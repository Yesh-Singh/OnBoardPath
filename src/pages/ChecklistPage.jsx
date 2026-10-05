import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import ChecklistItem from '../components/ChecklistItem';
import SafetyPills from '../components/SafetyPill';
import { CheckSquare, CheckCircle2, Circle, Filter, Sparkles } from 'lucide-react';
import { predictTaskPriority } from '../services/aiPriority';

export default function ChecklistPage() {
  const { currentTasks, progressMetrics, setActiveTaskModal, activePersona } = useOnboarding();
  const [predictions, setPredictions] = useState({});
  const [filterTab, setFilterTab] = useState('All'); // All, Pending, Completed

  useEffect(() => {
    let cancelled = false;
    const loadPredictions = async () => {
      const results = await Promise.all(currentTasks.map(async (task) => {
        try {
          return [task.id, await predictTaskPriority(task, activePersona)];
        } catch {
          return [task.id, null];
        }
      }));
      if (!cancelled) setPredictions(Object.fromEntries(results));
    };
    loadPredictions();
    return () => { cancelled = true; };
  }, [currentTasks, activePersona]);

  const categories = Array.from(new Set(currentTasks.map(t => t.category || 'General')));

  const filteredTasks = currentTasks.filter(task => {
    if (filterTab === 'Completed') return task.status === 'Completed';
    if (filterTab === 'Pending') return task.status !== 'Completed';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-blue-600" />
            My First-Week Checklist
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Complete your required onboarding tasks and keep your progress in one place.
          </p>
        </div>

        <SafetyPills compact={true} />
      </div>

      {/* Week 1 Progress Indicator Banner */}
      <div className="enterprise-card p-6 bg-white border-l-4 border-l-blue-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Week 1 Progress</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-baseline gap-2">
            <span>{progressMetrics.percentage}% complete</span>
            <span className="text-xs font-medium text-slate-500">
              ({progressMetrics.completed} of {progressMetrics.total} tasks finished)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Path scoped for {activePersona.role} ({activePersona.location}).
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2">
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressMetrics.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-semibold">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Completed'].map((tab) => {
            const count = tab === 'All' 
              ? currentTasks.length 
              : tab === 'Completed' 
              ? currentTasks.filter(t => t.status === 'Completed').length 
              : currentTasks.filter(t => t.status !== 'Completed').length;

            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`
                  px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5
                  ${filterTab === tab 
                    ? 'bg-blue-600 text-white shadow-2xs' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}
                `}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filterTab === tab ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          Click any task to view detail drawer
        </div>
      </div>

      {/* Categorized Task Sections */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const categoryTasks = filteredTasks.filter(t => (t.category || 'General') === cat);
          if (categoryTasks.length === 0) return null;

          return (
            <div key={cat} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {cat}
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  ({categoryTasks.filter(t => t.status === 'Completed').length}/{categoryTasks.length})
                </span>
              </div>

              <div className="space-y-3">
                {categoryTasks.map((task) => (
                  <ChecklistItem
                    key={task.id}
                    task={{ ...task, aiPrediction: predictions[task.id] }}
                    onOpenDetail={(t) => setActiveTaskModal(t)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
