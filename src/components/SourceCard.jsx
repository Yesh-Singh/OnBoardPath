import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { BookOpen, ShieldCheck, Calendar, ArrowRight, ExternalLink } from 'lucide-react';

export default function SourceCard({ source }) {
  const { setActiveSourceModal } = useOnboarding();

  return (
    <div className="enterprise-card p-5 flex flex-col justify-between hover:border-blue-300 transition-all group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Approved source
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
          {source.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-slate-500 my-1">
          <span>{source.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3 h-3" /> Reviewed {source.lastReviewed}
          </span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 my-2 leading-relaxed">
          {source.summary}
        </p>

        {/* Section List Preview */}
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Included Sections:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {source.sections.map((sec, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                {sec.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setActiveSourceModal(source)}
        className="mt-5 w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
      >
        <span>View full source document</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
