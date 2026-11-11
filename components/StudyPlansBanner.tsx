'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Trophy, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Flame,
  Clock
} from 'lucide-react';
import { 
  STUDY_PLANS, 
  StudyPlan, 
  getStudyPlanProgress, 
  StudyPlanProgress,
  getPlanActiveDayNumber
} from '@/lib/study-plans';
import { STUDY_PROGRESS_UPDATE_EVENT } from '@/lib/study-progress';
import { StudyPlanModal } from './StudyPlanModal';

export function StudyPlansBanner() {
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, StudyPlanProgress>>({});

  useEffect(() => {
    const refresh = () => {
      const map: Record<string, StudyPlanProgress> = {};
      for (const plan of STUDY_PLANS) {
        map[plan.id] = getStudyPlanProgress(plan);
      }
      setProgressMap(map);
    };

    refresh();
    window.addEventListener(STUDY_PROGRESS_UPDATE_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(STUDY_PROGRESS_UPDATE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="h-4 w-4" />
              <span>Sprint Study Timelines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Preparing On A Tight Deadline?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Skip the endless search. Follow curated, day-by-day sprint curriculums engineered for immediate interview retention.
          </p>
        </div>

        {/* 2-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {STUDY_PLANS.map((plan) => {
            const prog = progressMap[plan.id];
            const percent = prog?.percent || 0;
            const studied = prog?.studiedCount || 0;

            const is7Day = plan.id === '7-day-sprint';
            const activeDay = getPlanActiveDayNumber(plan);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className="group relative rounded-3xl bg-card border border-border p-5 sm:p-7 shadow-sm hover:shadow-xl hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                {/* Ambient Card Background Glow */}
                <div
                  className={`absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity bg-gradient-to-tr ${plan.gradient}`}
                />

                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${plan.gradient} text-white flex items-center justify-center shadow-md shadow-orange-500/10 group-hover:scale-105 transition-transform duration-200 shrink-0`}
                    >
                      {is7Day ? (
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                      ) : (
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted/70 text-foreground border border-border flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span>{plan.questionsPerDay} Qs / day</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        {plan.durationDays} Days
                      </span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {plan.tagline}. {plan.description}
                  </p>
                </div>

                {/* Bottom Row: Progress + Action CTA */}
                <div className="pt-6 mt-6 border-t border-border">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-muted-foreground">
                      Curriculum Progress
                    </span>
                    <span className="font-mono text-foreground font-bold">
                      {studied} / {plan.totalQuestions} ({percent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-muted overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${plan.gradient}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{prog?.isFullyCompleted ? '🎉 Sprint Mastered' : `Active: Day ${activeDay} of ${plan.durationDays}`}</span>
                    </span>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform"
                    >
                      <span>{prog?.studiedCount && prog.studiedCount > 0 ? `Resume Day ${activeDay}` : 'Start Sprint'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Plan Details Modal */}
      <StudyPlanModal
        plan={selectedPlan}
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
}

