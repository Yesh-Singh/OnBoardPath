import React, { useMemo, useRef, useState } from 'react';
import { Download, FileUp, MessageCircle, ShieldCheck, UserPlus, Users, CheckCircle2, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';
import { INITIAL_PERSONAS } from '../data/mockData';

export default function AdminPage() {
  const { personasTasks, handoffs, adminChatMessages, adminFiles, sendAdminChatMessage, assignTaskToMember, uploadAdminFile, removeAdminFile, replyToHandoff, updateMemberTask, reorderMemberTask, moveMemberTask, removeMemberTask } = useOnboarding();
  const [selectedMember, setSelectedMember] = useState('aanya');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDay, setTaskDay] = useState('1');
  const [chatText, setChatText] = useState('');
  const [handoffReplies, setHandoffReplies] = useState({});
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const fileInput = useRef(null);
  const members = Object.values(INITIAL_PERSONAS);
  const selected = INITIAL_PERSONAS[selectedMember];
  const progress = useMemo(() => members.map(member => {
    const tasks = personasTasks[member.id] || [];
    const completed = tasks.filter(task => task.status === 'Completed').length;
    return { member, tasks, completed, percentage: tasks.length ? Math.round(completed / tasks.length * 100) : 0 };
  }), [members, personasTasks]);

  const downloadReport = () => {
    const rows = [['Member', 'Role', 'Department', 'Completed', 'Total', 'Progress']];
    progress.forEach(item => rows.push([item.member.name, item.member.role, item.member.department, item.completed, item.tasks.length, `${item.percentage}%`]));
    const blob = new Blob([rows.map(row => row.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'onboardpath-member-progress.csv'; link.click(); URL.revokeObjectURL(url);
  };

  const submitTask = (event) => {
    event.preventDefault();
    assignTaskToMember(selectedMember, taskTitle, taskDescription || undefined, Number(taskDay));
    setTaskTitle('');
    setTaskDescription('');
  };

  const submitChat = (event) => {
    event.preventDefault();
    sendAdminChatMessage(chatText);
    setChatText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-wider text-purple-600">Buddy workspace</p><h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2"><ShieldCheck className="w-7 h-7 text-purple-600" /> Admin & Member Support</h1><p className="text-sm text-slate-600 mt-1">Manage progress, handoffs, assignments, files, and member conversations.</p></div>
        <button onClick={downloadReport} className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2"><Download className="w-4 h-4" /> Download report</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {progress.map(item => <button key={item.member.id} onClick={() => setSelectedMember(item.member.id)} className={`text-left enterprise-card p-5 bg-white border-l-4 ${selectedMember === item.member.id ? 'border-l-purple-600' : 'border-l-slate-200'}`}><div className="flex items-center justify-between"><div><div className="font-bold text-slate-900">{item.member.name}</div><div className="text-xs text-slate-500">{item.member.role}</div></div><Users className="w-5 h-5 text-purple-600" /></div><div className="mt-4 flex justify-between text-xs"><span>{item.completed}/{item.tasks.length} tasks complete</span><strong>{item.percentage}%</strong></div><div className="h-2 bg-slate-100 rounded-full mt-2"><div className="h-2 bg-purple-600 rounded-full" style={{ width: `${item.percentage}%` }} /></div></button>)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="enterprise-card p-5 bg-white"><div className="flex items-center gap-2 mb-4"><UserPlus className="w-5 h-5 text-purple-600" /><h2 className="font-bold">Plan tasks for {selected.name}</h2></div><p className="text-[11px] text-slate-500 mb-3">Drag a task onto another task to rearrange the checklist.</p><form onSubmit={submitTask} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_auto] gap-2"><input value={taskTitle} onChange={event => setTaskTitle(event.target.value)} required placeholder="Task title" className="px-3 py-2 border border-slate-200 rounded-lg text-sm" /><select value={taskDay} onChange={event => setTaskDay(event.target.value)} className="px-2 py-2 border border-slate-200 rounded-lg text-sm">{[1,2,3,4,5].map(day => <option key={day} value={day}>Day {day}</option>)}</select><button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold">Assign</button><input value={taskDescription} onChange={event => setTaskDescription(event.target.value)} placeholder="Description (optional)" className="sm:col-span-3 px-3 py-2 border border-slate-200 rounded-lg text-sm" /></form><div className="mt-4 space-y-2 max-h-64 overflow-auto">{(personasTasks[selectedMember] || []).map((task, index, tasks) => <div key={task.id} draggable onDragStart={() => setDraggedTaskId(task.id)} onDragEnd={() => setDraggedTaskId(null)} onDragOver={event => event.preventDefault()} onDrop={() => { moveMemberTask(selectedMember, draggedTaskId, task.id); setDraggedTaskId(null); }} className={`p-2 border rounded-lg cursor-grab active:cursor-grabbing ${draggedTaskId === task.id ? 'border-purple-400 bg-purple-50 opacity-60' : 'border-slate-200'}`}><div className="flex items-center gap-2 text-xs text-slate-700"><CheckCircle2 className={`w-4 h-4 ${task.status === 'Completed' ? 'text-emerald-600' : 'text-slate-300'}`} /><span className="font-semibold flex-1">{task.title}</span><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500">Day {task.day || 1}</span><button type="button" disabled={index === 0} onClick={() => reorderMemberTask(selectedMember, task.id, -1)} className="p-1 disabled:opacity-30" title="Move task earlier"><ChevronUp className="w-3.5 h-3.5" /></button><button type="button" disabled={index === tasks.length - 1} onClick={() => reorderMemberTask(selectedMember, task.id, 1)} className="p-1 disabled:opacity-30" title="Move task later"><ChevronDown className="w-3.5 h-3.5" /></button><button type="button" onClick={() => removeMemberTask(selectedMember, task.id)} className="p-1 text-rose-600" title="Delete task"><Trash2 className="w-3.5 h-3.5" /></button></div><div className="flex items-center gap-2 mt-2 ml-6"><label className="text-[11px] text-slate-500">Assigned day</label><select value={task.day || 1} onChange={event => updateMemberTask(selectedMember, task.id, { day: Number(event.target.value), category: `Day ${event.target.value} — Buddy Assigned` })} className="px-2 py-1 border border-slate-200 rounded text-[11px]">{[1,2,3,4,5].map(day => <option key={day} value={day}>Day {day}</option>)}</select></div></div>)}</div></section>
        <section className="enterprise-card p-5 bg-white"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><FileUp className="w-5 h-5 text-blue-600" /><h2 className="font-bold">Member files</h2></div><button onClick={() => fileInput.current?.click()} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">Upload file</button><input ref={fileInput} type="file" className="hidden" onChange={event => uploadAdminFile(event.target.files?.[0])} /></div>{adminFiles.length ? adminFiles.map(file => <div key={file.id} className="flex items-center justify-between gap-2 text-xs p-2 bg-slate-50 rounded-lg mb-2"><span className="truncate">{file.name}</span><button type="button" onClick={() => removeAdminFile(file.id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded" title="Delete uploaded file" aria-label={`Delete ${file.name}`}><X className="w-4 h-4" /></button></div>) : <p className="text-sm text-slate-500">Uploaded files will be visible to the selected member in the shared workspace.</p>}</section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="enterprise-card p-5 bg-white"><h2 className="font-bold mb-4">Handoff inbox</h2>{handoffs.length ? handoffs.map(handoff => <div key={handoff.id} className="border border-slate-200 rounded-lg p-3 mb-2"><div className="text-sm font-semibold">{handoff.category}</div><div className="text-xs text-slate-500">Assigned to {handoff.assignedTo} · {handoff.status}</div><div className="mt-2 space-y-1">{(handoff.messages || []).map(message => <div key={message.id} className="p-2 bg-blue-50 rounded text-xs"><strong>{message.sender === 'buddy' ? 'Buddy' : 'Member'}:</strong> {message.text}</div>)}</div><form onSubmit={event => { event.preventDefault(); replyToHandoff(handoff.id, handoffReplies[handoff.id], 'buddy'); setHandoffReplies(prev => ({ ...prev, [handoff.id]: '' })); }} className="flex gap-2 mt-2"><input value={handoffReplies[handoff.id] || ''} onChange={event => setHandoffReplies(prev => ({ ...prev, [handoff.id]: event.target.value }))} placeholder="Reply to member" className="flex-1 px-2.5 py-2 border border-slate-200 rounded text-xs" /><button className="px-3 py-2 bg-purple-600 text-white rounded text-xs font-semibold">Reply</button></form></div>) : <p className="text-sm text-slate-500">No active handoffs.</p>}</section>
        <section className="enterprise-card p-5 bg-white"><div className="flex items-center gap-2 mb-4"><MessageCircle className="w-5 h-5 text-blue-600" /><h2 className="font-bold">Shared buddy chat</h2></div><div className="h-40 overflow-auto space-y-2 mb-3">{adminChatMessages.map(message => <div key={message.id} className={`p-2 rounded-lg text-xs ${message.sender === 'buddy' ? 'bg-blue-50' : 'bg-slate-100'}`}><strong>{message.sender === 'buddy' ? 'Buddy' : selected.name}:</strong> {message.text}</div>)}</div><form onSubmit={submitChat} className="flex gap-2"><input value={chatText} onChange={event => setChatText(event.target.value)} required placeholder="Reply to member" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" /><button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">Send</button></form></section>
      </div>
    </div>
  );
}
