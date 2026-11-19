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

export type QuestionLevel = 'junior' | 'mid' | 'senior';

export interface ParsedQuestion {
  number: number;
  title: string;
  part: string;
  content: string;
  summary?: string;
  level?: QuestionLevel;
  isMostAsked?: boolean;
  hasCode?: boolean;
  hasDiagram?: boolean;
  tags?: string[];
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
  summary?: string;
  level?: QuestionLevel;
  isMostAsked?: boolean;
  hasCode?: boolean;
  hasDiagram?: boolean;
  tags?: string[];
}

export const TRACKS: TrackMeta[] = [
  // 1. Frontend Frameworks & Languages
  {
    id: '01',
    sectionNumber: 1,
    slug: 'typescript',
    title: 'TypeScript 5.x Master Architecture & Type Systems Master Interview Bank',
    shortTitle: 'TypeScript 5.x & Internals (50 Qs)',
    description: 'TypeScript type system, generics, conditional types, infer keyword, mapped types, template literal types, utility types, satisfies operator, branded types, and compiler architecture.',
    questionCount: 50,
    filename: '01-frontend-typescript.md',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
    iconName: 'Code2',
    tags: ['TypeScript 5.x', 'Generics', 'Conditional Types', 'infer', 'Mapped Types', 'satisfies', 'Utility Types', 'Compiler']
  },
  {
    id: '02',
    sectionNumber: 2,
    slug: 'angular',
    title: 'Complete Master Interview: Angular Architecture, Signals, RxJS & NgRx',
    shortTitle: 'Angular 19 & Signals (283 Qs)',
    description: 'The definitive Angular interview questions covering Angular 2-19, Standalone Components, Signals, Control Flow, Directives, Pipes, Dependency Injection, RxJS, and NgRx.',
    questionCount: 283,
    filename: '01-frontend-angular-ts.md',
    badgeColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
    iconName: 'Shield',
    tags: ['Angular 19', 'Signals', 'RxJS', 'NgRx', 'Directives', 'Routing', 'Forms', 'Dependency Injection']
  },
  {
    id: '03',
    sectionNumber: 3,
    slug: 'react',
    title: 'Complete Master Interview: React 18/19, Hooks, Redux & Fiber Architecture',
    shortTitle: 'React Core & Hooks (407 Qs)',
    description: 'The definitive React interview questions covering Core React, JSX, Virtual DOM, Fiber architecture, Hooks, Context API, Redux Toolkit, React Router v6, Concurrent Features, and Action hooks.',
    questionCount: 407,
    filename: '02-frontend-react.md',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30',
    iconName: 'Atom',
    tags: ['React 19', 'Hooks', 'Fiber', 'Virtual DOM', 'Redux Toolkit', 'Context API', 'Concurrent React']
  },
  {
    id: '04',
    sectionNumber: 4,
    slug: 'nextjs',
    title: 'Next.js App Router, React Server Components (RSC) & Server Actions Master Interview',
    shortTitle: 'Next.js & Server Actions (50 Qs)',
    description: 'Next.js App Router vs Pages Router, React Server Components (RSC), Server Actions, dynamic rendering, ISR, Turbopack, route handlers, middleware, and edge runtime.',
    questionCount: 50,
    filename: '03-frontend-nextjs.md',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    iconName: 'Sparkles',
    tags: ['Next.js 15', 'App Router', 'RSC', 'Server Actions', 'SSR', 'ISR', 'Turbopack', 'Route Handlers']
  },
  {
    id: '05',
    sectionNumber: 5,
    slug: 'vue',
    title: 'Vue 3 Composition API & Reactivity Engine Master Interview Bank',
    shortTitle: 'Vue 3 & Composition API (35 Qs)',
    description: 'Vue 3 Composition API vs Options API, ES6 Proxy reactivity, ref vs reactive, computed, watchEffect, script setup, defineModel, Pinia stores, composables, and Virtual DOM Block Tree.',
    questionCount: 35,
    filename: '16-frontend-vue.md',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    iconName: 'Sparkles',
    tags: ['Vue 3', 'Composition API', 'Reactivity', 'ref', 'reactive', 'Pinia', 'script setup', 'Virtual DOM']
  },
  {
    id: '06',
    sectionNumber: 6,
    slug: 'nuxt',
    title: 'Nuxt 3 Universal Architecture & Nitro Engine Master Interview Bank',
    shortTitle: 'Nuxt 3 & Nitro SSR (35 Qs)',
    description: 'Nuxt 3 full-stack framework, Nitro server engine, universal data fetching (useFetch, useAsyncData), file-based routing, auto-imports, Hybrid Rendering (ISR/SWR), server routes, and SEO.',
    questionCount: 35,
    filename: '17-frontend-nuxt.md',
    badgeColor: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30',
    iconName: 'Sparkles',
    tags: ['Nuxt 3', 'Nitro Engine', 'SSR', 'useFetch', 'useAsyncData', 'Hybrid Rendering', 'Auto-Imports', 'Server API']
  },
  {
    id: '07',
    sectionNumber: 7,
    slug: 'svelte',
    title: 'Svelte 5 Runes & Compiler Reactivity Master Interview Bank',
    shortTitle: 'Svelte 5 & Runes (35 Qs)',
    description: 'Svelte 5 Runes ($state, $derived, $effect, $props), compiler-based fine-grained reactivity, SvelteKit file-based routing, server load functions, form actions with use:enhance, and edge adapters.',
    questionCount: 35,
    filename: '18-frontend-svelte.md',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30',
    iconName: 'Sparkles',
    tags: ['Svelte 5', 'Runes', '$state', '$derived', 'SvelteKit', 'Compiler', 'Reactivity', 'Form Actions']
  },
  {
    id: '08',
    sectionNumber: 8,
    slug: 'astro',
    title: 'Astro Islands Architecture & Content Collections Master Interview Bank',
    shortTitle: 'Astro & Islands Architecture (35 Qs)',
    description: 'Astro Zero-JS by default, Component Islands architecture, selective hydration directives (client:load, client:visible), Content Collections with Zod schemas, View Transitions, and multi-framework integration.',
    questionCount: 35,
    filename: '19-frontend-astro.md',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30',
    iconName: 'Sparkles',
    tags: ['Astro', 'Islands Architecture', 'Zero-JS', 'client:load', 'Content Collections', 'View Transitions', 'Zod']
  },
  {
    id: '09',
    sectionNumber: 9,
    slug: 'javascript',
    title: 'Complete Core JavaScript & Browser Internals Master Interview Bank',
    shortTitle: 'JavaScript Internals (536 Qs)',
    description: 'Event Loop, Call Stack, Microtasks, Prototypal Inheritance, Closures, Scoping, V8 JIT Compilation, Memory Leaks, Garbage Collection, and Web APIs.',
    questionCount: 536,
    filename: '08-frontend-javascript.md',
    badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30',
    iconName: 'Code2',
    tags: ['JavaScript', 'V8 Engine', 'Event Loop', 'Closures', 'Prototypes', 'Garbage Collection', 'Async']
  },
  {
    id: '10',
    sectionNumber: 10,
    slug: 'html',
    title: 'HTML5 & Semantic Web Architecture Master Interview Bank',
    shortTitle: 'HTML5 & Web APIs (35 Qs)',
    description: 'HTML5 semantic elements, DOM tree construction, forms & Constraint Validation API, dialog vs Popover API, Resource Hints, Web Storage, Web Components (Shadow DOM), Web Workers, and Service Workers.',
    questionCount: 35,
    filename: '21-frontend-html.md',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30',
    iconName: 'Layout',
    tags: ['HTML5', 'Semantic HTML', 'DOM Tree', 'Validation API', 'dialog', 'Popover API', 'Web Components', 'Web Workers']
  },
  {
    id: '11',
    sectionNumber: 11,
    slug: 'css',
    title: 'Modern CSS3, Layouts & Cascade Architecture Master Interview Bank',
    shortTitle: 'CSS3 & Modern Layouts (35 Qs)',
    description: 'CSS Box Model, specificity calculation, Flexbox vs CSS Grid, Subgrid, Stacking Context & z-index, Container Queries (@container), Cascade Layers (@layer), :has() pseudo-class, and GPU acceleration.',
    questionCount: 35,
    filename: '22-frontend-css.md',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
    iconName: 'Palette',
    tags: ['CSS3', 'CSS Grid', 'Flexbox', 'Container Queries', 'Subgrid', 'Cascade Layers', ':has()', 'GPU Acceleration']
  },
  {
    id: '12',
    sectionNumber: 12,
    slug: 'web-vitals',
    title: 'Core Web Vitals & Web Performance Optimization Master Interview Bank',
    shortTitle: 'Core Web Vitals & Perf (35 Qs)',
    description: 'Core Web Vitals (LCP, INP, CLS), PerformanceObserver API, fetchpriority, scheduler.yield(), Long Animation Frames (LoAF), Speculation Rules API, content-visibility, and memory profiling.',
    questionCount: 35,
    filename: '23-web-vitals-performance.md',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
    iconName: 'Activity',
    tags: ['Core Web Vitals', 'LCP', 'INP', 'CLS', 'PerformanceObserver', 'scheduler.yield', 'Speculation Rules', 'Profiling']
  },
  {
    id: '13',
    sectionNumber: 13,
    slug: 'accessibility',
    title: 'Web Accessibility (WCAG 2.2) & Digital Inclusion Master Interview Bank',
    shortTitle: 'Web Accessibility & a11y (35 Qs)',
    description: 'WCAG 2.2 principles (POUR), Conformance levels (A/AA/AAA), First Rule of ARIA, color contrast ratios, aria-label/labelledby/describedby, keyboard accessibility, accessible dialog focus traps, and axe-core.',
    questionCount: 35,
    filename: '24-web-accessibility-wcag.md',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/30',
    iconName: 'Users',
    tags: ['WCAG 2.2', 'Accessibility', 'a11y', 'WAI-ARIA', 'Focus Traps', 'Screen Readers', 'Keyboard Navigation', 'axe-core']
  },

  // 2. Databases & Storage
  {
    id: '14',
    sectionNumber: 14,
    slug: 'sql-databases',
    title: 'Relational SQL & Database Architecture Master Interview Bank',
    shortTitle: 'Relational SQL & DB Design (35 Qs)',
    description: 'Relational SQL design, ACID properties, isolation levels (Read Committed vs Serializable), B-Tree indexes, normalization, joins, and query optimization.',
    questionCount: 35,
    filename: '04-backend-relational-sql.md',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    iconName: 'Database',
    tags: ['SQL', 'ACID', 'Isolation Levels', 'B-Tree', 'Normalization', 'Joins', 'Indexes', 'Query Tuning']
  },
  {
    id: '15',
    sectionNumber: 15,
    slug: 'postgresql',
    title: 'PostgreSQL Advanced Architecture & Internals Master Interview Bank',
    shortTitle: 'PostgreSQL & MVCC (35 Qs)',
    description: 'PostgreSQL MVCC, WAL (Write-Ahead Logging), VACUUM, GIN/GiST/BRIN indexes, CTEs, table partitioning, JSONB querying, and PgBouncer connection pooling.',
    questionCount: 35,
    filename: '05-backend-postgresql.md',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
    iconName: 'Database',
    tags: ['PostgreSQL', 'MVCC', 'WAL', 'VACUUM', 'GIN Index', 'Partitioning', 'JSONB', 'PgBouncer']
  },
  {
    id: '16',
    sectionNumber: 16,
    slug: 'mysql',
    title: 'MySQL & InnoDB Engine Architecture Master Interview Bank',
    shortTitle: 'MySQL & InnoDB (35 Qs)',
    description: 'MySQL InnoDB storage engine architecture, Buffer Pool management, Redo/Undo logs, Clustered vs Secondary indexes, Doublewrite buffer, and Replication.',
    questionCount: 35,
    filename: '06-backend-mysql.md',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    iconName: 'Database',
    tags: ['MySQL', 'InnoDB', 'Buffer Pool', 'Redo Log', 'Undo Log', 'Clustered Index', 'Replication']
  },
  {
    id: '17',
    sectionNumber: 17,
    slug: 'mongodb',
    title: 'MongoDB & Document NoSQL Master Interview Bank',
    shortTitle: 'MongoDB & NoSQL (35 Qs)',
    description: 'MongoDB WiredTiger storage engine, document modeling, Aggregation Pipeline stages, compound indexes, replica sets, Raft consensus, and horizontal sharding.',
    questionCount: 35,
    filename: '07-backend-mongodb-nosql.md',
    badgeColor: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30',
    iconName: 'Database',
    tags: ['MongoDB', 'WiredTiger', 'NoSQL', 'Aggregation', 'Sharding', 'Replica Sets', 'Document Store']
  },
  {
    id: '18',
    sectionNumber: 18,
    slug: 'redis',
    title: 'Redis & Distributed In-Memory Caching Master Interview Bank',
    shortTitle: 'Redis & Caching (35 Qs)',
    description: 'Redis single-threaded event loop, RESP protocol, in-memory data structures, cache eviction algorithms (LRU/LFU), Redis Cluster, and Sentinel HA.',
    questionCount: 35,
    filename: '08-backend-redis-caching.md',
    badgeColor: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
    iconName: 'Zap',
    tags: ['Redis', 'Caching', 'RESP', 'In-Memory', 'LRU Cache', 'Redis Cluster', 'Sentinel', 'PubSub']
  },
  {
    id: '19',
    sectionNumber: 19,
    slug: 'dynamodb',
    title: 'Amazon DynamoDB & Key-Value NoSQL Master Interview Bank',
    shortTitle: 'DynamoDB NoSQL (35 Qs)',
    description: 'AWS DynamoDB partition keys, sort keys, Global Secondary Indexes (GSI), Single-Table Design patterns, DynamoDB Streams, and On-Demand capacity.',
    questionCount: 35,
    filename: '09-backend-dynamodb-nosql.md',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30',
    iconName: 'Database',
    tags: ['DynamoDB', 'AWS NoSQL', 'Single-Table Design', 'GSI', 'LSI', 'Partition Key', 'Streams']
  },

  // 3. Backend Languages & Frameworks
  {
    id: '20',
    sectionNumber: 20,
    slug: 'python',
    title: 'Full-Stack & Backend Python Master: FastAPI, AsyncIO, Core & Internals',
    shortTitle: 'Python & FastAPI (65 Qs)',
    description: 'CPython memory management, the GIL, AsyncIO concurrency, FastAPI / Starlette, Pydantic v2 Rust core, SQLAlchemy 2.0, and Celery workflows.',
    questionCount: 65,
    filename: '04-backend-python.md',
    badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30',
    iconName: 'Terminal',
    tags: ['Python 3.12', 'FastAPI', 'AsyncIO', 'GIL', 'Pydantic v2', 'SQLAlchemy', 'Celery']
  },
  {
    id: '21',
    sectionNumber: 21,
    slug: 'nodejs',
    title: 'Full-Stack & Backend Node.js Master: V8, Libuv, Streams & High-Throughput APIs',
    shortTitle: 'Node.js & Event Loop (60 Qs)',
    description: 'V8 compilation pipeline, Libuv thread pool, Event Loop phases, Streams vs Buffers, backpressure, clustering, and worker threads.',
    questionCount: 60,
    filename: '05-backend-nodejs.md',
    badgeColor: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30',
    iconName: 'Cpu',
    tags: ['Node.js', 'Libuv', 'Event Loop', 'V8 Engine', 'Streams', 'Worker Threads', 'Clustering']
  },
  {
    id: '22',
    sectionNumber: 22,
    slug: 'golang',
    title: 'Full-Stack & Cloud-Native Go Master: Concurrency, Goroutines, Channels & Microservices',
    shortTitle: 'Go (Golang) & Concurrency (50 Qs)',
    description: 'Go 1.22+ GMP Scheduler, Goroutines, Channels, Memory Model, Escape Analysis, Slices/Maps Internals, Context, gRPC, and High-Throughput Microservices.',
    questionCount: 50,
    filename: '19-backend-golang-microservices.md',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30',
    iconName: 'Cpu',
    tags: ['Go 1.22+', 'Golang', 'Goroutines', 'Channels', 'GMP Scheduler', 'gRPC', 'Escape Analysis', 'Microservices']
  },
  {
    id: '23',
    sectionNumber: 23,
    slug: 'rust',
    title: 'Systems Programming & Cloud-Native Rust: Ownership, Concurrency & Tokio',
    shortTitle: 'Rust & Systems (35 Qs)',
    description: 'Ownership, Borrow Checker, Lifetimes, Smart Pointers (Box, Rc, Arc, RefCell), Tokio Async runtime, Axum, Fearless Concurrency (Send/Sync), and Zero-Cost Abstractions.',
    questionCount: 35,
    filename: '24-backend-rust-systems-programming.md',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30',
    iconName: 'Wrench',
    tags: ['Rust', 'Ownership', 'Borrow Checker', 'Lifetimes', 'Tokio', 'Axum', 'Smart Pointers', 'Systems Programming']
  },
  {
    id: '24',
    sectionNumber: 24,
    slug: 'java-spring',
    title: 'Full-Stack & Enterprise Java Master: Core Java 21, Spring Boot 3, JPA & Microservices',
    shortTitle: 'Java 21 & Spring Boot 3 (50 Qs)',
    description: 'JVM internals, ZGC/G1, Virtual Threads (Project Loom), Spring Boot 3 auto-configuration, Spring Data JPA, Hibernate caching, Spring Security 6, Kafka, and Microservices.',
    questionCount: 50,
    filename: '14-backend-java-spring-boot.md',
    badgeColor: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
    iconName: 'Coffee',
    tags: ['Java 21', 'Spring Boot 3', 'Spring Data JPA', 'Hibernate', 'JVM', 'Virtual Threads', 'Spring Security']
  },
  {
    id: '25',
    sectionNumber: 25,
    slug: 'dotnet-csharp',
    title: 'Full-Stack & Enterprise .NET Master: C# 12, CLR Internals, ASP.NET Core & EF Core',
    shortTitle: '.NET 8/9 & C# 12 (50 Qs)',
    description: 'CLR memory management, GC generations, Span<T>, ASP.NET Core middleware, Minimal APIs, Entity Framework Core 8, LINQ execution, Dapper, and Clean Architecture microservices.',
    questionCount: 50,
    filename: '15-backend-dotnet-csharp.md',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30',
    iconName: 'Code',
    tags: ['C# 12', '.NET 8/9', 'ASP.NET Core', 'EF Core', 'CLR', 'Span<T>', 'LINQ', 'Clean Architecture']
  },
  {
    id: '26',
    sectionNumber: 26,
    slug: 'php-laravel',
    title: 'Modern PHP 8.3+ & Enterprise Laravel 11 Architecture Master Interview Bank',
    shortTitle: 'PHP 8.3 & Laravel 11 (35 Qs)',
    description: 'PHP 8.3 JIT, Fibers, Readonly classes, Laravel 11 Service Container, Eloquent ORM N+1 optimization, Octane (Swoole/RoadRunner), Queues & Horizon.',
    questionCount: 35,
    filename: '25-backend-php-laravel-modern-web.md',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30',
    iconName: 'Layers',
    tags: ['PHP 8.3', 'Laravel 11', 'Eloquent ORM', 'Service Container', 'Octane', 'Horizon', 'Queues', 'MVC']
  },

  // 4. Cloud Platforms & DevOps
  {
    id: '27',
    sectionNumber: 27,
    slug: 'aws',
    title: 'Cloud Architecture & AWS Enterprise Engineering Master Interview Bank',
    shortTitle: 'AWS Cloud Architecture (65 Qs)',
    description: 'AWS multi-region VPC design, IAM policies, ECS/EKS container orchestration, Lambda serverless, SQS/SNS event routing, S3 security, and CloudFront CDN.',
    questionCount: 65,
    filename: '06-cloud-aws-architecture.md',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30',
    iconName: 'Cloud',
    tags: ['AWS', 'VPC', 'IAM', 'Lambda', 'ECS', 'EKS', 'S3', 'CloudFront', 'Cloud Architecture']
  },
  {
    id: '28',
    sectionNumber: 28,
    slug: 'gcp',
    title: 'Google Cloud Platform (GCP) Enterprise Architecture Master Interview Bank',
    shortTitle: 'Google Cloud (GCP) (35 Qs)',
    description: 'Google Kubernetes Engine (GKE Autopilot), Cloud Run serverless containers, BigQuery petabit analytics, Pub/Sub, Cloud Spanner TrueTime, and VPC Service Controls.',
    questionCount: 35,
    filename: '24-cloud-gcp-google-cloud.md',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
    iconName: 'Cloud',
    tags: ['GCP', 'Google Cloud', 'GKE', 'Cloud Run', 'BigQuery', 'Pub/Sub', 'Spanner', 'VPC-SC']
  },
  {
    id: '29',
    sectionNumber: 29,
    slug: 'azure',
    title: 'Microsoft Azure Enterprise Cloud Master Interview Bank',
    shortTitle: 'Microsoft Azure (35 Qs)',
    description: 'Azure Kubernetes Service (AKS), Azure Container Apps, Cosmos DB multi-model consistency, Azure SQL, Microsoft Entra ID (Azure AD), VNet peering, and Landing Zones.',
    questionCount: 35,
    filename: '25-cloud-azure-enterprise.md',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30',
    iconName: 'Cloud',
    tags: ['Azure', 'AKS', 'Cosmos DB', 'Container Apps', 'Entra ID', 'Azure SQL', 'Landing Zones']
  },
  {
    id: '30',
    sectionNumber: 30,
    slug: 'docker',
    title: 'Docker & Container Architecture Master Interview Bank',
    shortTitle: 'Docker & Containers (35 Qs)',
    description: 'Linux namespaces, cgroups, UnionFS, multi-stage Docker builds, layer caching, container security, and minimal base images (Distroless/Alpine).',
    questionCount: 35,
    filename: '26-devops-docker-containers.md',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
    iconName: 'Server',
    tags: ['Docker', 'Containers', 'Cgroups', 'Namespaces', 'Multi-Stage', 'Distroless', 'Security']
  },
  {
    id: '31',
    sectionNumber: 31,
    slug: 'kubernetes',
    title: 'Kubernetes (K8s) & Cloud-Native Architecture Master Interview Bank',
    shortTitle: 'Kubernetes (K8s) (40 Qs)',
    description: 'Kubernetes control plane, kubelet, kube-proxy, Pod lifecycle, Deployments, Services, Ingress, CNI, CSI, HPA, and Custom Resource Definitions (CRDs).',
    questionCount: 40,
    filename: '27-devops-kubernetes-cloud-native.md',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30',
    iconName: 'Server',
    tags: ['Kubernetes', 'K8s', 'Control Plane', 'Pods', 'Deployments', 'Ingress', 'HPA', 'CNI', 'CRD']
  },
  {
    id: '32',
    sectionNumber: 32,
    slug: 'terraform',
    title: 'Infrastructure as Code & Cloud Automation: Terraform, OpenTofu & GitOps',
    shortTitle: 'Terraform & IaC (50 Qs)',
    description: 'Terraform state architecture, S3/DynamoDB remote locking, Modules, Drift detection, OpenTofu, Kubernetes IaC with Helm/ArgoCD, and Policy as Code.',
    questionCount: 50,
    filename: '18-devops-infrastructure-as-code-terraform.md',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30',
    iconName: 'Server',
    tags: ['Terraform', 'OpenTofu', 'IaC', 'State Locking', 'GitOps', 'ArgoCD', 'HCL', 'Drift Detection']
  },
  {
    id: '33',
    sectionNumber: 33,
    slug: 'cicd',
    title: 'CI/CD Pipelines & GitHub Actions Master Interview Bank',
    shortTitle: 'CI/CD & GitHub Actions (35 Qs)',
    description: 'Continuous Integration & Continuous Delivery pipelines, GitHub Actions workflow syntax, matrix builds, artifact caching, OIDC cloud auth, self-hosted ARC runners, SLSA, and DORA metrics.',
    questionCount: 35,
    filename: '28-devops-cicd-github-actions.md',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30',
    iconName: 'Network',
    tags: ['CI/CD', 'GitHub Actions', 'Pipelines', 'Runners', 'OIDC', 'SLSA', 'Matrix Builds', 'DORA']
  },
  {
    id: '34',
    sectionNumber: 34,
    slug: 'gitops',
    title: 'GitOps, ArgoCD & Progressive Delivery Master Interview Bank',
    shortTitle: 'GitOps & ArgoCD (35 Qs)',
    description: 'OpenGitOps core principles, ArgoCD architecture, Application & ApplicationSet CRDs, drift detection, self-healing, External Secrets Operator, and Argo Rollouts canary deployments.',
    questionCount: 35,
    filename: '29-devops-gitops-argocd.md',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/30',
    iconName: 'Server',
    tags: ['GitOps', 'ArgoCD', 'ApplicationSet', 'Drift Detection', 'Self-Healing', 'Argo Rollouts', 'Canary', 'K8s']
  },
  {
    id: '35',
    sectionNumber: 35,
    slug: 'linux-os',
    title: 'Linux Operating Systems & Kernel Internals Master Interview Bank',
    shortTitle: 'Linux OS & Kernel (35 Qs)',
    description: 'Linux process lifecycles, fork/execve, Zombie & Orphan processes, signals (SIGTERM/SIGKILL), IPC (Unix domain sockets, pipes, shared memory), virtual memory, page cache, and inodes.',
    questionCount: 35,
    filename: '30-linux-operating-systems.md',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    iconName: 'Terminal',
    tags: ['Linux', 'Operating Systems', 'Kernel', 'Processes', 'Signals', 'IPC', 'Virtual Memory', 'Inodes']
  },
  {
    id: '36',
    sectionNumber: 36,
    slug: 'bash-shell',
    title: 'Bash & Shell Scripting Mastery Master Interview Bank',
    shortTitle: 'Bash & Shell Scripting (35 Qs)',
    description: 'Bash script robustness (set -euo pipefail), conditionals, loops, subshells, process substitution, standard file descriptors (stdin, stdout, stderr), grep, sed, awk, and regex.',
    questionCount: 35,
    filename: '31-shell-bash-scripting.md',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    iconName: 'Terminal',
    tags: ['Bash', 'Shell Scripting', 'Pipefail', 'Grep', 'Sed', 'Awk', 'Regex', 'CLI']
  },

  // 5. Messaging, Search & Data Engineering
  {
    id: '37',
    sectionNumber: 37,
    slug: 'rabbitmq',
    title: 'RabbitMQ & AMQP Message Broker Master Interview Bank',
    shortTitle: 'RabbitMQ & AMQP (35 Qs)',
    description: 'RabbitMQ AMQP 0-9-1 protocol, Direct/Topic/Fanout/Headers exchanges, queue durability, Dead Letter Queues (DLQ), Quorum Queues (Raft), consumer prefetch, and publisher confirms.',
    questionCount: 35,
    filename: '32-messaging-rabbitmq.md',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30',
    iconName: 'Network',
    tags: ['RabbitMQ', 'AMQP', 'DLQ', 'Quorum Queues', 'Exchanges', 'Message Broker', 'Prefetch']
  },
  {
    id: '38',
    sectionNumber: 38,
    slug: 'kafka',
    title: 'Apache Kafka & Event Streaming Master Interview Bank',
    shortTitle: 'Apache Kafka & Streaming (35 Qs)',
    description: 'Apache Kafka distributed commit log, topics, partitions, consumer groups, offset management, Exactly-Once Semantics (EOS), compacted topics, Schema Registry, and KRaft consensus.',
    questionCount: 35,
    filename: '33-messaging-kafka.md',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    iconName: 'Network',
    tags: ['Apache Kafka', 'Streaming', 'Partitions', 'Consumer Groups', 'Exactly-Once', 'Commit Log', 'KRaft']
  },
  {
    id: '39',
    sectionNumber: 39,
    slug: 'elasticsearch',
    title: 'Search Engines: Elasticsearch, OpenSearch & Lucene Master Interview Bank',
    shortTitle: 'Elasticsearch & Search (35 Qs)',
    description: 'Apache Lucene inverted index architecture, BM25 scoring algorithm, Elasticsearch sharding, tokenizers, analyzers, aggregations, fuzzy search, and cluster scaling.',
    questionCount: 35,
    filename: '34-search-engines-elasticsearch.md',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30',
    iconName: 'Search',
    tags: ['Elasticsearch', 'OpenSearch', 'Lucene', 'Inverted Index', 'BM25', 'Search Engines', 'Sharding']
  },
  {
    id: '40',
    sectionNumber: 40,
    slug: 'vector-databases',
    title: 'Vector Databases & Vector Search Master Interview Bank',
    shortTitle: 'Vector Databases & RAG (35 Qs)',
    description: 'Vector embeddings, Approximate Nearest Neighbor (ANN) search, HNSW graph indexing, IVFFlat, Cosine similarity vs Dot product, Pinecone, Milvus, and Hybrid Search (RRF).',
    questionCount: 35,
    filename: '35-vector-databases-rag.md',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30',
    iconName: 'Search',
    tags: ['Vector Databases', 'HNSW', 'Embeddings', 'Pinecone', 'Milvus', 'Hybrid Search', 'RAG', 'ANN']
  },
  {
    id: '41',
    sectionNumber: 41,
    slug: 'apache-spark',
    title: 'Apache Spark & Big Data Pipelines Master Interview Bank',
    shortTitle: 'Apache Spark & Big Data (35 Qs)',
    description: 'Apache Spark Catalyst Optimizer, Tungsten execution engine, RDDs vs DataFrames, narrow vs wide transformations, shuffling bottlenecks, partition tuning, and Delta Lake.',
    questionCount: 35,
    filename: '36-data-engineering-spark.md',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    iconName: 'Database',
    tags: ['Apache Spark', 'Big Data', 'Catalyst Optimizer', 'Tungsten', 'RDDs', 'DataFrames', 'Delta Lake']
  },
  {
    id: '42',
    sectionNumber: 42,
    slug: 'data-warehousing',
    title: 'Modern Data Warehousing: Snowflake & BigQuery Master Interview Bank',
    shortTitle: 'Snowflake & BigQuery (35 Qs)',
    description: 'Snowflake 3-tier multi-cluster shared data architecture, micro-partitioning, zero-copy cloning, time travel, Google BigQuery Dremel & Capacitor storage, slot reservations, and FinOps.',
    questionCount: 35,
    filename: '36-data-warehousing-snowflake-bigquery.md',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
    iconName: 'Database',
    tags: ['Data Warehousing', 'Snowflake', 'BigQuery', 'OLAP', 'Star Schema', 'SCD', 'Micro-Partitions', 'FinOps']
  },
  {
    id: '43',
    sectionNumber: 43,
    slug: 'dbt',
    title: 'dbt (Data Build Tool) & Modern Analytics Engineering Master Interview Bank',
    shortTitle: 'dbt Analytics Engineering (35 Qs)',
    description: 'dbt Core & dbt Cloud, DAG compilation, ref() and source(), incremental models (merge, insert_overwrite), snapshots (SCD Type 2), Jinja macros, model contracts, Slim CI, and dbt Mesh.',
    questionCount: 35,
    filename: '37-data-engineering-dbt.md',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    iconName: 'Boxes',
    tags: ['dbt', 'Analytics Engineering', 'Incremental Models', 'Snapshots', 'SCD Type 2', 'Jinja Macros', 'Slim CI', 'Mesh']
  },

  // 6. Mobile Development
  {
    id: '44',
    sectionNumber: 44,
    slug: 'react-native',
    title: 'React Native & Cross-Platform Mobile Master Interview Bank',
    shortTitle: 'React Native & Expo (35 Qs)',
    description: 'React Native New Architecture (TurboModules, Fabric Renderer, Bridgeless mode, JSI), Hermes bytecode pre-compilation, Reanimated 3 UI worklets, FlatList profiling, and MMKV.',
    questionCount: 35,
    filename: '38-mobile-react-native.md',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30',
    iconName: 'Smartphone',
    tags: ['React Native', 'TurboModules', 'Fabric', 'JSI', 'Hermes', 'Reanimated', 'MMKV', 'Mobile']
  },
  {
    id: '45',
    sectionNumber: 45,
    slug: 'flutter',
    title: 'Flutter Engine & Dart Architecture Master Interview Bank',
    shortTitle: 'Flutter & Dart (35 Qs)',
    description: 'Flutter Engine architecture, Impeller rendering engine vs Skia shader compilation, Dart Isolates & Event Loop, Widget vs Element vs RenderObject trees, BLoC, Riverpod, and Dart FFI.',
    questionCount: 35,
    filename: '39-mobile-flutter.md',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30',
    iconName: 'Smartphone',
    tags: ['Flutter', 'Dart', 'Impeller', 'Isolates', 'BLoC', 'Riverpod', 'RenderObject', 'Mobile']
  },
  {
    id: '46',
    sectionNumber: 46,
    slug: 'ios-swift',
    title: 'Native iOS, Swift 6 & SwiftUI Master Interview Bank',
    shortTitle: 'iOS & Swift 6 (35 Qs)',
    description: 'Automatic Reference Counting (ARC), strong/weak/unowned references, Swift Concurrency (async/await, Tasks, Actors, @MainActor), SwiftUI state management, GCD, and Secure Enclave.',
    questionCount: 35,
    filename: '40-mobile-ios-swift.md',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30',
    iconName: 'Smartphone',
    tags: ['iOS', 'Swift 6', 'SwiftUI', 'ARC', 'Actors', 'Concurrency', 'GCD', 'Secure Enclave']
  },
  {
    id: '47',
    sectionNumber: 47,
    slug: 'android-kotlin',
    title: 'Native Android, Kotlin Coroutines & Jetpack Compose Master Interview Bank',
    shortTitle: 'Android & Kotlin Compose (35 Qs)',
    description: 'Kotlin Coroutines (suspend, CoroutineScope, Dispatchers), StateFlow vs SharedFlow, Jetpack Compose recomposition & remember, Activity lifecycle, Hilt dependency injection, and WorkManager.',
    questionCount: 35,
    filename: '41-mobile-android-kotlin.md',
    badgeColor: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30',
    iconName: 'Smartphone',
    tags: ['Android', 'Kotlin', 'Jetpack Compose', 'Coroutines', 'StateFlow', 'Hilt', 'WorkManager']
  },

  // 7. Quality, SRE, Networking & Architecture
  {
    id: '48',
    sectionNumber: 48,
    slug: 'software-testing',
    title: 'Software Testing, QA Automation & Load Testing Master Interview Bank',
    shortTitle: 'Software Testing & QA (40 Qs)',
    description: 'Testing Pyramid, Vitest vs Jest ESM performance, Mock Service Worker (MSW) network interception, Playwright E2E automation & auto-waiting, Pact contract testing, and k6 load testing.',
    questionCount: 40,
    filename: '42-software-testing-qa-automation.md',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
    iconName: 'Activity',
    tags: ['Testing', 'Playwright', 'Vitest', 'Jest', 'MSW', 'E2E', 'k6', 'Contract Testing']
  },
  {
    id: '49',
    sectionNumber: 49,
    slug: 'sre-observability',
    title: 'Site Reliability Engineering (SRE) & Observability Master Interview Bank',
    shortTitle: 'SRE & Observability (35 Qs)',
    description: 'SRE core principles, SLI/SLO/SLA mathematical definitions, Error Budgets governance, OpenTelemetry collector architecture, Prometheus TSDB & PromQL percentiles, and Grafana dashboards.',
    questionCount: 35,
    filename: '43-site-reliability-engineering-sre.md',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30',
    iconName: 'Gauge',
    tags: ['SRE', 'Observability', 'SLO', 'SLI', 'Prometheus', 'Grafana', 'OpenTelemetry', 'PromQL']
  },
  {
    id: '50',
    sectionNumber: 50,
    slug: 'networking-protocols',
    title: 'Computer Networking, Web Protocols & Real-Time Communication Master Interview Bank',
    shortTitle: 'Networking & Web Protocols (35 Qs)',
    description: 'TCP/IP 3-way/4-way handshake, UDP, HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC), TLS 1.3, DNS, WebSockets, Server-Sent Events, WebRTC, and Edge Proxies.',
    questionCount: 35,
    filename: '20-networking-protocols-web-communication.md',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
    iconName: 'Globe',
    tags: ['Networking', 'TCP/IP', 'UDP', 'HTTP/3', 'QUIC', 'TLS 1.3', 'DNS', 'WebSockets', 'WebRTC']
  },
  {
    id: '51',
    sectionNumber: 51,
    slug: 'design-patterns',
    title: 'Software Design Patterns & SOLID Principles Master Interview Bank',
    shortTitle: 'Design Patterns & SOLID (35 Qs)',
    description: 'SOLID principles in enterprise architecture, Gang of Four (GoF) Creational patterns (Factory, Singleton, Builder), Structural patterns (Adapter, Decorator, Facade), and Behavioral patterns.',
    questionCount: 35,
    filename: '45-software-design-patterns-solid.md',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30',
    iconName: 'Boxes',
    tags: ['Design Patterns', 'SOLID', 'GoF Patterns', 'Factory', 'Observer', 'Strategy', 'Architecture']
  },
  {
    id: '52',
    sectionNumber: 52,
    slug: 'domain-driven-design',
    title: 'Domain-Driven Design (DDD) & Clean Architecture Master Interview Bank',
    shortTitle: 'Domain-Driven Design (35 Qs)',
    description: 'Strategic DDD (Bounded Contexts, Ubiquitous Language), Tactical DDD (Aggregates, Aggregate Roots, Entities, Value Objects, Domain Events), Hexagonal Architecture, and SAGA pattern.',
    questionCount: 35,
    filename: '46-domain-driven-design-ddd.md',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30',
    iconName: 'Boxes',
    tags: ['DDD', 'Domain-Driven Design', 'Bounded Context', 'Aggregates', 'Hexagonal Architecture', 'SAGA']
  },
  {
    id: '53',
    sectionNumber: 53,
    slug: 'system-design',
    title: 'Large-Scale Distributed System Design Master Interview Bank',
    shortTitle: 'System Design (50 Qs)',
    description: 'Consistent Hashing, CAP Theorem, Database Sharding, Caching Strategies, Rate Limiting, High Availability, Resiliency, and Distributed Consensus.',
    questionCount: 50,
    filename: '10-system-design-distributed-systems.md',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30',
    iconName: 'Network',
    tags: ['System Design', 'Distributed Systems', 'CAP Theorem', 'Sharding', 'Consistent Hashing', 'High Availability']
  },
  {
    id: '54',
    sectionNumber: 54,
    slug: 'web-security-owasp',
    title: 'Web Security, Cryptography & OWASP Top 10 Master Interview Bank',
    shortTitle: 'Web Security & OWASP (50 Qs)',
    description: 'OWASP Top 10, SQLi, XSS, CSRF, SSRF, JWT Security, OAuth2 / OIDC, CORS, CSP, Cryptography, and Zero-Trust Architecture.',
    questionCount: 50,
    filename: '12-web-security-owasp.md',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
    iconName: 'Lock',
    tags: ['Web Security', 'OWASP Top 10', 'XSS', 'CSRF', 'SSRF', 'JWT', 'OAuth2', 'Cryptography']
  },
  {
    id: '55',
    sectionNumber: 55,
    slug: 'ai-engineering-llm',
    title: 'AI Engineering, LLM Systems & Agentic Architecture Master Interview Bank',
    shortTitle: 'AI Engineering & LLMs (50 Qs)',
    description: 'LLM Architecture, Transformers, Attention Mechanism, RAG, Vector Search, Prompt Engineering, Agents, Model Context Protocol (MCP), and LoRA Fine-Tuning.',
    questionCount: 50,
    filename: '13-ai-engineering-llm.md',
    badgeColor: 'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/30',
    iconName: 'Bot',
    tags: ['AI Engineering', 'LLM', 'RAG', 'Vector Search', 'Agents', 'MCP', 'LoRA', 'Transformers']
  },
  {
    id: '56',
    sectionNumber: 56,
    slug: 'dsa',
    title: 'Data Structures & Algorithms (DSA) Patterns Master Interview Bank',
    shortTitle: 'DSA & Coding Patterns (100 Qs)',
    description: 'Two Pointers, Sliding Window, Fast & Slow Pointers, Trees, Graphs, Dynamic Programming, Backtracking, and Greedy Algorithms.',
    questionCount: 100,
    filename: '07-data-structures-algorithms.md',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    iconName: 'FileCode',
    tags: ['DSA', 'Algorithms', 'Data Structures', 'Dynamic Programming', 'Graphs', 'Trees', 'Two Pointers']
  },
  {
    id: '57',
    sectionNumber: 57,
    slug: 'behavioral-hr',
    title: 'Behavioral, Leadership & Cultural Master Interview Bank',
    shortTitle: 'Behavioral & Leadership (50 Qs)',
    description: 'STAR Technique, Behavioral Questions, Conflict Resolution, Engineering Leadership, Project Retrospectives, and Culture Fit.',
    questionCount: 50,
    filename: '09-general-behavioral-hr.md',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/30',
    iconName: 'Users',
    tags: ['Behavioral', 'Leadership', 'STAR Method', 'Management', 'Soft Skills', 'HR Interview']
  }
];
