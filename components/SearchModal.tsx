'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, BookOpen, Hash } from 'lucide-react';
import { QuestionIndexItem } from '@/lib/tracks-meta';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  indexItems: QuestionIndexItem[];
}

export function SearchModal({ isOpen, onClose, indexItems }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return indexItems.slice(0, 15);
    const q = query.toLowerCase();
    return indexItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.part.toLowerCase().includes(q) ||
        item.trackShortTitle.toLowerCase().includes(q) ||
        item.questionNumber.toString() === q
    ).slice(0, 30);
  }, [query, indexItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: QuestionIndexItem) => {
    onClose();
    router.push(`/sections/${item.trackSlug}/${item.questionNumber}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-900/40 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-border flex items-center gap-3">
          <Search className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 1,500+ interview questions (e.g. Signals, Hooks, Fiber, Promises, B-Tree, AWS)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground p-1"
              aria-label="Clear Search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs bg-muted border border-border rounded text-muted-foreground font-mono font-semibold">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-border/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No matching questions found for "{query}".</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={`${item.trackSlug}-${item.questionNumber}-${idx}`}
                onClick={() => handleSelect(item)}
                className={`w-full text-left p-3 sm:p-3.5 rounded-xl flex items-start justify-between gap-3 sm:gap-4 transition-colors group ${
                  idx === selectedIndex ? 'bg-purple-100 text-purple-900 border border-purple-200 dark:bg-purple-500/10 dark:text-foreground dark:border-purple-500/30' : 'hover:bg-card-hover'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 shrink-0">
                      Q{item.questionNumber}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold truncate">
                      {item.trackShortTitle}
                    </span>
                    <span className="text-xs text-muted-foreground/60 hidden sm:inline">•</span>
                    <span className="text-xs text-muted-foreground/75 truncate hidden sm:inline">
                      {item.part}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {item.title}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
              </button>
            ))
          )}
        </div>

        {/* Bottom Search Footer */}
        <div className="p-3 bg-muted/50 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length} questions displayed</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[11px] font-semibold">↵ Enter</kbd>
            <span>to open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
