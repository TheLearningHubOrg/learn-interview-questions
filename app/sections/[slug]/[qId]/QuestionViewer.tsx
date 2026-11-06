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
  X, 
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';
import { QuestionViewData } from '@/lib/tracks-meta';
import { CodeBlock } from '@/components/CodeBlock';

interface QuestionViewerProps {
  data: QuestionViewData;
}

export function QuestionViewer({ data }: QuestionViewerProps) {
  const router = useRouter();
  const { track, question, allQuestions, prevQuestion, nextQuestion, totalInTrack } = data;

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
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  // Toggle studied status
  const toggleStudied = (num: number) => {
    const updated = { ...studiedMap, [num]: !studiedMap[num] };
    setStudiedMap(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  const isCurrentStudied = !!studiedMap[question.number];

  // Keyboard Navigation: ArrowLeft for Prev, ArrowRight for Next, G for Grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Section & Navigation Bar */}
      <div className="mb-6 space-y-3 sm:space-y-4">
        {/* Breadcrumb & Section Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/sections/${track.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-purple-500/40 text-foreground transition-all group font-semibold text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Section Overview</span>
            </Link>
            <span className="text-border hidden sm:inline">•</span>
            <span className="hidden sm:inline px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold text-xs">
              Section {track.sectionNumber}: {track.shortTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Studied Toggle */}
            <button
              type="button"
              onClick={() => toggleStudied(question.number)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isCurrentStudied
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-purple-500/30'
              }`}
            >
              <CheckCircle2 className={`h-3.5 w-3.5 ${isCurrentStudied ? 'text-emerald-400' : 'text-muted-foreground'}`} />
              <span>{isCurrentStudied ? 'Studied' : 'Mark as Studied'}</span>
            </button>

            {/* Question Grid Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsGridOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-purple-500/40 text-foreground transition-all text-xs font-medium"
              title="Jump to question (Press G)"
            >
              <Grid className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden sm:inline">Jump</span>
            </button>

            {/* Share / Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg bg-card border border-border hover:border-purple-500/40 text-muted-foreground hover:text-foreground transition-all"
              title="Copy Direct Question Link"
              aria-label="Copy Direct Question Link"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
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
              <p className="text-[11px] text-muted-foreground truncate max-w-xs sm:max-w-md">
                {question.part}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-48">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold w-9 text-right shrink-0">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Single Question & Answer Card */}
      <article className="p-5 sm:p-8 md:p-10 rounded-2xl bg-card border border-border shadow-xl mb-8 animate-in fade-in duration-200">
        {/* Question Header */}
        <div className="pb-5 sm:pb-6 mb-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {track.shortTitle}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground font-medium">{question.part}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
            {question.title}
          </h1>
        </div>

        {/* Answer Content with Syntax-Highlighted Markdown */}
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
            components={{
              pre({ children }) {
                // Pass children cleanly to avoid pre > div invalid HTML
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

                // Block code: extract raw text content for copy button
                const extractRawText = (node: any): string => {
                  if (typeof node === 'string') return node;
                  if (Array.isArray(node)) return node.map(extractRawText).join('');
                  if (node?.props?.children) return extractRawText(node.props.children);
                  return '';
                };

                const rawCode = extractRawText(children).replace(/\n$/, '');
                const lang = match ? match[1] : '';

                return (
                  <CodeBlock language={lang} codeString={rawCode}>
                    {children}
                  </CodeBlock>
                );
              },
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
        </div>
      </article>

      {/* Bottom Previous & Next Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {prevQuestion ? (
          <Link
            href={`/sections/${track.slug}/${prevQuestion.number}`}
            className="p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-purple-500/40 hover:bg-card-hover transition-all group flex items-start gap-3.5"
          >
            <div className="p-2 rounded-lg bg-muted border border-border group-hover:border-purple-500/30 text-purple-400 shrink-0 mt-0.5">
              <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <div className="overflow-hidden min-w-0">
              <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Previous Question ({prevQuestion.number})
              </span>
              <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-purple-400 transition-colors line-clamp-1">
                {prevQuestion.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
            First question of Section {track.sectionNumber}
          </div>
        )}

        {nextQuestion ? (
          <Link
            href={`/sections/${track.slug}/${nextQuestion.number}`}
            className="p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-purple-500/40 hover:bg-card-hover transition-all group flex items-start justify-between gap-3.5 text-right"
          >
            <div className="overflow-hidden flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Next Question ({nextQuestion.number})
              </span>
              <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-purple-400 transition-colors line-clamp-1">
                {nextQuestion.title}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-muted border border-border group-hover:border-purple-500/30 text-purple-400 shrink-0 mt-0.5">
              <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-xs text-emerald-400 font-semibold">
            🎉 Section Completed!
          </div>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="mt-8 text-center text-xs text-muted-foreground hidden sm:block">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsGridOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <Grid className="h-4 w-4 text-purple-400" />
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
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-muted hover:bg-card-hover border border-border text-foreground hover:border-purple-500/30'
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

            <div className="pt-3 sm:pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3 sm:gap-4">
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
    </div>
  );
}
