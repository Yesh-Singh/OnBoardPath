import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { Bell, CheckCircle2, Trash2 } from 'lucide-react';

export default function NudgeCard({ nudge }) {
  const { dismissNudge, snoozeNudge, currentTasks, toggleTaskStatus } = useOnboarding();

  const matchedTask = currentTasks.find(t => t.id === nudge.taskId);

  const handleComplete = () => {
    if (matchedTask) {
      toggleTaskStatus(matchedTask.id);
    }
    dismissNudge(nudge.id);
  };

  return (
    <div className="enterprise-card p-5 relative group border-l-4 border-l-amber-500 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                {nudge.type || 'Required Task'}
              </span>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                {nudge.title}
              </h4>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
            {nudge.dueDate}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed my-2">
          "{nudge.description}"
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleComplete}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all shadow-2xs flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Complete task</span>
        </button>

        <button
          onClick={() => snoozeNudge(nudge.id)}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all"
        >
          Remind me later
        </button>
        <button
          onClick={() => dismissNudge(nudge.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Discard reminder"
          aria-label="Discard reminder"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
