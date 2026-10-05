import React from 'react';
import { ShieldCheck, MapPin, EyeOff, UserCheck } from 'lucide-react';

export default function SafetyPills({ compact = false }) {
  const principles = [
    {
      icon: ShieldCheck,
      label: 'Cited Sources',
      detail: 'Every answer is backed by approved documents',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      icon: MapPin,
      label: 'Scoped Visibility',
      detail: 'Personalized to your role & location',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      icon: EyeOff,
      label: 'No Invented Answers',
      detail: 'Clear boundaries when info is unavailable',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      icon: UserCheck,
      label: 'Human Handoff',
      detail: 'Sensitive topics route directly to your buddy',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {principles.map((p, idx) => {
          const Icon = p.icon;
          return (
            <span
              key={idx}
              title={p.detail}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${p.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {p.label}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {principles.map((p, idx) => {
        const Icon = p.icon;
        return (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-lg border ${p.color} bg-white shadow-xs`}
          >
            <div className="p-2 rounded-md bg-opacity-20 shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">{p.label}</div>
              <div className="text-[11px] opacity-80 leading-tight mt-0.5">{p.detail}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
