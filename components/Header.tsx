'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Github, Layers, Menu, X, ChevronRight, ExternalLink } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { TRACKS } from '@/lib/tracks-meta';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md transition-colors shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 p-[1px] shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="h-full w-full bg-card rounded-xl flex items-center justify-center">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  InterviewHub
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block font-medium">The Learning Hub Org</p>
            </div>
          </Link>

          {/* Center: Search Trigger (Tablet & Desktop) */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-purple-400/50 hover:bg-card-hover transition-all text-sm group shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                <span className="text-xs sm:text-sm font-medium">Search 1,799+ interview questions...</span>
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono bg-muted border border-border rounded text-muted-foreground font-semibold">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons & Toggles */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-colors"
              aria-label="Search questions"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Desktop Tracks link */}
            <Link
              href="/#tracks"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-all"
            >
              <Layers className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Tracks</span>
            </Link>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* GitHub Stars */}
            <a
              href="https://github.com/TheLearningHubOrg/learn-interview-questions"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star on GitHub"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 dark:bg-purple-600/10 dark:text-purple-400 dark:border-purple-500/20 dark:hover:bg-purple-600/20 transition-all shadow-sm dark:shadow-none"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors shadow-sm dark:shadow-none"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Slide-Over Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-background border-l border-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="font-extrabold text-base text-foreground">InterviewHub</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground bg-card"
                  aria-label="Close Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search Button in Drawer */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch?.();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 mb-6 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground text-sm font-medium shadow-sm dark:shadow-none"
              >
                <Search className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Search 1,799+ questions...</span>
              </button>

              {/* Tracks List */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  All {TRACKS.length} Study Tracks
                </p>
                {TRACKS.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/sections/${t.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-card border border-transparent hover:border-border text-xs font-semibold text-foreground transition-all group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {t.sectionNumber}
                      </span>
                      <span className="truncate">{t.shortTitle}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Footer Area */}
            <div className="pt-6 mt-6 border-t border-border space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-muted-foreground font-semibold">Theme Mode</span>
                <ThemeToggle />
              </div>
              <a
                href="https://github.com/TheLearningHubOrg/learn-interview-questions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-card border border-border text-foreground hover:bg-card-hover transition-colors shadow-sm dark:shadow-none"
              >
                <Github className="h-4 w-4" />
                <span>Star on GitHub</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
