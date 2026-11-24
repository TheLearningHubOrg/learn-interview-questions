import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllTracks, getTrackBySlug, getTrackQuestions } from '@/lib/tracks';
import { SectionClient } from './SectionClient';

interface SectionPageProps {
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
      images: [
        {
          url: 'https://learn-interview-questions.vercel.app/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${title} - InterviewHub PRO`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://learn-interview-questions.vercel.app/opengraph-image'],
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://learn-interview-questions.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: track.shortTitle,
        item: `https://learn-interview-questions.vercel.app/sections/${track.slug}`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: track.title,
    description: track.description,
    numberOfItems: questions.length,
    itemListElement: questions.slice(0, 30).map((q, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: q.title,
      url: `https://learn-interview-questions.vercel.app/sections/${track.slug}/${q.number}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <SectionClient track={track} questions={questions} allTracks={allTracks} />
    </>
  );
}
