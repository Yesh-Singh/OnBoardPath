import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import NudgeCard from '../components/NudgeCard';
import EmptyState from '../components/EmptyState';
import SafetyPills from '../components/SafetyPill';
import { Bell, Plus, CheckCircle2, Inbox } from 'lucide-react';

export default function NudgesPage() {
  const { nudges, setIsNudgeModalOpen, activePersona } = useOnboarding();

  const activeNudges = nudges.filter(n => n.personaId === activePersona.id || n.personaId === 'aanya');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-amber-500" />
            Nudges & Reminders
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Stay on top of required onboarding tasks with proactive automated reminders.
          </p>
        </div>

        <button
          onClick={() => setIsNudgeModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create Nudge</span>
        </button>
      </div>

      {/* Nudges List Grid or Empty State */}
      {activeNudges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeNudges.map((nudge) => (
            <NudgeCard key={nudge.id} nudge={nudge} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No active nudges"
          description="You're all caught up on your scheduled reminders and required onboarding setup tasks."
          icon={Inbox}
          action={
            <button
              onClick={() => setIsNudgeModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
            >
              Schedule a reminder
            </button>
          }
        />
      )}
    </div>
  );
}
