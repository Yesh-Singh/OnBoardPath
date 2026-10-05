import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { User, Briefcase, MapPin, UserCheck, Sparkles, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileCard() {
  const navigate = useNavigate();
  const { activePersona } = useOnboarding();

  return (
    <div className="space-y-6">
      {/* 1. Main Profile Overview */}
      <div className="enterprise-card p-6 bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <img
              src={activePersona.avatar}
              alt={activePersona.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activePersona.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Employee
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">{activePersona.role}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-blue-700 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {activePersona.location}
                </span>
                <span>•</span>
                <span>Work Type: {activePersona.workType}</span>
                <span>•</span>
                <span>Start Date: {activePersona.startDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/welcome')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Switch Persona</span>
          </button>
        </div>

        {/* Manager & Buddy Assigned Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Manager</div>
              <div className="text-xs font-bold text-slate-900">{activePersona.manager}</div>
              <div className="text-[11px] text-slate-500">Weekly Retrospective Sync</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-100 text-purple-700">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Onboarding Buddy</div>
              <div className="text-xs font-bold text-slate-900">{activePersona.buddy}</div>
              <div className="text-[11px] text-slate-500">Culture & Peer Mentor</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scoping & Personalization Rationale Card */}
      <div className="enterprise-card p-6 border-l-4 border-l-blue-600 bg-white">
        <div className="flex items-center gap-2.5 mb-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Why am I seeing these tasks?
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          “Your onboarding path is personalised using your role and location.”
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Role Scoping</span>
              <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 inline-block">
                {activePersona.role}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Location Scoping</span>
              <span className="font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block">
                {activePersona.location}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Active Personalization Chips
            </div>
            <div className="flex flex-wrap gap-2">
              {activePersona.personalizationChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
