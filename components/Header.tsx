'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Search, Github, Sparkles, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="h-full w-full bg-background rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors">
                InterviewHub
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">The Learning Hub Org</p>
          </div>
        </Link>

        {/* Center: Search Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-card/60 border border-border text-slate-400 hover:text-slate-200 hover:border-purple-500/40 hover:bg-card/90 transition-all text-sm group"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
              <span>Search 1,260+ interview questions...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono bg-border rounded text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-card transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href="/#tracks"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-card border border-transparent hover:border-border transition-all"
          >
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            <span>Tracks</span>
          </Link>

          <a
            href="https://github.com/TheLearningHubOrg/learn-interview-questions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-500/50 transition-all"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

