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
  Github,
  Zap
} from 'lucide-react';
import { getAllTracks } from '@/lib/tracks';
import { TrackCard } from '@/components/TrackCard';
import { ContinueReadingBanner } from '@/components/ContinueReadingBanner';
import { StudyProgressCard } from '@/components/StudyProgressCard';

export default async function HomePage() {
  const tracks = await getAllTracks();
  const totalQuestions = tracks.reduce((acc, t) => acc + t.questionCount, 0);

  // SEO JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'InterviewHub - The Learning Hub Org',
    url: 'https://learn-interview-questions.vercel.app',
    description: 'Comprehensive, production-tested interview question bank with 1,849+ questions covering Angular 2-19, React 18/19, Core JavaScript Internals, Large-Scale System Design, AI Engineering & LLM Architecture, Web Security & OWASP Top 10, DevOps, Kubernetes, Docker, Python, Node.js, Databases, AWS Cloud Architecture, and Data Structures & Algorithms.',
    knowsAbout: [
      'JavaScript',
      'Angular',
      'React',
      'TypeScript',
      'Python',
      'Node.js',
      'System Design',
      'Distributed Systems',
      'AI Engineering',
      'LLM Architecture',
      'RAG & Vector Search',
      'Autonomous Agents',
      'Model Context Protocol',
      'Web Security',
      'OWASP Top 10',
      'Application Security',
      'Cryptography',
      'DevOps',
      'Kubernetes',
      'Docker',
      'CI/CD',
      'Terraform',
      'AWS Cloud Architecture',
      'Databases',
      'Data Structures and Algorithms',
      'Behavioral Interviews'
    ],
    hasCourse: tracks.map((t) => ({
      '@type': 'Course',
      name: t.title,
      description: t.description,
      provider: {
        '@type': 'Organization',
        name: 'The Learning Hub Org',
      },
    })),
  };

  return (
    <div className="relative overflow-hidden">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-600/15 dark:via-indigo-600/5 blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 text-xs font-bold mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm dark:shadow-none">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The Complete 2026 Master Interview Engineering Edition</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.15] mb-6">
          Master Full-Stack & Cloud <br />
          <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-700 dark:from-purple-400 dark:via-violet-300 dark:to-indigo-400 bg-clip-text text-transparent">
            Technical Interviews
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-10 font-normal">
          Over <span className="font-bold text-foreground">{totalQuestions}+ battle-tested interview questions</span> and architectural deep-dives across Frontend, Backend, Databases, AWS Cloud Architecture, and Algorithms. Built for Senior, Lead, and Staff Software Engineers.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <Link
            href="/#tracks"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 transition-all active:scale-95"
          >
            <BookOpen className="h-4 w-4" />
            <span>Explore All {tracks.length} Tracks</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>

          <a
            href="https://github.com/TheLearningHubOrg/learn-interview-questions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-card hover:bg-card-hover border border-border text-foreground transition-all shadow-sm dark:shadow-none active:scale-95"
          >
            <Github className="h-4 w-4" />
            <span>Star on GitHub</span>
          </a>
        </div>

        {/* Metric Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm">
            <p className="text-2xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 mb-1">{totalQuestions}+</p>
            <p className="text-xs text-muted-foreground font-semibold">Master Questions</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm">
            <p className="text-2xl sm:text-4xl font-black text-cyan-700 dark:text-cyan-400 mb-1">{tracks.length}</p>
            <p className="text-xs text-muted-foreground font-semibold">Specialized Tracks</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm">
            <p className="text-2xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 mb-1">100%</p>
            <p className="text-xs text-muted-foreground font-semibold">Code Examples</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm">
            <p className="text-2xl sm:text-4xl font-black text-amber-700 dark:text-amber-400 mb-1">MIT</p>
            <p className="text-xs text-muted-foreground font-semibold">Open Source</p>
          </div>
        </div>
      </section>

      {/* Continue Reading Banner (client-side persisted) */}
      <ContinueReadingBanner />

      {/* Global Study Progress Dashboard */}
      <StudyProgressCard tracks={tracks} />

      {/* Tracks Section */}
      <section id="tracks" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="h-4 w-4" />
              <span>Curriculum Tracks</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Select Your Preparation Track
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Click into any track to view comprehensive explanations, architectural diagrams, benchmarks, and live coding solutions.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      {/* Study Framework Section */}
      <section className="py-16 sm:py-20 border-t border-border bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">
              Engineered for Senior & Staff Interview Success
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every question is formulated around candidate evaluation rubrics: clarifying constraints, diagnosing production incidents, and proposing optimal architectural trade-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Framework & Runtime Internals</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Peel back abstractions: V8 hidden classes, Libuv event loop phases, React 19 Fiber reconciliation, Angular Ivy compiler, and CPython reference counting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-4 shadow-sm">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Real-World Production Scenarios</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero-downtime schema migrations, memory leak triage, PostgreSQL connection starvation mitigation, and high-concurrency Redis caching strategies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-cyan-50 border border-cyan-200 dark:bg-cyan-500/10 dark:border-cyan-500/20 flex items-center justify-center text-cyan-700 dark:text-cyan-400 mb-4 shadow-sm">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Live Coding & Algorithms</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Optimal TypeScript and JavaScript implementations of Two Pointers, Monotonic Stacks, Kahn’s Topological Sort, Dijkstra’s Algorithm, and Dynamic Programming.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
