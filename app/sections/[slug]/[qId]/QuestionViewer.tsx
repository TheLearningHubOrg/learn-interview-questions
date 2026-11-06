'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Copy, 
  BookOpen, 
  Grid, 
  CheckCircle2, 
  X, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';
import { QuestionViewData } from '@/lib/tracks';

interface QuestionViewerProps {
  data: QuestionViewData;
}

export function QuestionViewer({ data }: QuestionViewerProps) {
  const router = useRouter();
  const { track, question, allQuestions, prevQuestion, nextQuestion, totalInTrack } = data;

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [studiedMap, setStudiedMap] = useState<Record<number, boolean>>({});

  const storageKey = `studied_${track.slug}`;

  // Load studied status from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setStudiedMap(JSON.parse(stored));
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, [storageKey]);

  // Toggle studied status
  const toggleStudied = (num: number) => {
    const updated = { ...studiedMap, [num]: !studiedMap[num] };
    setStudiedMap(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}
  };

  const isCurrentStudied = !!studiedMap[question.number];

  // Keyboard Navigation: ArrowLeft for Prev, ArrowRight for Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft' && prevQuestion) {
        e.preventDefault();
        router.push(`/sections/${track.slug}/${prevQuestion.number}`);
      } else if (e.key === 'ArrowRight' && nextQuestion) {
        e.preventDefault();
        router.push(`/sections/${track.slug}/${nextQuestion.number}`);
      } else if (e.key === 'g' || e.key === 'G') {
        setIsGridOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevQuestion, nextQuestion, router, track.slug]);

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const progressPercent = Math.round((question.number / totalInTrack) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Section & Navigation Bar */}
      <div className="mb-6 space-y-4">
        {/* Breadcrumb & Section Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Link
              href={`/sections/${track.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-purple-500/40 text-slate-300 hover:text-white transition-all group font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Section Overview</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
              Section {track.sectionNumber}: {track.shortTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Studied Toggle */}
            <button
              onClick={() => toggleStudied(question.number)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isCurrentStudied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-card border-border text-slate-400 hover:text-slate-200 hover:border-border/80'
              }`}
            >
              <CheckCircle2 className={`h-3.5 w-3.5 ${isCurrentStudied ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{isCurrentStudied ? 'Studied' : 'Mark as Studied'}</span>
            </button>

            {/* Question Grid Modal Trigger */}
            <button
              onClick={() => setIsGridOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-purple-500/40 text-slate-300 hover:text-white transition-all text-xs font-medium"
              title="Jump to question (Press G)"
            >
              <Grid className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden sm:inline">Jump</span>
            </button>

            {/* Share / Copy Link */}
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg bg-card border border-border hover:border-slate-700 text-slate-400 hover:text-white transition-all"
              title="Copy Direct Question Link"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Progress Bar & Counter Header */}
        <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-600 text-white shadow-md shadow-purple-600/30">
              Q{question.number}
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-300">
                Question {question.number} of {totalInTrack}
              </p>
              <p className="text-[11px] text-slate-400 truncate max-w-sm sm:max-w-md">
                {question.part}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-48">
            <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-purple-300 font-semibold w-9 text-right">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Single Question & Answer Card */}
      <article className="p-6 sm:p-10 rounded-2xl bg-card border border-border shadow-xl mb-8 animate-in fade-in duration-200">
        {/* Question Header */}
        <div className="pb-6 mb-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {track.shortTitle}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">{question.part}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {question.title}
          </h1>
        </div>

        {/* Answer Content */}
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={{
              h4({ children, ...props }) {
                return (
                  <h4 {...props} className="text-base font-bold text-slate-200 mt-6 mb-2">
                    {children}
                  </h4>
                );
              },
              pre({ children, ...props }) {
                return <div className="relative group my-4">{children}</div>;
              },
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                const codeString = String(children).replace(/\n$/, '');

                if (isInline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }

                const blockId = Math.random().toString(36).substring(7);

                return (
                  <div className="relative">
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-2 z-10">
                      {match && (
                        <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-background/80 border border-border">
                          {match[1]}
                        </span>
                      )}
                      <button
                        onClick={() => handleCopyCode(codeString, blockId)}
                        className="px-2 py-1 text-xs rounded-md bg-border/80 hover:bg-border text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                        title="Copy Code"
                      >
                        {copiedCodeId === blockId ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </div>
                );
              },
            }}
          >
            {question.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* Bottom Previous & Next Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevQuestion ? (
          <Link
            href={`/sections/${track.slug}/${prevQuestion.number}`}
            className="p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-purple-500/40 hover:bg-card-hover transition-all group flex items-start gap-3.5"
          >
            <div className="p-2 rounded-lg bg-background border border-border group-hover:border-purple-500/30 text-purple-400 shrink-0 mt-0.5">
              <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                Previous Question ({prevQuestion.number})
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                {prevQuestion.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-border/60 flex items-center justify-center text-xs text-slate-400">
            First question of Section {track.sectionNumber}
          </div>
        )}

        {nextQuestion ? (
          <Link
            href={`/sections/${track.slug}/${nextQuestion.number}`}
            className="p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-purple-500/40 hover:bg-card-hover transition-all group flex items-start justify-between gap-3.5 text-right"
          >
            <div className="overflow-hidden flex-1">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                Next Question ({nextQuestion.number})
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                {nextQuestion.title}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-background border border-border group-hover:border-purple-500/30 text-purple-400 shrink-0 mt-0.5">
              <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center text-xs text-emerald-400 font-medium">
            🎉 Section Completed!
          </div>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="mt-8 text-center text-xs text-slate-400">
        <span>Tip: Use </span>
        <kbd className="px-1.5 py-0.5 rounded bg-border text-slate-300 font-mono text-[11px]">←</kbd>
        <span> and </span>
        <kbd className="px-1.5 py-0.5 rounded bg-border text-slate-300 font-mono text-[11px]">→</kbd>
        <span> arrow keys to navigate questions. Press </span>
        <kbd className="px-1.5 py-0.5 rounded bg-border text-slate-300 font-mono text-[11px]">G</kbd>
        <span> to jump to any question.</span>
      </div>

      {/* Question Palette Modal (Number Grid 1 to N) */}
      {isGridOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Grid className="h-4 w-4 text-purple-400" />
                  <span>Section {track.sectionNumber}: Question Jump Palette</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select any question (1 - {totalInTrack}) to jump immediately
                </p>
              </div>
              <button
                onClick={() => setIsGridOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-card-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {allQuestions.map((q) => {
                  const isCurrent = q.number === question.number;
                  const isStudied = !!studiedMap[q.number];

                  return (
                    <button
                      key={q.number}
                      onClick={() => {
                        setIsGridOpen(false);
                        router.push(`/sections/${track.slug}/${q.number}`);
                      }}
                      className={`h-11 rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                        isCurrent
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 ring-2 ring-purple-400'
                          : isStudied
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-background hover:bg-card-hover border border-border text-slate-300 hover:text-white hover:border-purple-500/30'
                      }`}
                      title={`Q${q.number}: ${q.title}`}
                    >
                      <span>{q.number}</span>
                      {isStudied && !isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Current
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Studied
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-border" /> Unread
                </span>
              </div>
              <button
                onClick={() => setIsGridOpen(false)}
                className="px-3 py-1 rounded bg-border text-slate-300 hover:text-white text-xs"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

