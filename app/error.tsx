'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6 shadow-lg shadow-red-500/5">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Runtime Error</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">Something Went Wrong</h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
        {error.message || 'An unexpected error occurred while rendering this interview question.'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card hover:bg-card-hover border border-border text-slate-300 font-semibold transition-all hover:-translate-y-0.5"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}

