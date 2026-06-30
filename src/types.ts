export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  photoURL: string;
  createdAt: string;
  lastLogin: string;
  otpCode?: string | null;
  otpExpiresAt?: string | null;
  emailVerified?: boolean;
  provider?: string;
  level?: number;
  xp?: number;
  preferences?: Record<string, any>;
}

export type AuthView =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'verify-otp'
  | 'forgot-password'
  | 'reset-password'
  | 'reset-success';

export interface Task {
  id: string;
  title: string;
  description?: string;
  time: string; // startTime
  endTime?: string;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  reminder?: boolean;
  repeat?: string;
  completed: boolean;
  starred: boolean;
  date: string;
  userId: string;
  createdAt?: any;
  updatedAt?: any;
  boardId?: string;
  stickyNoteId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string; // YYYY-MM-DD
  category: string;
  userId: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  history: { [dateStr: string]: boolean }; // e.g. "2026-06-28": true
  userId: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // e.g. "28 Jun 2026"
  time: string;
  tag: 'Study' | 'Personal' | 'Ideas' | string;
  starred: boolean;
  userId: string;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
  sound: boolean;
  date: string; // YYYY-MM-DD
  userId: string;
}

export interface StickyNoteDef {
  id: string;
  title: string;
  colorType: number;
  position: number;
  boardId: string;
  userId: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  userId: string;
}

export interface PlannerGoal {
  id: string;
  type: 'study' | 'personal' | 'todo' | 'note';
  content: string;
  userId: string;
}

export interface StudySession {
  id: string;
  focusTimeMinutes: number;
  date: string; // YYYY-MM-DD
  userId: string;
}
