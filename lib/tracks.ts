import fs from 'fs/promises';
import path from 'path';

export interface TrackMeta {
  id: string;
  sectionNumber: number;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  questionCount: number;
  filename: string;
  badgeColor: string;
  iconName: string;
  tags: string[];
}

export interface ParsedQuestion {
  number: number;
  title: string;
  part: string;
  content: string;
}

export interface QuestionViewData {
  track: TrackMeta;
  question: ParsedQuestion;
  allQuestions: { number: number; title: string; part: string }[];
  prevQuestion: { number: number; title: string } | null;
  nextQuestion: { number: number; title: string } | null;
  totalInTrack: number;
}

export const TRACKS: TrackMeta[] = [
  {
    id: '01',
    sectionNumber: 1,
    slug: 'angular-ts',
    title: 'Complete Master Interview: Angular, TypeScript, JavaScript & Web Standards',
    shortTitle: 'Angular & TypeScript',
    description: 'Comprehensive 235 questions covering Angular 17-19, Signals, Control Flow, @defer, RxJS, Core JS internals, live coding, and HTML5/CSS3.',
    questionCount: 235,
    filename: '01-frontend-angular-ts.md',
    badgeColor: 'from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30',
    iconName: 'Shield',
    tags: ['Angular 19', 'TypeScript', 'Signals', 'RxJS', 'JavaScript', 'HTML5', 'CSS3']
  },
  {
    id: '02',
    sectionNumber: 2,
    slug: 'react-nextjs',
    title: 'Full-Stack Frontend Master: React 18/19, Next.js, Modern Web & Core JS',
    shortTitle: 'React & Next.js',
    description: 'Deep dive into React 19 Actions, Server Components (RSC), Next.js App Router, SSR/SSG/ISR, streaming hydration, and web performance.',
    questionCount: 160,
    filename: '02-frontend-react-nextjs.md',
    badgeColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    iconName: 'Atom',
    tags: ['React 19', 'Next.js App Router', 'RSC', 'Server Actions', 'SSR/ISR', 'Tailwind']
  },
  {
    id: '03',
    sectionNumber: 3,
    slug: 'databases',
    title: 'Full-Stack & Backend Database Master: SQL, NoSQL, Redis & System Design',
    shortTitle: 'Databases & System Design',
    description: 'PostgreSQL, MySQL, ACID, B-Tree indexes, MVCC, MongoDB aggregation, DynamoDB single-table design, Redis caching, and real-time scaling.',
    questionCount: 60,
    filename: '03-backend-databases-system-design.md',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    iconName: 'Database',
    tags: ['PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB', 'Redis', 'ACID', 'Indexing']
  },
  {
    id: '04',
    sectionNumber: 4,
    slug: 'python',
    title: 'Full-Stack & Backend Python Master: FastAPI, AsyncIO, Core & Internals',
    shortTitle: 'Python & FastAPI',
    description: 'CPython memory management, the GIL, AsyncIO concurrency, FastAPI / Starlette, Pydantic v2 Rust core, SQLAlchemy 2.0, and Celery workflows.',
    questionCount: 65,
    filename: '04-backend-python.md',
    badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
    iconName: 'Terminal',
    tags: ['Python 3.12+', 'FastAPI', 'AsyncIO', 'SQLAlchemy 2.0', 'Pydantic v2', 'Celery']
  },
  {
    id: '05',
    sectionNumber: 5,
    slug: 'nodejs',
    title: 'Full-Stack & Backend Node.js Master: Express, Fastify, Libuv, Streams & Architecture',
    shortTitle: 'Node.js & Libuv',
    description: 'V8 engine internals, Libuv Event Loop phases, Streams, Buffers, Worker Threads, clustering, Fastify schema compilation, and API security.',
    questionCount: 60,
    filename: '05-backend-nodejs.md',
    badgeColor: 'from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
    iconName: 'Cpu',
    tags: ['Node.js Runtime', 'Libuv', 'Event Loop', 'Streams', 'Fastify', 'Express']
  },
  {
    id: '06',
    sectionNumber: 6,
    slug: 'aws',
    title: 'Full-Stack & Cloud Architecture AWS Master: Well-Architected, Serverless & Security',
    shortTitle: 'AWS Cloud Architecture',
    description: 'AWS 6 Pillars, 3-tier VPC networking, ECS Fargate, Lambda, Aurora, DynamoDB, IAM evaluation logic, KMS encryption, and SQS messaging.',
    questionCount: 65,
    filename: '06-cloud-aws-architecture.md',
    badgeColor: 'from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30',
    iconName: 'Cloud',
    tags: ['AWS VPC', 'Lambda', 'Fargate', 'Aurora', 'IAM', 'KMS', 'FinOps']
  },
  {
    id: '07',
    sectionNumber: 7,
    slug: 'dsa',
    title: 'Data Structures & Algorithms Master: Blind 75, NeetCode & Core Patterns',
    shortTitle: 'DSA & Algorithms',
    description: 'Asymptotic complexity, Arrays, Sliding Window, Monotonic Stacks, Linked Lists, Binary Search, Trees, Heaps, Graphs, and Dynamic Programming.',
    questionCount: 100,
    filename: '07-data-structures-algorithms.md',
    badgeColor: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    iconName: 'Code2',
    tags: ['Blind 75', 'NeetCode', 'Two Pointers', 'Graphs', 'Dynamic Programming', 'Trees']
  }
];

export async function getAllTracks(): Promise<TrackMeta[]> {
  return TRACKS;
}

export async function getTrackBySlug(slug: string): Promise<TrackMeta | undefined> {
  return TRACKS.find(t => t.slug === slug);
}

export async function getTrackContent(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'tracks', filename);
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading track file ${filename}:`, err);
    return '';
  }
}

export function parseTrackQuestionsFromMarkdown(markdown: string): ParsedQuestion[] {
  const lines = markdown.split('\n');
  const questions: ParsedQuestion[] = [];
  let currentPart = 'General';
  let currentQ: { number: number; title: string; part: string } | null = null;
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## Part ') || line.startsWith('## PART ')) {
      currentPart = line.replace(/^##\s+/, '').trim();
    } else if (line.startsWith('### ')) {
      const match = line.match(/^### (\d+)\.\s*(.+)$/);
      if (match) {
        if (currentQ) {
          questions.push({
            number: currentQ.number,
            title: currentQ.title,
            part: currentQ.part,
            content: currentContent.join('\n').trim()
          });
        }
        currentQ = {
          number: parseInt(match[1], 10),
          title: match[2].trim(),
          part: currentPart
        };
        currentContent = [];
        continue;
      }
    }
    if (currentQ) {
      currentContent.push(line);
    }
  }

  if (currentQ) {
    questions.push({
      number: currentQ.number,
      title: currentQ.title,
      part: currentQ.part,
      content: currentContent.join('\n').trim()
    });
  }

  return questions;
}

const questionsCache = new Map<string, ParsedQuestion[]>();

export async function getTrackQuestions(slug: string): Promise<ParsedQuestion[]> {
  if (questionsCache.has(slug)) {
    return questionsCache.get(slug)!;
  }
  const track = await getTrackBySlug(slug);
  if (!track) return [];
  const content = await getTrackContent(track.filename);
  const questions = parseTrackQuestionsFromMarkdown(content);
  questionsCache.set(slug, questions);
  return questions;
}

export async function getQuestionData(slug: string, questionNumber: number): Promise<QuestionViewData | null> {
  const track = await getTrackBySlug(slug);
  if (!track) return null;

  const questions = await getTrackQuestions(slug);
  const index = questions.findIndex(q => q.number === questionNumber);
  if (index === -1) return null;

  const currentQ = questions[index];
  const prevQ = index > 0 ? { number: questions[index - 1].number, title: questions[index - 1].title } : null;
  const nextQ = index < questions.length - 1 ? { number: questions[index + 1].number, title: questions[index + 1].title } : null;

  return {
    track,
    question: currentQ,
    allQuestions: questions.map(q => ({ number: q.number, title: q.title, part: q.part })),
    prevQuestion: prevQ,
    nextQuestion: nextQ,
    totalInTrack: questions.length
  };
}

export interface QuestionIndexItem {
  trackSlug: string;
  trackShortTitle: string;
  sectionNumber: number;
  questionNumber: number;
  title: string;
  part: string;
}

export async function getGlobalSearchIndex(): Promise<QuestionIndexItem[]> {
  const items: QuestionIndexItem[] = [];
  
  for (const track of TRACKS) {
    const questions = await getTrackQuestions(track.slug);
    for (const q of questions) {
      items.push({
        trackSlug: track.slug,
        trackShortTitle: track.shortTitle,
        sectionNumber: track.sectionNumber,
        questionNumber: q.number,
        title: q.title,
        part: q.part
      });
    }
  }
  
  return items;
}
