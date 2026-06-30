import React, { useState } from 'react';
import { BookOpen, Star, Plus, Search, Eye, Trash2, Tag, X, MoreVertical, FileText } from 'lucide-react';
import { JournalEntry } from '../../types';
import EmptyState from './EmptyState';

interface JournalCardProps {
  entries: JournalEntry[];
  onAddEntry: (title: string, content: string, tag: string) => void;
  onToggleEntryStarred: (id: string, starred: boolean) => void;
  onDeleteEntry: (id: string) => void;
}

export default function JournalCard({
  entries,
  onAddEntry,
  onToggleEntryStarred,
  onDeleteEntry,
}: JournalCardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Study');

  const filteredEntries = entries.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTagStyle = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'study': return 'bg-brand-sage/15 text-[#7D8B71] border-brand-sage/20';
      case 'personal': return 'bg-[#B08B74]/15 text-[#8B7355] border-[#B08B74]/20';
      case 'ideas': return 'bg-[#8DA4C4]/15 text-[#5C7A92] border-[#8DA4C4]/20';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddEntry(newTitle, newContent, newTag);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between h-full relative">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <h3 className="font-serif font-bold text-base text-[#3E332E] tracking-wide flex items-center gap-2">
            Journal Entries
          </h3>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="Filter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 w-0 group-hover:w-32 focus:w-32 transition-all bg-[#FAF5EF] text-[10px] border border-[#624F43]/10 rounded-full py-1 pl-7 pr-3 focus:outline-none z-0"
              />
              <button className="text-[#3E332E] hover:text-[#B08B74] transition-colors cursor-pointer relative z-10 bg-white/50 rounded-full p-1">
                <Search className="w-4 h-4" />
              </button>
            </div>
            <button className="text-[#3E332E] hover:text-[#B08B74] transition-colors cursor-pointer p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Entries List Cards */}
        <div className="space-y-3.5 max-h-[300px] overflow-y-auto no-scrollbar pt-1 relative z-20">
          {filteredEntries.map((entry) => (
            <div 
              key={entry.id}
              className="bg-[#FCF9F5] border-none p-3.5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-all flex items-start justify-between relative group"
            >
              <div className="flex items-start gap-3 w-full pr-8">
                {/* Journal/Document Icon */}
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-[#624F43]/5 flex-shrink-0">
                  <FileText className="w-4 h-4 text-[#B08B74]" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-sans font-bold text-[#3E332E] truncate">
                      {entry.title}
                    </h4>
                    <span className={`text-[8px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getTagStyle(entry.tag)}`}>
                      {entry.tag}
                    </span>
                  </div>
                  
                  <span className="text-[10px] font-sans font-medium text-[#624F43]/60 block mb-1">
                    {entry.date} at {entry.time}
                  </span>

                  <p className="text-[11px] text-[#624F43]/80 font-sans line-clamp-1 leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </div>

              {/* Action buttons (Fav, view, delete) */}
              <div className="absolute top-3.5 right-3.5 flex flex-col items-end gap-2">
                <button
                  onClick={() => onToggleEntryStarred(entry.id, !entry.starred)}
                  className={`p-1 rounded-full cursor-pointer transition-colors ${
                    entry.starred ? 'text-amber-500' : 'text-[#624F43]/20 hover:text-amber-500'
                  }`}
                >
                  <Star className={`w-4 h-4 ${entry.starred ? 'fill-current' : ''}`} />
                </button>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button
                    onClick={() => setViewingEntry(entry)}
                    className="p-1 text-[#624F43]/40 hover:text-[#B08B74] rounded-lg cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1 text-[#624F43]/30 hover:text-red-500 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <EmptyState 
              message="No journal entries yet"
              onAction={() => setIsAdding(true)}
              actionLabel="Create Entry"
            />
          )}
        </div>
      </div>

      {/* Add Entry Modal Overlay (simulating drawer) */}
      {isAdding && (
        <div className="absolute inset-0 bg-[#FAF6F0]/95 backdrop-blur-xs rounded-[24px] z-50 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
              <h4 className="font-serif font-bold text-xs text-[#3E332E] uppercase tracking-wide">
                Write Journal Entry
              </h4>
              <button 
                onClick={() => setIsAdding(false)}
                className="p-1 hover:bg-black/5 rounded-full text-[#624F43]/50 hover:text-[#3E332E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Backpropagation Math Proof..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#624F43]/10 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest mb-1">
                  Tag Category
                </label>
                <div className="flex items-center space-x-2">
                  {['Study', 'Personal', 'Ideas'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewTag(t)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        newTag === t 
                          ? 'bg-[#B08B74] text-white border-[#B08B74]' 
                          : 'bg-white border-[#624F43]/10 text-[#624F43]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#624F43]/70 uppercase tracking-widest mb-1">
                  Entry Body Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Today I solved the chain rule gradients for multilayer neural nets..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#624F43]/10 rounded-xl focus:outline-none leading-relaxed"
                />
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detailed Entry Modal Overlay */}
      {viewingEntry && (
        <div className="absolute inset-0 bg-[#FAF6F0]/98 backdrop-blur-sm rounded-[24px] z-50 p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
              <span className={`text-[8px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getTagStyle(viewingEntry.tag)}`}>
                {viewingEntry.tag}
              </span>
              <button 
                onClick={() => setViewingEntry(null)}
                className="p-1 hover:bg-black/5 rounded-full text-[#624F43]/50 hover:text-[#3E332E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#3E332E]">
                {viewingEntry.title}
              </h3>
              <p className="text-[9px] font-mono text-[#624F43]/55">
                {viewingEntry.date} @ {viewingEntry.time}
              </p>
            </div>

            <p className="text-xs font-sans text-[#624F43] leading-relaxed pt-2 whitespace-pre-wrap">
              {viewingEntry.content}
            </p>
          </div>

          <button
            onClick={() => setViewingEntry(null)}
            className="w-full mt-6 py-2 bg-[#B08B74] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-[#8B7355] transition-all text-center cursor-pointer"
          >
            Done Reading
          </button>
        </div>
      )}

      {/* Decorative Image */}
      <img src="/journal.png" alt="" className="absolute bottom-20 right-0 w-32 h-32 object-contain pointer-events-none opacity-90 mix-blend-multiply z-10" />

      {/* FAB Add Entry */}
      <div className="relative z-20 pt-4 mt-auto">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3.5 bg-[#4A72FF] text-white rounded-[20px] text-sm font-sans font-medium hover:bg-[#3A62EF] transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(74,114,255,0.25)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
      </div>
    </div>
  );
}
