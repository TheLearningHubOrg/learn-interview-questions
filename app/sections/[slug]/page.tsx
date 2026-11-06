import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllTracks, getTrackBySlug, getTrackQuestions } from '@/lib/tracks';
import { SectionClient } from './SectionClient';

interface SectionPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const tracks = await getAllTracks();
  return tracks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const track = await getTrackBySlug(params.slug);
  if (!track) return { title: 'Section Not Found' };

  const pageUrl = `https://learn-interview-questions.vercel.app/sections/${track.slug}`;
  const title = `Section ${track.sectionNumber}: ${track.shortTitle} (${track.questionCount} Questions)`;
  const description = `${track.title}. Complete master track with ${track.questionCount} questions, 1-per-page routing, and code examples.`;

  return {
    title,
    description,
    keywords: track.tags,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      siteName: 'InterviewHub PRO',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const track = await getTrackBySlug(params.slug);
  if (!track) {
    notFound();
  }

  const questions = await getTrackQuestions(track.slug);
  const allTracks = await getAllTracks();

  return <SectionClient track={track} questions={questions} allTracks={allTracks} />;
}
