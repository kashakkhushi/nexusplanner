import React, { useState } from 'react';
import { Heart, Smile, Sparkles, Send, CheckCircle2 } from 'lucide-react';

interface SelfReflectionCardProps {
  onSaveReflection: (anxiety: number, focus: number, moodNote: string) => void;
}

export default function SelfReflectionCard({ onSaveReflection }: SelfReflectionCardProps) {
  const [anxiety, setAnxiety] = useState(3);
  const [focusDepth, setFocusDepth] = useState(8);
  const [moodNote, setMoodNote] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  const getAnxietyEmoji = (val: number) => {
    if (val <= 2) return '😌 (Calm)';
    if (val <= 5) return '🙂 (Relaxed)';
    if (val <= 7) return '😐 (Neutral)';
    if (val <= 9) return '😰 (Anxious)';
    return '😫 (Overwhelmed)';
  };

  const getFocusEmoji = (val: number) => {
    if (val <= 2) return '😴 (Distracted)';
    if (val <= 5) return '😐 (Slightly Focused)';
    if (val <= 7) return '⚡ (Good Flow)';
    return '🎯 (Laser Focused)';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection(anxiety, focusDepth, moodNote);
    setIsLogged(true);
    setMoodNote('');
    setTimeout(() => {
      setIsLogged(false);
    }, 4000);
  };

  return (
    <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between h-full relative">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
          <h3 className="font-serif font-bold text-xs text-[#3E332E] tracking-wider uppercase flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#B08B74]" />
            Self Reflection
          </h3>
          <span className="text-[9px] font-mono font-bold text-[#624F43]/40 uppercase tracking-widest">Daily check-in</span>
        </div>

        {/* Sliders Container Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1 font-sans">
          
          {/* Slider 1: Anxiety */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest pl-1">
              <span>Anxiety Level</span>
              <span className="text-[#3E332E]">{getAnxietyEmoji(anxiety)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={anxiety}
              onChange={(e) => setAnxiety(parseInt(e.target.value))}
              className="w-full accent-[#B08B74] h-1 bg-[#EADBC8]/40 rounded-lg appearance-none cursor-pointer border border-[#624F43]/5"
            />
          </div>

          {/* Slider 2: Focus Depth */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest pl-1">
              <span>Focus Depth</span>
              <span className="text-[#3E332E]">{getFocusEmoji(focusDepth)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={focusDepth}
              onChange={(e) => setFocusDepth(parseInt(e.target.value))}
              className="w-full accent-[#B08B74] h-1 bg-[#EADBC8]/40 rounded-lg appearance-none cursor-pointer border border-[#624F43]/5"
            />
          </div>

          {/* Mood note textarea */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest pl-1">
              How was your mood today?
            </label>
            <textarea
              rows={3}
              placeholder="Write down a thought, feeling, or win from today..."
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#FAF5EF]/60 border border-[#624F43]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B08B74] placeholder-[#624F43]/45 leading-relaxed resize-none"
            />
          </div>

          {/* Log Reflection trigger button */}
          <button
            type="submit"
            disabled={isLogged}
            className={`w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isLogged 
                ? 'bg-[#A4B494] text-white border border-[#A4B494]' 
                : 'bg-[#B08B74] text-white hover:bg-[#8B7355] border border-[#B08B74]/20'
            }`}
          >
            {isLogged ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Reflection Logged!
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Log Daily Reflection
              </>
            )}
          </button>
        </form>
      </div>

      {/* Success notification helper panel */}
      {isLogged && (
        <div className="mt-3 bg-[#FAF5EF] border border-[#A4B494]/30 p-3 rounded-xl flex items-start gap-2.5 animate-pulse">
          <Smile className="w-4 h-4 text-[#A4B494] flex-shrink-0" />
          <p className="text-[10px] font-semibold text-[#624F43]/80 leading-relaxed">
            Beautifully expressed. Logging daily moods creates long-term self-awareness and helps Nexus optimize your focus targets!
          </p>
        </div>
      )}
    </div>
  );
}
