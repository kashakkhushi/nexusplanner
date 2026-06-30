import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin, Clock, X } from 'lucide-react';
import { CalendarEvent } from '../../types';
import EmptyState from './EmptyState';

interface CalendarCardProps {
  events: CalendarEvent[];
  onAddEvent: (title: string, date: string, startTime: string, endTime: string, category: string) => void;
  onDeleteEvent: (id: string) => void;
}

export default function CalendarCard({
  events,
  onAddEvent,
  onDeleteEvent,
}: CalendarCardProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr); 
  const [isAdding, setIsAdding] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  
  // Modal/Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(todayStr);
  const [newStart, setNewStart] = useState('09:00 AM');
  const [newEnd, setNewEnd] = useState('11:00 AM');
  const [newCategory, setNewCategory] = useState('Study');

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDayOfWeek = currentMonth.getDay(); // 0 is Sunday
  const daysList = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const gridCells = [...Array(startDayOfWeek).fill(null), ...daysList];

  const getDayEvents = (dayNum: number) => {
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${formattedDay}`;
    return events.filter(e => e.date === dateStr);
  };

  const handleDayClick = (dayNum: number) => {
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${formattedDay}`;
    setSelectedDate(dateStr);
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddEvent(newTitle, newDate, newStart, newEnd, newCategory);
    setNewTitle('');
    setIsAdding(false);
  };

  // Get events on currently selected date
  const selectedDateEvents = events.filter(e => e.date === selectedDate);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'study': return 'bg-brand-sage/20 text-[#7D8B71] border-brand-sage/40';
      case 'math practice': return 'bg-[#8DA4C4]/20 text-[#5C7A92] border-[#8DA4C4]/40';
      case 'deadline': return 'bg-red-50 text-red-700 border-red-200';
      case 'data struct': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-[#B08B74]/15 text-[#8B7355] border-[#B08B74]/20';
    }
  };

  return (
    <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between relative h-full">
      <div className="space-y-4">
        {/* Header Navigation */}
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#624F43]/5 gap-2">
          <h3 className="font-serif font-bold text-xs text-[#3E332E] tracking-wider uppercase flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#B08B74]" />
            My Calendar
          </h3>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-[#FAF5EF] p-0.5 rounded-lg border border-[#624F43]/10 text-[10px] font-bold font-sans">
              {(['month', 'week', 'day'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setViewMode(view)}
                  className={`px-2 py-0.5 rounded-md capitalize transition-all cursor-pointer ${
                    viewMode === view ? 'bg-[#B08B74] text-white shadow-xs' : 'text-[#624F43]/50 hover:text-[#3E332E]'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1">
              <button onClick={prevMonth} className="p-1 hover:bg-[#FAF5EF] border border-[#624F43]/10 rounded-md cursor-pointer text-[#624F43]">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={nextMonth} className="p-1 hover:bg-[#FAF5EF] border border-[#624F43]/10 rounded-md cursor-pointer text-[#624F43]">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  setSelectedDate(todayStr);
                  setCurrentMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
                }}
                className="px-2 py-1 bg-white hover:bg-[#FAF5EF] border border-[#624F43]/10 text-[9px] font-bold uppercase rounded-md text-[#3E332E] cursor-pointer"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Month Title */}
        <div className="text-left">
          <h4 className="font-serif font-bold text-sm text-[#3E332E]">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
        </div>

        {/* Calendar Grid (Traditional Sun-Sat headers) */}
        <div className="space-y-1">
          <div className="grid grid-cols-7 text-center text-[9px] font-bold text-[#624F43]/50 uppercase tracking-widest pb-1 border-b border-[#624F43]/5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-sans">
            {gridCells.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              
              const dayEvents = getDayEvents(day);
              const formattedDay = day < 10 ? `0${day}` : `${day}`;
              const fullDateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${formattedDay}`;
              const isSelected = selectedDate === fullDateStr;
              const isTodayDate = fullDateStr === todayStr;

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`relative p-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex flex-col items-center justify-between h-9 ${
                    isSelected 
                      ? 'bg-[#B08B74] text-white shadow-xs' 
                      : isTodayDate
                      ? 'bg-[#B08B74]/15 text-[#3E332E] border border-[#B08B74]/50'
                      : 'bg-white hover:bg-[#FAF5EF] text-[#3E332E]'
                  }`}
                >
                  <span>{day}</span>
                  {/* Event indicator dots */}
                  {dayEvents.length > 0 && (
                    <div className="flex space-x-0.5 justify-center mt-0.5">
                      {dayEvents.slice(0, 3).map((e, eIdx) => (
                        <span 
                          key={eIdx} 
                          className={`w-1 h-1 rounded-full ${
                            isSelected 
                              ? 'bg-white' 
                              : e.category.toLowerCase() === 'deadline'
                              ? 'bg-red-500'
                              : e.category.toLowerCase() === 'math practice'
                              ? 'bg-[#8DA4C4]'
                              : 'bg-[#A4B494]'
                          }`} 
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date's Upcoming Events List */}
        <div className="space-y-3.5 pt-3 border-t border-[#624F43]/5">
          <h4 className="text-[9px] font-bold text-[#624F43]/50 uppercase tracking-widest pl-1">
            Upcoming Events ({selectedDateEvents.length})
          </h4>

          <div className="space-y-2.5 max-h-[160px] overflow-y-auto no-scrollbar pr-1">
            {selectedDateEvents.map((evt) => (
              <div 
                key={evt.id}
                className={`p-3 rounded-xl border flex items-center justify-between shadow-xs ${getCategoryColor(evt.category)}`}
              >
                <div className="min-w-0 flex-grow pr-3">
                  <h5 className="text-xs font-sans font-bold truncate leading-tight">{evt.title}</h5>
                  <div className="flex items-center space-x-2 mt-1 text-[9px] font-semibold opacity-75">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span>{evt.startTime} - {evt.endTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteEvent(evt.id)}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors cursor-pointer opacity-40 hover:opacity-100 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {selectedDateEvents.length === 0 && (
              <EmptyState 
                message="No calendar events yet"
                onAction={() => setIsAdding(true)}
                actionLabel="Create Event"
              />
            )}
          </div>
        </div>
      </div>

      {/* FAB Floating Add Event Button */}
      <button
        onClick={() => setIsAdding(true)}
        className="absolute bottom-5 right-5 w-11 h-11 bg-[#B08B74] hover:bg-[#8B7355] text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-[#FAF5EF]/10"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Add Event Overlay Form Modal */}
      {isAdding && (
        <div className="absolute inset-0 bg-[#FAF6F0]/95 backdrop-blur-xs rounded-[24px] z-50 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
              <h4 className="font-serif font-bold text-xs text-[#3E332E] uppercase tracking-wide">
                Add Calendar Event
              </h4>
              <button 
                onClick={() => setIsAdding(false)}
                className="p-1 hover:bg-black/5 rounded-full text-[#624F43]/50 hover:text-[#3E332E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="ML Midterm Study..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#624F43]/10 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#624F43]/10 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#624F43]/10 rounded-xl font-bold"
                  >
                    <option value="Study">Study</option>
                    <option value="Math Practice">Math Practice</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Data Struct">Data Structures</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="09:00 AM"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#624F43]/10 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="11:00 AM"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#624F43]/10 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-[#624F43]/5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-white border border-[#624F43]/10 rounded-xl text-[10px] font-bold text-[#624F43]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B08B74] text-white rounded-xl text-[10px] font-bold shadow-xs hover:bg-[#8B7355]"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
