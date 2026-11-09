'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Bookmark, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  GlobalStudyStats, 
  getGlobalStudyStats, 
  resetAllStudyProgress, 
  STUDY_PROGRESS_UPDATE_EVENT 
} from '@/lib/study-progress';
import { TrackMeta } from '@/lib/tracks-meta';

interface StudyProgressCardProps {
  tracks: TrackMeta[];
  onOpenBookmarks?: () => void;
}

export function StudyProgressCard({ tracks, onOpenBookmarks }: StudyProgressCardProps) {
  const [stats, setStats] = useState<GlobalStudyStats | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    const refresh = () => {
      setStats(getGlobalStudyStats(tracks));
    };

    refresh();
    window.addEventListener(STUDY_PROGRESS_UPDATE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);

    return () => {
      window.removeEventListener(STUDY_PROGRESS_UPDATE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [tracks]);

  if (!stats) return null;

  // Approximate study time: ~5 mins average per deep-dive question
  const hoursInvested = Math.round((stats.totalStudied * 5) / 60 * 10) / 10;

  // SVG Circular Ring calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.overallPercent / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-10 sm:mb-14">
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-5 sm:p-8 shadow-sm dark:shadow-xl transition-all">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10">
          {/* Top Row: Overall Summary */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
            {/* Left: Circular Ring + Headline */}
            <div className="flex items-center gap-5">
              {/* Circular SVG Progress Ring */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-muted"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl sm:text-2xl font-black text-foreground">
                    {stats.overallPercent}%
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Mastery
                  </span>
                </div>
              </div>

              {/* Title & Status */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                    Curriculum Readiness
                  </span>
                  {stats.tracksMastered > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Trophy className="h-3.5 w-3.5" />
                      <span>{stats.tracksMastered} Mastered</span>
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {stats.totalStudied === 0
                    ? 'Start Your Interview Preparation'
                    : `${stats.totalStudied} of ${stats.totalQuestions} Questions Mastered`}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                  {stats.totalStudied === 0
                    ? 'Mark questions as studied as you practice to track your overall curriculum completion across all 12 tracks.'
                    : `You've invested approximately ~${hoursInvested} hours of focused interview preparation across ${tracks.length} engineering tracks.`}
                </p>
              </div>
            </div>

            {/* Right: Quick Action & Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              {/* Studied Count */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Studied</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {stats.totalStudied}
                  <span className="text-xs text-muted-foreground font-normal ml-1">/ {stats.totalQuestions}</span>
                </p>
              </div>

              {/* Bookmarked Count */}
              <button
                type="button"
                onClick={onOpenBookmarks}
                className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border hover:border-amber-400/50 hover:bg-muted text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 font-semibold mb-1">
                  <Bookmark className="h-3.5 w-3.5 text-amber-500 fill-current" />
                  <span>Bookmarked</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {stats.totalBookmarks}
                  <span className="text-xs text-muted-foreground font-normal ml-1">saved</span>
                </p>
              </button>

              {/* Study Time */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-muted/60 border border-border col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
                  <Clock className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Prep Time</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  ~{hoursInvested}
                  <span className="text-xs text-muted-foreground font-normal ml-1">hrs</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Accordion Trigger: Track-by-Track Breakdown */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <span>{expanded ? 'Hide Track Readiness Breakdown' : 'View Track Readiness Breakdown (All 12 Tracks)'}</span>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {stats.totalStudied > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all studied progress? This will reset your checkmarks to 0 across all tracks.')) {
                    resetAllStudyProgress(tracks);
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium"
                title="Reset study progress"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Expanded Track Breakdown Grid */}
          {expanded && (
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-in fade-in duration-200">
              {stats.trackBreakdown.map((t) => (
                <Link
                  key={t.trackSlug}
                  href={`/sections/${t.trackSlug}`}
                  className="p-3.5 rounded-2xl bg-muted/40 border border-border hover:border-purple-400/50 hover:bg-card-hover transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                      {t.sectionNumber}. {t.trackTitle}
                    </span>
                    <span className={`text-[11px] font-mono font-bold shrink-0 ${t.percent === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                      {t.percent}%
                    </span>
                  </div>

                  {/* Track Mini Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-muted overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        t.percent === 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                      }`}
                      style={{ width: `${t.percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{t.studiedCount} / {t.totalCount} studied</span>
                    {t.bookmarkedCount > 0 && (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        ★ {t.bookmarkedCount} saved
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

