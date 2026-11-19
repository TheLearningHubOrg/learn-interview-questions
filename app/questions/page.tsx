import type { Metadata } from 'next';
import { getAllTracks, getGlobalSearchIndex } from '@/lib/tracks';
import { QuestionsDirectoryClient } from './QuestionsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Questions Explorer — 2,719+ Master Technical Interview Bank Across 30 Tracks',
  description: 'Search, filter, and practice across all 2,719 technical interview questions. Filter by Track, Seniority Level (Junior, Mid, Senior), Most Asked Frequency, and Code Implementations.',
  openGraph: {
    title: 'Explore All 2,719+ Master Interview Questions (30 Tracks)',
    description: 'Filter across 30 Specialized Tracks: Go, Rust, PHP, Java, .NET, Mobile, Testing/SRE, Networking, Linux, Design Patterns, Spark, Vector DBs, Cloud, React, Angular & System Design.',
    url: 'https://learn-interview-questions.vercel.app/questions',
  },
};

export default async function QuestionsPage() {
  const tracks = await getAllTracks();
  const items = await getGlobalSearchIndex();

  return <QuestionsDirectoryClient initialItems={items} tracks={tracks} />;
}
