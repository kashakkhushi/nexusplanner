import React, { useState } from 'react';
import { Bell, Volume2, VolumeX, Plus, Trash2, Calendar } from 'lucide-react';
import { Reminder } from '../../types';
import EmptyState from './EmptyState';

interface RemindersCardProps {
  reminders: Reminder[];
  onAddReminder: (title: string, time: string, date: string) => void;
  onToggleReminderSound: (id: string, sound: boolean) => void;
  onDeleteReminder: (id: string) => void;
}

export default function RemindersCard({
  reminders,
  onAddReminder,
  onToggleReminderSound,
  onDeleteReminder,
}: RemindersCardProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:30 AM');
  const [newDate, setNewDate] = useState('Today');

  const filteredReminders = reminders.filter((r) => {
    if (activeTab === 'completed') return !r.enabled;
    if (activeTab === 'upcoming') return r.enabled;
    return true; // all
  });

  const todayReminders = filteredReminders.filter(
    (r) => r.date.toLowerCase() === 'today' || r.date.toLowerCase().includes('28')
  );
  const tomorrowReminders = filteredReminders.filter(
    (r) => r.date.toLowerCase() === 'tomorrow' || r.date.toLowerCase().includes('29')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReminder(newTitle, newTime, newDate);
    setNewTitle('');
    setIsAdding(false);
  };

  const renderReminderItem = (reminder: Reminder) => (
    <div 
      key={reminder.id}
      className="flex items-center justify-between p-3 bg-white/60 border border-[#624F43]/5 rounded-2xl shadow-xs hover:border-[#B08B74]/20 transition-all"
    >
      <div className="flex items-center space-x-3 min-w-0">
        <div className={`p-2 rounded-xl flex-shrink-0 ${reminder.enabled ? 'bg-[#B08B74]/10 text-[#B08B74]' : 'bg-[#624F43]/5 text-[#624F43]/35'}`}>
          <Bell className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-sans font-bold text-[#3E332E] truncate">
            {reminder.title}
          </p>
          <span className="text-[9px] font-mono font-medium text-[#624F43]/50">
            {reminder.time}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
        <button
          onClick={() => onToggleReminderSound(reminder.id, !reminder.sound)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            reminder.sound ? 'text-[#B08B74] hover:bg-[#B08B74]/5' : 'text-[#624F43]/30 hover:bg-black/5'
          }`}
          title={reminder.sound ? "Sound Enabled" : "Sound Muted"}
        >
          {reminder.sound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => onDeleteReminder(reminder.id)}
          className="p-1.5 text-[#624F43]/20 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
          <h3 className="font-serif font-bold text-xs text-[#3E332E] tracking-wider uppercase flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#B08B74]" />
            Task Reminders
          </h3>
          <span className="text-[10px] bg-[#B08B74]/10 text-[#624F43] px-2 py-0.5 rounded-full font-bold">
            {reminders.filter(r => r.enabled).length} Active
          </span>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center justify-between gap-1 bg-[#FAF5EF] border border-[#624F43]/5 p-1 rounded-xl">
          {(['all', 'upcoming', 'completed'] as const).map((tab) => {
            const count = tab === 'all' 
              ? reminders.length 
              : tab === 'upcoming' 
              ? reminders.filter(r => r.enabled).length 
              : reminders.filter(r => !r.enabled).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1 text-[10px] font-sans font-bold capitalize rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#B08B74] text-white shadow-xs'
                    : 'text-[#624F43]/60 hover:text-[#3E332E]'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Add Reminder Inline Form */}
        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-[#FAF5EF] p-4 border border-[#B08B74]/20 rounded-2xl space-y-3 shadow-inner">
            <input
              type="text"
              required
              placeholder="Reminder label (e.g. 30m before study)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-[#624F43]/10 rounded-xl focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Time (e.g. 08:30 AM)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="text-[10px] p-2 bg-white border border-[#624F43]/10 rounded-xl"
              />
              <select
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="text-[10px] p-2 bg-white border border-[#624F43]/10 rounded-xl font-bold font-sans"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
              </select>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 bg-white border border-[#624F43]/10 rounded-lg text-[10px] font-bold text-[#624F43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#B08B74] text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-[#8B7355]"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 bg-[#B08B74]/5 border border-dashed border-[#B08B74]/30 text-[#B08B74] rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider hover:bg-[#B08B74]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Reminder
          </button>
        )}

        {/* Groups */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pt-1">
          {/* TODAY GROUP */}
          {todayReminders.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-[#B08B74] uppercase tracking-widest block pl-1">
                Today
              </span>
              <div className="space-y-2">
                {todayReminders.map(renderReminderItem)}
              </div>
            </div>
          )}

          {/* TOMORROW GROUP */}
          {tomorrowReminders.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-[#624F43]/50 uppercase tracking-widest block pl-1">
                Tomorrow
              </span>
              <div className="space-y-2">
                {tomorrowReminders.map(renderReminderItem)}
              </div>
            </div>
          )}

          {filteredReminders.length === 0 && (
            <EmptyState 
              message="No reminders yet"
              onAction={() => setIsAdding(true)}
              actionLabel="Create Reminder"
            />
          )}
        </div>
      </div>
    </div>
  );
}
