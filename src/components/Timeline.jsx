import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { CheckCircle2, Circle, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Timeline() {
  const navigate = useNavigate();
  const { currentTasks, setActiveTaskModal } = useOnboarding();

  // Group tasks by Day 1 to Day 5
  const days = [
    { dayNum: 1, title: 'Day 1 — Kickoff & Access' },
    { dayNum: 2, title: 'Day 2 — Setup & Buddy Sync' },
    { dayNum: 3, title: 'Day 3 — Role Sandbox & Safety' },
    { dayNum: 4, title: 'Day 4 — Team Integration' },
    { dayNum: 5, title: 'Day 5 — Week 1 Review' }
  ];

  return (
    <div className="enterprise-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Your Week at a Glance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured 5-day roadmap tailored for your role and location.
          </p>
        </div>

        <button
          onClick={() => navigate('/checklist')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
        >
          <span>Full Checklist</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal timeline grid on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {days.map((dayItem) => {
          const dayTasks = currentTasks.filter(t => (t.day === dayItem.dayNum) || (t.category && t.category.includes(`Day ${dayItem.dayNum}`)));

          return (
            <div 
              key={dayItem.dayNum}
              className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between hover:bg-slate-50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                    Day {dayItem.dayNum}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {dayTasks.filter(t => t.status === 'Completed').length}/{dayTasks.length} Done
                  </span>
                </div>

                <div className="space-y-1.5 mt-2">
                  {dayTasks.length > 0 ? (
                    dayTasks.map((t) => {
                      const isDone = t.status === 'Completed';
                      return (
                        <div
                          key={t.id}
                          onClick={() => setActiveTaskModal(t)}
                          className={`
                            group flex items-start gap-1.5 p-1.5 rounded-lg text-xs cursor-pointer transition-all border
                            ${isDone 
                              ? 'bg-white/80 border-slate-200/60 text-slate-500' 
                              : 'bg-white border-slate-200 text-slate-800 font-medium hover:border-blue-300 shadow-2xs'}
                          `}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 shrink-0 mt-0.5" />
                          )}
                          <span className={`truncate text-[11px] ${isDone ? 'line-through opacity-80' : ''}`}>
                            {t.title}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-[11px] text-slate-400 italic py-2">
                      Self-guided orientation
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
