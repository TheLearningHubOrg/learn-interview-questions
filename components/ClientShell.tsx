'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { BookmarksModal } from '@/components/BookmarksModal';
import { QuestionIndexItem } from '@/lib/tracks-meta';
import { recordStudyActivity } from '@/lib/study-streak';

interface ClientShellProps {
  children: React.ReactNode;
  searchIndex?: QuestionIndexItem[];
}

export function ClientShell({ children, searchIndex }: ClientShellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  useEffect(() => {
    // Record daily study activity on session start
    recordStudyActivity();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    const handleOpenBookmarks = () => {
      setIsBookmarksOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('interviewhub_open_bookmarks', handleOpenBookmarks);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('interviewhub_open_bookmarks', handleOpenBookmarks);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-purple-500/30 selection:text-purple-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <Header 
        onOpenSearch={() => setIsSearchOpen(true)} 
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
      />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        indexItems={searchIndex}
      />
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
      />
    </div>
  );
}

