import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  Layers, 
  Terminal, 
  Cpu, 
  Cloud, 
  Database, 
  Code2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Github
} from 'lucide-react';
import { getAllTracks } from '@/lib/tracks';
import { TrackCard } from '@/components/TrackCard';

export default async function HomePage() {
  const tracks = await getAllTracks();
  const totalQuestions = tracks.reduce((acc, t) => acc + t.questionCount, 0);

  return (
    <div className="relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The Complete 2026 Master Interview Engineering Edition</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Master Full-Stack & Cloud <br />
          <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
            Technical Interviews
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
          Over <span className="font-semibold text-white">{totalQuestions}+ battle-tested interview questions</span> and architectural deep-dives across Frontend, Backend, Databases, AWS Cloud Architecture, and Algorithms. Built for Senior, Lead, and Staff Software Engineers.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/#tracks"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>Explore All 7 Tracks</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>

          <a
            href="https://github.com/TheLearningHubOrg/learn-interview-questions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-card/80 hover:bg-card border border-border hover:border-slate-700 text-slate-200 hover:-translate-y-0.5 transition-all"
          >
            <Github className="h-4 w-4" />
            <span>Star on GitHub</span>
          </a>
        </div>

        {/* Metric Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-card/40 border border-border backdrop-blur-sm">
            <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 mb-1">{totalQuestions}+</p>
            <p className="text-xs text-slate-400 font-medium">Master Questions</p>
          </div>
          <div className="p-5 rounded-2xl bg-card/40 border border-border backdrop-blur-sm">
            <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 mb-1">{tracks.length}</p>
            <p className="text-xs text-slate-400 font-medium">Specialized Tracks</p>
          </div>
          <div className="p-5 rounded-2xl bg-card/40 border border-border backdrop-blur-sm">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">100%</p>
            <p className="text-xs text-slate-400 font-medium">Production Tested</p>
          </div>
          <div className="p-5 rounded-2xl bg-card/40 border border-border backdrop-blur-sm">
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-400 mb-1">MIT</p>
            <p className="text-xs text-slate-400 font-medium">Open Source</p>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section id="tracks" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="h-4 w-4" />
              <span>Curriculum Tracks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Select Your Preparation Track
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Click into any track to view comprehensive explanations, architectural diagrams, benchmarks, and live coding solutions.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      {/* Study Framework Section */}
      <section className="py-20 border-t border-border/80 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Engineered for Senior & Staff Interview Success
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every question is formulated around candidate evaluation rubrics: clarifying constraints, diagnosing production incidents, and proposing optimal architectural trade-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card/50 border border-border">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Framework & Runtime Internals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Peel back abstractions: V8 hidden classes, Libuv event loop phases, React 19 Fiber reconciliation, Angular Ivy compiler, and CPython reference counting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 border border-border">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Real-World Production Scenarios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-downtime schema migrations, memory leak triage, PostgreSQL connection starvation mitigation, and high-concurrency Redis caching strategies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 border border-border">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Live Coding & Algorithms</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optimal TypeScript and JavaScript implementations of Two Pointers, Monotonic Stacks, Kahn’s Topological Sort, Dijkstra’s Algorithm, and Dynamic Programming.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

