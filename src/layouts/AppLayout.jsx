import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import TaskDetailModal from '../components/TaskDetailModal';
import SourceDetailModal from '../components/SourceDetailModal';
import CreateNudgeModal from '../components/CreateNudgeModal';
import CreateHandoffModal from '../components/CreateHandoffModal';
import ToastContainer from '../components/ToastContainer';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Persistent Enterprise Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all">
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <TaskDetailModal />
      <SourceDetailModal />
      <CreateNudgeModal />
      <CreateHandoffModal />
      <ToastContainer />
    </div>
  );
}
