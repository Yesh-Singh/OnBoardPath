import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import PersonaCard from '../components/PersonaCard';
import SafetyPills from '../components/SafetyPill';
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { INITIAL_PERSONAS } from '../data/mockData';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { activePersonaId, selectPersona } = useOnboarding();

  const handleSelectPersona = (personaId) => {
    selectPersona(personaId);
    navigate('/dashboard');
  };

  const universalTasks = [
    'Welcome call',
    'MFA setup',
    'Security basics',
    'Buddy meeting',
    'Manager check-in'
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto space-y-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Enterprise Onboarding Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">OnboardPath</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto">
            Your personalised first week, in one trusted place.
          </p>
        </div>

        {/* Persona Selection Grid */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Your Role & Persona
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose a sample joiner persona to experience role and location-based onboarding pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(INITIAL_PERSONAS).map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isSelected={persona.id === activePersonaId}
                onSelect={handleSelectPersona}
              />
            ))}
          </div>
        </div>

        {/* Baseline Tasks Banner */}
        <div className="enterprise-card p-6 bg-white max-w-4xl mx-auto border-dashed">
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Universal Foundation
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
              Every new joiner receives
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-700 font-semibold">
            {universalTasks.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Principles Footer */}
        <div className="max-w-4xl mx-auto">
          <SafetyPills compact={false} />
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 pt-8">
        OnboardPath Enterprise SaaS • Powered by Source-backed Guidance & Safe Escalation
      </div>
    </div>
  );
}
