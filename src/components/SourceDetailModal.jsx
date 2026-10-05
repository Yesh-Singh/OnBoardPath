import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { X, BookOpen, ShieldCheck, Calendar, User, FileText } from 'lucide-react';

export default function SourceDetailModal() {
  const { activeSourceModal, setActiveSourceModal } = useOnboarding();

  if (!activeSourceModal) return null;

  const source = activeSourceModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Approved Enterprise Guidance
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {source.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span>Category: <strong>{source.category}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Reviewed: {source.lastReviewed}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveSourceModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-blue-900 block mb-1">Document Summary</span>
            {source.summary}
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" /> Document Sections
            </h4>

            {source.sections.map((sec, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                <h5 className="text-sm font-bold text-slate-900">{sec.name}</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Author: {source.author || 'Corporate HR & IT'}</span>
          <button
            onClick={() => setActiveSourceModal(null)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
}
