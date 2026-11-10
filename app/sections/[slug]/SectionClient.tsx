'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowRight, 
  Play, 
  BookOpen, 
  ChevronRight,
  Layers,
  Sparkles,
  BookmarkCheck,
  Bookmark,
  CheckCircle2,
  X
} from 'lucide-react';
import { TrackMeta, ParsedQuestion } from '@/lib/tracks-meta';
import { getTrackLastRead, READING_UPDATE_EVENT } from '@/lib/reading-history';
import { 
  getTrackStudiedMap, 
  getAllBookmarks, 
  STUDY_PROGRESS_UPDATE_EVENT, 
  BOOKMARKS_UPDATE_EVENT 
} from '@/lib/study-progress';
import { TrackRoadmapFlowchart, RoadmapPartInfo } from '@/components/TrackRoadmapFlowchart';

interface SectionClientProps {
  track: TrackMeta;
  questions: ParsedQuestion[];
  allTracks: TrackMeta[];
}

export function SectionClient({ track, questions, allTracks }: SectionClientProps) {
  const [query, setQuery] = useState('');
  const [lastReadNum, setLastReadNum] = useState<number | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'studied' | 'bookmarked'>('all');
  const [studiedMap, setStudiedMap] = useState<Record<number, boolean>>({});
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<number>>(new Set());
  const [selectedRoadmapPart, setSelectedRoadmapPart] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      const num = getTrackLastRead(track.slug);
      setLastReadNum(num);

      const map = getTrackStudiedMap(track.slug);
      setStudiedMap(map);

      const allB = getAllBookmarks();
      const trackBookmarks = allB.filter((b) => b.trackSlug === track.slug);
      setBookmarkedSet(new Set(trackBookmarks.map((b) => b.questionNumber)));
    };

    refresh();
    window.addEventListener(READING_UPDATE_EVENT, refresh);
    window.addEventListener(STUDY_PROGRESS_UPDATE_EVENT, refresh);
    window.addEventListener(BOOKMARKS_UPDATE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);

    return () => {
      window.removeEventListener(READING_UPDATE_EVENT, refresh);
      window.removeEventListener(STUDY_PROGRESS_UPDATE_EVENT, refresh);
      window.removeEventListener(BOOKMARKS_UPDATE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [track.slug]);

  const studiedCount = useMemo(() => {
    return Object.values(studiedMap).filter(Boolean).length;
  }, [studiedMap]);

  const bookmarkedCount = bookmarkedSet.size;

  // Compute full roadmap stages from all questions
  const roadmapParts = useMemo<RoadmapPartInfo[]>(() => {
    const map = new Map<string, ParsedQuestion[]>();
    for (const q of questions) {
      if (!map.has(q.part)) {
        map.set(q.part, []);
      }
      map.get(q.part)!.push(q);
    }
    return Array.from(map.entries()).map(([partName, qList]) => ({
      partName,
      count: qList.length,
      startNum: qList[0]?.number || 1,
      endNum: qList[qList.length - 1]?.number || qList.length,
      questionNumbers: qList.map((q) => q.number),
    }));
  }, [questions]);

  // Filter questions based on selectedRoadmapPart, filterTab and query
  const displayedQuestions = useMemo(() => {
    return questions.filter((item) => {
      // Roadmap part filter
      if (selectedRoadmapPart && item.part !== selectedRoadmapPart) return false;

      // Tab filter
      if (filterTab === 'studied' && !studiedMap[item.number]) return false;
      if (filterTab === 'bookmarked' && !bookmarkedSet.has(item.number)) return false;

      // Query filter
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.part.toLowerCase().includes(q) ||
        item.number.toString() === q
      );
    });
  }, [questions, selectedRoadmapPart, filterTab, query, studiedMap, bookmarkedSet]);

  // Group displayed questions by Part
  const groupedByPart = useMemo(() => {
    const map = new Map<string, ParsedQuestion[]>();
    for (const q of displayedQuestions) {
      if (!map.has(q.part)) {
        map.set(q.part, []);
      }
      map.get(q.part)!.push(q);
    }
    return Array.from(map.entries());
  }, [displayedQuestions]);

  const isFiltering = query.trim().length > 0 || filterTab !== 'all' || selectedRoadmapPart !== null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 flex-wrap font-medium">
        <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        <Link href="/#tracks" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          Tracks
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        <span className="text-foreground font-bold">
          Section {track.sectionNumber}: {track.shortTitle}
        </span>
      </div>

      {/* Section Header Card */}
      <div className="p-6 sm:p-10 rounded-2xl bg-card border border-border mb-10 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">
                Section {track.sectionNumber} of {allTracks.length}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground border border-border">
                {track.questionCount} Questions (1 Per Page)
              </span>
              {studiedCount > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                  {studiedCount}/{track.questionCount} Studied ({Math.round((studiedCount / track.questionCount) * 100)}%)
                </span>
              )}
            </div>

            <div className="hidden sm:block text-xs text-muted-foreground font-semibold">
              Free & Open Source
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight mb-3">
            {track.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-8 font-normal">
            {track.description}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {lastReadNum && lastReadNum > 1 && (
              <Link
                href={`/sections/${track.slug}/${lastReadNum}`}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-600/30 transition-all active:scale-95 animate-in fade-in"
              >
                <BookmarkCheck className="h-4 w-4" />
                <span>Continue Q{lastReadNum}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            )}

            <Link
              href={`/sections/${track.slug}/1`}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                lastReadNum && lastReadNum > 1
                  ? 'bg-card hover:bg-card-hover border border-border text-foreground shadow-sm'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25'
              }`}
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start from Q1</span>
            </Link>

            {/* Search Input Filter */}
            <div className="relative w-full sm:flex-1 sm:min-w-[260px] max-w-md">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${questions.length} questions in this track...`}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-400 shadow-sm dark:shadow-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Curriculum Roadmap Flowchart */}
      <TrackRoadmapFlowchart
        trackSlug={track.slug}
        parts={roadmapParts}
        studiedMap={studiedMap}
        selectedPart={selectedRoadmapPart}
        onSelectPart={setSelectedRoadmapPart}
      />

      {/* Filter Tabs: All Questions, Studied, Bookmarked */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'all'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-card-hover'
            }`}
          >
            All Questions ({questions.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('studied')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'studied'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-card-hover'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Studied ({studiedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('bookmarked')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'bookmarked'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-card-hover'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 fill-current" />
            <span>Bookmarked ({bookmarkedCount})</span>
          </button>
        </div>

        {isFiltering && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span>Showing {displayedQuestions.length} of {questions.length}</span>
            {isFiltering && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setFilterTab('all');
                  setSelectedRoadmapPart(null);
                }}
                className="text-purple-600 dark:text-purple-400 hover:underline font-bold ml-1"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Questions List */}
      {displayedQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border text-muted-foreground">
          {filterTab === 'bookmarked' ? (
            <>
              <Bookmark className="h-10 w-10 mx-auto mb-3 text-amber-500 opacity-60" />
              <h3 className="text-base font-bold text-foreground mb-1">No Bookmarked Questions in This Section</h3>
              <p className="text-xs max-w-sm mx-auto leading-relaxed mb-4">
                Click the <strong>Bookmark</strong> button on any question page to add it to your revision list.
              </p>
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm"
              >
                Show All Questions
              </button>
            </>
          ) : filterTab === 'studied' ? (
            <>
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-emerald-500 opacity-60" />
              <h3 className="text-base font-bold text-foreground mb-1">No Questions Marked as Studied Yet</h3>
              <p className="text-xs max-w-sm mx-auto leading-relaxed mb-4">
                Click <strong>Mark as Studied</strong> on questions as you complete them to track your progress.
              </p>
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm"
              >
                Show All Questions
              </button>
            </>
          ) : (
            <>
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-semibold">No questions found matching "{query}".</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 text-xs text-purple-600 dark:text-purple-400 hover:underline font-bold"
              >
                Clear search query
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {groupedByPart.map(([partTitle, partQuestions]) => (
            <div key={partTitle} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>{partTitle}</span>
                </h2>
                <span className="text-xs text-muted-foreground font-bold">
                  {partQuestions.length} {partQuestions.length === 1 ? 'Question' : 'Questions'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {partQuestions.map((q) => {
                  const isLastRead = q.number === lastReadNum;
                  const isStudied = !!studiedMap[q.number];
                  const isQBookmarked = bookmarkedSet.has(q.number);

                  return (
                    <Link
                      key={q.number}
                      href={`/sections/${track.slug}/${q.number}`}
                      className={`p-4 rounded-xl bg-card border ${
                        isLastRead 
                          ? 'border-purple-500 dark:border-purple-400 ring-1 ring-purple-500/30' 
                          : isQBookmarked
                          ? 'border-amber-300 dark:border-amber-500/40'
                          : 'border-border'
                      } hover:border-purple-400 hover:bg-card-hover transition-all flex items-start justify-between gap-3 group shadow-sm dark:shadow-none`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isLastRead 
                            ? 'bg-purple-600 text-white' 
                            : isStudied
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                            : 'bg-muted text-foreground border border-border group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600'
                        }`}>
                          {q.number}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            {isLastRead && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30">
                                Resume Here
                              </span>
                            )}
                            {isStudied && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                Studied
                              </span>
                            )}
                            {isQBookmarked && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                                <Bookmark className="h-2.5 w-2.5 fill-current" />
                                Bookmarked
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                            {q.title}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 shrink-0 mt-1 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
