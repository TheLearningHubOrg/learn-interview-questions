'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'interviewhub-theme';

export function useTheme() {
  const [dark, setDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage blocked or private browsing
    }

    const prefersDark =
      stored === null &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = stored === 'dark' || (stored === null && prefersDark) || stored === null;
    setDark(isDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [dark, mounted]);

  return {
    dark,
    mounted,
    toggle: () => setDark((prev) => !prev),
    setTheme: (isDark: boolean) => setDark(isDark),
  };
}

