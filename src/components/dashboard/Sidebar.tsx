import React from 'react';
import { 
  Home, 
  Trello, 
  Coffee, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  BookOpen, 
  MessageSquare, 
  Clock, 
  Heart, 
  Sparkles, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SidebarProps {
  userProfile: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  userProfile,
  activeTab,
  setActiveTab,
  onLogout,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const navItems = [
    { id: 'home', label: "TODAY'S JOURNAL", icon: Home },
    { id: 'planner-board', label: "PLANNER BOARD", icon: Trello },
    { id: 'study-hub', label: "COZY STUDY HUB", icon: Coffee },
    { id: 'calendar', label: "MY CALENDAR", icon: CalendarIcon },
    { id: 'habit-tracker', label: "HABIT TRACKER", icon: CheckSquare },
    { id: 'journal', label: "JOURNAL ENTRIES", icon: BookOpen },
    { id: 'ai-companion', label: "NEXUS AI COMPANION", icon: MessageSquare, isNew: true },
    { id: 'desk-clocks', label: "DESK CLOCKS", icon: Clock },
    { id: 'self-reflection', label: "SELF REFLECTION", icon: Heart },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false); // Close drawer on mobile
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#3E332E]/30 backdrop-blur-sm z-[100] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-[101] md:relative md:z-0
        w-64 bg-[#FAF6F0] border-r border-[#624F43]/10 p-5 flex flex-col justify-between h-full transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 pb-2 border-b border-[#624F43]/5">
            <div className="p-1.5 bg-[#B08B74]/15 rounded-xl">
              <Sparkles className="w-5 h-5 text-[#B08B74]" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-[#3E332E] tracking-wider uppercase leading-none">NEXUS</h1>
              <span className="font-sans text-[10px] text-[#B08B74] font-medium tracking-widest uppercase">Planner</span>
            </div>
          </div>

          {/* Profile Card Section */}
          <div className="flex items-center space-x-3 bg-white/60 border border-white/90 p-3.5 rounded-2xl shadow-sm">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              <img 
                src={userProfile.photoURL || `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(userProfile.fullName)}`} 
                alt={userProfile.fullName} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-serif font-semibold text-xs text-[#3E332E] truncate leading-tight">
                {userProfile.fullName}
              </h3>
              <p className="text-[10px] font-semibold text-[#B08B74] mt-0.5">Level 4</p>
              {/* Level progress bar */}
              <div className="w-full bg-[#EADBC8]/40 h-1.5 rounded-full mt-1 overflow-hidden border border-[#624F43]/5">
                <div className="bg-[#B08B74] h-full rounded-full" style={{ width: '80%' }} />
              </div>
              <p className="text-[8px] font-mono text-[#624F43]/50 text-right mt-0.5">320 / 400 XP</p>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#B08B74]/12 text-[#3E332E] font-bold shadow-xs' 
                      : 'text-[#624F43]/70 hover:bg-[#B08B74]/5 hover:text-[#3E332E] font-semibold'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#B08B74]' : 'text-[#624F43]/50'}`} />
                    <span className="text-[11px] font-sans tracking-wide uppercase truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    {item.isNew && (
                      <span className="bg-[#B08B74] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider mr-1 shadow-xs animate-pulse">
                        NEW
                      </span>
                    )}
                    <ChevronRight className={`w-3 h-3 ${isActive ? 'text-[#B08B74] opacity-100' : 'text-[#624F43]/20 opacity-0 group-hover:opacity-100'}`} />
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Photo Decoration (Replaced Quote Panel) */}
          <div className="mt-4 rounded-xl relative overflow-hidden">
            <img src="/photo1.png" alt="Decorative photo" className="w-[115%] h-auto max-w-[115%] -ml-[7.5%] object-cover mix-blend-multiply" />
          </div>
        </div>

        {/* Footer Panel */}
        <div className="pt-4 border-t border-[#624F43]/5">

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
