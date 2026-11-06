import { redirect, notFound } from 'next/navigation';
import { getAllTracks, getTrackBySlug } from '@/lib/tracks';

interface TrackPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const tracks = await getAllTracks();
  return tracks.map((t) => ({ slug: t.slug }));
}

export default async function TrackPage({ params }: TrackPageProps) {
  const track = await getTrackBySlug(params.slug);
  if (!track) {
    notFound();
  }

  // Redirect to the new 1-question-per-page section
  redirect(`/sections/${track.slug}/1`);
}
