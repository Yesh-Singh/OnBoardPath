"""HTTP API for the trained first-week task priority model."""

from pathlib import Path

import numpy as np
import tensorflow as tf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "outputs_clean" / "task_priority_model.keras"
LABELS = ["Low", "Medium", "High"]
model = tf.keras.models.load_model(MODEL_PATH)

app = FastAPI(title="OnboardPath AI Model", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


class TaskRequest(BaseModel):
    employee_role: str = ""
    department: str = ""
    day: str = "Day 1"
    task: str = Field(min_length=1, max_length=500)
    tool: str = ""
    resource: str = ""
    responsible_person: str = ""
    estimated_minutes: int = Field(default=30, ge=1, le=1440)
    prerequisite: str = ""


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_PATH.name}


@app.post("/predict-priority")
def predict_priority(task: TaskRequest):
    text = " | ".join([
        task.employee_role, task.department, task.day, task.task,
        task.tool, task.resource, task.responsible_person,
        str(task.estimated_minutes), task.prerequisite,
    ])
    probabilities = model.predict(np.array([text], dtype=object), verbose=0)[0]
    index = int(probabilities.argmax())
    return {
        "priority": LABELS[index],
        "confidence": round(float(probabilities[index]), 4),
        "probabilities": {
            label: round(float(probabilities[i]), 4)
            for i, label in enumerate(LABELS)
        },
    }
