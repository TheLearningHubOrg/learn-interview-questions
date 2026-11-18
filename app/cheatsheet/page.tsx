import type { Metadata } from 'next';
import { getAllTracks, getGlobalSearchIndex } from '@/lib/tracks';
import { CheatsheetClient } from './CheatsheetClient';

export const metadata: Metadata = {
  title: 'Last-Minute Interview Revision Cheatsheet — 1,864+ 1-Line Summaries',
  description: 'Instant 1-line technical interview takeaways for rapid pre-interview recall. Filter by Track, Most Asked, or Bookmarks, and export a clean printable PDF.',
  openGraph: {
    title: 'Last-Minute Interview Revision Cheatsheet & Printable PDF',
    description: 'Instant 1-line technical interview takeaways across JavaScript, React, System Design, Angular, Databases, and AI Engineering.',
    url: 'https://learn-interview-questions.vercel.app/cheatsheet',
  },
};

export default async function CheatsheetPage() {
  const tracks = await getAllTracks();
  const items = await getGlobalSearchIndex();

  return <CheatsheetClient initialItems={items} tracks={tracks} />;
}

