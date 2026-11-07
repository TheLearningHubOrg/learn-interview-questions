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

export interface QuestionIndexItem {
  trackSlug: string;
  trackShortTitle: string;
  sectionNumber: number;
  questionNumber: number;
  title: string;
  part: string;
}

export const TRACKS: TrackMeta[] = [
  {
    id: '01',
    sectionNumber: 1,
    slug: 'angular-ts',
    title: 'Complete Master Interview: Angular Architecture, Signals, RxJS & NgRx',
    shortTitle: 'Angular & Signals (283 Qs)',
    description: 'The definitive 283 Angular interview questions covering Angular 2-19, TypeScript, Standalone Components, Signals, Control Flow, Directives, Pipes, Dependency Injection, RxJS, and NgRx.',
    questionCount: 283,
    filename: '01-frontend-angular-ts.md',
    badgeColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
    iconName: 'Shield',
    tags: ['Angular 19', 'Signals', 'TypeScript', 'RxJS', 'NgRx', 'Directives', 'Routing', 'Forms']
  },
  {
    id: '02',
    sectionNumber: 2,
    slug: 'react-nextjs',
    title: 'Complete Master Interview: React 18/19, Hooks, Redux, React Router & Next.js',
    shortTitle: 'React & Modern Frontend (445 Qs)',
    description: 'The definitive 445 React interview questions covering Core React, JSX, Virtual DOM, Fiber, Hooks, Context, Redux Toolkit, React Router v6, SSR, React 19 Actions, and Historical Internals.',
    questionCount: 445,
    filename: '02-frontend-react-nextjs.md',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30',
    iconName: 'Atom',
    tags: ['React 19', 'Hooks', 'Fiber', 'Server Actions', 'Redux Toolkit', 'React Router v6', 'SSR']
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
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
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
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
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
    badgeColor: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30',
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
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30',
    iconName: 'Cloud',
    tags: ['AWS VPC', 'Lambda', 'Fargate', 'Aurora', 'IAM', 'KMS', 'FinOps']
  },
  {
    id: '07',
    sectionNumber: 7,
    slug: 'dsa',
    title: 'Data Structures & Algorithms Master: Blind 75, NeetCode & Core Patterns (Multi-Language)',
    shortTitle: 'DSA Patterns (Multi-Lang)',
    description: '100 core problems from Blind 75 and NeetCode 150 with complete multi-language implementations in Python 3, Java, C++, and TypeScript across Arrays, Trees, Graphs, and DP.',
    questionCount: 100,
    filename: '07-data-structures-algorithms.md',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30',
    iconName: 'Code2',
    tags: ['Python 3', 'Java', 'C++', 'TypeScript', 'Blind 75', 'NeetCode', 'Graphs', 'DP']
  },
  {
    id: '08',
    sectionNumber: 8,
    slug: 'javascript',
    title: 'Core JavaScript Master: Prototypes, Closures, Event Loop, ES6+ & Web APIs',
    shortTitle: 'JavaScript Internals (521 Qs)',
    description: 'The definitive 521 JavaScript interview questions covering Object prototypes, closures, event loop, Promises, ES6-ES2024, Web APIs, DOM, and performance.',
    questionCount: 521,
    filename: '08-frontend-javascript.md',
    badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30',
    iconName: 'FileCode',
    tags: ['JavaScript', 'ES6+', 'Prototypes', 'Event Loop', 'Closures', 'Promises', 'Web APIs', 'V8']
  }
];
