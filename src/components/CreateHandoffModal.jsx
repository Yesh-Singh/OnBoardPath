import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { X, UserCheck, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function CreateHandoffModal() {
  const { isHandoffModalOpen, setIsHandoffModalOpen, createHandoff, activePersona } = useOnboarding();
  const [selectedCategory, setSelectedCategory] = useState('Payroll & Compensation');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isHandoffModalOpen) return null;

  const categories = [
    'Payroll & Compensation',
    'Benefits & Health Insurance',
    'HR Policies & Leave Request',
    'Performance & Appraisal Review',
    'IT Hardware Escalation',
    'Finance Expense or Reimbursement',
    'Office / HQ Support',
    'Manager 1-on-1 Support'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    createHandoff(selectedCategory);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsHandoffModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create Human Buddy Handoff</h3>
              <p className="text-[10px] text-slate-500">Route sensitive inquiries to human team members</p>
            </div>
          </div>
          <button
            onClick={() => setIsHandoffModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Handoff created successfully</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your buddy ({activePersona.buddy.split(' (')[0]}) has been notified that you need help with a <strong>{selectedCategory}</strong> question.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Topic Category (Required)
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:border-purple-600"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Contact
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 flex items-center justify-between">
                <span>{activePersona.buddy}</span>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                  Onboarding Buddy
                </span>
              </div>
            </div>

            {/* Privacy Lock Banner */}
            <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-xl text-xs text-purple-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold block mb-0.5">Strict Privacy Notice</span>
                Only the category (<strong>{selectedCategory}</strong>) is shared for the handoff. No confidential text is stored or logged.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsHandoffModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl hover:bg-purple-700 shadow-xs flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Create handoff</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
