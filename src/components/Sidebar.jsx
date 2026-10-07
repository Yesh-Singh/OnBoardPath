import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useOnboarding, normalizeHandoffStatus } from '../context/OnboardingContext';
import { 
  Compass, 
  CheckSquare, 
  MessageSquare, 
  Bell, 
  UserCheck, 
  BookOpen, 
  User, 
  BarChart3, 
  ShieldCheck,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { activePersona, nudges, handoffs, selectPersona } = useOnboarding();

  const activeNudgeCount = nudges.filter(n => n.status === 'Active').length;
  const openHandoffCount = handoffs.filter(h => normalizeHandoffStatus(h.status) !== 'Resolved').length;

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Compass },
    { label: 'My Checklist', path: '/checklist', icon: CheckSquare },
    { label: 'Ask OnboardPath', path: '/ask', icon: MessageSquare },
    { 
      label: 'Nudges', 
      path: '/nudges', 
      icon: Bell, 
      badge: activeNudgeCount > 0 ? activeNudgeCount : null,
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    { 
      label: 'Buddy Handoff', 
      path: '/handoff', 
      icon: UserCheck,
      badge: openHandoffCount > 0 ? openHandoffCount : null,
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    { label: 'Sources', path: '/sources', icon: BookOpen }
  ];

  const bottomItems = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Overview (Admin)', path: '/admin', icon: BarChart3 }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Logo & App Header */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                  OnboardPath
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded-sm">
                    Enterprise
                  </span>
                </span>
                <span className="block text-[11px] text-slate-500 font-normal">
                  Source-Backed Assistant
                </span>
              </div>
            </div>
          </div>

          {/* Active Persona Mini Banner */}
          <div className="mx-3 mt-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={activePersona.avatar} 
                alt={activePersona.name} 
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0" 
              />
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-800 truncate">{activePersona.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{activePersona.role}</div>
              </div>
            </div>
            <NavLink 
              to="/welcome" 
              className="text-[10px] font-medium text-blue-600 hover:text-blue-800 shrink-0 hover:underline"
              title="Switch persona"
            >
              Switch
            </NavLink>
          </div>

          {/* Main Navigation Links */}
          <nav className="px-3 py-4 space-y-1">
            <div className="px-3 mb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Onboarding Workspace
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span key={item.badge} className={`px-2 py-0.5 rounded-full text-[10px] font-bold anim-pop ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <div className="px-3 mb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Account & Security
          </div>

          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-slate-100 text-slate-900 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>{item.label}</span>
                </div>
              </NavLink>
            );
          })}

          <NavLink
            to="/welcome"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all mt-2"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Change Persona</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </NavLink>

          {/* Scoped Trust Note */}
          <div className="mt-3 p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-[10px] text-blue-800 leading-tight">
            <span className="font-semibold block mb-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" /> Grounded & Scoped
            </span>
            Tasks and sources are tailored for {activePersona.role} ({activePersona.location}).
          </div>
        </div>
      </aside>
    </>
  );
}
