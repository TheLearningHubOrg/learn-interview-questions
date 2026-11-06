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

  return {
    title: `Q${data.question.number}: ${data.question.title} - ${data.track.shortTitle} | The Learning Hub Org`,
    description: `Master technical interview question: ${data.question.title}. Detailed answer and code implementation for ${data.track.title}.`,
    keywords: [...data.track.tags, `question ${data.question.number}`, data.question.part],
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

  return <QuestionViewer data={data} />;
}

