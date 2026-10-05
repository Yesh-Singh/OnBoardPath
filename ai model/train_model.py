
from pathlib import Path
import json
import os

import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers
except ImportError as exc:
    raise SystemExit(
        "TensorFlow/Keras is required. Install dependencies with: "
        "python -m pip install -r requirements.txt"
    ) from exc


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / "first_week_maze_3_roles_dataset.csv"
OUTPUT = ROOT / "outputs_clean"
RANDOM_SEED = 42
TARGET_ROWS = 780


def expand_dataset(source: pd.DataFrame) -> pd.DataFrame:
    """Expand task templates with controlled, non-destructive variations."""
    rng = np.random.default_rng(RANDOM_SEED)
    role_variants = {
        "Software Engineer": ("Engineering", "VS Code"),
        "Sales Executive": ("Sales", "Salesforce"),
        "HR Associate": ("Human Resources", "Workday"),
    }
    rows = []
    for index in range(TARGET_ROWS):
        original = source.iloc[index % len(source)].copy()
        role = original["employee_role"]
        department, default_tool = role_variants.get(
            role, (original["department"], original["tool"])
        )
        original["department"] = department
        if rng.random() < 0.35:
            original["tool"] = default_tool
        original["estimated_minutes"] = max(
            10, int(original["estimated_minutes"]) + int(rng.integers(-5, 11))
        )
        original["task_id"] = f"AIM{index + 1:04d}"
        original["status"] = "Pending"
        rows.append(original)

    expanded = pd.DataFrame(rows)
    expanded.to_csv(OUTPUT / "expanded_dataset.csv", index=False)
    return expanded


def prepare_text(data: pd.DataFrame) -> pd.Series:
    fields = [
        "employee_role", "department", "day", "task", "tool", "resource",
        "responsible_person", "estimated_minutes", "prerequisite",
    ]
    return data[fields].fillna("").astype(str).agg(" | ".join, axis=1)


def plot_dataset(data: pd.DataFrame) -> None:
    sns.set_theme(style="whitegrid")
    figure, axes = plt.subplots(1, 2, figsize=(13, 5))
    sns.countplot(data=data, x="priority", order=["Low", "Medium", "High"], ax=axes[0])
    axes[0].set_title("Expanded Task Priority Distribution")
    axes[0].set_xlabel("Priority")
    axes[0].set_ylabel("Tasks")
    sns.countplot(data=data, x="employee_role", hue="priority", ax=axes[1])
    axes[1].set_title("Priority by Employee Role")
    axes[1].tick_params(axis="x", rotation=20)
    figure.tight_layout()
    figure.savefig(OUTPUT / "dataset_distribution.png", dpi=160)
    plt.close(figure)


def main() -> None:
    OUTPUT.mkdir(exist_ok=True)
    np.random.seed(RANDOM_SEED)
    tf.random.set_seed(RANDOM_SEED)

    source = pd.read_csv(SOURCE)
    required = {"priority", "employee_role", "task"}
    missing = required.difference(source.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")

    data = expand_dataset(source)
    plot_dataset(data)

    labels = ["Low", "Medium", "High"]
    label_to_id = {label: index for index, label in enumerate(labels)}
    data["label_id"] = data["priority"].map(label_to_id)
    text = prepare_text(data).to_numpy()
    y = data["label_id"].to_numpy(dtype=np.int32)

    split = int(len(data) * 0.8)
    indices = np.random.permutation(len(data))
    train_idx, test_idx = indices[:split], indices[split:]
    x_train, x_test = text[train_idx], text[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]

    vectorizer = layers.TextVectorization(
        max_tokens=2500, output_mode="tf_idf", ngrams=2
    )
    vectorizer.adapt(x_train)

    model = keras.Sequential([
        keras.Input(shape=(1,), dtype=tf.string),
        vectorizer,
        layers.Dense(64, activation="relu"),
        layers.Dropout(0.25),
        layers.Dense(len(labels), activation="softmax"),
    ])
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    history = model.fit(
        x_train, y_train, validation_split=0.2, epochs=25, batch_size=32,
        verbose=0, callbacks=[keras.callbacks.EarlyStopping(patience=4, restore_best_weights=True)],
    )

    test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)
    probabilities = model.predict(x_test, verbose=0)
    predictions = probabilities.argmax(axis=1)
    matrix = tf.math.confusion_matrix(y_test, predictions, num_classes=len(labels)).numpy()

    model.save(OUTPUT / "task_priority_model.keras")
    with (OUTPUT / "metrics.json").open("w", encoding="utf-8") as file:
        json.dump({
            "source_rows": int(len(source)),
            "expanded_rows": int(len(data)),
            "train_rows": int(len(x_train)),
            "test_rows": int(len(x_test)),
            "test_loss": float(test_loss),
            "test_accuracy": float(test_accuracy),
            "labels": labels,
        }, file, indent=2)

    report = pd.DataFrame(matrix, index=labels, columns=labels)
    plt.figure(figsize=(7, 5))
    sns.heatmap(report, annot=True, fmt="d", cmap="Blues")
    plt.title("Task Priority Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.savefig(OUTPUT / "confusion_matrix.png", dpi=160)
    plt.close()

    print(f"Source rows: {len(source)}")
    print(f"Expanded rows: {len(data)}")
    print(f"Train rows: {len(x_train)} | Test rows: {len(x_test)}")
    print(f"Test accuracy: {test_accuracy:.3f}")
    print(f"Saved outputs to: {OUTPUT}")


if __name__ == "__main__":
    main()
