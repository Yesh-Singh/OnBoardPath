import React from 'react';
import { Inbox, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function EmptyState({ title, description, icon: Icon = Inbox, action }) {
  return (
    <div className="enterprise-card p-12 text-center flex flex-col items-center justify-center bg-white border-dashed">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-slate-900 tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {action && action}
    </div>
  );
}
