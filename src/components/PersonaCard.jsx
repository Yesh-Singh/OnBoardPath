import React from 'react';
import { MapPin, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PersonaCard({ persona, onSelect, isSelected }) {
  return (
    <div className={`
      relative enterprise-card p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1
      ${isSelected ? 'border-2 border-blue-600 ring-4 ring-blue-50/50 shadow-md' : 'hover:border-blue-300'}
    `}>
      {isSelected && (
        <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-xs">
          Active Selection
        </span>
      )}

      <div>
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={persona.avatar}
            alt={persona.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{persona.name}</h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-slate-700">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {persona.role}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-700 font-semibold mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {persona.location}
            </div>
          </div>
        </div>

        {/* Personalized Focus Tasks */}
        <div className="my-4 pt-4 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Key Role Tasks
          </div>
          <ul className="space-y-2">
            {persona.personalizationChips.slice(0, 2).map((chip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{chip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Select Action CTA */}
      <button
        onClick={() => onSelect(persona.id)}
        className={`
          mt-4 w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-xs
          ${isSelected 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-slate-900 hover:bg-slate-800 text-white'}
        `}
      >
        <span>Continue as {persona.name.split(' ')[0]}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
