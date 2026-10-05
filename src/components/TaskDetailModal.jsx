import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Bell, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight,
  ListChecks
} from 'lucide-react';

export default function TaskDetailModal() {
  const navigate = useNavigate();
  const { 
    activeTaskModal, 
    setActiveTaskModal, 
    toggleTaskStatus, 
    createNudge, 
    sources, 
    setActiveSourceModal 
  } = useOnboarding();

  if (!activeTaskModal) return null;

  const task = activeTaskModal;
  const isCompleted = task.status === 'Completed';

  const handleSourceClick = () => {
    if (task.source) {
      const foundSource = sources.find(s => s.title.toLowerCase().includes(task.source.title.toLowerCase()));
      if (foundSource) {
        setActiveTaskModal(null);
        setActiveSourceModal(foundSource);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-sm">
              {task.category || 'First Week Task'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
              {task.title}
            </h3>
          </div>
          <button
            onClick={() => setActiveTaskModal(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status & Estimated Time Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                isCompleted 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {task.status}
              </span>
            </div>
            {task.estimatedTime && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Est. Time: {task.estimatedTime}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Task Overview
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Steps Checklist */}
          {task.steps && task.steps.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-blue-600" />
                Execution Checklist
              </h4>
              <div className="space-y-2 bg-slate-50/70 p-3.5 border border-slate-200/80 rounded-xl">
                {task.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Citation Card */}
          {task.source && (
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Approved Source Citation
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  {task.source.title}
                </div>
                <div className="text-[11px] text-slate-600">
                  Section: {task.source.section}
                </div>
              </div>
              <button
                onClick={handleSourceClick}
                className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 shrink-0"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              createNudge(task.id, task.title, 'Due tomorrow');
              setActiveTaskModal(null);
              navigate('/nudges');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Remind Me Later</span>
          </button>

          <button
            onClick={() => toggleTaskStatus(task.id)}
            className={`px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm flex items-center gap-2 ${
              isCompleted
                ? 'bg-slate-700 hover:bg-slate-800'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Mark Pending' : 'Complete Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
