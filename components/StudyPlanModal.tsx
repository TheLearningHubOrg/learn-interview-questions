'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Trophy, 
  Check, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  X, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { 
  StudyPlan, 
  StudyPlanDay, 
  getStudyPlanProgress, 
  StudyPlanProgress 
} from '@/lib/study-plans';
import { 
  getTrackStudiedMap, 
  toggleQuestionStudied, 
  STUDY_PROGRESS_UPDATE_EVENT 
} from '@/lib/study-progress';

interface StudyPlanModalProps {
  plan: StudyPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StudyPlanModal({ plan, isOpen, onClose }: StudyPlanModalProps) {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [progress, setProgress] = useState<StudyPlanProgress | null>(null);

  // Sync progress
  useEffect(() => {
    if (!plan) return;
    const refresh = () => {
      setProgress(getStudyPlanProgress(plan));
    };

    refresh();
    window.addEventListener(STUDY_PROGRESS_UPDATE_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(STUDY_PROGRESS_UPDATE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [plan]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !plan) return null;

  const activeDay = plan.days.find((d) => d.dayNumber === selectedDayNumber) || plan.days[0];
  const activeDayProgress = progress?.dayProgress.find((d) => d.dayNumber === activeDay.dayNumber);

  const handleToggleStudied = (trackSlug: string, qNum: number) => {
    toggleQuestionStudied(trackSlug, qNum);
    if (plan) {
      setProgress(getStudyPlanProgress(plan));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Banner */}
        <div className={`h-2.5 bg-gradient-to-r ${plan.gradient}`} />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 sm:p-7 pb-3 sm:pb-4 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${plan.gradient} text-white flex items-center justify-center shadow-md shrink-0`}>
              {plan.iconName === 'Zap' ? (
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              ) : (
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
                  {plan.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {plan.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                {plan.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar Header Summary */}
        <div className="px-4 sm:px-7 py-2.5 sm:py-3 bg-muted/30 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${plan.gradient}`}
                style={{ width: `${progress?.percent || 0}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-foreground shrink-0">
              {progress?.percent || 0}% Complete
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">{progress?.studiedCount || 0}</strong> of{' '}
              <strong className="text-foreground">{plan.totalQuestions}</strong> questions mastered
            </span>
            {progress?.isFullyCompleted && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Plan Mastered!</span>
              </span>
            )}
          </div>
        </div>

        {/* Day Selector Pills Bar */}
        <div className="px-4 sm:px-7 py-2.5 sm:py-3 border-b border-border bg-background/50 overflow-x-auto no-scrollbar flex items-center gap-2">
          {plan.days.map((day) => {
            const dayProg = progress?.dayProgress.find((d) => d.dayNumber === day.dayNumber);
            const isSelected = selectedDayNumber === day.dayNumber;
            const isCompleted = dayProg?.isCompleted;

            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20'
                    : 'bg-muted/50 text-muted-foreground border border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : (
                  <Calendar className="w-3 h-3 opacity-60" />
                )}
                <span>Day {day.dayNumber}</span>
                <span className="text-[10px] opacity-75 ml-0.5">
                  ({dayProg?.studied || 0}/{day.questions.length})
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area: Active Day Questions */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                Day {activeDay.dayNumber} of {plan.durationDays}
              </span>
              <h4 className="text-lg sm:text-xl font-black text-foreground mt-0.5">
                {activeDay.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                Focus: {activeDay.focus}
              </p>
            </div>

            <div className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg shrink-0 w-fit">
              {activeDayProgress?.studied || 0} / {activeDay.questions.length} questions completed
            </div>
          </div>

          {/* Question List for Active Day */}
          <div className="space-y-3 pt-1">
            {activeDay.questions.map((q) => {
              const studiedMap = getTrackStudiedMap(q.trackSlug);
              const isStudied = !!studiedMap[q.questionNumber];

              return (
                <div
                  key={`${q.trackSlug}-${q.questionNumber}`}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isStudied
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-card border-border hover:border-purple-500/30 hover:bg-card-hover'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Checkbox Trigger */}
                    <button
                      type="button"
                      onClick={() => handleToggleStudied(q.trackSlug, q.questionNumber)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                        isStudied
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'border-2 border-muted-foreground/40 hover:border-purple-500'
                      }`}
                      title={isStudied ? 'Mark as unstudied' : 'Mark as studied'}
                    >
                      {isStudied && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {/* Track Badge */}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                          {q.trackName} #{q.questionNumber}
                        </span>

                        {/* Topic */}
                        <span className="text-[11px] text-muted-foreground font-mono">
                          • {q.topic}
                        </span>

                        {/* Importance Pill */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                            q.importance === 'MUST_KNOW'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : q.importance === 'STAFF_LEVEL'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              : 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20'
                          }`}
                        >
                          {q.importance.replace('_', ' ')}
                        </span>
                      </div>

                      <Link
                        href={`/sections/${q.trackSlug}/${q.questionNumber}`}
                        onClick={onClose}
                        className="text-sm font-bold text-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2"
                      >
                        {q.title}
                      </Link>
                    </div>
                  </div>

                  {/* Open Question Link */}
                  <Link
                    href={`/sections/${q.trackSlug}/${q.questionNumber}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-purple-600 hover:text-white text-muted-foreground transition-all shrink-0 w-full sm:w-auto"
                  >
                    <span>Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-5 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Progress syncs across all devices via your browser storage</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
            {selectedDayNumber < plan.durationDays && (
              <button
                type="button"
                onClick={() => setSelectedDayNumber((prev) => Math.min(plan.durationDays, prev + 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer flex-1 sm:flex-none text-center"
              >
                Next Day (Day {selectedDayNumber + 1}) →
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 transition-all cursor-pointer flex-1 sm:flex-none text-center"
            >
              Continue Preparation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

