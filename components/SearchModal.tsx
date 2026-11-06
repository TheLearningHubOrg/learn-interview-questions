'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, BookOpen, Hash } from 'lucide-react';
import { QuestionIndexItem } from '@/lib/tracks';

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="h-5 w-5 text-purple-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across 745+ questions (e.g. Signals, Event Loop, B-Tree, AWS VPC, Two Sum)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white p-1">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs bg-border rounded text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-border/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm">No matching questions found for "{query}".</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={`${item.trackSlug}-${item.questionNumber}-${idx}`}
                onClick={() => handleSelect(item)}
                className={`w-full text-left p-3.5 rounded-xl flex items-start justify-between gap-4 transition-colors group ${
                  idx === selectedIndex ? 'bg-purple-500/10 border border-purple-500/20' : 'hover:bg-card-hover'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                      Section {item.sectionNumber}: {item.trackShortTitle}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono font-bold">
                      Q{item.questionNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {item.part}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {item.title}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-purple-400 shrink-0 mt-1 transform group-hover:translate-x-1 transition-all" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-background/50 border-t border-border flex items-center justify-between text-xs text-slate-400">
          <span>{filtered.length} matching questions</span>
          <div className="flex items-center gap-2">
            <span>Click question to open its dedicated page</span>
          </div>
        </div>
      </div>
    </div>
  );
}
