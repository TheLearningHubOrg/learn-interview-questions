'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ArrowRight, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  Hash, 
  ChevronRight,
  Sparkles,
  Layers
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-purple-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/#sections" className="hover:text-purple-400 transition-colors">
          Sections
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-200 font-medium">Section {track.sectionNumber}: {track.shortTitle}</span>
      </div>

      {/* Section Header Card */}
      <div className="p-6 sm:p-10 rounded-2xl bg-card border border-border mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Section {track.sectionNumber} of 7
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-border text-slate-300">
                {track.questionCount} Questions (1 Per Page)
              </span>
            </div>

            {/* Quick Next/Prev Section */}
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Section {track.sectionNumber} of 7</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            {track.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl mb-8">
            {track.description}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/sections/${track.slug}/1`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Start Section from Question 1</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            {/* Search Input Filter */}
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${questions.length} questions in this section...`}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-background/80 border border-border text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {filtered ? (
        // Search Results Mode
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border text-xs text-slate-400">
            <span>Found {filtered.length} matching questions for "{query}"</span>
            <button onClick={() => setQuery('')} className="text-purple-400 hover:underline">
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
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold text-xs flex items-center justify-center shrink-0">
                    Q{q.number}
                  </span>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5">{q.part}</span>
                    <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {q.title}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-purple-400 shrink-0 transform group-hover:translate-x-1 transition-transform" />
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
                <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span>{partTitle}</span>
                </h2>
                <span className="text-xs text-slate-400 font-medium">
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
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-background text-slate-300 border border-border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-500 transition-all">
                        {q.number}
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-purple-300 transition-colors line-clamp-2">
                        {q.title}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-purple-400 shrink-0 mt-1 transform group-hover:translate-x-1 transition-transform" />
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

