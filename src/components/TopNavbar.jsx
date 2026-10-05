import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import { 
  Menu, 
  Search, 
  Bell, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  ChevronDown, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_PERSONAS } from '../data/mockData';

export default function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { activePersona, selectPersona, nudges, progressMetrics } = useOnboarding();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeNudgesCount = nudges.filter(n => n.status === 'Active').length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ask?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 flex items-center justify-between shadow-2xs">
      {/* Mobile Menu & Left Area */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72 lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search approved onboarding guides & FAQs..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-all"
          />
        </form>
      </div>

      {/* Right Area Controls */}
      <div className="flex items-center gap-3">
        {/* Safety Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Source-Backed Guarantee</span>
        </div>

        {/* Location Pill */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-xs font-medium">
          <MapPin className="w-3 h-3 text-slate-500" />
          <span>{activePersona.location}</span>
        </div>

        {/* Progress Pill */}
        <div 
          onClick={() => navigate('/checklist')}
          className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-semibold hover:bg-blue-100 transition-all"
          title="View First-Week Checklist"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>{progressMetrics.percentage}% Done</span>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => navigate('/nudges')}
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          title="Active Nudges"
        >
          <Bell className="w-4 h-4" />
          {activeNudgesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
          )}
        </button>

        <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block" />

        {/* Quick Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-left"
          >
            <img
              src={activePersona.avatar}
              alt={activePersona.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">{activePersona.name}</div>
              <div className="text-[10px] text-slate-500">{activePersona.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Active Persona
              </div>

              {Object.values(INITIAL_PERSONAS).map((persona) => {
                const isSelected = persona.id === activePersona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      selectPersona(persona.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-blue-50/60' : ''
                    }`}
                  >
                    <img
                      src={persona.avatar}
                      alt={persona.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">{persona.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{persona.role}</div>
                      <div className="text-[10px] text-blue-600 font-medium">{persona.location}</div>
                    </div>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                );
              })}

              <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                <button
                  onClick={() => {
                    navigate('/welcome');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-center py-1.5 text-xs text-blue-600 font-medium hover:underline"
                >
                  View full persona details →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
