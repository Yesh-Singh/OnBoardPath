import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import AppLayout from './layouts/AppLayout';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ChecklistPage from './pages/ChecklistPage';
import AskOnboardPathPage from './pages/AskOnboardPathPage';
import NudgesPage from './pages/NudgesPage';
import BuddyHandoffPage from './pages/BuddyHandoffPage';
import ProfilePage from './pages/ProfilePage';
import SourcesPage from './pages/SourcesPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <OnboardingProvider>
      <BrowserRouter>
        <Routes>
          {/* Welcome Screen Page 1 */}
          <Route path="/welcome" element={<WelcomePage />} />

          {/* Main Workspace Layout with Persistent Sidebar */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/ask" element={<AskOnboardPathPage />} />
            <Route path="/nudges" element={<NudgesPage />} />
            <Route path="/handoff" element={<BuddyHandoffPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* Default redirect to welcome page */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </OnboardingProvider>
  );
}
