'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  X, 
  ArrowRight, 
  Flame, 
  Code2, 
  Filter, 
  CheckCircle2, 
  Bookmark, 
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  ArrowUpDown
} from 'lucide-react';
import { QuestionIndexItem, TrackMeta } from '@/lib/tracks-meta';
import { 
  getAllBookmarks, 
  BOOKMARKS_UPDATE_EVENT,
  STUDY_PROGRESS_UPDATE_EVENT 
} from '@/lib/study-progress';
import { TechStackSelector } from '@/components/TechStackSelector';
import { getSelectedTechSlugs, setSelectedTechSlugs, TECH_STACK_UPDATE_EVENT, isQuestionInSelectedTech } from '@/lib/tech-stack';

interface QuestionsDirectoryClientProps {
  initialItems: QuestionIndexItem[];
  tracks: TrackMeta[];
}

export function QuestionsDirectoryClient({ initialItems, tracks }: QuestionsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'junior' | 'mid' | 'senior'>('all');
  const [mostAskedOnly, setMostAskedOnly] = useState<boolean>(false);
  const [hasCodeOnly, setHasCodeOnly] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'studied' | 'bookmarked'>('all');
  const [pageSize, setPageSize] = useState<number>(40);

  // Selected technologies from tech stack filter
  const [selectedTechSlugs, setSelectedTechSlugsState] = useState<string[]>([]);

  // Local state for bookmarks and studied questions
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(new Set());
  const [studiedSet, setStudiedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refreshState = () => {
      // Load bookmarks
      const allB = getAllBookmarks();
      const bSet = new Set(allB.map((b) => `${b.trackSlug}:${b.questionNumber}`));
      setBookmarkedSet(bSet);

      // Load tech stack
      setSelectedTechSlugsState(getSelectedTechSlugs());

      // Load studied items from localStorage
      const sSet = new Set<string>();
      for (const t of tracks) {
        try {
          const raw = localStorage.getItem(`interviewhub_studied_${t.slug}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            Object.entries(parsed).forEach(([qNum, isDone]) => {
              if (isDone) sSet.add(`${t.slug}:${qNum}`);
            });
          }
        } catch {}
      }
      setStudiedSet(sSet);
    };

    refreshState();
    window.addEventListener(BOOKMARKS_UPDATE_EVENT, refreshState);
    window.addEventListener(STUDY_PROGRESS_UPDATE_EVENT, refreshState);
    window.addEventListener(TECH_STACK_UPDATE_EVENT, refreshState);
    window.addEventListener('storage', refreshState);

    return () => {
      window.removeEventListener(BOOKMARKS_UPDATE_EVENT, refreshState);
      window.removeEventListener(STUDY_PROGRESS_UPDATE_EVENT, refreshState);
      window.removeEventListener(TECH_STACK_UPDATE_EVENT, refreshState);
      window.removeEventListener('storage', refreshState);
    };
  }, [tracks]);

  const handleTechStackChange = (slugs: string[]) => {
    setSelectedTechSlugsState(slugs);
    setSelectedTechSlugs(slugs);
  };

  // Track map for fast metadata lookup
  const trackMap = useMemo(() => {
    const map = new Map<string, TrackMeta>();
    for (const t of tracks) {
      map.set(t.slug, t);
    }
    return map;
  }, [tracks]);

  // Dynamic filter pipeline
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // 0. Personalized Tech Stack Filter (Multi-select, supporting granular tech separation)
      if (selectedTechSlugs.length > 0 && !isQuestionInSelectedTech(item, selectedTechSlugs)) {
        return false;
      }

      // 1. Level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) {
        return false;
      }

      // 2. Most asked filter
      if (mostAskedOnly && !item.isMostAsked) {
        return false;
      }

      // 3. Has code filter
      if (hasCodeOnly && !item.hasCode) {
        return false;
      }

      // 4. Status filter
      const key = `${item.trackSlug}:${item.questionNumber}`;
      if (statusFilter === 'studied' && !studiedSet.has(key)) {
        return false;
      }
      if (statusFilter === 'bookmarked' && !bookmarkedSet.has(key)) {
        return false;
      }

      // 5. Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.summary && item.summary.toLowerCase().includes(q)) ||
        item.part.toLowerCase().includes(q) ||
        item.trackShortTitle.toLowerCase().includes(q) ||
        item.questionNumber.toString() === q
      );
    });
  }, [
    initialItems, 
    selectedTechSlugs,
    selectedLevel, 
    mostAskedOnly, 
    hasCodeOnly, 
    statusFilter, 
    searchQuery, 
    studiedSet, 
    bookmarkedSet
  ]);

  // Reset pagination when any filter changes
  useEffect(() => {
    setPageSize(40);
  }, [selectedTechSlugs, selectedLevel, mostAskedOnly, hasCodeOnly, statusFilter, searchQuery]);

  const pagedItems = useMemo(() => {
    return filteredItems.slice(0, pageSize);
  }, [filteredItems, pageSize]);

  const isFiltering = 
    selectedTechSlugs.length > 0 ||
    selectedLevel !== 'all' || 
    mostAskedOnly || 
    hasCodeOnly || 
    statusFilter !== 'all' || 
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    handleTechStackChange([]);
    setSelectedLevel('all');
    setMostAskedOnly(false);
    setHasCodeOnly(false);
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-medium">
        <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        <span className="text-foreground font-bold">
          All Questions Explorer
        </span>
      </div>

      {/* Header Banner Card */}
      <div className="p-6 sm:p-10 rounded-2xl bg-card border border-border mb-8 shadow-sm dark:shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">
              Master Question Hub
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground border border-border">
              {initialItems.length} Master Questions
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground border border-border">
              {tracks.length} Tracks
            </span>
            {selectedTechSlugs.length > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                {selectedTechSlugs.length} Techs Selected ({filteredItems.length} Qs)
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight mb-3">
            Explore All {initialItems.length || '3,600'}+ Interview Questions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
            Filter, search, and practice across the entire engineering curriculum. Filter by seniority level, high-frequency interview patterns, runnable code solutions, and individual technology tracks.
          </p>
        </div>
      </div>

      {/* Interactive Personalized Interview Tech Stack Selector */}
      <TechStackSelector
        tracks={tracks}
        selectedSlugs={selectedTechSlugs}
        onChange={handleTechStackChange}
        isCollapsible={true}
        className="mb-8"
      />

      {/* Multi-Filter Control Console */}
      <div className="p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-card border border-border mb-8 shadow-xs space-y-3 sm:space-y-4">
        {/* Row 1: Search Bar & Primary Status Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, algorithms, concepts, or question #..."
              className="w-full pl-9 pr-8 py-2 sm:py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-purple-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs: All / Studied / Bookmarked */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none touch-pan-x -mx-1 px-1 shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[34px] touch-manipulation ${
                statusFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80'
              }`}
            >
              All ({initialItems.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('studied')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[34px] touch-manipulation ${
                statusFilter === 'studied'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Studied ({studiedSet.size})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('bookmarked')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[34px] touch-manipulation ${
                statusFilter === 'bookmarked'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Saved ({bookmarkedSet.size})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Seniority Level, Most Asked & Code Toggles */}
        <div className="pt-2.5 sm:pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none touch-pan-x -mx-1 px-1">
            {/* Most Asked Pill */}
            <button
              type="button"
              onClick={() => setMostAskedOnly((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[32px] touch-manipulation ${
                mostAskedOnly
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm ring-2 ring-amber-500/20'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-400'
              }`}
              title="Show most frequently asked questions in top tech interviews"
            >
              <Flame className={`w-3.5 h-3.5 ${mostAskedOnly ? 'text-white fill-current' : 'text-amber-500 fill-current'}`} />
              <span>Most Asked</span>
            </button>

            <span className="h-4 w-px bg-border shrink-0" />

            {/* Level Pills */}
            <button
              type="button"
              onClick={() => setSelectedLevel('all')}
              className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[32px] touch-manipulation ${
                selectedLevel === 'all'
                  ? 'bg-foreground text-background font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              All Levels
            </button>

            <button
              type="button"
              onClick={() => setSelectedLevel((prev) => prev === 'junior' ? 'all' : 'junior')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[32px] touch-manipulation ${
                selectedLevel === 'junior'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
              <span>Junior</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedLevel((prev) => prev === 'mid' ? 'all' : 'mid')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[32px] touch-manipulation ${
                selectedLevel === 'mid'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0" />
              <span>Mid-Level</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedLevel((prev) => prev === 'senior' ? 'all' : 'senior')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[32px] touch-manipulation ${
                selectedLevel === 'senior'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-muted-foreground hover:text-purple-600 hover:bg-purple-500/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block shrink-0" />
              <span>Senior / Staff</span>
            </button>

            <span className="h-4 w-px bg-border shrink-0" />

            {/* Code Toggle */}
            <button
              type="button"
              onClick={() => setHasCodeOnly((prev) => !prev)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[32px] touch-manipulation ${
                hasCodeOnly
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 shrink-0" />
              <span>Has Code</span>
            </button>
          </div>

          {/* Results Counter & Reset */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-muted-foreground font-medium w-full sm:w-auto pt-1 sm:pt-0 shrink-0">
            <span>
              Showing <strong className="text-foreground">{filteredItems.length}</strong> of {initialItems.length} questions
            </span>
            {isFiltering && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-purple-600 dark:text-purple-400 hover:underline font-bold ml-1 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Questions Listing */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-card border border-border text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40 text-purple-500" />
          <h3 className="text-base font-bold text-foreground mb-1">No Questions Match Your Filter Criteria</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed mb-4 text-muted-foreground">
            Try adjusting your search terms, changing the selected track, or resetting the level and status filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pagedItems.map((item) => {
              const key = `${item.trackSlug}:${item.questionNumber}`;
              const isStudied = studiedSet.has(key);
              const isBookmarked = bookmarkedSet.has(key);
              const track = trackMap.get(item.trackSlug);

              return (
                <Link
                  key={key}
                  href={`/sections/${item.trackSlug}/${item.questionNumber}`}
                  className={`p-4 rounded-xl bg-card border ${
                    isBookmarked
                      ? 'border-amber-300 dark:border-amber-500/40'
                      : isStudied
                      ? 'border-emerald-300 dark:border-emerald-500/30'
                      : 'border-border'
                  } hover:border-purple-400 hover:bg-card-hover transition-all flex items-start justify-between gap-3 group shadow-2xs dark:shadow-none`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Question Number Badge */}
                    <span className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isStudied
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                        : 'bg-muted text-foreground border border-border group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600'
                    }`}>
                      {item.questionNumber}
                    </span>

                    <div className="min-w-0">
                      {/* Meta Tags Row */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${track?.badgeColor || 'bg-muted text-muted-foreground'}`}>
                          {item.trackShortTitle}
                        </span>

                        {item.isMostAsked && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                            <Flame className="h-2.5 w-2.5 text-amber-500 fill-current" />
                            Most Asked
                          </span>
                        )}

                        {item.level === 'junior' && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            Junior
                          </span>
                        )}

                        {item.level === 'mid' && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                            Mid
                          </span>
                        )}

                        {item.level === 'senior' && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
                            Senior
                          </span>
                        )}

                        {item.hasCode && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground border border-border">
                            <Code2 className="h-2.5 w-2.5" />
                            Code
                          </span>
                        )}

                        {item.tags?.slice(0, 2).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSearchQuery(t);
                            }}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-card text-muted-foreground border border-border hover:border-purple-400 hover:text-foreground transition-all cursor-pointer"
                            title={`Filter questions by #${t}`}
                          >
                            <span className="text-purple-500 font-bold">#</span>
                            <span>{t}</span>
                          </button>
                        ))}

                        {isStudied && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                          </span>
                        )}

                        {isBookmarked && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold text-amber-600 dark:text-amber-400">
                            <Bookmark className="h-2.5 w-2.5 fill-current" />
                          </span>
                        )}
                      </div>

                      {/* Question Title */}
                      <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug break-words [overflow-wrap:anywhere]">
                        {item.title}
                      </p>

                      {/* 1-Line Explanation Preview */}
                      {item.summary && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                          {item.summary}
                        </p>
                      )}

                      <p className="text-[11px] text-muted-foreground/75 mt-1.5 truncate">
                        {item.part}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 shrink-0 mt-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              );
            })}
          </div>

          {/* Load More Pagination */}
          {pageSize < filteredItems.length && (
            <div className="pt-6 pb-2 text-center">
              <button
                type="button"
                onClick={() => setPageSize((prev) => prev + 40)}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-card hover:bg-card-hover border border-border hover:border-purple-400 text-foreground transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Load More Questions ({filteredItems.length - pageSize} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
