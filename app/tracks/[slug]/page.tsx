import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllTracks, getTrackBySlug } from '@/lib/tracks';
import { withBasePath } from '@/lib/site-config';
import { TrackRedirect } from './TrackRedirect';

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

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const track = await getTrackBySlug(params.slug);
  if (!track) return { title: 'Track Not Found' };
  return {
    title: track.title,
    alternates: {
      canonical: `/sections/${track.slug}/1`,
    },
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const track = await getTrackBySlug(params.slug);
  if (!track) {
    notFound();
  }

  const targetPath = `/sections/${track.slug}/1`;
  const refreshUrl = withBasePath(`${targetPath}/`);

  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${refreshUrl}`} />
      <TrackRedirect targetPath={targetPath} trackTitle={track.title} />
    </>
  );
}
