import React, { useState } from 'react';
import { Calendar, Play, ChevronRight, Sparkles, CheckCircle, Plus, X, Trash2, Edit2, CheckSquare } from 'lucide-react';
import { CalendarEvent, Task } from '../../types';

interface TodayPlanCardProps {
  onOptimizeDay: () => void;
  isOptimized: boolean;
  events: CalendarEvent[];
  tasks?: Task[];
  onAddTask?: (title: string, priority: 'high' | 'medium' | 'low', time: string, date: string, additional?: Partial<Task>) => void;
  onToggleTaskCompleted?: (id: string, completed: boolean) => void;
  onDeleteTask?: (id: string) => void;
}

export default function TodayPlanCard({ 
  onOptimizeDay, 
  isOptimized, 
  events,
  tasks = [],
  onAddTask,
  onToggleTaskCompleted,
  onDeleteTask,
  onViewFullSchedule
}: TodayPlanCardProps & { onViewFullSchedule?: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    endTime: '10:00',
    priority: 'medium',
    category: 'general',
    reminder: false,
    repeat: 'none'
  });

  // Filter tasks for today
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === todayDateStr || t.date.toLowerCase() === 'today');

  // Combine events and tasks for the timeline, sort by time
  const scheduleItems = [
    ...events.map(e => ({ ...e, isTask: false, completed: false })),
    ...todayTasks.map(t => ({ 
      id: t.id,
      title: t.title, 
      startTime: t.time, 
      endTime: t.endTime || t.time,
      isTask: true,
      completed: t.completed
    }))
  ].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')).map((item) => ({
    id: item.id,
    time: item.startTime,
    title: item.title,
    duration: item.endTime && item.endTime !== item.startTime ? `${item.startTime} - ${item.endTime}` : item.startTime,
    isTask: item.isTask,
    completed: item.completed
  }));

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !onAddTask) return;
    onAddTask(
      newTask.title, 
      (newTask.priority as any) || 'medium', 
      newTask.time || '09:00', 
      newTask.date || todayDateStr,
      {
        description: newTask.description,
        endTime: newTask.endTime,
        category: newTask.category,
        reminder: newTask.reminder,
        repeat: newTask.repeat
      }
    );
    setIsModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      date: todayDateStr,
      time: '09:00',
      endTime: '10:00',
      priority: 'medium',
      category: 'general',
      reminder: false,
      repeat: 'none'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      {/* 1. TODAY'S PLAN TIMELINE CARD */}
      <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between relative">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
            <h3 className="font-serif font-bold text-xs text-[#3E332E] tracking-wider uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#B08B74]" />
              Today's Plan
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-[#624F43]/40 uppercase tracking-widest">{scheduleItems.length} Events</span>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="p-1 rounded-full bg-[#B08B74]/10 text-[#B08B74] hover:bg-[#B08B74] hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline list */}
          <div className="space-y-3.5 relative pl-4 border-l border-[#B08B74]/15 py-1 min-h-[100px] max-h-[180px] overflow-y-auto no-scrollbar">
            {scheduleItems.length > 0 ? (
              scheduleItems.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#FAF6F0] z-10 shadow-xs ${item.completed ? 'bg-green-500' : 'bg-[#B08B74]'}`} />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#624F43]/55 font-bold block">{item.time}</span>
                      <span className={`text-xs font-sans font-bold transition-colors ${item.completed ? 'text-[#624F43]/50 line-through' : 'text-[#3E332E] group-hover:text-[#B08B74]'}`}>
                        {item.title}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-mono font-bold text-[#624F43]/40 bg-[#FAF5EF] px-1.5 py-0.5 rounded-md border border-[#624F43]/5">
                        {item.duration}
                      </span>
                      {item.isTask && (
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 mt-1">
                          <button onClick={() => onToggleTaskCompleted && item.id && onToggleTaskCompleted(item.id, !item.completed)} className="text-green-600 hover:text-green-700">
                            <CheckSquare className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => onDeleteTask && item.id && onDeleteTask(item.id)} className="text-red-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center -ml-4 space-y-2">
                <span className="text-xs font-sans font-medium text-[#624F43]/60 italic">No plans for today.</span>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 bg-[#B08B74]/10 text-[#B08B74] rounded-lg text-[10px] font-bold shadow-xs hover:bg-[#B08B74] hover:text-white transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Create First Task
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => onViewFullSchedule && onViewFullSchedule()}
          className="w-full mt-5 text-center text-[10px] font-sans font-bold text-[#B08B74] uppercase tracking-wider bg-[#B08B74]/5 hover:bg-[#B08B74]/10 py-2 rounded-xl transition-all border border-[#B08B74]/10 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          View Full Schedule
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. POSTER ARTWORK CARD */}
      <div className="bg-white/75 backdrop-blur-xs border border-white p-3 rounded-[24px] shadow-sm flex flex-col justify-between relative overflow-hidden h-[330px]">
        {/* Tape illustration mock on top */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-4 bg-amber-100/50 border border-amber-200/30 rounded-xs shadow-xs z-20 flex items-center justify-center rotate-[-1deg] backdrop-blur-xs">
          <span className="text-[6px] text-amber-800/40 font-mono select-none">TAPE</span>
        </div>

        {/* Vintage ripped poster container */}
        <div className="w-full h-full border border-[#624F43]/10 rounded-xl relative shadow-inner overflow-hidden">
          <img src="/photo.png" alt="Artwork" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 3. AI INSIGHT CARD */}
      <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#624F43]/5">
            <Sparkles className="w-4 h-4 text-[#B08B74] animate-pulse" />
            <h3 className="font-serif font-bold text-xs text-[#3E332E] tracking-wider uppercase">AI Insight</h3>
          </div>

          <p className="text-xs font-sans font-medium text-[#624F43]/80 leading-relaxed pt-1">
            You usually focus best between <strong className="text-[#3E332E]">9 AM - 1 PM</strong>. 
            <br /><br />
            Shall I schedule your important study tasks and mathematics practice in that time slot?
          </p>

          <div className="bg-[#FAF5EF] border border-[#B08B74]/15 p-3.5 rounded-xl flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <p className="text-[10px] font-medium text-[#624F43]/70 leading-relaxed">
              Matching difficult subjects to peak cognitive windows boosts retention by up to 24%.
            </p>
          </div>
        </div>

        <button 
          onClick={onOptimizeDay}
          disabled={isOptimized}
          className={`w-full mt-5 text-center text-[10px] font-sans font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all border flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
            isOptimized
              ? 'bg-[#A4B494] text-white border-[#A4B494]/30'
              : 'bg-[#B08B74] text-white border-[#B08B74]/20 hover:bg-[#8B7355]'
          }`}
        >
          {isOptimized ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              Day Optimized!
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Optimize My Day
            </>
          )}
        </button>
      </div>

      {/* TASK CREATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#3E332E]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] rounded-3xl p-6 w-full max-w-md shadow-2xl relative border-4 border-white">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/50 rounded-full hover:bg-white text-[#624F43]"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold text-[#3E332E] mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-[#B08B74]" /> Create New Task
            </h2>
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#624F43]/70 block mb-1">Task Title</label>
                <input type="text" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-[#B08B74]/30 outline-none shadow-sm text-sm" placeholder="What do you need to do?" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#624F43]/70 block mb-1">Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-[#B08B74]/30 outline-none shadow-sm text-sm h-20 resize-none" placeholder="Add details..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#624F43]/70 block mb-1">Date</label>
                  <input type="date" required value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-[#B08B74]/30 outline-none shadow-sm text-sm text-[#3E332E]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#624F43]/70 block mb-1">Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})} className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-[#B08B74]/30 outline-none shadow-sm text-sm text-[#3E332E]">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#624F43]/70 block mb-1">Start Time</label>
                  <input type="time" required value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-[#B08B74]/30 outline-none shadow-sm text-sm text-[#3E332E]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#624F43]/70 block mb-1">End Time</label>
                  <input type="time" required value={newTask.endTime} onChange={e => setNewTask({...newTask, endTime: e.target.value})} className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-[#B08B74]/30 outline-none shadow-sm text-sm text-[#3E332E]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#624F43]/70 block mb-1">Category</label>
                  <input type="text" value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})} className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-[#B08B74]/30 outline-none shadow-sm text-sm" placeholder="e.g. Study, Work..." />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#624F43]/70 block mb-1">Repeat</label>
                  <select value={newTask.repeat} onChange={e => setNewTask({...newTask, repeat: e.target.value})} className="w-full bg-white p-3 rounded-xl border-none focus:ring-2 focus:ring-[#B08B74]/30 outline-none shadow-sm text-sm text-[#3E332E]">
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="reminder" checked={newTask.reminder} onChange={e => setNewTask({...newTask, reminder: e.target.checked})} className="w-4 h-4 text-[#B08B74] focus:ring-[#B08B74] rounded" />
                <label htmlFor="reminder" className="text-xs font-bold text-[#3E332E]">Set a reminder 10 minutes before</label>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-[#B08B74] hover:bg-[#8B7355] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors uppercase tracking-widest text-[11px]">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
