import type { Metadata } from 'next';
import { getAllTracks, getGlobalSearchIndex } from '@/lib/tracks';
import { QuestionsDirectoryClient } from './QuestionsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Questions Explorer — 3,600+ Master Technical Interview Bank Across 64 Tracks',
  description: 'Search, filter, and practice across all 3,600+ technical interview questions. Filter by Track, Seniority Level (Junior, Mid, Senior), Most Asked Frequency, and Code Implementations.',
  openGraph: {
    title: 'Explore All 3,600+ Master Interview Questions (64 Separated Tracks)',
    description: 'Filter across 64 Individual Tracks: React, Next.js, Angular, Vue, Svelte, Astro, Go, Rust, Java, Spring Boot, C#, ASP.NET Core, PHP, Laravel, Python, Node.js, PostgreSQL, MySQL, SQL, MongoDB, Redis, Docker, Kubernetes, Terraform, AWS, GCP, Azure, Snowflake, BigQuery, Swift, iOS, Kotlin, Android, SOLID Principles, Design Patterns, and more.',
    url: 'https://learn-interview-questions.vercel.app/questions',
  },
};

export default async function QuestionsPage() {
  const tracks = await getAllTracks();
  const items = await getGlobalSearchIndex();

  return <QuestionsDirectoryClient initialItems={items} tracks={tracks} />;
}
