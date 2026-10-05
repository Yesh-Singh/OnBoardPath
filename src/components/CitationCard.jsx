import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CitationCard({ citation }) {
  const { sources, setActiveSourceModal } = useOnboarding();

  if (!citation) return null;

  const handleViewSource = () => {
    const found = sources.find(s => s.title.toLowerCase() === citation.title.toLowerCase()) || sources[0];
    setActiveSourceModal(found);
  };

  return (
    <div className="mt-3 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
            <span>Source:</span>
            <span className="text-blue-800 font-bold">{citation.title}</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-xs">
              <ShieldCheck className="w-3 h-3 text-blue-600" /> Grounded
            </span>
          </div>
          <div className="text-slate-600 text-[11px] mt-0.5">
            Section: {citation.section}
          </div>
        </div>
      </div>

      <button
        onClick={handleViewSource}
        className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 shrink-0 text-xs shadow-2xs"
      >
        <span>View source</span>
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
}
