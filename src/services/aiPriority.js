const AI_MODEL_URL = import.meta.env.VITE_AI_MODEL_URL || 'http://127.0.0.1:8000';

export async function predictTaskPriority(task, persona) {
  const response = await fetch(`${AI_MODEL_URL}/predict-priority`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      employee_role: persona.role,
      department: persona.department,
      day: task.day ? `Day ${task.day}` : 'Day 1',
      task: task.title,
      tool: task.tool || '',
      resource: task.source?.title || '',
      responsible_person: task.responsiblePerson || persona.buddy || '',
      estimated_minutes: Number.parseInt(task.estimatedTime, 10) || 30,
      prerequisite: task.prerequisite || '',
    }),
  });

  if (!response.ok) throw new Error(`AI model request failed: ${response.status}`);
  return response.json();
}
