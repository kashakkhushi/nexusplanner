import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Globe, 
  Mic, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../../types';

interface NexusAICompanionProps {
  chatMessages: ChatMessage[];
  onSendMessage: (text: string, sender: 'user' | 'ai') => void;
  onClearChat: () => void;
  userFullName: string;
  tasks?: any[];
  events?: any[];
  habits?: any[];
  journalEntries?: any[];
  reminders?: any[];
  focusTimeMinutes?: number;
  studyStreakDays?: number;
}

// Beautiful AI illustration avatar (Sketch of a girl with brown hair)
const AiAvatar = () => (
  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#EEDCC6] border border-[#624F43]/15 flex items-center justify-center flex-shrink-0 shadow-sm relative">
    {/* Hair back */}
    <div className="absolute top-1 w-6 h-6 rounded-full bg-[#5E483A]" />
    {/* Face */}
    <div className="absolute top-2 w-4.5 h-4.5 rounded-full bg-[#FCE5D6]" />
    {/* Eyes */}
    <div className="absolute top-3.5 left-2.5 w-1 h-1 rounded-full bg-[#302118]" />
    <div className="absolute top-3.5 right-2.5 w-1 h-1 rounded-full bg-[#302118]" />
    {/* Hair front */}
    <div className="absolute top-1 w-5 h-2.5 rounded-b-md bg-[#5E483A]" />
    {/* Blushes */}
    <div className="absolute top-4 left-2 w-1.5 h-0.5 rounded-full bg-[#F3A49E] opacity-75" />
    <div className="absolute top-4 right-2 w-1.5 h-0.5 rounded-full bg-[#F3A49E] opacity-75" />
    {/* Clothes */}
    <div className="absolute bottom-0 w-6 h-3 rounded-t-lg bg-[#B08B74]" />
  </div>
);

// Cute Robot Mascot Avatar for User message bubble
const UserAvatar = () => (
  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#D9E6F2] border border-[#7CA1C2]/20 flex items-center justify-center flex-shrink-0 shadow-sm relative">
    {/* Robot Head */}
    <div className="w-5 h-4 bg-white rounded-md border border-[#7CA1C2]/40 flex items-center justify-center relative shadow-xs">
      {/* Robot screen */}
      <div className="w-4 h-2.5 bg-[#4B6B88] rounded-xs flex items-center justify-center space-x-0.5">
        {/* Glowy eyes */}
        <div className="w-1 h-1 bg-cyan-300 rounded-full" />
        <div className="w-1 h-1 bg-cyan-300 rounded-full" />
      </div>
      {/* Ear antennas */}
      <div className="absolute -left-1 w-0.5 h-1.5 bg-[#7CA1C2] rounded-full" />
      <div className="absolute -right-1 w-0.5 h-1.5 bg-[#7CA1C2] rounded-full" />
    </div>
    {/* Antenna top */}
    <div className="absolute top-1 w-0.5 h-1 bg-[#7CA1C2]" />
    <div className="absolute top-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
  </div>
);

// Gorgeous, delicate twig/wildflower vector illustration
const WildflowerSVG = () => (
  <svg viewBox="0 0 100 150" className="w-16 h-28 text-[#C3A987] pointer-events-none opacity-85" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Stems */}
    <path d="M50 140 C45 100, 35 60, 30 20" />
    <path d="M50 140 C55 105, 65 75, 70 40" />
    <path d="M50 140 C48 115, 52 90, 50 65" />
    {/* Leaves */}
    <path d="M42 110 C35 112, 32 108, 45 102" fill="#FAF5EF" />
    <path d="M58 100 C65 102, 68 98, 55 92" fill="#FAF5EF" />
    <path d="M37 75 C30 77, 28 73, 40 68" fill="#FAF5EF" />
    <path d="M62 65 C69 67, 72 63, 59 58" fill="#FAF5EF" />
    {/* Yellow Flowers */}
    <circle cx="30" cy="20" r="5" fill="#E8B869" stroke="#B08B74" strokeWidth="1" />
    <circle cx="70" cy="40" r="4" fill="#E8B869" stroke="#B08B74" strokeWidth="1" />
    <circle cx="50" cy="65" r="4.5" fill="#E8B869" stroke="#B08B74" strokeWidth="1" />
    {/* Petals */}
    <path d="M30 15 C28 12, 32 12, 30 15 Z" fill="#E8B869" />
    <path d="M30 25 C28 28, 32 28, 30 25 Z" fill="#E8B869" />
    <path d="M25 20 C22 18, 22 22, 25 20 Z" fill="#E8B869" />
    <path d="M35 20 C38 18, 38 22, 35 20 Z" fill="#E8B869" />
    
    <path d="M70 36 C68 33, 72 33, 70 36 Z" fill="#E8B869" />
    <path d="M70 44 C68 47, 72 47, 70 44 Z" fill="#E8B869" />
    <path d="M66 40 C63 38, 63 42, 66 40 Z" fill="#E8B869" />
    <path d="M74 40 C77 38, 77 42, 74 40 Z" fill="#E8B869" />
  </svg>
);

// Helper component to format standard markdown output nicely
const BeautifulMarkdown = ({ text }: { text: string }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-1" />;

        // Headings (#, ##, ###)
        if (trimmed.startsWith('#')) {
          const depth = (trimmed.match(/^#+/) || ['#'])[0].length;
          const cleanText = trimmed.replace(/^#+\s*/, '');
          const fontSize = depth === 1 ? 'text-sm font-serif font-bold text-[#3E332E]' : 'text-xs font-serif font-bold text-[#3E332E] mt-2 mb-1 block';
          return (
            <span key={index} className={`${fontSize} border-b border-[#624F43]/5 pb-0.5 block`}>
              {cleanText}
            </span>
          );
        }

        // Bullet point lines
        if (trimmed.startsWith('•') || trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const cleanText = trimmed.replace(/^[•*-]\s*/, '');
          // Parse potential strong tags within list items
          const boldParts = cleanText.split('**');
          return (
            <div key={index} className="flex items-start space-x-1.5 pl-2 my-0.5 animate-fade-in">
              <span className="text-[#B08B74] mt-1 text-[8px]">●</span>
              <p className="text-[#4E3F35] leading-relaxed text-xs">
                {boldParts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-[#3E332E]">{part}</strong> : part)}
              </p>
            </div>
          );
        }

        // Table Rows (using | )
        if (trimmed.startsWith('|') && trimmed.endsWith('|') && !trimmed.includes('---')) {
          const cols = trimmed.split('|').filter(c => c.trim() !== '');
          return (
            <div key={index} className="grid grid-cols-2 gap-2 bg-[#FAF5EF]/50 px-2 py-1 rounded border border-[#624F43]/5 text-[10px] my-1 font-mono text-[#4E3F35] animate-fade-in">
              {cols.map((col, cIdx) => (
                <div key={cIdx} className={cIdx === 0 ? "font-bold text-[#3E332E]" : "text-right"}>
                  {col.trim()}
                </div>
              ))}
            </div>
          );
        }

        // Inline Bold Parsing
        if (trimmed.includes('**')) {
          const boldParts = trimmed.split('**');
          return (
            <p key={index} className="text-[#4E3F35] leading-relaxed">
              {boldParts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-[#3E332E]">{part}</strong> : part)}
            </p>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('>')) {
          const cleanText = trimmed.replace(/^>\s*/, '');
          return (
            <blockquote key={index} className="border-l-2 border-[#B08B74] pl-2.5 py-0.5 my-1.5 text-[#624F43]/80 italic">
              {cleanText}
            </blockquote>
          );
        }

        // Default paragraph line
        return (
          <p key={index} className="text-[#4E3F35] leading-relaxed text-xs">
            {line}
          </p>
        );
      })}
    </div>
  );
};

export default function NexusAICompanion({
  chatMessages,
  onSendMessage,
  onClearChat,
  userFullName,
  tasks = [],
  events = [],
  habits = [],
  journalEntries = [],
  reminders = [],
  focusTimeMinutes = 272,
  studyStreakDays = 7,
}: NexusAICompanionProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const greetingName = (userFullName || 'Kashak').split(' ')[0] || 'Kashak';

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    // 1. Instantly register User Message on screen/database
    onSendMessage(textToSend, 'user');
    setInputText('');
    setIsTyping(true);

    // 2. Query our fully-secure server Gemini proxy endpoint
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: chatMessages,
          userContext: {
            userFullName,
            tasks,
            events,
            habits,
            journalEntries,
            reminders,
            focusTimeMinutes,
            studyStreakDays
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Server request to Nexus AI Companion engine failed.');
      }

      const data = await response.json();
      const aiReply = data.text || "I was unable to synthesize a plan for you. Please try again.";
      onSendMessage(aiReply, 'ai');
    } catch (error) {
      console.error('AI Chat Error:', error);
      onSendMessage("Apologies, I had trouble synchronizing with the server. Please verify your internet connection or check the secret key setup under Settings > Secrets.", 'ai');
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (chipPrompt: string) => {
    handleSend(chipPrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  // Helper chips matching exactly the specs and UI photos!
  const helperChips = [
    { label: 'Create Study Plan', prompt: 'Create a study plan for my tasks' },
    { label: 'Summarize Notes', prompt: 'Summarize my study notes' },
    { label: 'Explain Topic', prompt: 'Explain a difficult topic' },
    { label: 'Generate Quiz', prompt: 'Generate an interactive quiz' },
    { label: 'Optimize My Day', prompt: 'Optimize my day' },
    { label: 'Motivate Me', prompt: 'Give me some motivation' },
  ];

  return (
    <div id="nexus-ai-companion-card" className="bg-[#FAF6F0] border-2 border-white/80 p-5 rounded-[32px] shadow-lg flex flex-col justify-between h-[520px] relative overflow-hidden">
      {/* Background soft botanicals element */}
      <div className="absolute right-0 bottom-12 opacity-15 pointer-events-none">
        <WildflowerSVG />
      </div>

      <div className="flex flex-col h-full justify-between">
        {/* Card Header matching photos precisely */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#624F43]/10 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#B08B74]" />
            <h3 className="font-serif font-bold text-[#3E332E] tracking-wider uppercase flex items-center gap-1.5 text-xs">
              Nexus AI Companion
              <span className="bg-[#E29A7A] text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                BETA
              </span>
            </h3>
          </div>

          <button 
            onClick={onClearChat}
            className="p-1.5 hover:bg-[#FAF5EF] text-[#624F43]/40 hover:text-[#B08B74] rounded-full transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Chat Message Box */}
        <div className="flex-grow overflow-y-auto no-scrollbar py-3 space-y-4 font-sans text-xs">
          <AnimatePresence mode="wait">
            {chatMessages.length === 0 ? (
              <motion.div 
                key="greeting-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <AiAvatar />
                  <div>
                    <div className="bg-white border border-[#624F43]/10 p-3 rounded-2xl text-[#3E332E] font-medium leading-relaxed shadow-sm relative">
                      <p className="font-bold text-[#3E332E]">Hi {greetingName}! 👋</p>
                      <p className="mt-1 text-[#624F43]">I am your Nexus AI Companion. How can I help you optimize your focus, study habits, and planning workflow today?</p>
                    </div>
                  </div>
                </div>

                {/* Suggestions chips rendered inside empty flow */}
                <div className="pl-11 pr-4 space-y-2">
                  <p className="text-[10px] font-bold text-[#624F43]/60 uppercase tracking-widest">Quick Actions</p>
                  <div className="flex flex-wrap gap-1.5">
                    <AnimatePresence>
                      {helperChips.map((chip) => (
                        <motion.button
                          key={chip.label}
                          layout
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => handleChipClick(chip.prompt)}
                          className="px-3 py-1.5 bg-white hover:bg-[#FAF5EF] text-[10px] font-sans font-bold text-[#624F43] rounded-full border border-[#624F43]/10 hover:border-[#B08B74] hover:text-[#B08B74] transition-all cursor-pointer shadow-xs"
                        >
                          {chip.label}
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="history-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <AnimatePresence initial={false}>
                  {chatMessages.map((msg) => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <motion.div 
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex items-start space-x-3 max-w-[88%] ${!isAi ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
                      >
                        {isAi ? <AiAvatar /> : <UserAvatar />}
                        <div className="relative">
                          <div className={`p-3.5 rounded-2xl border ${
                            isAi 
                              ? 'bg-white border-[#624F43]/10 text-[#3E332E] shadow-sm' 
                              : 'bg-[#B08B74]/15 border-[#B08B74]/30 text-[#3E332E] font-medium shadow-xs'
                          }`}>
                            {isAi ? (
                              <BeautifulMarkdown text={msg.text} />
                            ) : (
                              <p className="leading-relaxed text-xs">{msg.text}</p>
                            )}

                            {/* Cute custom twig inside specific AI plan messages to match photos! */}
                            {isAi && (msg.text.includes('personalized plan') || msg.text.includes('study plan')) && (
                              <div className="absolute top-2 -right-14 w-12 h-12 hidden md:block opacity-65">
                                <WildflowerSVG />
                              </div>
                            )}
                          </div>
                          
                          {/* "View Full Plan ->" trigger mockup link inside list */}
                          {isAi && (msg.text.includes('personalized plan') || msg.text.includes('study plan')) && (
                            <div className="mt-1 pl-1">
                              <button 
                                onClick={() => alert("Daily revision tasks have been successfully scheduled in your To-Do card!")}
                                className="text-[#5C80A2] hover:text-[#4B6B88] font-bold text-[10px] tracking-wide hover:underline transition-all"
                              >
                                View Full Plan →
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thinking status */}
          <AnimatePresence>
            {isTyping && (
              <motion.div 
                key="thinking-indicator"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start space-x-3 max-w-[85%]"
              >
                <AiAvatar />
                <div className="bg-white border border-[#624F43]/10 p-3 rounded-2xl text-[#624F43]/50 italic shadow-sm">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-[#E8B869]" />
                    Nexus AI is analyzing your planner data...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Action chips above input if conversational mode has active messages */}
        <AnimatePresence>
          {chatMessages.length > 0 && (
            <motion.div 
              key="action-chips-above-input"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex overflow-x-auto no-scrollbar gap-1.5 pb-2.5 flex-shrink-0"
            >
              <AnimatePresence>
                {helperChips.slice(0, 4).map((chip) => (
                  <motion.button
                    key={`chat-chip-${chip.label}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleChipClick(chip.prompt)}
                    className="px-2.5 py-1 bg-white hover:bg-[#FAF5EF] text-[9px] font-sans font-bold text-[#624F43] rounded-full border border-[#624F43]/10 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                  >
                    {chip.label}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Text Box Form with globe/attachment, mic, and airplane send button */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 flex-shrink-0 bg-white border border-[#624F43]/10 rounded-full p-1.5 shadow-xs">
          {/* Globe search icon decoration */}
          <button 
            type="button"
            className="p-1.5 text-[#624F43]/40 hover:text-[#B08B74] rounded-full hover:bg-[#FAF5EF] transition-all"
            title="Grounding Search"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Microphone icon decoration */}
          <button 
            type="button"
            className="p-1.5 text-[#624F43]/40 hover:text-[#B08B74] rounded-full hover:bg-[#FAF5EF] transition-all mr-1"
            title="Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            required
            placeholder="Ask anything..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-grow bg-transparent text-[#3E332E] text-xs placeholder-[#624F43]/45 focus:outline-none py-1.5"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="p-2.5 bg-[#B08B74] hover:bg-[#8B7355] text-white rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
