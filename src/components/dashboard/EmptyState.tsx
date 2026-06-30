import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  onAction?: () => void;
  actionLabel?: string;
}

export default function EmptyState({ message, onAction, actionLabel = 'Create' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-12 h-12 bg-[#FAF5EF] rounded-full border border-[#8B7355]/10 flex items-center justify-center mb-3">
        <Plus className="w-5 h-5 text-[#8B7355]/40" />
      </div>
      <p className="text-xs text-[#624F43]/60 font-serif italic mb-4">
        {message}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#FAF5EF] border border-[#8B7355]/20 text-[#624F43] rounded-xl text-[10px] font-bold tracking-wider uppercase hover:bg-[#EADBC8]/30 transition-colors shadow-sm cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
