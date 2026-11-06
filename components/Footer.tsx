import React from 'react';
import Link from 'next/link';
import { BookOpen, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/50 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">The Learning Hub Org</p>
              <p className="text-xs text-slate-400">Open-source developer guides and interview mastery platforms</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <Link href="/tracks/javascript" className="hover:text-purple-400 transition-colors">JavaScript</Link>
            <Link href="/tracks/angular-ts" className="hover:text-purple-400 transition-colors">Angular Track</Link>
            <Link href="/tracks/react-nextjs" className="hover:text-purple-400 transition-colors">React Track</Link>
            <Link href="/tracks/databases" className="hover:text-purple-400 transition-colors">Databases</Link>
            <Link href="/tracks/python" className="hover:text-purple-400 transition-colors">Python</Link>
            <Link href="/tracks/nodejs" className="hover:text-purple-400 transition-colors">Node.js</Link>
            <Link href="/tracks/aws" className="hover:text-purple-400 transition-colors">AWS</Link>
            <Link href="/tracks/dsa" className="hover:text-purple-400 transition-colors">DSA</Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Licensed under MIT</span>
            <span>•</span>
            <a
              href="https://github.com/TheLearningHubOrg/learn-interview-questions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
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

