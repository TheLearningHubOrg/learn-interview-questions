'use client';

import React from 'react';
import { BookOpen, Github, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border bg-card/40 backdrop-blur-sm py-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand & Platform Identity */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                The Learning Hub Org
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Open Source
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Free & open-source engineering interview platform • 1,849+ Questions • 13 Specialized Tracks
              </p>
            </div>
          </div>

          {/* Right Utilities: License, Star on GitHub, Back to Top */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden md:inline font-mono">MIT License</span>
            <span className="hidden md:inline">•</span>
            <a
              href="https://github.com/TheLearningHubOrg/learn-interview-questions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background/60 hover:bg-muted hover:text-foreground transition-all font-medium"
            >
              <Github className="h-3.5 w-3.5" />
              <span>Star on GitHub</span>
            </a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background/60 hover:bg-muted hover:text-foreground transition-all cursor-pointer font-medium"
              aria-label="Back to top"
              title="Scroll back to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Top</span>
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
