'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowRight, 
  Play, 
  BookOpen, 
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { TrackMeta, ParsedQuestion } from '@/lib/tracks';

interface SectionClientProps {
  track: TrackMeta;
  questions: ParsedQuestion[];
  allTracks: TrackMeta[];
}

export function SectionClient({ track, questions, allTracks }: SectionClientProps) {
  const [query, setQuery] = useState('');

  // Group questions by Part
  const groupedByPart = useMemo(() => {
    const map = new Map<string, ParsedQuestion[]>();
    for (const q of questions) {
      if (!map.has(q.part)) {
        map.set(q.part, []);
      }
      map.get(q.part)!.push(q);
    }
    return Array.from(map.entries());
  }, [questions]);

  // Filter questions
  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return questions.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.part.toLowerCase().includes(q) ||
        item.number.toString() === q
    );
  }, [query, questions]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-purple-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        <Link href="/#tracks" className="hover:text-purple-400 transition-colors">
          Tracks
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
        <span className="text-foreground font-semibold">
          Section {track.sectionNumber}: {track.shortTitle}
        </span>
      </div>

      {/* Section Header Card */}
      <div className="p-6 sm:p-10 rounded-2xl bg-card border border-border mb-10 shadow-xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Section {track.sectionNumber} of {allTracks.length}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-foreground border border-border">
                {track.questionCount} Questions (1 Per Page)
              </span>
            </div>

            <div className="text-xs text-muted-foreground font-medium">
              Section {track.sectionNumber} of {allTracks.length}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            {track.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mb-8">
            {track.description}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/sections/${track.slug}/1`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 transition-all active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Start from Question 1</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            {/* Search Input Filter */}
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${questions.length} questions in this track...`}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {filtered ? (
        // Search Results Mode
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border text-xs text-muted-foreground">
            <span>Found {filtered.length} matching questions for "{query}"</span>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-purple-400 hover:underline font-semibold"
            >
              Clear search
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filtered.map((q) => (
              <Link
                key={q.number}
                href={`/sections/${track.slug}/${q.number}`}
                className="p-4 rounded-xl bg-card border border-border hover:border-purple-500/40 hover:bg-card-hover transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold text-xs flex items-center justify-center shrink-0">
                    Q{q.number}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[11px] text-muted-foreground block mb-0.5 truncate">{q.part}</span>
                    <p className="text-sm font-semibold text-foreground group-hover:text-purple-400 transition-colors line-clamp-1">
                      {q.title}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 shrink-0 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        // Grouped by Part Mode
        <div className="space-y-10">
          {groupedByPart.map(([partTitle, partQuestions]) => (
            <div key={partTitle} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span>{partTitle}</span>
                </h2>
                <span className="text-xs text-muted-foreground font-semibold">
                  {partQuestions.length} Questions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {partQuestions.map((q) => (
                  <Link
                    key={q.number}
                    href={`/sections/${track.slug}/${q.number}`}
                    className="p-4 rounded-xl bg-card border border-border hover:border-purple-500/40 hover:bg-card-hover transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-muted text-foreground border border-border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-500 transition-all">
                        {q.number}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-purple-400 transition-colors line-clamp-2">
                        {q.title}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-purple-400 shrink-0 mt-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
