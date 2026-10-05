import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import ProgressCard from '../components/ProgressCard';
import Timeline from '../components/Timeline';
import SafetyPills from '../components/SafetyPill';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  UserCheck,
  Play
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { activePersona, currentTasks, setActiveTaskModal, setActiveSourceModal, sources } = useOnboarding();

  // Find next incomplete task
  const nextTask = currentTasks.find(t => t.status !== 'Completed') || currentTasks[0];

  const handleViewSource = () => {
    if (nextTask && nextTask.source) {
      const foundSource = sources.find(s => s.title.toLowerCase().includes(nextTask.source.title.toLowerCase()));
      if (foundSource) {
        setActiveSourceModal(foundSource);
      }
    } else {
      setActiveSourceModal(sources[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {activePersona.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Here’s what your first week looks like as a <strong className="text-slate-800">{activePersona.role}</strong> at <strong className="text-blue-700">{activePersona.location}</strong>.
          </p>
        </div>

        <SafetyPills compact={true} />
      </div>

      {/* Top 4 Summary Cards */}
      <ProgressCard />

      {/* Week at a Glance Timeline */}
      <Timeline />

      {/* Two Column Grid: Continue Onboarding & Need Help */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* "Continue Your Onboarding" Card */}
        {nextTask && (
          <div className="enterprise-card p-6 bg-white border-l-4 border-l-blue-600 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  Continue Your Onboarding
                </span>
                <span className="text-xs font-semibold text-slate-400">Next Action</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {nextTask.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed my-2">
                {nextTask.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 my-3">
                {nextTask.estimatedTime && (
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est. time: {nextTask.estimatedTime}
                  </span>
                )}
                {nextTask.source && (
                  <span className="flex items-center gap-1 text-blue-700 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    {nextTask.source.title} available
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTaskModal(nextTask)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start task</span>
              </button>

              <button
                onClick={handleViewSource}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>View source</span>
              </button>
            </div>
          </div>
        )}

        {/* "Need Help? - Ask OnboardPath" Assistant Card */}
        <div className="enterprise-card p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-40 h-40" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
              <Sparkles className="w-3 h-3 text-blue-300" /> Grounded Q&A Assistant
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white">
              Need Help? Ask OnboardPath
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              “Get answers from approved onboarding guidance.”
            </p>

            <div className="my-4 p-3 rounded-xl bg-white/10 backdrop-blur-xs text-xs text-slate-200 space-y-1 border border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Sample Query</div>
              <div className="italic">"How do I set up my laptop and company email?"</div>
            </div>
          </div>

          <div>
            <button
              onClick={() => navigate('/ask')}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask a question</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust note */}
            <p className="text-[10px] text-slate-400 leading-tight mt-3 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Answers are grounded in approved sources. Sensitive topics can be routed to a human buddy.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
