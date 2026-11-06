import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllTracks, getTrackQuestions, getQuestionData } from '@/lib/tracks';
import { QuestionViewer } from './QuestionViewer';

interface QuestionPageProps {
  params: {
    slug: string;
    qId: string;
  };
}

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

  const pageUrl = `https://learn-interview-questions.vercel.app/sections/${params.slug}/${qNum}`;
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

  // Schema.org QAPage Structured Data for Google Rich Snippets
  const qaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: data.question.title,
      text: data.question.title,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: data.question.content.slice(0, 250).replace(/[#*`]/g, '') + '...',
        url: `https://learn-interview-questions.vercel.app/sections/${params.slug}/${qNum}`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaJsonLd) }}
      />
      <QuestionViewer data={data} />
    </>
  );
}
