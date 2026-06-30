import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'framer-motion';
import { Plus, X, Check, Paperclip, Pin, MapPin, Grid3x3, Trash2 } from 'lucide-react';
import { Task, CalendarEvent, Habit, Reminder, JournalEntry, StickyNoteDef } from '../../types';

interface Board {
  id: string;
  name: string;
  theme: string;
}

interface PlannerBoardProps {
  userId: string;
  tasks?: Task[];
  onAddTask?: any;
  onUpdateTask?: any;
  onDeleteTask?: any;
}

const STYLES = [
  {
    bg: 'bg-[#FFF2A8]',
    boxShadow: '2px 8px 15px rgba(0,0,0,0.1), 10px 20px 30px rgba(0,0,0,0.15)',
    borderRadius: { borderBottomRightRadius: '10px 100px', borderBottomLeftRadius: '2px 20px' },
    transform: 'transform -rotate-3',
    titleColor: 'text-[#8A6A4E]',
    borderColor: 'border-[#8A6A4E]',
    textColor: 'text-[#5C4533]',
    checkBg: 'bg-[#8A6A4E]',
    checkIcon: 'text-[#FFF2A8]',
    pin: (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-red-500 rounded-full shadow-md z-20 flex items-center justify-center transform rotate-12">
        <div className="w-3 h-3 bg-red-900 rounded-full opacity-50 absolute top-2 right-2"></div>
        <div className="w-full h-full rounded-full border-2 border-red-600 shadow-inner"></div>
      </div>
    )
  },
  {
    bg: 'bg-[#D4E6F1]',
    boxShadow: '2px 8px 15px rgba(0,0,0,0.1), 10px 20px 30px rgba(0,0,0,0.15)',
    borderRadius: { borderBottomLeftRadius: '10px 100px', borderTopRightRadius: '3px 30px' },
    transform: 'transform rotate-2',
    titleColor: 'text-[#2C3E50]',
    borderColor: 'border-[#2C3E50]',
    textColor: 'text-[#2C3E50]',
    checkBg: 'bg-[#2C3E50]',
    checkIcon: 'text-[#D4E6F1]',
    pin: <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-200/80 transform -rotate-2 shadow-sm z-20"></div>
  },
  {
    bg: 'bg-[#F5CBA7]',
    boxShadow: '2px 8px 15px rgba(0,0,0,0.1), 10px 20px 30px rgba(0,0,0,0.15)',
    borderRadius: { borderBottomRightRadius: '30px 60px', borderTopLeftRadius: '5px 40px' },
    transform: 'transform -rotate-1',
    titleColor: 'text-[#6E2C00]',
    borderColor: 'border-[#6E2C00]',
    textColor: 'text-[#6E2C00]',
    checkBg: 'bg-[#6E2C00]',
    checkIcon: 'text-[#F5CBA7]',
    pin: (
      <div className="absolute top-2 right-3 opacity-60 transform rotate-12">
        <Paperclip className="w-8 h-8 text-[#6E2C00]" />
      </div>
    )
  },
  {
    bg: 'bg-[#FDFEFE]',
    boxShadow: '2px 8px 15px rgba(0,0,0,0.1), 10px 20px 30px rgba(0,0,0,0.15)',
    borderRadius: { borderBottomLeftRadius: '50px 20px', backgroundImage: 'linear-gradient(transparent 95%, #AED6F1 5%)', backgroundSize: '100% 32px' },
    transform: 'transform rotate-1',
    titleColor: 'text-[#34495E]',
    borderColor: 'border-[#2C3E50]',
    textColor: 'text-[#34495E]',
    checkBg: 'bg-[#34495E]',
    checkIcon: 'text-[#FDFEFE]',
    pin: (
      <>
        <div className="absolute -top-3 right-8 w-12 h-12 bg-blue-300 rounded-full opacity-30 blur-md pointer-events-none"></div>
        <div className="absolute top-2 right-8">
          <Pin className="w-6 h-6 text-red-500 drop-shadow-md transform rotate-12" fill="#ef4444" />
        </div>
      </>
    )
  }
];

export default function PlannerBoard({ userId, tasks = [], onAddTask, onUpdateTask, onDeleteTask }: PlannerBoardProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [stickyNotes, setStickyNotes] = useState<StickyNoteDef[]>([]);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newNoteTitles, setNewNoteTitles] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'plannerBoards', userId, 'boards'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const b: Board[] = [];
      snapshot.forEach(d => b.push({ id: d.id, ...d.data() } as Board));
      setBoards(b);
      if (b.length > 0 && !activeBoardId) setActiveBoardId(b[0].id);
      else if (b.length === 0) setActiveBoardId(null);
    });
    return () => unsubscribe();
  }, [userId, activeBoardId]);

  useEffect(() => {
    if (!userId || !activeBoardId) {
      setStickyNotes([]);
      return;
    }
    const q = query(collection(db, 'plannerBoards', userId, 'boards', activeBoardId, 'stickyNotes'), orderBy('position', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sn: StickyNoteDef[] = [];
      snapshot.forEach(d => sn.push({ id: d.id, ...d.data() } as StickyNoteDef));
      setStickyNotes(sn);
    });
    return () => unsubscribe();
  }, [userId, activeBoardId]);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim() || !userId) return;
    const docRef = await addDoc(collection(db, 'plannerBoards', userId, 'boards'), {
      name: newBoardName.trim(),
      theme: 'default',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setNewBoardName('');
    setIsCreatingBoard(false);
  };

  const handleDeleteBoard = async (id: string) => {
    if (!userId) return;
    await deleteDoc(doc(db, 'plannerBoards', userId, 'boards', id));
    if (activeBoardId === id) setActiveBoardId(null);
  };

  const handleAddStickyNote = async () => {
    if (!userId || !activeBoardId) return;
    await addDoc(collection(db, 'plannerBoards', userId, 'boards', activeBoardId, 'stickyNotes'), {
      title: 'New Note',
      colorType: stickyNotes.length % 4,
      position: stickyNotes.length,
      boardId: activeBoardId,
      userId,
      createdAt: serverTimestamp()
    });
  };

  const handleDeleteStickyNote = async (id: string) => {
    if (!userId || !activeBoardId) return;
    await deleteDoc(doc(db, 'plannerBoards', userId, 'boards', activeBoardId, 'stickyNotes', id));
  };

  const handleAddTask = async (stickyNoteId: string, category: string) => {
    const title = newNoteTitles[stickyNoteId]?.trim();
    if (!title || !userId || !activeBoardId || !onAddTask) return;
    
    const isSchedule = title.toLowerCase().includes('at') || title.toLowerCase().includes('am') || title.toLowerCase().includes('pm') || category.toLowerCase() === 'schedule';
    
    onAddTask(
      title,
      'medium',
      isSchedule ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
      isSchedule ? new Date().toISOString().split('T')[0] : '',
      {
        boardId: activeBoardId,
        stickyNoteId,
        category,
      }
    );
    
    setNewNoteTitles(prev => ({ ...prev, [stickyNoteId]: '' }));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceNoteId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceNoteId', sourceNoteId);
  };

  const handleDrop = async (e: React.DragEvent, targetNoteId: string, targetCategory: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceNoteId = e.dataTransfer.getData('sourceNoteId');
    if (!taskId || sourceNoteId === targetNoteId || !userId || !activeBoardId || !onUpdateTask) return;
    
    onUpdateTask(taskId, {
      stickyNoteId: targetNoteId,
      category: targetCategory
    });
  };

  if (boards.length === 0) {
    return (
      <div className="w-full h-full min-h-[800px] bg-[#E8DCC4] p-8 md:p-12 rounded-3xl relative shadow-[inset_0_10px_30px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center border-[16px] border-[#8A6A4E]/80">
        <h2 className="font-serif italic text-3xl text-[#4A3B2C] mb-6 font-bold">No planner boards yet.</h2>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Board Name" 
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="px-4 py-2 rounded-xl outline-none"
          />
          <button onClick={handleCreateBoard} className="px-6 py-2 bg-[#8A6A4E] text-white rounded-xl">Create</button>
        </div>
      </div>
    );
  }

  const activeBoard = boards.find(b => b.id === activeBoardId) || boards[0];

  return (
    <div className="w-full h-full min-h-[800px] bg-[#E8DCC4] p-8 md:p-12 rounded-3xl relative shadow-[inset_0_10px_30px_rgba(0,0,0,0.1)] border-[16px] border-[#8A6A4E]/80" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`
    }}>
      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply" style={{
        backgroundImage: `radial-gradient(#5C4533 1.5px, transparent 1.5px), radial-gradient(#5C4533 1px, transparent 1px)`,
        backgroundSize: `24px 24px, 18px 18px`,
        backgroundPosition: `0 0, 12px 12px`
      }} />

      <div className="flex justify-between items-center mb-10 relative z-10">
        <select 
          value={activeBoardId || ''} 
          onChange={(e) => setActiveBoardId(e.target.value)}
          className="bg-white/80 backdrop-blur border-2 border-[#8A6A4E]/30 rounded-xl px-4 py-2 font-serif text-xl font-bold text-[#4A3B2C] outline-none"
        >
          {boards.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        
        <div className="flex gap-2">
          {isCreatingBoard ? (
            <div className="flex gap-2 bg-white/80 p-1.5 rounded-xl border border-[#8A6A4E]/20">
              <input type="text" placeholder="New board..." value={newBoardName} onChange={e => setNewBoardName(e.target.value)} className="px-3 py-1 rounded-lg outline-none w-32" />
              <button onClick={handleCreateBoard} className="p-1.5 bg-[#8A6A4E] text-white rounded-lg"><Check className="w-4 h-4" /></button>
              <button onClick={() => setIsCreatingBoard(false)} className="p-1.5 bg-gray-200 text-gray-700 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <button onClick={() => setIsCreatingBoard(true)} className="flex items-center gap-2 px-4 py-2 bg-white/80 border-2 border-[#8A6A4E]/30 rounded-xl font-sans text-sm font-medium text-[#4A3B2C]">
              <Plus className="w-4 h-4" /> New Board
            </button>
          )}
          <button onClick={handleAddStickyNote} className="px-4 py-2 bg-white/80 border-2 border-[#8A6A4E]/30 rounded-xl font-sans text-sm font-medium text-[#4A3B2C] flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Note
          </button>
        </div>
      </div>

      <h2 className="font-serif italic text-4xl md:text-5xl text-center text-[#4A3B2C] mb-12 drop-shadow-sm opacity-90 relative z-10 font-bold tracking-wide">
        {activeBoard.name}
      </h2>

      <div className="flex flex-wrap justify-center gap-10 md:gap-14 relative z-10 pb-10 max-w-6xl mx-auto w-full">
        {stickyNotes.map((note) => {
          const style = STYLES[note.colorType % 4];
          const noteTasks = tasks.filter(t => t.boardId === activeBoardId && t.stickyNoteId === note.id);
          
          return (
            <motion.div 
              key={note.id}
              whileHover={{ rotate: 0, scale: 1.02, zIndex: 30 }}
              className={`relative w-[320px] min-h-[380px] ${style.bg} p-6 ${style.transform} transition-all duration-300 flex flex-col group/note`}
              style={{ boxShadow: style.boxShadow, ...style.borderRadius }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, note.id, note.title)}
            >
              {style.pin}
              <button onClick={() => handleDeleteStickyNote(note.id)} className="absolute top-4 right-4 opacity-0 group-hover/note:opacity-100 text-red-500 z-30 transition-opacity">
                 <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="relative z-20 w-full mb-5 pb-2 border-b-2 border-dashed flex justify-center" style={{ borderColor: `${style.borderColor}40` }}>
                <input 
                   type="text"
                   defaultValue={note.title}
                   onBlur={async (e) => {
                     if (e.target.value !== note.title) {
                       await updateDoc(doc(db, 'plannerBoards', userId, 'boards', activeBoardId, 'stickyNotes', note.id), { title: e.target.value });
                     }
                   }}
                   className={`bg-transparent text-center font-serif text-2xl font-bold ${style.titleColor} uppercase tracking-wider outline-none w-full`}
                />
              </div>
              
              <ul className="space-y-3 flex-grow overflow-y-auto pr-1">
                {noteTasks.map(task => (
                  <li key={task.id} className="flex items-start gap-3 group cursor-move" draggable onDragStart={(e) => handleDragStart(e, task.id, note.id)}>
                    <button 
                      onClick={() => onUpdateTask && onUpdateTask(task.id, { completed: !task.completed })}
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.completed ? `${style.checkBg} border-transparent` : `bg-transparent`} ${style.borderColor}`}
                      style={{ opacity: task.completed ? 1 : 0.6 }}
                    >
                      {task.completed && <Check className={`w-3.5 h-3.5 ${style.checkIcon} stroke-[3]`} />}
                    </button>
                    <span className={`font-sans font-medium text-[16px] flex-grow leading-snug ${task.completed ? 'line-through opacity-50' : ''} ${style.textColor}`}>
                      {task.title}
                    </span>
                    <button onClick={() => onDeleteTask && onDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity ml-1 flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-3 relative">
                <input 
                  type="text" 
                  placeholder={`+ Add item...`}
                  value={newNoteTitles[note.id] || ''}
                  onChange={(e) => setNewNoteTitles(prev => ({...prev, [note.id]: e.target.value}))}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask(note.id, note.title)}
                  className={`w-full bg-transparent border-b-2 border-dashed font-sans text-[15px] font-medium placeholder-opacity-50 focus:outline-none pb-2 transition-colors ${style.textColor}`}
                  style={{ borderColor: `${style.borderColor}40` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
