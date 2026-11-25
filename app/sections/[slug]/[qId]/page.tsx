import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllTracks, getTrackQuestions, getQuestionData } from '@/lib/tracks';
import { SITE_URL } from '@/lib/site-config';
import { QuestionViewer } from './QuestionViewer';

interface QuestionPageProps {
  params: {
    slug: string;
    qId: string;
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const tracks = await getAllTracks();
  const params: { slug: string; qId: string }[] = [];

  for (const track of tracks) {
    const questions = await getTrackQuestions(track.slug);
    for (const q of questions) {
      params.push({
        slug: track.slug,
        qId: q.number.toString(),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const qNum = parseInt(params.qId, 10);
  if (isNaN(qNum)) return { title: 'Question Not Found' };

  const data = await getQuestionData(params.slug, qNum);
  if (!data) return { title: 'Question Not Found' };

  const pageUrl = `${SITE_URL}/sections/${params.slug}/${qNum}`;
  const title = `Q${data.question.number}: ${data.question.title} - ${data.track.shortTitle}`;
  const description = `In-depth technical answer & code example for: ${data.question.title}. Part of the ${data.track.title} interview question bank.`;

  return {
    title,
    description,
    keywords: [
      ...data.track.tags,
      `question ${data.question.number}`,
      data.question.part,
      'interview question',
      'code example',
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'article',
      siteName: 'InterviewHub PRO',
      images: [
        {
          url: `${SITE_URL}/opengraph-image.png`,
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
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const qNum = parseInt(params.qId, 10);
  if (isNaN(qNum)) {
    notFound();
  }

  const data = await getQuestionData(params.slug, qNum);
  if (!data) {
    notFound();
  }

  // Schema.org QAPage & BreadcrumbList Structured Data for Google Rich Snippets
  const qaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: data.question.title,
      text: data.question.title,
      answerCount: 1,
      upvoteCount: 1,
      author: {
        '@type': 'Organization',
        name: 'The Learning Hub Org',
      },
      acceptedAnswer: {
        '@type': 'Answer',
        text: data.question.summary || (data.question.content.slice(0, 300).replace(/[#*`]/g, '') + '...'),
        url: `${SITE_URL}/sections/${params.slug}/${qNum}`,
        upvoteCount: 1,
        author: {
          '@type': 'Organization',
          name: 'The Learning Hub Org',
        },
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: data.track.shortTitle,
        item: `${SITE_URL}/sections/${params.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Q${data.question.number}: ${data.question.title}`,
        item: `${SITE_URL}/sections/${params.slug}/${qNum}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <QuestionViewer data={data} />
    </>
  );
}
