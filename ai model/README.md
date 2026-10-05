# First-Week Maze AI Model

This folder is isolated from the React application. It trains a Keras model to classify onboarding task priority as `Low`, `Medium`, or `High`.

The source file contains 60 task templates. The script expands them to exactly 780 reproducible examples with small controlled variations, then creates an 80/20 train/test split.

## Run

From this folder:

```bash
python -m pip install -r requirements.txt
python train_model.py
```

Generated files are written to `outputs/`:

- `expanded_dataset.csv`
- `task_priority_model.keras`
- `metrics.json`
- `dataset_distribution.png`
- `confusion_matrix.png`

The model is a baseline classifier for experimentation. The expanded rows are derived from task templates, so the reported accuracy should not be treated as real-world performance until the project has independently collected labeled employee onboarding outcomes.
