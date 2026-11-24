import type { Metadata } from 'next';
import { getAllTracks, getGlobalSearchIndex } from '@/lib/tracks';
import { CheatsheetClient } from './CheatsheetClient';

export const metadata: Metadata = {
  title: 'Last-Minute Interview Revision Cheatsheet — 4,300+ 1-Line Summaries',
  description: 'Instant 1-line technical interview takeaways for rapid pre-interview recall. Filter by Track, Most Asked, or Bookmarks, and export a clean printable PDF.',
  alternates: {
    canonical: 'https://learn-interview-questions.vercel.app/cheatsheet',
  },
  openGraph: {
    title: 'Last-Minute Interview Revision Cheatsheet & Printable PDF',
    description: 'Instant 1-line technical interview takeaways across JavaScript, React, System Design, Angular, Databases, and AI Engineering.',
    url: 'https://learn-interview-questions.vercel.app/cheatsheet',
    type: 'website',
    siteName: 'InterviewHub PRO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Last-Minute Interview Revision Cheatsheet & Printable PDF',
    description: 'Instant 1-line technical interview takeaways across JavaScript, React, System Design, Angular, Databases, and AI Engineering.',
  },
};

export default async function CheatsheetPage() {
  const tracks = await getAllTracks();
  const items = await getGlobalSearchIndex();

  return <CheatsheetClient initialItems={items} tracks={tracks} />;
}

