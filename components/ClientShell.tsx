'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { QuestionIndexItem } from '@/lib/tracks';

interface ClientShellProps {
  children: React.ReactNode;
  searchIndex: QuestionIndexItem[];
}

export function ClientShell({ children, searchIndex }: ClientShellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-purple-500/30 selection:text-purple-200">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        indexItems={searchIndex}
      />
    </div>
  );
}

