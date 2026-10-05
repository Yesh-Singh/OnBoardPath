import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import HandoffCard from '../components/HandoffCard';
import EmptyState from '../components/EmptyState';
import SafetyPills from '../components/SafetyPill';
import { UserCheck, ShieldCheck, AlertTriangle, Plus, Lock, Inbox } from 'lucide-react';

export default function BuddyHandoffPage() {
  const { handoffs, setIsHandoffModalOpen, activePersona } = useOnboarding();

  const activeHandoffs = handoffs.filter(h => h.personaId === activePersona.id || h.personaId === 'aanya');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-purple-600" />
            Talk to a Human (Buddy Handoff)
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Some questions are better handled by your HR, IT team, manager, or onboarding buddy.
          </p>
        </div>

        <button
          onClick={() => setIsHandoffModalOpen(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create handoff</span>
        </button>
      </div>

      {/* Sensitive Topic Warning Info Banner */}
      <div className="enterprise-card p-5 bg-amber-50/70 border-l-4 border-l-amber-500 border-amber-200 text-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              Sensitive topic detected / Privacy Protection Rule
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed mt-1">
              “This question may involve information that OnboardPath should not answer directly.” For sensitive topics like compensation, performance rating, or confidential HR policies, OnboardPath routes requests safely without storing raw queries.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Handoff Action Card */}
      <div className="enterprise-card p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-l-purple-600">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
            Recommended handoff
          </span>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Payroll & Compensation Inquiry
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
            <span>Assigned to: <strong>{activePersona.buddy} / HR</strong></span>
            <span>•</span>
            <span className="text-purple-700 font-semibold">Status: Ready to initiate</span>
          </div>
        </div>

        <button
          onClick={() => setIsHandoffModalOpen(true)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs shrink-0"
        >
          <UserCheck className="w-4 h-4" />
          <span>Create handoff</span>
        </button>
      </div>

      {/* Open Handoffs List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Active Escalation Log ({activeHandoffs.length})
          </h3>
          {/* Trust note */}
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-purple-600" />
            <span>Only the category is shared for the handoff.</span>
          </div>
        </div>

        {activeHandoffs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeHandoffs.map((handoff) => (
              <HandoffCard key={handoff.id} handoff={handoff} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No open handoffs"
            description="When you need human support or route a sensitive HR question, your open handoffs will appear here."
            icon={Inbox}
            action={
              <button
                onClick={() => setIsHandoffModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl"
              >
                Request buddy sync
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
