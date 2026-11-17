import type { Metadata } from 'next';
import { getAllTracks, getGlobalSearchIndex } from '@/lib/tracks';
import { QuestionsDirectoryClient } from './QuestionsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Questions Explorer — 1,849+ Master Technical Interview Bank',
  description: 'Search, filter, and practice across all 1,849 technical interview questions. Filter by Track, Seniority Level (Junior, Mid, Senior), Most Asked Frequency, and Code Implementations.',
  openGraph: {
    title: 'Explore All 1,849+ Master Interview Questions',
    description: 'Filter across 13 Specialized Tracks: AI Engineering, React 18/19, Angular Signals, System Design, DevOps, Kubernetes, and Cloud Architecture.',
    url: 'https://learn-interview-questions.vercel.app/questions',
  },
};

export default async function QuestionsPage() {
  const tracks = await getAllTracks();
  const items = await getGlobalSearchIndex();

  return <QuestionsDirectoryClient initialItems={items} tracks={tracks} />;
}
