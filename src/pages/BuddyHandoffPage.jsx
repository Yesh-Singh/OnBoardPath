import React, { useState } from 'react';
import { useOnboarding, normalizeHandoffStatus, HANDOFF_STATUSES } from '../context/OnboardingContext';
import HandoffCard, { HandoffStatusBadge } from '../components/HandoffCard';
import EmptyState from '../components/EmptyState';
import SafetyPills from '../components/SafetyPill';
import { UserCheck, ShieldCheck, AlertTriangle, Plus, Lock, Inbox, ListChecks } from 'lucide-react';

const STATUS_FILTERS = ['All', ...HANDOFF_STATUSES];
const STATUS_ORDER = { Open: 0, 'In Progress': 1, Resolved: 2 };
const STATUS_COPY = {
  Open: 'Waiting for a buddy response',
  'In Progress': 'Being worked on right now',
  Resolved: 'Closed out successfully'
};

export default function BuddyHandoffPage() {
  const { handoffs, setIsHandoffModalOpen, activePersona } = useOnboarding();
  const [statusFilter, setStatusFilter] = useState('All');

  const activeHandoffs = handoffs.filter(h => h.personaId === activePersona.id || h.personaId === 'aanya');

  const counts = HANDOFF_STATUSES.reduce((acc, status) => {
    acc[status] = activeHandoffs.filter(h => normalizeHandoffStatus(h.status) === status).length;
    return acc;
  }, {});

  const visibleHandoffs = activeHandoffs
    .filter(h => statusFilter === 'All' || normalizeHandoffStatus(h.status) === statusFilter)
    .sort((a, b) => STATUS_ORDER[normalizeHandoffStatus(a.status)] - STATUS_ORDER[normalizeHandoffStatus(b.status)]);

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
          className="btn-lift px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs self-start md:self-center"
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
          className="btn-lift px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs shrink-0"
        >
          <UserCheck className="w-4 h-4" />
          <span>Create handoff</span>
        </button>
      </div>

      {/* Handoff queue status overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {HANDOFF_STATUSES.map(status => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`enterprise-card p-4 bg-white text-left transition-all border-l-4 ${
              statusFilter === status
                ? status === 'Open'
                  ? 'border-l-amber-500 ring-2 ring-amber-200'
                  : status === 'In Progress'
                  ? 'border-l-blue-500 ring-2 ring-blue-200'
                  : 'border-l-emerald-500 ring-2 ring-emerald-200'
                : 'border-l-slate-200 hover:border-l-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <HandoffStatusBadge status={status} />
              <span key={counts[status]} className="text-2xl font-extrabold text-slate-900 anim-pop">{counts[status]}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">{STATUS_COPY[status]}</p>
          </button>
        ))}
      </div>

      {/* Queue status filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Queue view:</span>
        {STATUS_FILTERS.map(filter => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
              statusFilter === filter
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {filter}
            <span className="ml-1.5 opacity-70">
              {filter === 'All' ? activeHandoffs.length : counts[filter]}
            </span>
          </button>
        ))}
      </div>

      {/* Handoff Queue List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Handoff Queue ({visibleHandoffs.length}{statusFilter !== 'All' ? ` of ${activeHandoffs.length}` : ''})
          </h3>
          {/* Trust note */}
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-purple-600" />
            <span>Only the category is shared for the handoff.</span>
          </div>
        </div>

        {activeHandoffs.length > 0 ? (
          visibleHandoffs.length > 0 ? (
            <div key={statusFilter} className="queue-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleHandoffs.map((handoff) => (
                <HandoffCard key={handoff.id} handoff={handoff} />
              ))}
            </div>
          ) : (
            <div className="enterprise-card p-8 bg-white text-center">
              <ListChecks className="w-7 h-7 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No {statusFilter.toLowerCase()} handoffs</p>
              <p className="text-xs text-slate-500 mt-1">Pick another queue view above to see your other handoffs.</p>
            </div>
          )
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
