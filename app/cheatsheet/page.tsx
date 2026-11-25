import type { Metadata } from 'next';
import { getAllTracks, getGlobalSearchIndex } from '@/lib/tracks';
import { SITE_URL } from '@/lib/site-config';
import { CheatsheetClient } from './CheatsheetClient';

export const metadata: Metadata = {
  title: 'Last-Minute Interview Revision Cheatsheet — 4,300+ 1-Line Summaries',
  description: 'Instant 1-line technical interview takeaways for rapid pre-interview recall. Filter by Track, Most Asked, or Bookmarks, and export a clean printable PDF.',
  alternates: {
    canonical: `${SITE_URL}/cheatsheet`,
  },
  openGraph: {
    title: 'Last-Minute Interview Revision Cheatsheet & Printable PDF',
    description: 'Instant 1-line technical interview takeaways across JavaScript, React, System Design, Angular, Databases, and AI Engineering.',
    url: `${SITE_URL}/cheatsheet`,
    type: 'website',
    siteName: 'InterviewHub PRO',
    images: [
      {
        url: `${SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'InterviewHub PRO Cheatsheet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Last-Minute Interview Revision Cheatsheet & Printable PDF',
    description: 'Instant 1-line technical interview takeaways across JavaScript, React, System Design, Angular, Databases, and AI Engineering.',
    images: [`${SITE_URL}/opengraph-image.png`],
  },
};

export default async function CheatsheetPage() {
  const tracks = await getAllTracks();
  const allItems = await getGlobalSearchIndex();
  // Pass initial slice of 50 high-yield questions for instant first paint and SEO
  // The client automatically hydrates the full list from cached /search-index.json
  // This reduces cheatsheet.html size from 6.37 MB down to ~40 KB (99.4% reduction!)
  const initialSlice = allItems.slice(0, 50);

  return <CheatsheetClient initialItems={initialSlice} tracks={tracks} />;
}

