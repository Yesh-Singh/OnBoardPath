import React from 'react';
import AssistantChat from '../components/AssistantChat';
import SafetyPills from '../components/SafetyPill';
import { MessageSquare, ShieldCheck, Lock, UserCheck } from 'lucide-react';

export default function AskOnboardPathPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-blue-600" />
            Ask OnboardPath
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Find answers from approved onboarding guidance. All answers are grounded in official documentation.
          </p>
        </div>

        <SafetyPills compact={true} />
      </div>

      {/* Main Interactive Chat Interface */}
      <AssistantChat />
    </div>
  );
}
