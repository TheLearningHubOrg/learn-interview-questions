'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  Copy, 
  Check, 
  Search, 
  X, 
  Flame, 
  Bookmark, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  Zap, 
  Code2,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { QuestionIndexItem, TrackMeta } from '@/lib/tracks-meta';
import { getAllBookmarks, BOOKMARKS_UPDATE_EVENT } from '@/lib/study-progress';
import { TechStackSelector } from '@/components/TechStackSelector';
import { getSelectedTechSlugs, setSelectedTechSlugs, TECH_STACK_UPDATE_EVENT, isQuestionInSelectedTech } from '@/lib/tech-stack';

interface CheatsheetClientProps {
  initialItems: QuestionIndexItem[];
  tracks: TrackMeta[];
}

type StudyFocus = 'all' | 'most-asked' | 'bookmarked';

export function CheatsheetClient({ initialItems, tracks }: CheatsheetClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [studyFocus, setStudyFocus] = useState<StudyFocus>('most-asked');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'junior' | 'mid' | 'senior'>('all');
  const [viewMode, setViewMode] = useState<'compact' | 'grid'>('compact');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // Selected technologies from localStorage
  const [selectedTechSlugs, setSelectedTechSlugsState] = useState<string[]>([]);

  // Bookmarks from localStorage
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(new Set());

  // Native print handler (keeps user on-screen theme intact, @media print handles paper styling)
  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  useEffect(() => {
    const refreshBookmarks = () => {
      const allB = getAllBookmarks();
      const bSet = new Set(allB.map((b) => `${b.trackSlug}:${b.questionNumber}`));
      setBookmarkedSet(bSet);
    };

    const refreshTechStack = () => {
      setSelectedTechSlugsState(getSelectedTechSlugs());
    };

    refreshBookmarks();
    refreshTechStack();

    window.addEventListener(BOOKMARKS_UPDATE_EVENT, refreshBookmarks);
    window.addEventListener(TECH_STACK_UPDATE_EVENT, refreshTechStack);
    window.addEventListener('storage', refreshBookmarks);
    window.addEventListener('storage', refreshTechStack);

    return () => {
      window.removeEventListener(BOOKMARKS_UPDATE_EVENT, refreshBookmarks);
      window.removeEventListener(TECH_STACK_UPDATE_EVENT, refreshTechStack);
      window.removeEventListener('storage', refreshBookmarks);
      window.removeEventListener('storage', refreshTechStack);
    };
  }, []);

  const handleTechStackChange = (slugs: string[]) => {
    setSelectedTechSlugsState(slugs);
    setSelectedTechSlugs(slugs);
  };

  const trackMap = useMemo(() => {
    const map = new Map<string, TrackMeta>();
    for (const t of tracks) {
      map.set(t.slug, t);
    }
    return map;
  }, [tracks]);

  // Filter pipeline
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const key = `${item.trackSlug}:${item.questionNumber}`;

      // Personalized Tech Stack Filter (Multi-select, supporting granular tech separation)
      if (selectedTechSlugs.length > 0 && !isQuestionInSelectedTech(item, selectedTechSlugs)) {
        return false;
      }

      // Study Focus Mode
      if (studyFocus === 'most-asked' && !item.isMostAsked) {
        return false;
      }
      if (studyFocus === 'bookmarked' && !bookmarkedSet.has(key)) {
        return false;
      }

      // Seniority Level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) {
        return false;
      }

      // Live Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.summary && item.summary.toLowerCase().includes(q)) ||
        item.part.toLowerCase().includes(q) ||
        item.trackShortTitle.toLowerCase().includes(q) ||
        item.questionNumber.toString() === q ||
        item.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [
    initialItems,
    selectedTechSlugs,
    studyFocus,
    selectedLevel,
    bookmarkedSet,
    searchQuery
  ]);

  // Group filtered items by Track
  const groupedByTrack = useMemo(() => {
    const map = new Map<string, QuestionIndexItem[]>();
    for (const item of filteredItems) {
      if (!map.has(item.trackSlug)) {
        map.set(item.trackSlug, []);
      }
      map.get(item.trackSlug)!.push(item);
    }
    return Array.from(map.entries());
  }, [filteredItems]);

  // Handle Copy as Markdown
  const handleCopyMarkdown = async () => {
    let md = `# InterviewHub PRO — Technical Revision Cheatsheet\n\n`;
    md += `*Generated for rapid pre-interview recall (${filteredItems.length} questions)*\n\n`;

    for (const [slug, items] of groupedByTrack) {
      const track = trackMap.get(slug);
      md += `## Section ${track?.sectionNumber || ''}: ${track?.shortTitle || slug} (${items.length} Questions)\n\n`;
      for (const item of items) {
        md += `### Q${item.questionNumber}. ${item.title}\n`;
        if (item.summary) {
          md += `> 💡 **Takeaway:** ${item.summary}\n`;
        }
        md += `\n`;
      }
      md += `---\n\n`;
    }

    try {
      await navigator.clipboard.writeText(md);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2500);
    } catch {}
  };

  const isFiltering =
    studyFocus !== 'all' ||
    selectedLevel !== 'all' ||
    selectedTechSlugs.length > 0 ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setStudyFocus('all');
    setSelectedLevel('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 print:p-0 print:m-0 print:max-w-none">
      {/* Printable Watermark Header (Only visible in Print / PDF mode) */}
      <div className="hidden print:block mb-3 pb-2 border-b-2 border-slate-900 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-black">
              InterviewHub PRO — Rapid Technical Revision Cheatsheet
            </h1>
            <p className="text-[10px] text-slate-700 mt-0.5">
              {selectedTechSlugs.length > 0
                ? `Personalized Stack (${selectedTechSlugs.map(s => trackMap.get(s)?.shortTitle || s).join(', ')}) • https://learn-interview-questions.vercel.app`
                : 'https://learn-interview-questions.vercel.app/cheatsheet • 1,864+ Technical Interview Bank'}
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-700 font-mono">
            <strong>{filteredItems.length} Questions</strong> • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Top Banner (Hidden in Print) */}
      <div className="mb-6 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-purple-900/20 via-indigo-900/15 to-transparent border border-purple-500/20 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>30-Min Rapid Recall</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                {filteredItems.length} Questions
              </span>
              {selectedTechSlugs.length > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                  {selectedTechSlugs.length} Techs Selected
                </span>
              )}
              {bookmarkedSet.size > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  {bookmarkedSet.size} Saved
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              Last-Minute Revision Cheatsheet
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed font-medium">
              Crisp 1-line takeaways to skim through 50–100 core concepts in minutes. Ideal for your pre-interview commute or quick revision.
            </p>
            <div className="mt-2.5 flex items-center gap-2 text-[11px] text-purple-700 dark:text-purple-300 font-medium flex-wrap">
              <span>💡 Print Estimate:</span>
              <span className="font-bold underline">{filteredItems.length} questions will print on ~{Math.max(1, Math.ceil(filteredItems.length / 14))} pages</span>
              <span>•</span>
              <span className="text-muted-foreground">Select your Tech Stack below or 'Most Asked' for a focused 3–6 page printable cheatsheet</span>
            </div>
          </div>

          {/* Action Buttons: Print PDF & Copy Markdown */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap w-full lg:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 transition-all active:scale-95 cursor-pointer flex-1 sm:flex-none justify-center min-h-[38px] touch-manipulation"
              title="Print clean paper cheatsheet or save as PDF"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all active:scale-95 cursor-pointer flex-1 sm:flex-none justify-center min-h-[38px] touch-manipulation ${
                copiedMarkdown
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800/70 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 text-foreground hover:border-purple-400'
              }`}
              title="Copy current questions and 1-line takeaways as Markdown for Notion or Obsidian"
            >
              {copiedMarkdown ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Copied Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Personalized Interview Tech Stack Selector (Hidden in Print) */}
      <div className="mb-6 print:hidden">
        <TechStackSelector
          tracks={tracks}
          selectedSlugs={selectedTechSlugs}
          onChange={handleTechStackChange}
          isCollapsible={true}
        />
      </div>

      {/* Streamlined Study Focus & Filter Toolbar (Hidden in Print) */}
      <div className="mb-6 p-3 sm:p-4 rounded-xl bg-card border border-border shadow-xs print:hidden space-y-2.5 sm:space-y-3">
        {/* Row 1: Instant Search & Granular Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
          {/* Live Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cheatsheet topics (e.g. closure, indexing, signals, acid, jwt)..."
              className="w-full pl-10 pr-9 py-2 rounded-lg bg-background border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto shrink-0">
            {/* Seniority Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="flex-1 sm:flex-none px-2.5 sm:px-3 py-2 rounded-lg bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-purple-500 cursor-pointer min-h-[36px]"
            >
              <option value="all">All Seniority Levels</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior / Staff</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-background shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer min-h-[32px] flex items-center ${
                  viewMode === 'compact'
                    ? 'bg-purple-600 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer min-h-[32px] flex items-center ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Study Focus Tabs (All / Most Asked / Bookmarks) & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-border/50 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none touch-pan-x -mx-1 px-1 w-full sm:w-auto">
            <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1 shrink-0">
              Study Focus:
            </span>

            <button
              type="button"
              onClick={() => setStudyFocus('most-asked')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                studyFocus === 'most-asked'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs ring-1 ring-amber-500/30'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Most Asked</span>
            </button>

            <button
              type="button"
              onClick={() => setStudyFocus('all')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                studyFocus === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>All Stack Qs</span>
            </button>

            <button
              type="button"
              onClick={() => setStudyFocus('bookmarked')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                studyFocus === 'bookmarked'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Saved ({bookmarkedSet.size})</span>
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-muted-foreground w-full sm:w-auto pt-1 sm:pt-0 shrink-0">
            <span>
              Showing <strong className="text-foreground">{filteredItems.length}</strong> cheatsheet entries
            </span>
            {isFiltering && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cheatsheet Listings Grouped By Track */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-card border border-border text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40 text-purple-500" />
          <h3 className="text-base font-bold text-foreground mb-1">No Questions Match Your Cheatsheet Filter</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed mb-4 text-muted-foreground">
            Try adjusting your search query, selecting another preset, or resetting filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10 print:space-y-4">
          {groupedByTrack.map(([trackSlug, items]) => {
            const track = trackMap.get(trackSlug);

            return (
              <section key={trackSlug} className="space-y-3.5 print:space-y-2">
                {/* Track Group Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-border print:pb-1 cheatsheet-section-header">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${track?.badgeColor || 'bg-muted text-muted-foreground'}`}>
                      Section {track?.sectionNumber}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                      {track?.title || track?.shortTitle}
                    </h2>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono font-bold shrink-0">
                    {items.length} {items.length === 1 ? 'Q' : 'Qs'}
                  </span>
                </div>

                {/* Questions Listing */}
                <div className={`${viewMode === 'compact' ? 'space-y-2.5' : 'grid grid-cols-1 md:grid-cols-2 gap-3'} cheatsheet-print-grid`}>
                  {items.map((item) => {
                    const key = `${item.trackSlug}:${item.questionNumber}`;
                    const isBookmarked = bookmarkedSet.has(key);

                    return (
                      <div
                        key={key}
                        className={`p-3.5 sm:p-4 rounded-xl bg-card border ${
                          isBookmarked
                            ? 'border-amber-300 dark:border-amber-500/40 shadow-xs'
                            : 'border-border'
                        } hover:border-purple-400/80 transition-all group cheatsheet-item print:border-slate-300 print:p-2 print:bg-white print:text-black print-page-break-avoid`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            {/* Question Number Badge */}
                            <Link
                              href={`/sections/${item.trackSlug}/${item.questionNumber}`}
                              className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-muted text-foreground border border-border group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-colors shrink-0 mt-0.5 print:bg-slate-100 print:text-black print:border-slate-300"
                              title="Open full question and deep-dive answer"
                            >
                              Q{item.questionNumber}
                            </Link>

                            <div className="min-w-0 flex-1">
                              {/* Metadata Badges */}
                              <div className="flex items-center gap-1.5 flex-wrap mb-1 text-[10px] print:hidden">
                                {item.isMostAsked && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                                    <Flame className="w-2.5 h-2.5 text-amber-500 fill-current" />
                                    <span>Most Asked</span>
                                  </span>
                                )}

                                {item.level && (
                                  <span
                                    className={`inline-block px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                                      item.level === 'junior'
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                        : item.level === 'mid'
                                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                                        : 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20'
                                    }`}
                                  >
                                    {item.level}
                                  </span>
                                )}

                                {item.hasCode && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded font-medium bg-muted text-muted-foreground border border-border">
                                    <Code2 className="w-2.5 h-2.5" />
                                    <span>Code</span>
                                  </span>
                                )}

                                {isBookmarked && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                                    <Bookmark className="w-2.5 h-2.5 fill-current" />
                                    <span>Saved</span>
                                  </span>
                                )}
                              </div>

                              {/* Question Title */}
                              <Link
                                href={`/sections/${item.trackSlug}/${item.questionNumber}`}
                                className="text-xs sm:text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug block cheatsheet-title print:text-black print:text-[10pt]"
                              >
                                {item.title}
                              </Link>

                              {/* 1-Line Explanation Box */}
                              {item.summary && (
                                <div className="mt-2 p-2.5 rounded-lg bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 cheatsheet-summary-box print:bg-slate-50 print:border-slate-200 print:mt-1 print:p-1.5">
                                  <div className="flex items-start gap-1.5">
                                    <span className="text-purple-600 dark:text-purple-400 font-bold shrink-0 text-xs print:text-slate-700">
                                      💡
                                    </span>
                                    <p className="text-xs font-medium text-foreground/90 leading-relaxed cheatsheet-summary-text print:text-slate-900 print:text-[9pt] print:leading-normal">
                                      {item.summary}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Arrow Link (Hidden in Print) */}
                          <Link
                            href={`/sections/${item.trackSlug}/${item.questionNumber}`}
                            className="text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 shrink-0 mt-1 print:hidden"
                            title="View full answer"
                          >
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Floating Quick-Print Action Pill (Bottom Right, Hidden in Print) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 transition-all active:scale-95 cursor-pointer hover:shadow-2xl"
          title="Print or Export PDF"
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF</span>
        </button>
      </div>
    </div>
  );
}

