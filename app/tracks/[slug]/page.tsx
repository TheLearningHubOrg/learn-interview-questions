import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllTracks, getTrackBySlug, getTrackContent } from '@/lib/tracks';
import { TrackReader } from './TrackReader';

interface TrackPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const tracks = await getAllTracks();
  return tracks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const track = await getTrackBySlug(params.slug);
  if (!track) return { title: 'Track Not Found' };

  return {
    title: `${track.shortTitle} - Master Interview Questions | The Learning Hub Org`,
    description: track.description,
    keywords: track.tags,
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const track = await getTrackBySlug(params.slug);
  if (!track) {
    notFound();
  }

  const markdown = await getTrackContent(track.filename);
  const allTracks = await getAllTracks();

  return <TrackReader track={track} markdown={markdown} allTracks={allTracks} />;
}

