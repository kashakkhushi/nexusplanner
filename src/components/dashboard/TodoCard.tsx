import React, { useState } from 'react';
import { CheckSquare, Star, Plus, Trash2, CheckCircle2, Circle, Search, Edit2, GripVertical } from 'lucide-react';
import { Task } from '../../types';
import EmptyState from './EmptyState';

interface TodoCardProps {
  tasks: Task[];
  onAddTask: (title: string, priority: 'high' | 'medium' | 'low', time: string, date: string, additional?: Partial<Task>) => void;
  onToggleTaskCompleted: (id: string, completed: boolean) => void;
  onToggleTaskStarred: (id: string, starred: boolean) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
}

export default function TodoCard({
  tasks,
  onAddTask,
  onToggleTaskCompleted,
  onToggleTaskStarred,
  onDeleteTask,
  onUpdateTask
}: TodoCardProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'important' | 'done'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDate, setNewDate] = useState('June 28, 2026');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab === 'important') return t.starred || t.priority === 'high';
    if (activeTab === 'done') return t.completed;
    if (activeTab === 'today') {
      const todayStr = new Date().toISOString().split('T')[0];
      return t.date === todayStr || t.date.toLowerCase().includes('today');
    }
    return true; // 'all'
  });

  const highPriority = filteredTasks.filter((t) => t.priority === 'high');
  const mediumPriority = filteredTasks.filter((t) => t.priority === 'medium');
  const lowPriority = filteredTasks.filter((t) => t.priority === 'low');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (editingTaskId && onUpdateTask) {
      onUpdateTask(editingTaskId, {
        title: newTitle,
        priority: newPriority,
        time: newTime,
        date: newDate
      });
      setEditingTaskId(null);
    } else {
      onAddTask(newTitle, newPriority, newTime, newDate);
    }
    setNewTitle('');
    setIsAdding(false);
  };

  const startEdit = (task: Task) => {
    setNewTitle(task.title);
    setNewPriority(task.priority);
    setNewTime(task.time || '');
    setNewDate(task.date || '');
    setEditingTaskId(task.id);
    setIsAdding(true);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, targetPriority: 'high' | 'medium' | 'low') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId || !onUpdateTask) return;
    onUpdateTask(taskId, { priority: targetPriority });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderTaskItem = (task: Task) => (
    <div 
      key={task.id} 
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      className={`flex items-center justify-between p-3.5 bg-white border border-[#624F43]/10 rounded-2xl shadow-xs transition-all cursor-move ${
        task.completed ? 'opacity-65' : 'hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center space-x-3 flex-grow min-w-0">
        <GripVertical className="w-4 h-4 text-[#624F43]/20 flex-shrink-0 hidden md:block" />
        <button 
          onClick={() => onToggleTaskCompleted(task.id, !task.completed)}
          className="text-[#B08B74] hover:scale-105 transition-transform flex-shrink-0 cursor-pointer"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-50" />
          ) : (
            <Circle className="w-5 h-5 text-[#B08B74]/55" />
          )}
        </button>

        <div className="min-w-0">
          <p className={`text-xs font-sans font-bold text-[#3E332E] truncate ${
            task.completed ? 'line-through text-[#624F43]/50' : ''
          }`}>
            {task.title}
          </p>
          <span className="text-[9px] font-mono font-medium text-[#624F43]/50">
            {task.time ? `${task.time}` : ''} {task.date ? `• ${task.date}` : ''}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1 flex-shrink-0 ml-3">
        <button 
          onClick={() => startEdit(task)}
          className="p-1.5 text-[#624F43]/20 hover:text-[#B08B74] rounded-full transition-colors cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => onToggleTaskStarred(task.id, !task.starred)}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            task.starred ? 'text-amber-500 hover:text-amber-600' : 'text-[#624F43]/20 hover:text-[#B08B74]'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${task.starred ? 'fill-current' : ''}`} />
        </button>
        <button 
          onClick={() => onDeleteTask(task.id)}
          className="p-1.5 text-[#624F43]/20 hover:text-red-500 rounded-full transition-colors cursor-pointer"
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
            <CheckSquare className="w-4 h-4 text-[#B08B74]" />
            To-Do List
          </h3>
          <span className="text-[10px] bg-[#B08B74]/10 text-[#624F43] px-2 py-0.5 rounded-full font-bold">
            {tasks.filter(t => !t.completed).length} Pending
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between gap-1 bg-[#FAF5EF] border border-[#624F43]/5 p-1 rounded-xl">
          {(['all', 'today', 'important', 'done'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1 text-[10px] font-sans font-bold capitalize rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#B08B74] text-white shadow-xs'
                  : 'text-[#624F43]/60 hover:text-[#3E332E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#624F43]/40" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-[10px] bg-white border border-[#624F43]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B08B74]"
          />
        </div>

        {/* Add Task Block */}
        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-[#FAF5EF] p-4 border border-[#B08B74]/20 rounded-2xl space-y-3 shadow-inner">
            <input
              type="text"
              required
              placeholder="Task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-[#624F43]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B08B74]"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="text-[10px] font-sans font-bold p-2 bg-white border border-[#624F43]/10 rounded-xl"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="text-[10px] p-2 bg-white border border-[#624F43]/10 rounded-xl text-[#3E332E]"
              />
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingTaskId(null); }}
                className="px-3 py-1.5 bg-white border border-[#624F43]/10 rounded-lg text-[10px] font-bold text-[#624F43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#B08B74] text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-[#8B7355]"
              >
                {editingTaskId ? 'Update Task' : 'Save Task'}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => {
              setNewTitle('');
              setNewPriority('high');
              setNewDate(new Date().toISOString().split('T')[0]);
              setEditingTaskId(null);
              setIsAdding(true);
            }}
            className="w-full py-2.5 bg-[#B08B74]/5 border border-dashed border-[#B08B74]/30 text-[#B08B74] rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider hover:bg-[#B08B74]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        )}

        {/* Priority Groups */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pt-1 pb-4">
          {/* HIGH PRIORITY */}
          {(highPriority.length > 0 || searchQuery === '') && (
            <div 
              className="space-y-2 pb-2 min-h-[30px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'high')}
            >
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest block pl-1">
                High Priority
              </span>
              <div className="space-y-2 border-l-2 border-red-200 pl-2">
                {highPriority.map(renderTaskItem)}
                {highPriority.length === 0 && <div className="text-[10px] text-gray-400 italic py-1">Drop tasks here</div>}
              </div>
            </div>
          )}

          {/* MEDIUM PRIORITY */}
          {(mediumPriority.length > 0 || searchQuery === '') && (
            <div 
              className="space-y-2 pb-2 min-h-[30px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'medium')}
            >
              <span className="text-[9px] font-bold text-[#B08B74] uppercase tracking-widest block pl-1">
                Medium Priority
              </span>
              <div className="space-y-2 border-l-2 border-[#B08B74]/30 pl-2">
                {mediumPriority.map(renderTaskItem)}
                {mediumPriority.length === 0 && <div className="text-[10px] text-gray-400 italic py-1">Drop tasks here</div>}
              </div>
            </div>
          )}

          {/* LOW PRIORITY */}
          {(lowPriority.length > 0 || searchQuery === '') && (
            <div 
              className="space-y-2 pb-2 min-h-[30px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'low')}
            >
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block pl-1">
                Low Priority
              </span>
              <div className="space-y-2 border-l-2 border-blue-200 pl-2">
                {lowPriority.map(renderTaskItem)}
                {lowPriority.length === 0 && <div className="text-[10px] text-gray-400 italic py-1">Drop tasks here</div>}
              </div>
            </div>
          )}

          {filteredTasks.length === 0 && searchQuery !== '' && (
            <div className="text-center text-xs text-[#624F43]/50 py-4">No matching tasks found</div>
          )}

          {tasks.length === 0 && (
            <EmptyState 
              message="No tasks yet"
              onAction={() => setIsAdding(true)}
              actionLabel="Create Task"
            />
          )}
        </div>
      </div>
    </div>
  );
}
