import type { Metadata } from 'next';
import { getAllTracks, getGlobalSearchIndex } from '@/lib/tracks';
import { SITE_URL } from '@/lib/site-config';
import { QuestionsDirectoryClient } from './QuestionsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Questions Explorer — 4,300+ Master Technical Interview Bank Across 64 Tracks',
  description: 'Search, filter, and practice across all 4,300+ technical interview questions. Filter by Track, Seniority Level (Junior, Mid, Senior), Most Asked Frequency, and Code Implementations.',
  alternates: {
    canonical: `${SITE_URL}/questions`,
  },
  openGraph: {
    title: 'Explore All 4,300+ Master Interview Questions (64 Separated Tracks)',
    description: 'Filter across 64 Individual Tracks: React, Next.js, Angular, Vue, Svelte, Astro, Go, Rust, Java, Spring Boot, C#, ASP.NET Core, PHP, Laravel, Python, Node.js, PostgreSQL, MySQL, SQL, MongoDB, Redis, Docker, Kubernetes, Terraform, AWS, GCP, Azure, Snowflake, BigQuery, Swift, iOS, Kotlin, Android, SOLID Principles, Design Patterns, and more.',
    url: `${SITE_URL}/questions`,
    type: 'website',
    siteName: 'InterviewHub PRO',
    images: [
      {
        url: `${SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'InterviewHub PRO Question Explorer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore All 4,300+ Master Interview Questions (64 Separated Tracks)',
    description: 'Search, filter, and practice across 4,300+ technical interview questions across 64 specialized tracks.',
    images: [`${SITE_URL}/opengraph-image.png`],
  },
};

export default async function QuestionsPage() {
  const tracks = await getAllTracks();
  const allItems = await getGlobalSearchIndex();
  // Pass initial slice of 50 high-yield questions for instant first paint and SEO
  // The client automatically hydrates the full list from cached /search-index.json
  // This reduces questions.html size from 2.98 MB down to ~40 KB (98.7% reduction!)
  const initialSlice = allItems.slice(0, 50);

  return <QuestionsDirectoryClient initialItems={initialSlice} tracks={tracks} />;
}
