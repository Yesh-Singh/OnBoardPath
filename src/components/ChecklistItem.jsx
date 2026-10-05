import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { CheckCircle2, Circle, Clock, BookOpen, ExternalLink, ChevronRight, ShieldAlert } from 'lucide-react';

export default function ChecklistItem({ task, onOpenDetail }) {
  const { toggleTaskStatus, setActiveSourceModal, sources } = useOnboarding();

  const isCompleted = task.status === 'Completed';
  const isInProgress = task.status === 'In Progress';

  const handleSourceClick = (e) => {
    e.stopPropagation();
    if (task.source) {
      const foundSource = sources.find(s => s.title.toLowerCase().includes(task.source.title.toLowerCase()));
      if (foundSource) {
        setActiveSourceModal(foundSource);
      }
    }
  };

  return (
    <div 
      onClick={() => onOpenDetail && onOpenDetail(task)}
      className={`
        enterprise-card p-4 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group
        ${isCompleted ? 'bg-slate-50/70 border-slate-200/80 opacity-90' : 'hover:border-blue-300'}
      `}
    >
      {/* Left: Checkbox & Info */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskStatus(task.id);
          }}
          className={`
            p-1 rounded-full transition-transform active:scale-90 shrink-0 mt-0.5
            ${isCompleted ? 'text-emerald-600' : 'text-slate-300 hover:text-blue-600'}
          `}
          title={isCompleted ? 'Mark pending' : 'Mark completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className={`text-sm font-semibold tracking-tight ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
              {task.title}
            </h4>

            {/* Status Pills */}
            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Completed
              </span>
            )}
            {isInProgress && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                In Progress
              </span>
            )}
            {!isCompleted && !isInProgress && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                Pending
              </span>
            )}

            {/* Scoped Badge */}
            {task.roleSpecific && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Role Specific
              </span>
            )}
            {task.locationSpecific && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Location Specific
              </span>
            )}
            {task.aiPrediction && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                task.aiPrediction.priority === 'High'
                  ? 'bg-rose-100 text-rose-800'
                  : task.aiPrediction.priority === 'Medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-sky-100 text-sky-800'
              }`} title={`AI confidence: ${Math.round(task.aiPrediction.confidence * 100)}%`}>
                AI {task.aiPrediction.priority}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>

          {/* Source Citation & Est Time */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
            {task.estimatedTime && (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" />
                {task.estimatedTime}
              </span>
            )}

            {task.source && (
              <button
                onClick={handleSourceClick}
                className="flex items-center gap-1 text-blue-600 font-medium hover:underline bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100"
              >
                <BookOpen className="w-3 h-3 text-blue-500" />
                <span>{task.source.title}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskStatus(task.id);
          }}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs
            ${isCompleted
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white'}
          `}
        >
          {isCompleted ? 'Mark Pending' : 'Complete Task'}
        </button>

        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 hidden sm:block" />
      </div>
    </div>
  );
}
