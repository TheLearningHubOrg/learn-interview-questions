'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/use-theme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { dark, mounted, toggle } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle Theme"
        className={`p-2 rounded-lg border border-border bg-card/60 text-muted-foreground ${className}`}
      >
        <span className="w-4 h-4 block" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative p-2 rounded-lg border border-border bg-card/80 hover:bg-card text-foreground hover:border-purple-500/40 transition-all active:scale-95 group ${className}`}
    >
      {dark ? (
        <Sun className="h-4 w-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="h-4 w-4 text-purple-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}

