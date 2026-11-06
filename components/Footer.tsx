import React from 'react';
import Link from 'next/link';
import { BookOpen, Github, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 py-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">The Learning Hub Org</p>
              <p className="text-xs text-muted-foreground">Open-source engineering interview & architecture platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <Link href="/sections/angular-ts" className="hover:text-purple-400 transition-colors">Angular (283 Qs)</Link>
            <Link href="/sections/react-nextjs" className="hover:text-purple-400 transition-colors">React (353 Qs)</Link>
            <Link href="/sections/javascript" className="hover:text-purple-400 transition-colors">JavaScript (518 Qs)</Link>
            <Link href="/sections/databases" className="hover:text-purple-400 transition-colors">Databases</Link>
            <Link href="/sections/python" className="hover:text-purple-400 transition-colors">Python</Link>
            <Link href="/sections/nodejs" className="hover:text-purple-400 transition-colors">Node.js</Link>
            <Link href="/sections/aws" className="hover:text-purple-400 transition-colors">AWS Cloud</Link>
            <Link href="/sections/dsa" className="hover:text-purple-400 transition-colors">DSA Patterns</Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>MIT License</span>
            <span>•</span>
            <a
              href="https://github.com/TheLearningHubOrg/learn-interview-questions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              <span>Contribute</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
