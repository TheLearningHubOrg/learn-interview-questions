'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { 
  ArrowLeft, 
  Check, 
  BookOpen, 
  Grid, 
  CheckCircle2, 
  Bookmark,
  X, 
  ChevronLeft,
  ChevronRight,
  Share2,
  BrainCircuit,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Zap,
  PencilLine
} from 'lucide-react';
import { QuestionViewData } from '@/lib/tracks-meta';
import { CodeBlock } from '@/components/CodeBlock';
import { MermaidBlock } from '@/components/MermaidBlock';
import { MultiLangCodeTabs, LanguageBlock } from '@/components/MultiLangCodeTabs';
import { saveLastRead } from '@/lib/reading-history';
import { 
  isQuestionBookmarked, 
  toggleBookmark, 
  getAllBookmarks, 
  BOOKMARKS_UPDATE_EVENT,
  STUDY_PROGRESS_UPDATE_EVENT,
  getFlashcardMode,
  toggleFlashcardMode,
  FLASHCARD_MODE_UPDATE_EVENT
} from '@/lib/study-progress';
import { recordStudyActivity } from '@/lib/study-streak';
import { 
  getQuestionStudyPlanBadges, 
  getSprintQuestionNavigation, 
  SprintQuestionNavigation, 
  STUDY_PLANS, 
  StudyPlan,
  ACTIVE_PLAN_UPDATE_EVENT 
} from '@/lib/study-plans';
import { StudyPlanModal } from '@/components/StudyPlanModal';
import { QuestionNotesDrawer } from '@/components/QuestionNotesDrawer';
import { getQuestionNote, NOTES_UPDATE_EVENT } from '@/lib/study-notes';

function parseQuestionContent(content: string) {
  const langRegex = /####\s+(Python 3|Python|JavaScript|JS|TypeScript|TS|Java|C\+\+|Go|Rust)\s*\n+```(\w+)\n([\s\S]*?)```/gi;
  const blocks: LanguageBlock[] = [];
  let match: RegExpExecArray | null;

  while ((match = langRegex.exec(content)) !== null) {
    let label = match[1].trim();
    if (label.toLowerCase() === 'js') label = 'JavaScript';
    if (label.toLowerCase() === 'ts') label = 'TypeScript';
    if (label.toLowerCase() === 'python') label = 'Python 3';

    blocks.push({
      label,
      lang: match[2].trim().toLowerCase(),
      code: match[3].trim(),
    });
  }

  if (blocks.length > 1) {
    const firstHeaderIdx = content.search(/####\s+(Python 3|Python|JavaScript|JS|TypeScript|TS|Java|C\+\+)/i);
    const explanation = firstHeaderIdx !== -1 ? content.slice(0, firstHeaderIdx).trim() : content;
    return { isMultiLang: true, explanation, blocks };
  }

  return { isMultiLang: false, explanation: content, blocks: [] };
}

interface QuestionViewerProps {
  data: QuestionViewData;
}


const renderMarkdownImage = ({ src, alt, ...props }: any) => {
  if (!src) return null;
  let resolvedSrc = src;
  if (resolvedSrc.startsWith('images/')) {
    resolvedSrc = '/' + resolvedSrc;
  } else if (resolvedSrc.startsWith('./images/')) {
    resolvedSrc = resolvedSrc.replace(/^\.\//, '/');
  }
  return (
    <figure className="my-6 flex flex-col items-center">
      <div className="overflow-hidden rounded-xl border border-border bg-card p-2 sm:p-3 shadow-md max-w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
          alt={alt || 'Interview reference diagram'}
          loading="lazy"
          className="rounded-lg object-contain max-h-[550px] w-auto max-w-full mx-auto"
          {...props}
        />
      </div>
      {alt && alt !== 'ScreenShot' && alt !== 'Screenshot' && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground italic font-medium">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};

export function QuestionViewer({ data }: QuestionViewerProps) {
  const router = useRouter();
  const { track, question, allQuestions, prevQuestion, nextQuestion, totalInTrack } = data;

  const [copiedLink, setCopiedLink] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [studiedMap, setStudiedMap] = useState<Record<number, boolean>>({});
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<number>>(new Set());
  const [isFlashcardMode, setIsFlashcardMode] = useState<boolean>(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [hasNote, setHasNote] = useState<boolean>(false);
  const [sprintPlanId, setSprintPlanId] = useState<string | null>(null);
  const [sprintNav, setSprintNav] = useState<SprintQuestionNavigation | null>(null);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState<boolean>(false);
  const [selectedSprintPlan, setSelectedSprintPlan] = useState<StudyPlan | null>(null);
  const [sprintModalDay, setSprintModalDay] = useState<number | undefined>(undefined);

  // Sync sprint study timeline context for current question
  useEffect(() => {
    let currentSprint: string | null = null;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      currentSprint = params.get('sprint');
      setSprintPlanId(currentSprint);
    }

    const refreshSprint = () => {
      setSprintNav(getSprintQuestionNavigation(track.slug, question.number, currentSprint));
    };

    refreshSprint();
    window.addEventListener(STUDY_PROGRESS_UPDATE_EVENT, refreshSprint);
    window.addEventListener(ACTIVE_PLAN_UPDATE_EVENT, refreshSprint);
    window.addEventListener('storage', refreshSprint);

    return () => {
      window.removeEventListener(STUDY_PROGRESS_UPDATE_EVENT, refreshSprint);
      window.removeEventListener(ACTIVE_PLAN_UPDATE_EVENT, refreshSprint);
      window.removeEventListener('storage', refreshSprint);
    };
  }, [track.slug, question.number]);

  // Check if note exists for this question
  useEffect(() => {
    const checkNote = () => {
      setHasNote(getQuestionNote(track.slug, question.number).trim().length > 0);
    };
    checkNote();
    window.addEventListener(NOTES_UPDATE_EVENT, checkNote);
    return () => window.removeEventListener(NOTES_UPDATE_EVENT, checkNote);
  }, [track.slug, question.number]);

  // Reset answer reveal and purge rogue body SVGs whenever question changes
  useEffect(() => {
    setIsAnswerRevealed(false);
    if (typeof document !== 'undefined') {
      document
        .querySelectorAll('body > svg[id^="mermaid-"], body > svg.error-icon, body > [id^="dmermaid"]')
        .forEach((el) => el.remove());
    }
  }, [track.slug, question.number]);

  // Load and listen to Flashcard mode preference
  useEffect(() => {
    setIsFlashcardMode(getFlashcardMode());
    const onFlashcardUpdate = () => setIsFlashcardMode(getFlashcardMode());
    window.addEventListener(FLASHCARD_MODE_UPDATE_EVENT, onFlashcardUpdate);
    return () => window.removeEventListener(FLASHCARD_MODE_UPDATE_EVENT, onFlashcardUpdate);
  }, []);

  const storageKey = `studied_${track.slug}`;

  // Load studied status & bookmarks from localStorage
  useEffect(() => {
    const refresh = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setStudiedMap(JSON.parse(stored));
        }
      } catch {}

      const allB = getAllBookmarks();
      const trackBookmarks = allB.filter((b) => b.trackSlug === track.slug);
      setBookmarkedSet(new Set(trackBookmarks.map((b) => b.questionNumber)));
      setIsBookmarked(isQuestionBookmarked(track.slug, question.number));
    };

    refresh();
    window.addEventListener(BOOKMARKS_UPDATE_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(BOOKMARKS_UPDATE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [storageKey, track.slug, question.number]);

  // Save current question to reading history
  useEffect(() => {
    saveLastRead({
      trackSlug: track.slug,
      trackTitle: track.shortTitle,
      sectionNumber: track.sectionNumber,
      questionNumber: question.number,
      questionTitle: question.title,
      timestamp: Date.now(),
    });
  }, [track.slug, track.shortTitle, track.sectionNumber, question.number, question.title]);

  // Toggle studied status
  const toggleStudied = (num: number) => {
    const nextStatus = !studiedMap[num];
    const updated = { ...studiedMap, [num]: nextStatus };
    setStudiedMap(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      window.dispatchEvent(new Event(STUDY_PROGRESS_UPDATE_EVENT));
      if (nextStatus) {
        recordStudyActivity();
      }
    } catch {}
  };

  // Toggle bookmark status
  const handleToggleBookmark = () => {
    const res = toggleBookmark({
      trackSlug: track.slug,
      trackTitle: track.shortTitle,
      sectionNumber: track.sectionNumber,
      questionNumber: question.number,
      questionTitle: question.title,
      timestamp: Date.now(),
    });
    setIsBookmarked(res);
  };

  const isCurrentStudied = !!studiedMap[question.number];

  const handleToggleFlashcardMode = () => {
    const next = toggleFlashcardMode();
    setIsFlashcardMode(next);
    if (!next) {
      setIsAnswerRevealed(true);
    } else {
      setIsAnswerRevealed(false);
    }
  };

  const handleNeedReview = () => {
    if (!isBookmarked) {
      handleToggleBookmark();
    }
    if (sprintPlanId && sprintNav?.nextQuestion) {
      router.push(`/sections/${sprintNav.nextQuestion.trackSlug}/${sprintNav.nextQuestion.questionNumber}?sprint=${sprintNav.plan.id}`);
    } else if (nextQuestion) {
      router.push(`/sections/${track.slug}/${nextQuestion.number}`);
    }
  };

  const handleMastered = () => {
    if (!isCurrentStudied) {
      toggleStudied(question.number);
    }
    if (sprintPlanId && sprintNav?.nextQuestion) {
      router.push(`/sections/${sprintNav.nextQuestion.trackSlug}/${sprintNav.nextQuestion.questionNumber}?sprint=${sprintNav.plan.id}`);
    } else if (nextQuestion) {
      router.push(`/sections/${track.slug}/${nextQuestion.number}`);
    }
  };

  // Keyboard Navigation:
  // ArrowLeft/ArrowRight: Prev/Next (follows Sprint Plan when sprint query active)
  // G: Jump Grid
  // F: Toggle Flashcard Mode
  // Space: Reveal/Hide Answer in Flashcard Mode
  // B: Need Review (in Flashcard mode when revealed)
  // S: Mastered (in Flashcard mode when revealed)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        if (sprintPlanId && sprintNav?.prevQuestion) {
          e.preventDefault();
          router.push(`/sections/${sprintNav.prevQuestion.trackSlug}/${sprintNav.prevQuestion.questionNumber}?sprint=${sprintNav.plan.id}`);
        } else if (prevQuestion) {
          e.preventDefault();
          router.push(`/sections/${track.slug}/${prevQuestion.number}`);
        }
      } else if (e.key === 'ArrowRight') {
        if (sprintPlanId && sprintNav?.nextQuestion) {
          e.preventDefault();
          router.push(`/sections/${sprintNav.nextQuestion.trackSlug}/${sprintNav.nextQuestion.questionNumber}?sprint=${sprintNav.plan.id}`);
        } else if (nextQuestion) {
          e.preventDefault();
          router.push(`/sections/${track.slug}/${nextQuestion.number}`);
        }
      } else if (e.key === 'g' || e.key === 'G') {
        setIsGridOpen((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFlashcardMode();
      } else if (e.code === 'Space' && isFlashcardMode) {
        e.preventDefault();
        setIsAnswerRevealed((prev) => !prev);
      } else if ((e.key === 'b' || e.key === 'B') && isFlashcardMode && isAnswerRevealed) {
        e.preventDefault();
        handleNeedReview();
      } else if ((e.key === 's' || e.key === 'S') && isFlashcardMode && isAnswerRevealed) {
        e.preventDefault();
        handleMastered();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsNotesOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    prevQuestion, 
    nextQuestion, 
    router, 
    track.slug, 
    isFlashcardMode, 
    isAnswerRevealed, 
    isBookmarked, 
    isCurrentStudied,
    question.number
  ]);

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {}
    }
  };

  const progressPercent = Math.round((question.number / totalInTrack) * 100);
  const planBadges = getQuestionStudyPlanBadges(track.slug, question.number);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Section & Navigation Bar */}
      <div className="mb-6 space-y-3 sm:space-y-4">
        {/* Breadcrumb & Section Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/sections/${track.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-purple-400 text-foreground transition-all group font-semibold text-xs shadow-sm dark:shadow-none"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Section Overview</span>
            </Link>
            <span className="text-border hidden sm:inline">•</span>
            <span className="hidden sm:inline px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 font-bold text-xs">
              Section {track.sectionNumber}: {track.shortTitle}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 justify-start sm:justify-end">
            {/* Studied Toggle */}
            <button
              type="button"
              onClick={() => toggleStudied(question.number)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm dark:shadow-none ${
                isCurrentStudied
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
              }`}
            >
              <CheckCircle2 className={`h-3.5 w-3.5 ${isCurrentStudied ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
              <span className="hidden sm:inline">{isCurrentStudied ? 'Studied' : 'Mark as Studied'}</span>
              <span className="sm:hidden">{isCurrentStudied ? 'Studied' : 'Study'}</span>
            </button>

            {/* Bookmark / Save for Review Toggle */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm dark:shadow-none ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30 shadow-amber-500/10'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-amber-400/50'
              }`}
              title={isBookmarked ? 'Remove from review cheat sheet' : 'Save question to review cheat sheet'}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              <span className="sm:hidden">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            {/* Self-Test / Flashcard Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleFlashcardMode}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm dark:shadow-none cursor-pointer ${
                isFlashcardMode
                  ? 'bg-purple-600 text-white border-purple-500 shadow-purple-600/25 ring-2 ring-purple-500/20'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
              }`}
              title="Toggle Self-Test Flashcard Mode (Press F)"
            >
              <BrainCircuit className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isFlashcardMode ? 'Self-Test ON' : 'Self-Test'}</span>
              <span className="sm:hidden">{isFlashcardMode ? 'Test ON' : 'Self-Test'}</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1 rounded bg-black/15 dark:bg-white/10 ml-0.5">
                F
              </kbd>
            </button>

            {/* Personal Notes Toggle */}
            <button
              type="button"
              onClick={() => setIsNotesOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm dark:shadow-none cursor-pointer ${
                isNotesOpen || hasNote
                  ? 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
              }`}
              title="Toggle Personal Notes (Press N)"
            >
              <PencilLine className="h-3.5 w-3.5" />
              <span>{hasNote ? 'Notes (1)' : 'Notes'}</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1 rounded bg-black/15 dark:bg-white/10 ml-0.5">
                N
              </kbd>
            </button>

            {/* Question Grid Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsGridOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-card border border-border hover:border-purple-400 text-foreground transition-all text-xs font-semibold shadow-sm dark:shadow-none"
              title="Jump to question (Press G)"
            >
              <Grid className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Jump</span>
            </button>

            {/* Share / Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg bg-card border border-border hover:border-purple-400 text-muted-foreground hover:text-foreground transition-all shadow-sm dark:shadow-none"
              title="Copy Direct Question Link"
              aria-label="Copy Direct Question Link"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar & Counter Header */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-600 text-white shadow-md shadow-purple-600/30 shrink-0">
              Q{question.number}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground">
                Question {question.number} of {totalInTrack}
              </p>
              <p className="text-[11px] text-muted-foreground truncate max-w-xs sm:max-w-md font-medium">
                {question.part}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-48">
            <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold w-9 text-right shrink-0">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Sprint Study Timeline Active Module Banner */}
      {sprintNav && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-500/10 border border-amber-500/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  {sprintNav.plan.title}
                </span>
                <span className="text-muted-foreground text-xs hidden sm:inline">•</span>
                <span className="text-xs font-bold text-foreground">
                  Day {sprintNav.dayNumber}: {sprintNav.day.title}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium truncate">
                Question {sprintNav.dayIndex} of {sprintNav.dayTotal} today ({sprintNav.overallIndex}/{sprintNav.overallTotal} in sprint) • Focus: {sprintNav.day.focus}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            <span className="text-xs font-mono font-bold text-muted-foreground hidden lg:inline">
              Day progress: {sprintNav.dayStudiedCount}/{sprintNav.dayTotal}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedSprintPlan(sprintNav.plan);
                setSprintModalDay(sprintNav.dayNumber);
                setIsSprintModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-card border border-amber-500/30 hover:border-amber-500 text-amber-700 dark:text-amber-400 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Day {sprintNav.dayNumber} Schedule
            </button>
            {sprintPlanId && (
              <Link
                href={`/sections/${track.slug}/${question.number}`}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
                title="Exit sprint mode and browse track sequentially"
              >
                Exit Sprint
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Single Question & Answer Card */}
      <article className="p-5 sm:p-8 md:p-10 rounded-2xl bg-card border border-border shadow-sm dark:shadow-xl mb-8 animate-in fade-in duration-200">
        {/* Question Header */}
        <div className="pb-5 sm:pb-6 mb-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">
              {track.shortTitle}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground font-semibold">{question.part}</span>

            {/* Curated Study Plan Badge */}
            {planBadges.map((b) => (
              <button
                key={b.planId}
                type="button"
                onClick={() => {
                  const plan = STUDY_PLANS.find((p) => p.id === b.planId) || null;
                  setSelectedSprintPlan(plan);
                  setSprintModalDay(b.dayNumber);
                  setIsSprintModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/25 transition-colors cursor-pointer"
                title={`${b.planTitle} • Day ${b.dayNumber} • Click to open sprint schedule`}
              >
                <Zap className="w-3 h-3 text-amber-500 fill-current" />
                <span>
                  {b.planId === '7-day-sprint' ? '7-Day Sprint' : '30-Day Master'}: Day {b.dayNumber} ({b.importance.replace('_', ' ')})
                </span>
              </button>
            ))}
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight leading-snug break-words [overflow-wrap:anywhere]">
            {question.title}
          </h1>
        </div>

        {/* Answer Content with Syntax-Highlighted Markdown & Self-Test Blur */}
        {isFlashcardMode && !isAnswerRevealed ? (
          <div className="relative mt-4">
            {/* Blurred answer preview */}
            <div className="filter blur-md opacity-20 select-none pointer-events-none max-h-[360px] overflow-hidden" aria-hidden="true">
              <div className="markdown-body">
                {(() => {
                  const parsed = parseQuestionContent(question.content);
                  if (parsed.isMultiLang) {
                    return (
                      <>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {parsed.explanation}
                        </ReactMarkdown>
                        <MultiLangCodeTabs blocks={parsed.blocks} />
                      </>
                    );
                  }
                  return (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {question.content}
                    </ReactMarkdown>
                  );
                })()}
              </div>
            </div>

            {/* Frosted Glass Active Recall Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-card/80 backdrop-blur-md rounded-2xl border border-purple-500/30 shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3.5 shadow-inner">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground mb-1.5">
                Self-Test Mode Active
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
                Formulate your answer or speak your technical explanation out loud as if you are in a real interview loop.
              </p>

              <button
                type="button"
                onClick={() => setIsAnswerRevealed(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Reveal Answer</span>
                <kbd className="text-[11px] font-mono bg-purple-800/80 px-2 py-0.5 rounded text-purple-200 ml-1">
                  Space
                </kbd>
              </button>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-4 font-mono">
                <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">Space</kbd> to reveal</span>
                <span>•</span>
                <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">F</kbd> to exit</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {isFlashcardMode && isAnswerRevealed && (
              <div className="flex items-center justify-between p-3 mb-6 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-800 dark:text-purple-300">
                <span className="flex items-center gap-2 font-medium">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span>Answer Revealed — Rate your understanding below</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAnswerRevealed(false)}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
                >
                  Hide again (Space)
                </button>
              </div>
            )}

            <div className="markdown-body">
              {(() => {
                const parsed = parseQuestionContent(question.content);
                if (parsed.isMultiLang) {
                  return (
                    <>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                        components={{
                          img: renderMarkdownImage,
                          table({ children }) {
                            return (
                              <div className="table-wrapper">
                                <table>{children}</table>
                              </div>
                            );
                          },
                        }}
                      >
                        {parsed.explanation}
                      </ReactMarkdown>

                      {/* Multi-Language Interactive Code IDE */}
                      <div className="mt-8 pt-4 border-t border-border/60">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground tracking-wide">Multi-Language Solutions</span>
                            <span className="hidden sm:inline-flex text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/20">
                              Python 3 • JavaScript • TypeScript • Java • C++
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground font-medium">Switch tabs or choose All</span>
                        </div>
                        <MultiLangCodeTabs blocks={parsed.blocks} />
                      </div>
                    </>
                  );
                }

                return (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                    components={{
                      pre({ children }) {
                        return <>{children}</>;
                      },
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;

                        if (isInline) {
                          return (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }

                        const extractRawText = (node: any): string => {
                          if (typeof node === 'string') return node;
                          if (Array.isArray(node)) return node.map(extractRawText).join('');
                          if (node?.props?.children) return extractRawText(node.props.children);
                          return '';
                        };

                        const rawCode = extractRawText(children).replace(/\n$/, '');
                        const lang = match ? match[1] : '';

                        if (lang.toLowerCase() === 'mermaid') {
                          return <MermaidBlock chart={rawCode} />;
                        }

                        return (
                          <CodeBlock language={lang} codeString={rawCode}>
                            {children}
                          </CodeBlock>
                        );
                      },
                      img: renderMarkdownImage,
                      table({ children }) {
                        return (
                          <div className="table-wrapper">
                            <table>{children}</table>
                          </div>
                        );
                      },
                    }}
                  >
                    {question.content}
                  </ReactMarkdown>
                );
              })()}
            </div>

            {/* Active Recall Self-Assessment Bar (only shown in Flashcard mode when revealed) */}
            {isFlashcardMode && isAnswerRevealed && (
              <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-muted/50 to-card border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>How confident did you feel answering this?</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Self-assessing updates your progress and bookmarks tricky questions for revision.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleNeedReview}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all active:scale-95 cursor-pointer"
                    title="Bookmark this question and advance to next"
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                    <span>Need Review</span>
                    <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20">B</kbd>
                  </button>

                  <button
                    type="button"
                    onClick={handleMastered}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer"
                    title="Mark question studied and advance to next"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mastered</span>
                    <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-800">S</kbd>
                    {nextQuestion && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </article>

      {/* Personal Study Notes Drawer */}
      <QuestionNotesDrawer
        trackSlug={track.slug}
        trackTitle={track.shortTitle}
        questionNumber={question.number}
        questionTitle={question.title}
        isOpen={isNotesOpen}
        onToggle={() => setIsNotesOpen((prev) => !prev)}
      />

      {/* Sprint Study Timeline Next/Prev Actions (when part of a sprint plan) */}
      {sprintNav && (
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                {sprintNav.isLastInDay 
                  ? `🎉 Day ${sprintNav.dayNumber} Complete! (${sprintNav.dayTotal}/${sprintNav.dayTotal} Questions)`
                  : `${sprintNav.plan.title} • Day ${sprintNav.dayNumber}`}
              </span>
              <p className="text-xs sm:text-sm font-bold text-foreground mt-0.5 truncate">
                {sprintNav.nextQuestion 
                  ? (sprintNav.isLastInDay 
                      ? `Up Next: Day ${sprintNav.nextQuestion.day} — ${sprintNav.nextQuestion.title}` 
                      : `Next Sprint Question: ${sprintNav.nextQuestion.title}`)
                  : '🏆 Congratulations! You have completed all questions in this sprint plan!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {sprintNav.prevQuestion && (
              <Link
                href={`/sections/${sprintNav.prevQuestion.trackSlug}/${sprintNav.prevQuestion.questionNumber}?sprint=${sprintNav.plan.id}`}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-card border border-border hover:bg-card-hover text-muted-foreground hover:text-foreground transition-all shrink-0"
              >
                ← Prev in Sprint
              </Link>
            )}

            {sprintNav.nextQuestion ? (
              <Link
                href={`/sections/${sprintNav.nextQuestion.trackSlug}/${sprintNav.nextQuestion.questionNumber}?sprint=${sprintNav.plan.id}`}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/25 transition-all shrink-0 active:scale-95 cursor-pointer"
              >
                <span>{sprintNav.isLastInDay ? `Start Day ${sprintNav.nextQuestion.day} →` : 'Next Sprint Question →'}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedSprintPlan(sprintNav.plan);
                  setSprintModalDay(sprintNav.dayNumber);
                  setIsSprintModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm"
              >
                View Full Completion Stats
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Previous & Next Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
        {prevQuestion ? (
          <Link
            href={`/sections/${track.slug}/${prevQuestion.number}`}
            className="p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-purple-400 hover:bg-card-hover transition-all group flex items-start gap-3.5 shadow-sm dark:shadow-none"
          >
            <div className="p-2 rounded-lg bg-muted border border-border group-hover:border-purple-300 dark:group-hover:border-purple-500/30 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
              <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <div className="overflow-hidden min-w-0">
              <span className="text-[11px] font-bold text-muted-foreground block mb-0.5">
                Previous Question ({prevQuestion.number})
              </span>
              <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                {prevQuestion.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground font-medium">
            First question of Section {track.sectionNumber}
          </div>
        )}

        {nextQuestion ? (
          <Link
            href={`/sections/${track.slug}/${nextQuestion.number}`}
            className="p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-purple-400 hover:bg-card-hover transition-all group flex items-start justify-between gap-3.5 text-right shadow-sm dark:shadow-none"
          >
            <div className="overflow-hidden flex-1 min-w-0">
              <span className="text-[11px] font-bold text-muted-foreground block mb-0.5">
                Next Question ({nextQuestion.number})
              </span>
              <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                {nextQuestion.title}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-muted border border-border group-hover:border-purple-300 dark:group-hover:border-purple-500/30 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
              <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-xs text-emerald-700 dark:text-emerald-400 font-bold">
            🎉 Section Completed!
          </div>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="mt-8 text-center text-xs text-muted-foreground hidden sm:block font-medium">
        <span>Tip: Use </span>
        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-mono text-[11px]">←</kbd>
        <span> and </span>
        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-mono text-[11px]">→</kbd>
        <span> arrow keys to navigate questions. Press </span>
        <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-mono text-[11px]">G</kbd>
        <span> to jump to any question.</span>
      </div>

      {/* Question Palette Modal (Number Grid 1 to N) */}
      {isGridOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsGridOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-foreground flex items-center gap-2">
                  <Grid className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Section {track.sectionNumber}: Question Jump Palette</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select any question (1 - {totalInTrack}) to jump immediately
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGridOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-hover"
                aria-label="Close jump palette"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {allQuestions.map((q) => {
                  const isCurrent = q.number === question.number;
                  const isStudied = !!studiedMap[q.number];
                  const isQBookmarked = bookmarkedSet.has(q.number);

                  return (
                    <button
                      key={q.number}
                      type="button"
                      onClick={() => {
                        setIsGridOpen(false);
                        router.push(`/sections/${track.slug}/${q.number}`);
                      }}
                      className={`h-11 rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                        isCurrent
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 ring-2 ring-purple-400'
                          : isStudied
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/25'
                          : 'bg-muted hover:bg-card-hover border border-border text-foreground hover:border-purple-400/50'
                      }`}
                      title={`Q${q.number}: ${q.title}`}
                    >
                      <span>{q.number}</span>
                      {isQBookmarked && (
                        <span className="absolute top-1 right-1 text-[9px] text-amber-500 font-black leading-none" title="Bookmarked">
                          ★
                        </span>
                      )}
                      {isStudied && !isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-muted-foreground font-medium flex-wrap gap-2">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Current
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Studied
                </span>
                <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                  <span>★</span> Bookmarked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-border" /> Unread
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsGridOpen(false)}
                className="px-3 py-1 rounded bg-muted border border-border text-foreground hover:bg-card-hover text-xs font-semibold"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sprint Study Plan Modal */}
      <StudyPlanModal
        plan={selectedSprintPlan}
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        initialDayNumber={sprintModalDay}
      />
    </div>
  );
}
