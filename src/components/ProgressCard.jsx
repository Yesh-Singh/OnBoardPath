import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { CheckCircle2, Clock, Bell, UserCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProgressCard() {
  const navigate = useNavigate();
  const { progressMetrics, nudges, activePersona } = useOnboarding();

  const activeNudgesCount = nudges.filter(n => n.status === 'Active').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Progress Card */}
      <div 
        onClick={() => navigate('/checklist')}
        className="enterprise-card p-5 cursor-pointer group hover:border-blue-300 relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</span>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {progressMetrics.completed} / {progressMetrics.total} <span className="text-xs font-normal text-slate-500">tasks</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressMetrics.percentage}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-500 flex justify-between font-medium">
          <span>First-week track</span>
          <span className="text-blue-600 font-semibold">{progressMetrics.percentage}% complete</span>
        </div>
      </div>

      {/* 2. Today Card */}
      <div 
        onClick={() => navigate('/checklist')}
        className="enterprise-card p-5 cursor-pointer group hover:border-blue-300"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today</span>
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {progressMetrics.remaining} <span className="text-xs font-normal text-slate-500">remaining</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Keep momentum going on Day 2 setup items.
        </p>
      </div>

      {/* 3. Nudges Card */}
      <div 
        onClick={() => navigate('/nudges')}
        className="enterprise-card p-5 cursor-pointer group hover:border-blue-300"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nudges</span>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
            <Bell className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {activeNudgesCount} <span className="text-xs font-normal text-slate-500">pending reminder{activeNudgesCount === 1 ? '' : 's'}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Proactive alerts for mandatory setup items.
        </p>
      </div>

      {/* 4. Buddy Card */}
      <div 
        onClick={() => navigate('/handoff')}
        className="enterprise-card p-5 cursor-pointer group hover:border-blue-300"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Buddy</span>
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          1 <span className="text-xs font-normal text-slate-500">buddy assigned</span>
        </div>
        <p className="text-[11px] text-slate-500 truncate">
          {activePersona.buddy.split(' (')[0]}
        </p>
      </div>
    </div>
  );
}
