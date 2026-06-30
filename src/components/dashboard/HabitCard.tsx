import React, { useState } from 'react';
import { CheckSquare, Plus, Droplet, Book, Heart, Apple, Dumbbell, Star, ChevronDown } from 'lucide-react';
import { Habit } from '../../types';
import EmptyState from './EmptyState';

interface HabitCardProps {
  habits: Habit[];
  onAddHabit: (name: string, icon: string) => void;
  onToggleDay: (habitId: string, dateStr: string, active: boolean) => void;
}

export default function HabitCard({
  habits,
  onAddHabit,
  onToggleDay,
}: HabitCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('droplet');

  // Generate last 7 days ending with today
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      date: d.getDate().toString(),
      fullDate: d.toISOString().split('T')[0]
    };
  });
  const todayStr = today.toISOString().split('T')[0];

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'droplet': return <Droplet className="w-4 h-4 text-[#8DA4C4]" />;
      case 'book': return <Book className="w-4 h-4 text-[#B08B74]" />;
      case 'heart': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'apple': return <Apple className="w-4 h-4 text-amber-500" />;
      case 'dumbbell': return <Dumbbell className="w-4 h-4 text-emerald-500" />;
      default: return <Star className="w-4 h-4 text-[#B08B74]" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName, newHabitIcon);
    setNewHabitName('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
          <h3 className="font-serif font-bold text-xs text-[#3E332E] tracking-wider uppercase flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#B08B74]" />
            Habit Tracker
          </h3>
          
          <button className="flex items-center space-x-1 px-2.5 py-1 bg-[#FAF5EF] hover:bg-[#EADBC8]/20 border border-[#624F43]/10 rounded-lg text-[9px] font-bold text-[#624F43] cursor-pointer">
            <span>Today</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Days Header Row (Mon to Sun) */}
        <div className="grid grid-cols-[100px_1fr] gap-3 pt-1">
          <div />
          <div className="grid grid-cols-7 text-center">
            {weekDays.map((d) => (
              <div 
                key={d.fullDate} 
                className={`flex flex-col items-center py-1.5 rounded-lg ${
                  d.fullDate === todayStr ? 'bg-[#B08B74]/15 text-[#3E332E]' : 'text-[#624F43]/50'
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{d.day}</span>
                <span className="text-[10px] font-sans font-bold mt-1 leading-none">{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habits List Row */}
        <div className="space-y-3.5 max-h-[220px] overflow-y-auto no-scrollbar">
          {habits.map((habit) => (
            <div key={habit.id} className="grid grid-cols-[100px_1fr] gap-3 items-center">
              {/* Habit name with icon */}
              <div className="flex items-center space-x-2 min-w-0">
                <div className="p-2 bg-[#FAF5EF] border border-[#624F43]/5 rounded-xl flex-shrink-0">
                  {getIconComponent(habit.icon)}
                </div>
                <span className="text-[11px] font-sans font-bold text-[#3E332E] truncate">
                  {habit.name}
                </span>
              </div>

              {/* Day trigger checklists */}
              <div className="grid grid-cols-7 text-center">
                {weekDays.map((d) => {
                  const isCompleted = !!habit.history[d.fullDate];
                  return (
                    <div key={d.fullDate} className="flex justify-center items-center">
                      <button
                        onClick={() => onToggleDay(habit.id, d.fullDate, !isCompleted)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                          isCompleted
                            ? 'bg-[#A4B494] text-white border-[#A4B494] scale-105'
                            : 'bg-white border-[#624F43]/15 text-transparent hover:border-[#B08B74]'
                        }`}
                      >
                        {isCompleted && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1.5 4 4 6.5 8.5 2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {habits.length === 0 && (
            <EmptyState 
              message="No habits added yet"
              onAction={() => setIsAdding(true)}
              actionLabel="Create Habit"
            />
          )}
        </div>
      </div>

      {/* Add Habit Prompt Drawer */}
      {isAdding ? (
        <form onSubmit={handleSubmit} className="bg-[#FAF5EF] p-4 border border-[#B08B74]/20 rounded-2xl space-y-3 mt-4 shadow-inner">
          <input
            type="text"
            required
            placeholder="Habit name (e.g. Meditate 10m)..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-[#624F43]/10 rounded-xl focus:outline-none"
          />
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-[#624F43]/50 uppercase tracking-widest pl-1">
              Select Icon
            </span>
            <div className="flex items-center space-x-2.5">
              {['droplet', 'book', 'heart', 'apple', 'dumbbell'].map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setNewHabitIcon(ic)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    newHabitIcon === ic ? 'bg-[#B08B74] border-[#B08B74]' : 'bg-white border-[#624F43]/10'
                  }`}
                >
                  <span className={newHabitIcon === ic ? 'text-white' : ''}>
                    {getIconComponent(ic)}
                  </span>
                </button>
              ))}
            </div>
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
              Add Habit
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full mt-4 py-2.5 bg-[#B08B74]/5 border border-dashed border-[#B08B74]/30 text-[#B08B74] rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider hover:bg-[#B08B74]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Habit
        </button>
      )}
    </div>
  );
}
