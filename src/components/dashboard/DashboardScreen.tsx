import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  setDoc, 
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { UserProfile, Task, CalendarEvent, Habit, JournalEntry, Reminder, ChatMessage } from '../../types';

// Subcomponents
import Sidebar from './Sidebar';
import StatsHeader from './StatsHeader';
import TodayPlanCard from './TodayPlanCard';
import TodoCard from './TodoCard';
import RemindersCard from './RemindersCard';
import CalendarCard from './CalendarCard';
import StudyHubCard from './StudyHubCard';
import HabitCard from './HabitCard';
import JournalCard from './JournalCard';
import NexusAICompanion from './NexusAICompanion';
import DeskClocksCard from './DeskClocksCard';
import SelfReflectionCard from './SelfReflectionCard';

import PlannerBoard from './PlannerBoard';

interface DashboardScreenProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

export default function DashboardScreen({ userProfile, onLogout }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);

  // Focus and streak metrics
  const [focusTimeMinutes, setFocusTimeMinutes] = useState<number>(0); 
  const [studyStreakDays, setStudyStreakDays] = useState<number>(0); 

  // Firestore Sync'd States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const userId = userProfile.uid;

  // Temporary cleanup of dummy data from Firestore that might have been seeded previously.
  useEffect(() => {
    if (!userId) return;

    const cleanupMockData = async () => {
      const mockTasks = ['ML Midterm Study', 'Math Practice', 'Data Structures', 'OS Revision'];
      const mockEvents = ['ML Midterm Study', 'Math Practice', 'Project Revision'];
      const mockHabits = ['Drink Water', 'Read Books', 'Meditate', 'Exercise'];
      const mockJournals = ['Backpropagation Math Proof', 'Daily Reflection'];
      const mockReminders = ['ML Midterm Study - 30m before', 'Math Practice - 5m before'];

      const deleteMocks = async (colName: string, mockTitles: string[], titleField: string = 'title') => {
        try {
          const snapshot = await getDocs(collection(db, 'users', userId, colName));
          snapshot.forEach(async (document) => {
            const data = document.data();
            if (mockTitles.includes(data[titleField])) {
              await deleteDoc(doc(db, 'users', userId, colName, document.id));
            }
          });
        } catch (e) {
          console.log('Cleanup error', e);
        }
      };

      await deleteMocks('tasks', mockTasks, 'title');
      await deleteMocks('events', mockEvents, 'title');
      await deleteMocks('habits', mockHabits, 'name');
      await deleteMocks('journalEntries', mockJournals, 'title');
      await deleteMocks('reminders', mockReminders, 'title');
      
      // Clear mock chat
      try {
        const snapshot = await getDocs(collection(db, 'users', userId, 'aiChats'));
        snapshot.forEach(async (document) => {
          if (document.data().text?.includes('Hello! I am your Nexus AI companion.')) {
            await deleteDoc(doc(db, 'users', userId, 'aiChats', document.id));
          }
        });
      } catch (e) {}
    };

    cleanupMockData();
  }, [userId]);

  // 1. Fetch & Listen to Tasks in Real-time
  useEffect(() => {
    if (!userId) return;
    const path = `users/${userId}/tasks`;
    const q = query(collection(db, 'users', userId, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Task[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(items);
    }, (err) => {
      console.warn('Tasks listen error:', err);
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (e) {
        // Log formatted diagnostic details
      }
    });

    return unsubscribe;
  }, [userId]);

  // 2. Fetch & Listen to Events
  useEffect(() => {
    if (!userId) return;
    const path = `users/${userId}/events`;
    const q = query(collection(db, 'users', userId, 'events'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: CalendarEvent[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as CalendarEvent);
      });
      setEvents(items);
    }, (err) => {
      console.warn('Events listen error:', err);
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (e) {
        // Log formatted diagnostic details
      }
    });

    return unsubscribe;
  }, [userId]);

  // 3. Fetch & Listen to Habits
  useEffect(() => {
    if (!userId) return;
    const path = `users/${userId}/habits`;
    const q = query(collection(db, 'users', userId, 'habits'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Habit[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Habit);
      });
      setHabits(items);
    }, (err) => {
      console.warn('Habits listen error:', err);
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (e) {
        // Log formatted diagnostic details
      }
    });

    return unsubscribe;
  }, [userId]);

  // 4. Fetch & Listen to Journal Entries
  useEffect(() => {
    if (!userId) return;
    const path = `users/${userId}/journalEntries`;
    const q = query(collection(db, 'users', userId, 'journalEntries'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: JournalEntry[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      setJournalEntries(items);
    }, (err) => {
      console.warn('Journal listen error:', err);
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (e) {
        // Log formatted diagnostic details
      }
    });

    return unsubscribe;
  }, [userId]);

  // 5. Fetch & Listen to Reminders
  useEffect(() => {
    if (!userId) return;
    const path = `users/${userId}/reminders`;
    const q = query(collection(db, 'users', userId, 'reminders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Reminder[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Reminder);
      });
      setReminders(items);
    }, (err) => {
      console.warn('Reminders listen error:', err);
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (e) {
        // Log formatted diagnostic details
      }
    });

    return unsubscribe;
  }, [userId]);

  // 6. Fetch & Listen to Chat Messages (stored in aiChats)
  useEffect(() => {
    if (!userId) return;
    const path = `users/${userId}/aiChats`;
    const q = query(collection(db, 'users', userId, 'aiChats'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setChatMessages(items);
    }, (err) => {
      console.warn('Chat listen error:', err);
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (e) {
        // Log formatted diagnostic details
      }
    });

    return unsubscribe;
  }, [userId]);

  const combinedEvents = [
    ...events,
    ...tasks.filter(t => t.date || t.time).map(t => ({
      id: t.id,
      title: t.title,
      date: t.date || new Date().toISOString().split('T')[0],
      startTime: t.time || '09:00 AM',
      endTime: t.endTime || t.time || '10:00 AM',
      category: t.category || 'Task',
      userId: t.userId,
      isTask: true
    } as any))
  ];

  // --- ACTIONS ---
  
  // Tasks handlers
  const handleAddTask = async (title: string, priority: 'high' | 'medium' | 'low', time: string, date: string, additionalFields?: Partial<Task>) => {
    const path = `users/${userId}/tasks`;
    try {
      await addDoc(collection(db, 'users', userId, 'tasks'), {
        title,
        priority,
        time,
        date,
        completed: false,
        starred: false,
        ...additionalFields
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const handleToggleTaskCompleted = async (id: string, completed: boolean) => {
    const path = `users/${userId}/tasks/${id}`;
    try {
      await updateDoc(doc(db, 'users', userId, 'tasks', id), { completed });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const handleToggleTaskStarred = async (id: string, starred: boolean) => {
    const path = `users/${userId}/tasks/${id}`;
    try {
      await updateDoc(doc(db, 'users', userId, 'tasks', id), { starred });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const path = `users/${userId}/tasks/${id}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'tasks', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    const path = `users/${userId}/tasks/${id}`;
    try {
      await updateDoc(doc(db, 'users', userId, 'tasks', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  // Reminders handlers
  const handleAddReminder = async (title: string, time: string, date: string) => {
    const path = `users/${userId}/reminders`;
    try {
      await addDoc(collection(db, 'users', userId, 'reminders'), {
        title,
        time,
        date,
        enabled: true,
        sound: true,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const handleToggleReminderSound = async (id: string, sound: boolean) => {
    const path = `users/${userId}/reminders/${id}`;
    try {
      await updateDoc(doc(db, 'users', userId, 'reminders', id), { sound });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    const path = `users/${userId}/reminders/${id}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'reminders', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Events handlers
  const handleAddEvent = async (title: string, date: string, startTime: string, endTime: string, category: string) => {
    const path = `users/${userId}/events`;
    try {
      await addDoc(collection(db, 'users', userId, 'events'), {
        title,
        date,
        startTime,
        endTime,
        category,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const handleDeleteEvent = async (id: string, isTask?: boolean) => {
    if (isTask || tasks.find(t => t.id === id)) {
      return handleDeleteTask(id);
    }
    const path = `users/${userId}/events/${id}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'events', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Habits handlers
  const handleAddHabit = async (name: string, icon: string) => {
    const path = `users/${userId}/habits`;
    try {
      await addDoc(collection(db, 'users', userId, 'habits'), {
        name,
        icon,
        history: {},
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    const path = `users/${userId}/habits/${id}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'habits', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleToggleDay = async (habitId: string, dateStr: string, active: boolean) => {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const updatedHistory = { ...habit.history };
    if (active) {
      updatedHistory[dateStr] = true;
    } else {
      delete updatedHistory[dateStr];
    }

    const path = `users/${userId}/habits/${habitId}`;
    try {
      await updateDoc(habitRef, { history: updatedHistory });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  // Journal handlers
  const handleAddJournalEntry = async (title: string, content: string, tag: string) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const path = `users/${userId}/journalEntries`;
    try {
      await addDoc(collection(db, 'users', userId, 'journalEntries'), {
        title,
        content,
        tag,
        date: todayStr,
        time: timeStr,
        starred: false,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const handleToggleJournalStarred = async (id: string, starred: boolean) => {
    const path = `users/${userId}/journalEntries/${id}`;
    try {
      await updateDoc(doc(db, 'users', userId, 'journalEntries', id), { starred });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const handleDeleteJournalEntry = async (id: string) => {
    const path = `users/${userId}/journalEntries/${id}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'journalEntries', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // AI chat handlers
  const handleSendMessage = async (text: string, sender: 'user' | 'ai') => {
    const path = `users/${userId}/aiChats`;
    try {
      await addDoc(collection(db, 'users', userId, 'aiChats'), {
        text,
        sender,
        timestamp: Date.now(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const handleClearChat = async () => {
    const path = `users/${userId}/aiChats`;
    try {
      const q = query(collection(db, 'users', userId, 'aiChats'));
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, 'users', userId, 'aiChats', d.id));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Study Pomodoro completion tracker
  const handleSessionComplete = (minutes: number) => {
    setFocusTimeMinutes((prev) => prev + minutes);
  };

  // Mood Self Reflection Logger
  const handleSaveReflection = async (anxiety: number, focus: number, moodNote: string) => {
    const path = `users/${userId}/reflections`;
    try {
      await addDoc(collection(db, 'users', userId, 'reflections'), {
        anxiety,
        focus,
        moodNote,
        timestamp: Date.now(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const handleOptimizeDay = () => {
    setIsOptimized(true);
  };

  // Render content depending on activeTab (the Sidebar switcher)
  const renderTabContent = () => {
    switch (activeTab) {
      case 'planner-board':
        return (
          <div className="animate-fade-in-up h-full">
            <PlannerBoard 
              userId={userProfile.uid}
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        );
      case 'study-hub':
        return (
          <div className="animate-fade-in-up">
            <StudyHubCard onSessionComplete={handleSessionComplete} />
          </div>
        );
      case 'calendar':
        return (
          <div className="h-[550px] animate-fade-in-up">
            <CalendarCard 
              events={combinedEvents}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        );
      case 'habit-tracker':
        return (
          <div className="animate-fade-in-up">
            <HabitCard 
              habits={habits}
              onAddHabit={handleAddHabit}
              onToggleDay={handleToggleDay}
            />
          </div>
        );
      case 'journal':
        return (
          <div className="animate-fade-in-up">
            <JournalCard 
              entries={journalEntries}
              onAddEntry={handleAddJournalEntry}
              onToggleEntryStarred={handleToggleJournalStarred}
              onDeleteEntry={handleDeleteJournalEntry}
            />
          </div>
        );
      case 'ai-companion':
        return (
          <div className="animate-fade-in-up">
            <NexusAICompanion 
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              userFullName={userProfile.fullName}
              tasks={tasks}
              events={combinedEvents}
              habits={habits}
              journalEntries={journalEntries}
              reminders={reminders}
              focusTimeMinutes={focusTimeMinutes}
              studyStreakDays={studyStreakDays}
            />
          </div>
        );
      case 'desk-clocks':
        return (
          <div className="max-w-md mx-auto animate-fade-in-up">
            <DeskClocksCard />
          </div>
        );
      case 'self-reflection':
        return (
          <div className="max-w-xl mx-auto animate-fade-in-up">
            <SelfReflectionCard onSaveReflection={handleSaveReflection} />
          </div>
        );
      case 'home':
      default:
        // THE COHESIVE FULL COMPOSITE DASHBOARD BENTO GRID LAYOUT MATCHING pho.png EXACTLY!
        return (
          <div className="space-y-8 animate-fade-in-up">
            {/* Timeline, Mountains illustration, AI insights banner row */}
            <TodayPlanCard 
              onOptimizeDay={handleOptimizeDay} 
              isOptimized={isOptimized} 
              events={events} 
              tasks={tasks}
              onAddTask={handleAddTask} 
              onToggleTaskCompleted={handleToggleTaskCompleted}
              onDeleteTask={handleDeleteTask}
              onViewFullSchedule={() => setActiveTab('planner')}
            />

            {/* Main Double Grid: Left (Planner & Habits & Clocks), Right (Calendar & Study Pomodoro) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              
              {/* Left Column Widgets */}
              <div className="space-y-5">
                <TodoCard 
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onToggleTaskCompleted={handleToggleTaskCompleted}
                  onToggleTaskStarred={handleToggleTaskStarred}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTask={handleUpdateTask}
                />
                <HabitCard 
                  habits={habits}
                  onAddHabit={handleAddHabit}
                  onToggleDay={handleToggleDay}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <DeskClocksCard />
                  <SelfReflectionCard onSaveReflection={handleSaveReflection} />
                </div>
                <div className="h-[520px] flex flex-col">
                  <JournalCard 
                    entries={journalEntries}
                    onAddEntry={handleAddJournalEntry}
                    onToggleEntryStarred={handleToggleJournalStarred}
                    onDeleteEntry={handleDeleteJournalEntry}
                  />
                </div>
              </div>

              {/* Right Column Widgets */}
              <div className="space-y-5 flex flex-col h-full">
                <CalendarCard 
                  events={combinedEvents}
                  onAddEvent={handleAddEvent}
                  onDeleteEvent={handleDeleteEvent}
                />
                <StudyHubCard onSessionComplete={handleSessionComplete} />
                <div className="flex-1 min-h-[520px]">
                  <NexusAICompanion 
                    chatMessages={chatMessages}
                    onSendMessage={handleSendMessage}
                    onClearChat={handleClearChat}
                    userFullName={userProfile.fullName}
                    tasks={tasks}
                    events={events}
                    habits={habits}
                    journalEntries={journalEntries}
                    reminders={reminders}
                    focusTimeMinutes={focusTimeMinutes}
                    studyStreakDays={studyStreakDays}
                  />
                </div>
              </div>

            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#FAF6F0] overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar 
        userProfile={userProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Mobile Nav Top Bar */}
        <header className="bg-white border-b border-[#624F43]/10 px-4 py-3 flex items-center justify-between md:hidden flex-shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 hover:bg-[#FAF5EF] rounded-xl text-[#3E332E] cursor-pointer"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-1.5">
            <span className="font-serif font-bold text-[#3E332E] text-xs uppercase tracking-wider">NEXUS PLANNER</span>
          </div>

          <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-xs">
            <img 
              src={userProfile.photoURL || `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(userProfile.fullName)}`} 
              alt={userProfile.fullName} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Dynamic Nested Content Stage */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
          
          {/* Header (Greeting & Stats row) */}
          <StatsHeader 
            userProfile={userProfile}
            tasks={tasks}
            focusTimeMinutes={focusTimeMinutes}
            studyStreakDays={studyStreakDays}
          />

          {/* Render Active View Tab Content */}
          <div className="pb-8">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
