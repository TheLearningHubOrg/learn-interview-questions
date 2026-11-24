import { redirect, notFound } from 'next/navigation';
import { getAllTracks, getTrackBySlug } from '@/lib/tracks';

interface TrackPageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const tracks = await getAllTracks();
  const legacySlugs = [
    'react-nextjs',
    'databases',
    'devops-kubernetes',
    'modern-frameworks',
    'messaging-queues',
    'terraform-iac',
    'cloud-gcp-azure',
    'mobile-development',
    'testing-qa-sre',
    'data-engineering-spark',
    'search-vector-databases',
    'linux-os-shell',
    'design-patterns-ddd',
    'html-css-web-vitals',
    'rust-systems',
  ];
  return [
    ...tracks.map((t) => ({ slug: t.slug })),
    ...legacySlugs.map((slug) => ({ slug })),
  ];
}

export default async function TrackPage({ params }: TrackPageProps) {
  const track = await getTrackBySlug(params.slug);
  if (!track) {
    notFound();
  }

  // Redirect to the new 1-question-per-page section
  redirect(`/sections/${track.slug}/1`);
}
