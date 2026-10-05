import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { X, Bell, Calendar, Plus } from 'lucide-react';

export default function CreateNudgeModal() {
  const { isNudgeModalOpen, setIsNudgeModalOpen, createNudge, currentTasks } = useOnboarding();

  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [dueDate, setDueDate] = useState('Due today');

  if (!isNudgeModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    createNudge(selectedTaskId, customTitle, dueDate);
    setIsNudgeModalOpen(false);
    setSelectedTaskId('');
    setCustomTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Schedule Task Nudge</h3>
          </div>
          <button
            onClick={() => setIsNudgeModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Pending Task</label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
            >
              <option value="">-- Choose a task or custom reminder --</option>
              {currentTasks.map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.status})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Reminder Note (Optional)</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Set up company email before 4 PM"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder Schedule</label>
            <select
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
            >
              <option value="Due today">Due today (Evening)</option>
              <option value="Due tomorrow">Due tomorrow morning</option>
              <option value="In 2 days">In 2 days</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNudgeModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 shadow-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create Nudge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
