import React from 'react';
import ProfileCard from '../components/ProfileCard';
import SafetyPills from '../components/SafetyPill';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-blue-600" />
            My Onboarding Profile
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            View your role parameters, assigned support team, and personalization rationale.
          </p>
        </div>

        <SafetyPills compact={true} />
      </div>

      <ProfileCard />
    </div>
  );
}
