'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, X, ArrowRight, Trash2, BookOpen, ExternalLink } from 'lucide-react';
import { 
  BookmarkItem, 
  getAllBookmarks, 
  removeBookmark, 
  clearAllBookmarks, 
  BOOKMARKS_UPDATE_EVENT 
} from '@/lib/study-progress';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookmarksModal({ isOpen, onClose }: BookmarksModalProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    const refresh = () => {
      setBookmarks(getAllBookmarks());
    };

    refresh();
    window.addEventListener(BOOKMARKS_UPDATE_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(BOOKMARKS_UPDATE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Group bookmarks by track
  const grouped = bookmarks.reduce((acc, item) => {
    if (!acc[item.trackSlug]) {
      acc[item.trackSlug] = {
        trackTitle: item.trackTitle,
        sectionNumber: item.sectionNumber,
        items: [],
      };
    }
    acc[item.trackSlug].items.push(item);
    return acc;
  }, {} as Record<string, { trackTitle: string; sectionNumber: number; items: BookmarkItem[] }>);

  const groupEntries = Object.entries(grouped);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-3 sm:px-4 bg-slate-900/50 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between gap-3 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Bookmark className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Saved for Review
              </h2>
              <p className="text-xs text-muted-foreground">
                {bookmarks.length === 0
                  ? 'Your personalized interview cheat sheet'
                  : `${bookmarks.length} ${bookmarks.length === 1 ? 'question' : 'questions'} bookmarked across ${groupEntries.length} ${groupEntries.length === 1 ? 'track' : 'tracks'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear all bookmarked questions?')) {
                    clearAllBookmarks();
                  }
                }}
                className="text-xs text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-card border border-transparent hover:border-border transition-colors font-medium"
                title="Clear all bookmarks"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-colors"
              aria-label="Close bookmarks modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6">
          {bookmarks.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-3">
                <Bookmark className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">No Bookmarks Saved Yet</h3>
              <p className="text-xs max-w-sm leading-relaxed mb-4">
                Click the <strong>Bookmark</strong> button on any question while studying to flag complex topics or algorithms for high-priority review before your interview.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm"
              >
                Browse Questions
              </button>
            </div>
          ) : (
            groupEntries.map(([slug, group]) => (
              <div key={slug} className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                  <span>
                    Section {group.sectionNumber}: {group.trackTitle}
                  </span>
                  <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    {group.items.length} {group.items.length === 1 ? 'question' : 'questions'}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.items.map((b) => (
                    <div
                      key={`${b.trackSlug}-${b.questionNumber}`}
                      className="p-3 sm:p-3.5 rounded-xl bg-card border border-border hover:border-amber-400/50 hover:bg-card-hover transition-all flex items-center justify-between gap-3 group shadow-xs"
                    >
                      <Link
                        href={`/sections/${b.trackSlug}/${b.questionNumber}`}
                        onClick={onClose}
                        className="flex items-center gap-3 min-w-0 flex-1"
                      >
                        <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30 text-xs font-bold flex items-center justify-center shrink-0">
                          Q{b.questionNumber}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                            {b.questionTitle}
                          </p>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {b.trackTitle} • Question {b.questionNumber}
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-center gap-1 shrink-0">
                        <Link
                          href={`/sections/${b.trackSlug}/${b.questionNumber}`}
                          onClick={onClose}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                          title="Open question"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeBookmark(b.trackSlug, b.questionNumber)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Remove from bookmarks"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Tip: Filter by bookmarks inside any section directory</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-card-hover font-semibold text-xs shadow-xs"
          >
            Close (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}

