import React, { useState } from 'react';
import { useOnboarding, normalizeHandoffStatus, HANDOFF_STATUS_STYLES, HANDOFF_STATUS_DOTS } from '../context/OnboardingContext';
import { UserCheck, ShieldCheck, Clock, CheckCircle2, AlertCircle, Trash2, Send, PlayCircle, CheckCircle, RotateCcw } from 'lucide-react';

export function HandoffStatusBadge({ status, className = '' }) {
  const normalized = normalizeHandoffStatus(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider anim-pop ${HANDOFF_STATUS_STYLES[normalized]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${HANDOFF_STATUS_DOTS[normalized]}`} />
      {normalized}
    </span>
  );
}

export default function HandoffCard({ handoff }) {
  const { escalateHandoff, replyToHandoff, removeHandoff, updateHandoffStatus } = useOnboarding();
  const [message, setMessage] = useState('');
  const status = normalizeHandoffStatus(handoff.status);
  const currentLevel = handoff.escalationLevel || 1;
  const escalationPath = handoff.escalationPath || [];
  const canEscalate = escalationPath.length > 0 && currentLevel < escalationPath.length;
  const messages = handoff.messages || [];

  return (
    <div className="enterprise-card p-5 border-l-4 border-l-purple-600 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
            Human Escalation Handoff
          </span>
          <h4 className="text-base font-bold text-slate-900 tracking-tight mt-1">
            Category: {handoff.category}
          </h4>
        </div>
        <HandoffStatusBadge key={status} status={status} />
      </div>

      <div className="space-y-2 text-xs text-slate-600 my-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-600" />
          <span>Assigned to: <strong>{handoff.assignedTo}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Created: {handoff.createdAt}</span>
        </div>
        <div className="text-[11px] text-purple-700 font-semibold">
          Escalation level {currentLevel}{escalationPath.length ? ` of ${escalationPath.length}` : ''}
        </div>
      </div>

      {/* Queue status actions */}
      <div className="flex flex-wrap items-center gap-2">
        {status === 'Open' && (
          <button
            type="button"
            onClick={() => updateHandoffStatus(handoff.id, 'In Progress')}
            className="btn-lift px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold rounded-lg hover:bg-blue-100 flex items-center gap-1.5"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Start progress
          </button>
        )}
        {status === 'In Progress' && (
          <button
            type="button"
            onClick={() => updateHandoffStatus(handoff.id, 'Resolved')}
            className="btn-lift px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold rounded-lg hover:bg-emerald-100 flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Mark resolved
          </button>
        )}
        {status === 'Resolved' && (
          <button
            type="button"
            onClick={() => updateHandoffStatus(handoff.id, 'Open')}
            className="btn-lift px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reopen handoff
          </button>
        )}
      </div>

      {canEscalate && (
        <button
          type="button"
          onClick={() => escalateHandoff(handoff.id)}
          className="w-full mt-3 px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-100 transition-colors"
        >
          No response? Escalate to {escalationPath[currentLevel]}
        </button>
      )}

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Handoff messages</div>
        <div className="space-y-2 max-h-32 overflow-auto">
          {messages.length === 0 && <p className="text-xs text-slate-400">No reply yet. Your buddy can respond here.</p>}
          {messages.map(item => <div key={item.id} className={`p-2 rounded-lg text-xs ${item.sender === 'buddy' ? 'bg-blue-50 text-blue-900' : 'bg-slate-100 text-slate-700'}`}><strong>{item.sender === 'buddy' ? 'Buddy' : 'You'}:</strong> {item.text}</div>)}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); replyToHandoff(handoff.id, message, 'member'); setMessage(''); }} className="flex gap-2 mt-3">
          <input value={message} onChange={event => setMessage(event.target.value)} placeholder="Send a message about this handoff" className="flex-1 px-2.5 py-2 border border-slate-200 rounded-lg text-xs" />
          <button className="p-2 bg-blue-600 text-white rounded-lg" title="Send message"><Send className="w-3.5 h-3.5" /></button>
        </form>
      </div>

      <button type="button" onClick={() => removeHandoff(handoff.id)} className="mt-3 text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Remove this handoff</button>

      {/* Strict Privacy Guarantee Box */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-600 flex items-start gap-2 mt-4">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800 block">Privacy Guarantee</span>
          {handoff.privacyNote || 'Only the category is shared for the handoff. Your raw text was not recorded.'}
        </div>
      </div>
    </div>
  );
}
