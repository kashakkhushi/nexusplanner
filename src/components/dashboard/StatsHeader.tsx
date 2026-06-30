import React from 'react';
import { Search, Bell, Sparkles, Flame, CheckSquare, Clock, ShieldCheck } from 'lucide-react';
import { UserProfile, Task } from '../../types';

interface StatsHeaderProps {
  userProfile: UserProfile;
  tasks: Task[];
  focusTimeMinutes: number;
  studyStreakDays: number;
}

export default function StatsHeader({
  userProfile,
  tasks,
  focusTimeMinutes,
  studyStreakDays,
}: StatsHeaderProps) {
  // Format focus time (e.g. 272 minutes -> 4h 32m)
  const formatFocusTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length;

  return (
    <div className="space-y-5">
      {/* Search and Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#3E332E] tracking-tight flex items-center gap-2">
            Good Evening, {(userProfile?.fullName || 'Kashak').split(' ')[0]}! 🌙
          </h2>
          <p className="text-[11px] sm:text-xs font-sans text-[#624F43]/60 flex items-center gap-1.5 mt-0.5 font-medium">
            Let's make today amazing <span className="text-[#B08B74] animate-pulse">✨</span>
          </p>
        </div>

        {/* Search & Icons */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {/* Search bar */}
          <div className="relative max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-3.5 w-3.5 text-[#624F43]/40" />
            </span>
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-9 pr-4 py-1.5 bg-white/70 backdrop-blur-xs border border-[#624F43]/10 text-[#3E332E] text-xs rounded-full placeholder-[#624F43]/40 focus:outline-none focus:ring-1 focus:ring-[#B08B74] focus:border-[#B08B74] transition-all w-48 sm:w-56"
            />
          </div>

          {/* Notifications Bell */}
          <button className="p-2 bg-white/70 hover:bg-white rounded-full border border-[#624F43]/10 text-[#624F43]/70 hover:text-[#3E332E] transition-all cursor-pointer relative shadow-xs">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full border border-white" />
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* FOCUS TIME CARD */}
        <div className="bg-white/75 backdrop-blur-xs border border-white p-4 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#EADBC8"
                strokeWidth="3.5"
                fill="transparent"
                className="opacity-40"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#8DA4C4"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - 0.72)} // Static visual representation of 72%
                strokeLinecap="round"
              />
            </svg>
            <Clock className="w-4 h-4 text-[#5C7A92] absolute" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#624F43]/50 uppercase tracking-widest block">Focus Time</span>
            <span className="font-serif font-bold text-base text-[#3E332E] tracking-tight">{formatFocusTime(focusTimeMinutes)}</span>
            <span className="text-[9px] font-semibold text-green-600 block mt-0.5">↑ 18% from yesterday</span>
          </div>
        </div>

        {/* TASKS COMPLETED CARD */}
        <div className="bg-white/75 backdrop-blur-xs border border-white p-4 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF5EF] border border-[#B08B74]/15 flex items-center justify-center flex-shrink-0 text-[#B08B74]">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#624F43]/50 uppercase tracking-widest block">Tasks Completed</span>
            <span className="font-serif font-bold text-base text-[#3E332E] tracking-tight">
              {completedTasksCount} / {totalTasksCount}
            </span>
            <span className="text-[9px] font-semibold text-[#B08B74] block mt-0.5">
              {totalTasksCount > 0 ? (completedTasksCount >= totalTasksCount ? 'Great going! 🎉' : 'Keep clicking! ✨') : 'No tasks yet'}
            </span>
          </div>
        </div>

        {/* STUDY STREAK CARD */}
        <div className="bg-white/75 backdrop-blur-xs border border-white p-4 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500 animate-bounce" style={{ animationDuration: '3s' }}>
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#624F43]/50 uppercase tracking-widest block">Study Streak</span>
            <span className="font-serif font-bold text-base text-[#3E332E] tracking-tight">{studyStreakDays} Days</span>
            <span className="text-[9px] font-semibold text-orange-600 block mt-0.5">Keep it up! 🔥</span>
          </div>
        </div>

      </div>
    </div>
  );
}
