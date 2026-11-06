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
    badgeColor: 'from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30',
    iconName: 'Shield',
    tags: ['Angular 19', 'Signals', 'TypeScript', 'RxJS', 'NgRx', 'Directives', 'Routing', 'Forms']
  },
  {
    id: '02',
    sectionNumber: 2,
    slug: 'react-nextjs',
    title: 'Complete Master Interview: React 18/19, Hooks, Redux, React Router & Next.js',
    shortTitle: 'React & Modern Frontend (353 Qs)',
    description: 'The definitive 353 React interview questions covering Core React, JSX, Virtual DOM, Fiber, Hooks, Context, Redux Toolkit, React Router v6, SSR, and React 19 Actions.',
    questionCount: 353,
    filename: '02-frontend-react-nextjs.md',
    badgeColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
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
  },
  {
    id: '08',
    sectionNumber: 8,
    slug: 'javascript',
    title: 'Core JavaScript Master: Prototypes, Closures, Event Loop, ES6+ & Web APIs',
    shortTitle: 'JavaScript Internals (518 Qs)',
    description: 'The definitive 518 JavaScript interview questions covering Object prototypes, closures, event loop, Promises, ES6-ES2024, Web APIs, DOM, and performance.',
    questionCount: 518,
    filename: '08-frontend-javascript.md',
    badgeColor: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30',
    iconName: 'FileCode',
    tags: ['JavaScript', 'ES6+', 'Prototypes', 'Event Loop', 'Closures', 'Promises', 'Web APIs', 'V8']
  }
];
