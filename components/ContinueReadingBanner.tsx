'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookmarkCheck, ArrowRight, X, Sparkles } from 'lucide-react';
import { getGlobalLastRead, LastReadItem } from '@/lib/reading-history';

export function ContinueReadingBanner() {
  const [lastRead, setLastRead] = useState<LastReadItem | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const item = getGlobalLastRead();
    if (item) {
      setLastRead(item);
    }
  }, []);

  if (!lastRead || dismissed) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-3 duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-violet-900/10 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-violet-950/40 border border-purple-500/20 dark:border-purple-500/30 p-4 sm:p-5 shadow-lg shadow-purple-500/5 backdrop-blur-sm">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/25 shrink-0">
              <BookmarkCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Pick Up Where You Left Off
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-purple-400" />
                <span className="text-xs text-muted-foreground font-semibold">
                  Section {lastRead.sectionNumber}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-foreground line-clamp-1">
                Q{lastRead.questionNumber}: {lastRead.questionTitle}
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {lastRead.trackTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            <Link
              href={`/sections/${lastRead.trackSlug}/${lastRead.questionNumber}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/25 transition-all active:scale-95"
            >
              <span>Continue Reading</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

