import type { Metadata } from 'next';
import { getAllTracks, getGlobalSearchIndex } from '@/lib/tracks';
import { QuestionsDirectoryClient } from './QuestionsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Questions Explorer — 2,400+ Master Technical Interview Bank Across 50 Tracks',
  description: 'Search, filter, and practice across all 2,400+ technical interview questions. Filter by Track, Seniority Level (Junior, Mid, Senior), Most Asked Frequency, and Code Implementations.',
  openGraph: {
    title: 'Explore All 2,400+ Master Interview Questions (50 Separated Tracks)',
    description: 'Filter across 50 Individual Tracks: React, Next.js, Angular, Vue, Svelte, Astro, Go, Rust, Java, .NET, PHP, Python, Node.js, PostgreSQL, MySQL, MongoDB, Redis, Docker, Kubernetes, Terraform, AWS, GCP, Azure, and more.',
    url: 'https://learn-interview-questions.vercel.app/questions',
  },
};

export default async function QuestionsPage() {
  const tracks = await getAllTracks();
  const items = await getGlobalSearchIndex();

  return <QuestionsDirectoryClient initialItems={items} tracks={tracks} />;
}
