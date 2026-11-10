'use client';

import React, { useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Calendar, 
  Sparkles, 
  Check, 
  X, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { StudyStreakData, getCurrentWeekDays } from '@/lib/study-streak';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakData: StudyStreakData;
}

export function StreakModal({ isOpen, onClose, streakData }: StreakModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const weekDays = getCurrentWeekDays(streakData.activeDates);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gradient Accent */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 sm:p-8 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-inner shrink-0">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-2">
                  Daily Study Streak
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Consistency beats intensity • Solve 1 question daily
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer shrink-0"
              aria-label="Close Streak Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Core Stat Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
            {/* Current Streak */}
            <div className="p-2.5 sm:p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center relative overflow-hidden">
              <span className="text-[10px] sm:text-[11px] font-bold text-orange-700 dark:text-orange-400 block uppercase tracking-wider">
                Current
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mt-1 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 fill-current inline" />
                <span>{streakData.currentStreak}</span>
              </p>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-mono block mt-1">
                <span className="hidden sm:inline">{streakData.studiedToday ? 'Studied Today ✅' : 'Study Today ⏳'}</span>
                <span className="sm:hidden">{streakData.studiedToday ? 'Today ✅' : 'Today ⏳'}</span>
              </span>
            </div>

            {/* Longest Streak */}
            <div className="p-2.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wider">
                Longest
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mt-1 flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 inline" />
                <span>{streakData.longestStreak}</span>
              </p>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-mono block mt-1">
                Personal Best
              </span>
            </div>

            {/* Total Days */}
            <div className="p-2.5 sm:p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 dark:text-purple-400 block uppercase tracking-wider">
                Total Days
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mt-1 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 inline" />
                <span>{streakData.totalActiveDays}</span>
              </p>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-mono block mt-1">
                All-Time
              </span>
            </div>
          </div>

          {/* Current Week Activity Dots */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center justify-between text-xs font-bold text-foreground mb-3 flex-wrap gap-1">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-500" />
                <span>This Week's Activity</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground font-normal">
                {weekDays.filter((d) => d.isStudied).length} of 7 days completed
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {weekDays.map((d) => (
                <div key={d.dateStr} className="flex flex-col items-center gap-1 sm:gap-1.5">
                  <span className="text-[9px] sm:text-[10px] font-mono font-medium text-muted-foreground">
                    {d.dayName}
                  </span>
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${
                      d.isStudied
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20'
                        : d.isToday
                        ? 'border-2 border-orange-500 text-orange-500 bg-orange-500/10 animate-pulse'
                        : d.isPast
                        ? 'bg-muted/70 text-muted-foreground border border-border/50'
                        : 'bg-muted/30 text-muted-foreground/40 border border-dashed border-border'
                    }`}
                  >
                    {d.isStudied ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    ) : (
                      <span>{d.dayNumber}</span>
                    )}
                  </div>
                  {d.isToday && (
                    <span className="text-[8px] sm:text-[9px] font-bold text-orange-500 uppercase tracking-tight">
                      Today
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Tip Box */}
          <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-500 shrink-0" />
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
              {streakData.currentStreak === 0
                ? 'Mark any question as studied or master a flashcard today to ignite your streak!'
                : streakData.currentStreak < 7
                ? `🔥 You are only ${7 - streakData.currentStreak} day${7 - streakData.currentStreak === 1 ? '' : 's'} away from a 7-Day Consistency Badge!`
                : '🏆 Incredible discipline! Daily active recall is proven to boost interview retention by 300%.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-6 pt-3 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <span className="text-[11px] text-muted-foreground font-mono">
            Zero login • Saved locally
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
          >
            <span>Continue Studying</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

