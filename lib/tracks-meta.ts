// Auto-generated & curated tracks metadata
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
  simpleWords?: string[];
  keyPoints?: string[];
  codeSnippets?: Array<{ language: string; code: string }>;
  diagram?: string;
  explanation?: string;
  rawMarkdown?: string;
  importance?: 'critical' | 'high' | 'medium';
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'lead';
  category?: 'conceptual' | 'coding' | 'architecture' | 'troubleshooting';
  estimatedReadTimeMinutes?: number;
}

export interface QuestionViewData {
  track: TrackMeta;
  question: ParsedQuestion;
  allQuestions: Array<{ number: number; title: string; part: string }>;
  prevQuestion: { number: number; title: string } | null;
  nextQuestion: { number: number; title: string } | null;
  totalInTrack: number;
}

export interface QuestionIndexItem {
  trackSlug: string;
  trackTitle?: string;
  trackShortTitle: string;
  sectionNumber: number;
  questionNumber: number;
  title: string;
  questionTitle?: string;
  part: string;
  summary?: string;
  snippet?: string;
  level?: QuestionLevel;
  isMostAsked?: boolean;
  hasCode?: boolean;
  hasDiagram?: boolean;
  tags?: string[];
  importance?: 'critical' | 'high' | 'medium';
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'lead';
  category?: 'conceptual' | 'coding' | 'architecture' | 'troubleshooting';
  estimatedReadTimeMinutes?: number;
}

export const TRACKS: TrackMeta[] = [
  {
    "id": "1",
    "sectionNumber": 1,
    "slug": "typescript",
    "title": "TypeScript Enterprise Architecture, Type Systems & Advanced Typings Master Interview Bank",
    "shortTitle": "TypeScript Master (50 Qs)",
    "description": "Advanced generic type algebra, conditional types, template literals, type narrowing, distributive types, and decorator metadata.",
    "questionCount": 50,
    "filename": "01-frontend-typescript.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "Code2",
    "tags": [
      "TypeScript",
      "Generics",
      "Type Systems",
      "Conditional Types",
      "Type Narrowing",
      "Decorators"
    ]
  },
  {
    "id": "2",
    "sectionNumber": 2,
    "slug": "angular",
    "title": "Angular Enterprise Architecture, Signals & Performance Master Interview Bank",
    "shortTitle": "Angular Master (283 Qs)",
    "description": "Core Angular architecture, zoneless change detection, Signals reactivity, deferrable views (@defer), standalone components, control flow, RxJS interop, and microfrontends.",
    "questionCount": 283,
    "filename": "01-frontend-angular-ts.md",
    "badgeColor": "bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30",
    "iconName": "Layers",
    "tags": [
      "Angular",
      "Signals",
      "Zoneless",
      "@defer",
      "RxJS",
      "Standalone Components",
      "Enterprise"
    ]
  },
  {
    "id": "3",
    "sectionNumber": 3,
    "slug": "react",
    "title": "React Core Architecture, Hooks & Systems Performance Master Interview Bank",
    "shortTitle": "React Core & Hooks (407 Qs)",
    "description": "Virtual DOM, Fiber reconciliation architecture, Concurrent Mode, React Server Components (RSC), Suspense, Server Actions, Hooks, and state management.",
    "questionCount": 407,
    "filename": "02-frontend-react.md",
    "badgeColor": "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30",
    "iconName": "Atom",
    "tags": [
      "React",
      "Fiber",
      "Concurrent Mode",
      "RSC",
      "Server Actions",
      "Hooks",
      "Performance"
    ]
  },
  {
    "id": "4",
    "sectionNumber": 4,
    "slug": "nextjs",
    "title": "Next.js App Router, SSR & Production Infrastructure Master Interview Bank",
    "shortTitle": "Next.js & App Router (50 Qs)",
    "description": "App Router architecture, Server Actions, partial prerepresenting (PPR), Next.js caching layers, Edge runtime, ISR, dynamic IO, and metadata optimization.",
    "questionCount": 50,
    "filename": "03-frontend-nextjs.md",
    "badgeColor": "bg-slate-900 text-white border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    "iconName": "Globe",
    "tags": [
      "Next.js",
      "App Router",
      "RSC",
      "PPR",
      "Server Actions",
      "Edge Runtime",
      "ISR"
    ]
  },
  {
    "id": "5",
    "sectionNumber": 5,
    "slug": "vue",
    "title": "Vue.js Core Architecture, Composition API & Reactivity Engine Master Interview Bank",
    "shortTitle": "Vue.js & Composition API (35 Qs)",
    "description": "Vue Proxy-based reactivity engine (ref, reactive, effectScope), Composition API, Vapor Mode (VDOM-less compilation), Pinia state architecture, and hydration.",
    "questionCount": 35,
    "filename": "16-frontend-vue.md",
    "badgeColor": "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
    "iconName": "Boxes",
    "tags": [
      "Vue.js",
      "Composition API",
      "Reactivity",
      "Vapor Mode",
      "Pinia",
      "Vite",
      "Frontend"
    ]
  },
  {
    "id": "6",
    "sectionNumber": 6,
    "slug": "nuxt",
    "title": "Nuxt Full-Stack Architecture & Universal Rendering Master Interview Bank",
    "shortTitle": "Nuxt & Universal SSR (35 Qs)",
    "description": "Nuxt Nitro server engine, universal data fetching (useAsyncData, useFetch), Island components, Server-Side Rendering (SSR), Hybrid Rendering, and SEO architecture.",
    "questionCount": 35,
    "filename": "17-frontend-nuxt.md",
    "badgeColor": "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/30",
    "iconName": "Server",
    "tags": [
      "Nuxt",
      "Nitro Engine",
      "SSR",
      "Hybrid Rendering",
      "Islands",
      "Vue.js",
      "Full-Stack"
    ]
  },
  {
    "id": "7",
    "sectionNumber": 7,
    "slug": "svelte",
    "title": "Svelte & SvelteKit Enterprise Architecture Master Interview Bank",
    "shortTitle": "Svelte & SvelteKit (35 Qs)",
    "description": "Svelte Runes ($state, $derived, $effect), fine-grained signal reactivity with zero Virtual DOM overhead, SvelteKit form actions, load functions, and universal hydration.",
    "questionCount": 35,
    "filename": "18-frontend-svelte.md",
    "badgeColor": "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30",
    "iconName": "Zap",
    "tags": [
      "Svelte",
      "Runes",
      "No-VDOM",
      "Signals",
      "SvelteKit",
      "Reactivity",
      "Compilers"
    ]
  },
  {
    "id": "8",
    "sectionNumber": 8,
    "slug": "astro",
    "title": "Astro Content-Driven Web Architecture & Islands Master Interview Bank",
    "shortTitle": "Astro Islands & SSR (35 Qs)",
    "description": "Astro Islands Architecture, Component Island hydration directives (client:load, client:visible, client:idle), Content Collections with Zod schemas, View Transitions API, and hybrid adapters.",
    "questionCount": 35,
    "filename": "19-frontend-astro.md",
    "badgeColor": "bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/30",
    "iconName": "Layout",
    "tags": [
      "Astro",
      "Islands Architecture",
      "Zero JS by Default",
      "Content Collections",
      "SSR",
      "View Transitions"
    ]
  },
  {
    "id": "9",
    "sectionNumber": 9,
    "slug": "javascript",
    "title": "JavaScript Core Language, V8 Engine & Runtime Mechanics Master Interview Bank",
    "shortTitle": "JavaScript & V8 Internals (536 Qs)",
    "description": "V8 engine pipeline (Ignition & TurboFan), Event Loop (microtasks vs macrotasks), closures, prototypal inheritance, lexical scope, garbage collection, and async execution.",
    "questionCount": 536,
    "filename": "08-frontend-javascript.md",
    "badgeColor": "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
    "iconName": "Code2",
    "tags": [
      "JavaScript",
      "V8 Engine",
      "Event Loop",
      "Closures",
      "Prototypes",
      "Garbage Collection",
      "Async"
    ]
  },
  {
    "id": "10",
    "sectionNumber": 10,
    "slug": "html",
    "title": "HTML5 & Semantic Web Architecture Master Interview Bank",
    "shortTitle": "HTML5 & Web APIs (35 Qs)",
    "description": "HTML5 semantic elements, DOM tree construction, forms & Constraint Validation API, dialog vs Popover API, Resource Hints, Web Storage, Web Components, and Web Workers.",
    "questionCount": 35,
    "filename": "21-frontend-html.md",
    "badgeColor": "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30",
    "iconName": "Layout",
    "tags": [
      "HTML5",
      "Semantic HTML",
      "DOM Tree",
      "Validation API",
      "dialog",
      "Popover API",
      "Web Components",
      "Web Workers"
    ]
  },
  {
    "id": "11",
    "sectionNumber": 11,
    "slug": "css",
    "title": "Modern CSS3, Layouts & Cascade Architecture Master Interview Bank",
    "shortTitle": "CSS3 & Modern Layouts (35 Qs)",
    "description": "CSS Box Model, specificity calculation, Flexbox vs CSS Grid, Subgrid, Stacking Context & z-index, Container Queries (@container), Cascade Layers (@layer), and GPU acceleration.",
    "questionCount": 35,
    "filename": "22-frontend-css.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "Palette",
    "tags": [
      "CSS3",
      "CSS Grid",
      "Flexbox",
      "Container Queries",
      "Subgrid",
      "Cascade Layers",
      ":has()",
      "GPU Acceleration"
    ]
  },
  {
    "id": "12",
    "sectionNumber": 12,
    "slug": "web-vitals",
    "title": "Core Web Vitals & Web Performance Engineering Master Interview Bank",
    "shortTitle": "Web Vitals & Performance (35 Qs)",
    "description": "LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift), Critical Rendering Path, Resource Hints, and performance profiling.",
    "questionCount": 35,
    "filename": "23-web-vitals-performance.md",
    "badgeColor": "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
    "iconName": "Zap",
    "tags": [
      "Web Vitals",
      "LCP",
      "INP",
      "CLS",
      "Rendering Path",
      "Resource Hints",
      "Performance Profiling"
    ]
  },
  {
    "id": "13",
    "sectionNumber": 13,
    "slug": "accessibility",
    "title": "Web Accessibility & WCAG 2.2 AA Compliance Master Interview Bank",
    "shortTitle": "Web Accessibility & WCAG (35 Qs)",
    "description": "WCAG 2.2 principles (POUR), WAI-ARIA landmark roles, accessible name calculation, focus management, screen reader optimization, and color contrast compliance.",
    "questionCount": 35,
    "filename": "24-web-accessibility-wcag.md",
    "badgeColor": "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30",
    "iconName": "Eye",
    "tags": [
      "Accessibility",
      "WCAG 2.2",
      "WAI-ARIA",
      "Screen Readers",
      "Keyboard Navigation",
      "Focus Management"
    ]
  },
  {
    "id": "14",
    "sectionNumber": 14,
    "slug": "sql-databases",
    "title": "Relational Database Engineering & Advanced SQL Architecture Master Interview Bank",
    "shortTitle": "SQL & Relational Databases (35 Qs)",
    "description": "ACID transaction isolation levels, B-Tree vs LSM-Tree index structures, EXPLAIN ANALYZE query plan reading, query optimization, and normalization.",
    "questionCount": 35,
    "filename": "04-backend-relational-sql.md",
    "badgeColor": "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30",
    "iconName": "Database",
    "tags": [
      "SQL",
      "Relational Databases",
      "ACID",
      "B-Tree",
      "Indexes",
      "Isolation Levels",
      "Transactions"
    ]
  },
  {
    "id": "15",
    "sectionNumber": 15,
    "slug": "postgresql",
    "title": "PostgreSQL Enterprise Internals & High-Performance Engineering Master Interview Bank",
    "shortTitle": "PostgreSQL Enterprise (35 Qs)",
    "description": "MVCC architecture, table bloat & autovacuum tuning, write-ahead logging (WAL), B-Tree/GIN/GiST indexes, connection pooling (PgBouncer), and partitioning.",
    "questionCount": 35,
    "filename": "05-backend-postgresql.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "Database",
    "tags": [
      "PostgreSQL",
      "MVCC",
      "Autovacuum",
      "WAL",
      "GIN Indexes",
      "PgBouncer",
      "Database Internals"
    ]
  },
  {
    "id": "16",
    "sectionNumber": 16,
    "slug": "mysql",
    "title": "MySQL Internals, InnoDB & High-Throughput Engineering Master Interview Bank",
    "shortTitle": "MySQL & InnoDB (35 Qs)",
    "description": "InnoDB engine architecture, buffer pool management, doublewrite buffer, redo log vs binlog, GTID replication, deadlock resolution, and query optimization.",
    "questionCount": 35,
    "filename": "06-backend-mysql.md",
    "badgeColor": "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
    "iconName": "Database",
    "tags": [
      "MySQL",
      "InnoDB",
      "Buffer Pool",
      "Replication",
      "Redo Log",
      "Binlog",
      "Database Tuning"
    ]
  },
  {
    "id": "17",
    "sectionNumber": 17,
    "slug": "mongodb",
    "title": "MongoDB & Document Database Architecture Master Interview Bank",
    "shortTitle": "MongoDB & NoSQL (35 Qs)",
    "description": "WiredTiger storage engine, document modeling, aggregation framework, replica sets & raft-like consensus, sharding strategies, and write concern.",
    "questionCount": 35,
    "filename": "07-backend-mongodb-nosql.md",
    "badgeColor": "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
    "iconName": "Database",
    "tags": [
      "MongoDB",
      "WiredTiger",
      "NoSQL",
      "Sharding",
      "Replica Sets",
      "Aggregation Pipeline",
      "Document DB"
    ]
  },
  {
    "id": "18",
    "sectionNumber": 18,
    "slug": "redis",
    "title": "Redis In-Memory Data Store & Distributed Caching Master Interview Bank",
    "shortTitle": "Redis & Caching (35 Qs)",
    "description": "Redis single-threaded event loop, core data structures, memory eviction policies, RDB and AOF persistence, Redis Cluster, Sentinel, and Redlock.",
    "questionCount": 35,
    "filename": "08-backend-redis-caching.md",
    "badgeColor": "bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30",
    "iconName": "Database",
    "tags": [
      "Redis",
      "Caching",
      "Redis Cluster",
      "Sentinel",
      "Eviction Policies",
      "Persistence",
      "Redlock"
    ]
  },
  {
    "id": "19",
    "sectionNumber": 19,
    "slug": "dynamodb",
    "title": "Amazon DynamoDB & Cloud NoSQL Architecture Master Interview Bank",
    "shortTitle": "Amazon DynamoDB (35 Qs)",
    "description": "Single-table design, Partition Keys vs Sort Keys, Global Secondary Indexes (GSI), read/write capacity units, DynamoDB Streams, and distributed scale.",
    "questionCount": 35,
    "filename": "09-backend-dynamodb-nosql.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "Database",
    "tags": [
      "DynamoDB",
      "AWS",
      "Single-Table Design",
      "GSI",
      "Streams",
      "NoSQL",
      "High Throughput"
    ]
  },
  {
    "id": "20",
    "sectionNumber": 20,
    "slug": "python",
    "title": "Python Core Language, AsyncIO & Backend Architecture Master Interview Bank",
    "shortTitle": "Python & AsyncIO (65 Qs)",
    "description": "CPython internals, GIL (Global Interpreter Lock), memory management, AsyncIO event loop, generators, decorators, typing, and FastAPI/Django.",
    "questionCount": 65,
    "filename": "04-backend-python.md",
    "badgeColor": "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30",
    "iconName": "FileCode2",
    "tags": [
      "Python 3.12",
      "CPython",
      "AsyncIO",
      "GIL",
      "Generators",
      "Decorators",
      "FastAPI"
    ]
  },
  {
    "id": "21",
    "sectionNumber": 21,
    "slug": "nodejs",
    "title": "Node.js Core Internals, Libuv & Microservices Master Interview Bank",
    "shortTitle": "Node.js & Libuv (60 Qs)",
    "description": "Node.js event loop phases, Libuv thread pool, Streams API, clustering, Worker Threads, memory leak diagnostics, and NestJS enterprise patterns.",
    "questionCount": 60,
    "filename": "05-backend-nodejs.md",
    "badgeColor": "bg-green-50 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30",
    "iconName": "Server",
    "tags": [
      "Node.js",
      "Libuv",
      "Event Loop",
      "Streams",
      "Worker Threads",
      "Microservices",
      "NestJS"
    ]
  },
  {
    "id": "22",
    "sectionNumber": 22,
    "slug": "golang",
    "title": "Go (Golang) Systems Programming & High-Scale Microservices Master Interview Bank",
    "shortTitle": "Golang & Concurrency (50 Qs)",
    "description": "Go runtime scheduler (GMP model), Goroutines, Channels, memory allocation, Garbage Collector, interfaces, context propagation, and gRPC.",
    "questionCount": 50,
    "filename": "19-backend-golang-microservices.md",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30",
    "iconName": "Cpu",
    "tags": [
      "Go",
      "Golang",
      "Goroutines",
      "Channels",
      "GMP Scheduler",
      "Microservices",
      "Concurrency"
    ]
  },
  {
    "id": "23",
    "sectionNumber": 23,
    "slug": "rust",
    "title": "Rust Systems Programming, Concurrency & High Performance Master Interview Bank",
    "shortTitle": "Rust Systems & Tokio (35 Qs)",
    "description": "Rust ownership, borrow checker, lifetimes, fearless concurrency (Send/Sync), smart pointers (Rc, Arc, RefCell), async with Tokio, and Axum microservices.",
    "questionCount": 35,
    "filename": "24-backend-rust-systems-programming.md",
    "badgeColor": "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30",
    "iconName": "Wrench",
    "tags": [
      "Rust",
      "Ownership",
      "Borrow Checker",
      "Lifetimes",
      "Tokio",
      "Axum",
      "Smart Pointers",
      "Systems Programming"
    ]
  },
  {
    "id": "24",
    "sectionNumber": 24,
    "slug": "java",
    "title": "Core Java, JVM Internals, Memory Model & Concurrency Master Interview Bank",
    "shortTitle": "Java Core & JVM (35 Qs)",
    "description": "JVM architecture, G1GC/ZGC, Virtual Threads (Project Loom), JMM volatile/synchronized, Collections internals, CompletableFuture, NIO.2, and ClassLoaders.",
    "questionCount": 35,
    "filename": "14-backend-java.md",
    "badgeColor": "bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30",
    "iconName": "Coffee",
    "tags": [
      "Java",
      "JVM Internals",
      "Virtual Threads",
      "ZGC",
      "Concurrency",
      "Collections",
      "JMM",
      "NIO"
    ]
  },
  {
    "id": "25",
    "sectionNumber": 25,
    "slug": "spring-boot",
    "title": "Spring Boot, Spring Data JPA & Cloud Microservices Master Interview Bank",
    "shortTitle": "Spring Boot & Microservices (35 Qs)",
    "description": "Spring Boot auto-configuration, IoC/DI, Spring Data JPA & Hibernate caching, Spring Security, Kafka integration, Resilience4j, and Microservices.",
    "questionCount": 35,
    "filename": "14-backend-spring-boot.md",
    "badgeColor": "bg-green-50 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30",
    "iconName": "Layers",
    "tags": [
      "Spring Boot",
      "Spring Data JPA",
      "Hibernate",
      "Spring Security",
      "Kafka",
      "Microservices",
      "Resilience4j"
    ]
  },
  {
    "id": "26",
    "sectionNumber": 26,
    "slug": "csharp",
    "title": "C# Language, CLR Internals & High-Performance Engineering Master Interview Bank",
    "shortTitle": "C# & CLR Internals (35 Qs)",
    "description": "CLR memory management, GC generations, Span<T>, Memory<T>, Async/Await State Machine, Channels, Native AOT, SIMD vectorization, and lock-free concurrency.",
    "questionCount": 35,
    "filename": "15-backend-csharp.md",
    "badgeColor": "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30",
    "iconName": "Code",
    "tags": [
      "C#",
      "CLR Internals",
      "Span<T>",
      "GC Generations",
      "Async Await",
      "Native AOT",
      "Channels"
    ]
  },
  {
    "id": "27",
    "sectionNumber": 27,
    "slug": "aspnet-core",
    "title": "ASP.NET Core, Web API & Enterprise Cloud Architecture Master Interview Bank",
    "shortTitle": "ASP.NET Core & Web API (35 Qs)",
    "description": "ASP.NET Core middleware pipeline, DI lifetimes, Minimal APIs, Entity Framework Core, JWT & policy authorization, Kestrel tuning, and Microservices.",
    "questionCount": 35,
    "filename": "15-backend-aspnet-core.md",
    "badgeColor": "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30",
    "iconName": "Globe",
    "tags": [
      "ASP.NET Core",
      ".NET",
      "EF Core",
      "Web API",
      "Minimal APIs",
      "Kestrel",
      "Microservices"
    ]
  },
  {
    "id": "28",
    "sectionNumber": 28,
    "slug": "php",
    "title": "Modern PHP, Zend Engine Internals & Scalable Web Architecture Master Interview Bank",
    "shortTitle": "PHP & Zend Engine (35 Qs)",
    "description": "Zend Engine architecture, zval memory layout, reference counting & GC, OPcache, JIT compiler, Fibers, SPL, streams, and PHP-FPM process tuning.",
    "questionCount": 35,
    "filename": "25-backend-php.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "Code2",
    "tags": [
      "PHP",
      "Zend Engine",
      "zval",
      "OPcache",
      "JIT",
      "Fibers",
      "PHP-FPM",
      "Memory Management"
    ]
  },
  {
    "id": "29",
    "sectionNumber": 29,
    "slug": "laravel",
    "title": "Laravel Framework, Eloquent ORM & Scalable Ecosystem Master Interview Bank",
    "shortTitle": "Laravel & Ecosystem (35 Qs)",
    "description": "Laravel Service Container & Providers, Eloquent ORM N+1 optimization, Queues & Horizon, Octane (Swoole/RoadRunner), Sanctum, and Enterprise Design.",
    "questionCount": 35,
    "filename": "25-backend-laravel.md",
    "badgeColor": "bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30",
    "iconName": "Layers",
    "tags": [
      "Laravel",
      "Eloquent ORM",
      "Service Container",
      "Octane",
      "Horizon",
      "Queues",
      "Sanctum",
      "MVC"
    ]
  },
  {
    "id": "30",
    "sectionNumber": 30,
    "slug": "aws",
    "title": "Cloud Architecture & AWS Enterprise Engineering Master Interview Bank",
    "shortTitle": "AWS Cloud Architecture (65 Qs)",
    "description": "AWS Well-Architected Framework, multi-region high availability, VPC networking, IAM least privilege, ECS/EKS container orchestration, and serverless.",
    "questionCount": 65,
    "filename": "06-cloud-aws-architecture.md",
    "badgeColor": "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
    "iconName": "Cloud",
    "tags": [
      "AWS",
      "Cloud Architecture",
      "IAM",
      "VPC",
      "ECS",
      "EKS",
      "Serverless",
      "High Availability"
    ]
  },
  {
    "id": "31",
    "sectionNumber": 31,
    "slug": "gcp",
    "title": "Google Cloud Platform (GCP) Enterprise Architecture Master Interview Bank",
    "shortTitle": "GCP Cloud Architecture (35 Qs)",
    "description": "GCP VPC network peering, Shared VPC, GKE (Google Kubernetes Engine), Cloud Run serverless containers, Cloud Spanner, and Google Cloud IAM.",
    "questionCount": 35,
    "filename": "24-cloud-gcp-google-cloud.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "Cloud",
    "tags": [
      "GCP",
      "Google Cloud",
      "GKE",
      "Cloud Run",
      "BigQuery",
      "Cloud Spanner",
      "Shared VPC",
      "IAM"
    ]
  },
  {
    "id": "32",
    "sectionNumber": 32,
    "slug": "azure",
    "title": "Microsoft Azure Cloud Enterprise Architecture Master Interview Bank",
    "shortTitle": "Microsoft Azure (35 Qs)",
    "description": "Azure Resource Manager (ARM), Azure Virtual Networks (VNet), AKS (Azure Kubernetes Service), Entra ID (Azure AD), Cosmos DB, and Azure Functions.",
    "questionCount": 35,
    "filename": "25-cloud-azure-enterprise.md",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30",
    "iconName": "Cloud",
    "tags": [
      "Azure",
      "AKS",
      "Entra ID",
      "Cosmos DB",
      "Azure Functions",
      "ARM",
      "VNet",
      "Enterprise Cloud"
    ]
  },
  {
    "id": "33",
    "sectionNumber": 33,
    "slug": "docker",
    "title": "Docker & Containerization Engineering Master Interview Bank",
    "shortTitle": "Docker & Containers (35 Qs)",
    "description": "Linux namespaces, cgroups, UnionFS / overlay2 storage drivers, multi-stage Docker builds, image layer caching, rootless Docker, and container security.",
    "questionCount": 35,
    "filename": "26-devops-docker-containers.md",
    "badgeColor": "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30",
    "iconName": "Boxes",
    "tags": [
      "Docker",
      "Containers",
      "Namespaces",
      "cgroups",
      "Overlay2",
      "Multi-Stage",
      "Security"
    ]
  },
  {
    "id": "34",
    "sectionNumber": 34,
    "slug": "kubernetes",
    "title": "Kubernetes & Cloud-Native Orchestration Master Interview Bank",
    "shortTitle": "Kubernetes (K8s) (40 Qs)",
    "description": "K8s control plane architecture (etcd, kube-scheduler), Pod lifecycle, Deployments, Services, Ingress, CNI networking, CSI volumes, and HPA autoscaling.",
    "questionCount": 40,
    "filename": "27-devops-kubernetes-cloud-native.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "Boxes",
    "tags": [
      "Kubernetes",
      "K8s",
      "Control Plane",
      "Pods",
      "CNI",
      "CSI",
      "Ingress",
      "HPA",
      "etcd"
    ]
  },
  {
    "id": "35",
    "sectionNumber": 35,
    "slug": "terraform",
    "title": "Infrastructure as Code (IaC) & Terraform Enterprise Master Interview Bank",
    "shortTitle": "Terraform & IaC (50 Qs)",
    "description": "Terraform state management, remote backends with state locking, HCL modules, dependency graphs, drift detection, and CI/CD automation.",
    "questionCount": 50,
    "filename": "18-devops-infrastructure-as-code-terraform.md",
    "badgeColor": "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30",
    "iconName": "Wrench",
    "tags": [
      "Terraform",
      "IaC",
      "State Management",
      "HCL",
      "Drift Detection",
      "DevOps",
      "Cloud Automation"
    ]
  },
  {
    "id": "36",
    "sectionNumber": 36,
    "slug": "cicd",
    "title": "CI/CD Pipelines & GitHub Actions Master Interview Bank",
    "shortTitle": "CI/CD & GitHub Actions (35 Qs)",
    "description": "Continuous Integration & Continuous Delivery architectures, GitHub Actions workflows, matrix builds, composite actions, self-hosted runners, and OIDC.",
    "questionCount": 35,
    "filename": "28-devops-cicd-github-actions.md",
    "badgeColor": "bg-slate-900 text-white border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    "iconName": "Zap",
    "tags": [
      "CI/CD",
      "GitHub Actions",
      "Pipelines",
      "Matrix Builds",
      "OIDC",
      "Automation",
      "DevOps"
    ]
  },
  {
    "id": "37",
    "sectionNumber": 37,
    "slug": "gitops",
    "title": "GitOps & Declarative Continuous Delivery (ArgoCD & Flux) Master Interview Bank",
    "shortTitle": "GitOps & ArgoCD (35 Qs)",
    "description": "Declarative Continuous Delivery with GitOps, ArgoCD architecture, ApplicationSets, sync phases, health checks, rollback mechanisms, and Flux.",
    "questionCount": 35,
    "filename": "29-devops-gitops-argocd.md",
    "badgeColor": "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30",
    "iconName": "GitBranch",
    "tags": [
      "GitOps",
      "ArgoCD",
      "Flux",
      "Declarative CD",
      "Kubernetes",
      "ApplicationSets",
      "DevOps"
    ]
  },
  {
    "id": "38",
    "sectionNumber": 38,
    "slug": "linux-os",
    "title": "Linux Operating Systems & Kernel Internals Master Interview Bank",
    "shortTitle": "Linux OS Internals (35 Qs)",
    "description": "Linux process management (fork, execve, zombie, orphan), virtual memory & page tables, VFS (Virtual File System), system calls, and signals.",
    "questionCount": 35,
    "filename": "30-linux-operating-systems.md",
    "badgeColor": "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
    "iconName": "Terminal",
    "tags": [
      "Linux",
      "Kernel",
      "Virtual Memory",
      "Processes",
      "System Calls",
      "VFS",
      "Operating Systems"
    ]
  },
  {
    "id": "39",
    "sectionNumber": 39,
    "slug": "bash-shell",
    "title": "Shell Scripting, Bash & CLI Automation Master Interview Bank",
    "shortTitle": "Bash & Shell Scripting (35 Qs)",
    "description": "Bash shell scripting, POSIX standards, file descriptors (stdin/stdout/stderr), pipes, signal trapping, stream editing with sed/awk, and process substitution.",
    "questionCount": 35,
    "filename": "31-shell-bash-scripting.md",
    "badgeColor": "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
    "iconName": "Terminal",
    "tags": [
      "Bash",
      "Shell Scripting",
      "Linux CLI",
      "Sed",
      "Awk",
      "Pipes",
      "Automation"
    ]
  },
  {
    "id": "40",
    "sectionNumber": 40,
    "slug": "rabbitmq",
    "title": "RabbitMQ & AMQP Message Broker Architecture Master Interview Bank",
    "shortTitle": "RabbitMQ & AMQP (35 Qs)",
    "description": "AMQP 0-9-1 model, Exchanges (Direct, Fanout, Topic, Headers), Queues, Bindings, Publisher Confirms, Consumer Acknowledgments, and Quorum Queues.",
    "questionCount": 35,
    "filename": "32-messaging-rabbitmq.md",
    "badgeColor": "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30",
    "iconName": "Inbox",
    "tags": [
      "RabbitMQ",
      "AMQP",
      "Message Broker",
      "Quorum Queues",
      "Dead Letter",
      "Distributed Systems"
    ]
  },
  {
    "id": "41",
    "sectionNumber": 41,
    "slug": "kafka",
    "title": "Apache Kafka Distributed Event Streaming Master Interview Bank",
    "shortTitle": "Apache Kafka Streaming (35 Qs)",
    "description": "Distributed commit log architecture, Topics, Partitions, Consumer Groups, rebalancing protocols, KRaft consensus, exact-once semantics (EOS), and Kafka Streams.",
    "questionCount": 35,
    "filename": "33-messaging-kafka.md",
    "badgeColor": "bg-slate-900 text-white border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    "iconName": "Boxes",
    "tags": [
      "Apache Kafka",
      "Event Streaming",
      "Distributed Log",
      "Consumer Groups",
      "KRaft",
      "EOS"
    ]
  },
  {
    "id": "42",
    "sectionNumber": 42,
    "slug": "elasticsearch",
    "title": "Elasticsearch & Distributed Search Engine Master Interview Bank",
    "shortTitle": "Elasticsearch & Lucene (35 Qs)",
    "description": "Apache Lucene inverted index internals, term dictionary & posting lists, cluster topology, sharding & replica routing, BM25 scoring, and aggregations.",
    "questionCount": 35,
    "filename": "34-search-engines-elasticsearch.md",
    "badgeColor": "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/30",
    "iconName": "Search",
    "tags": [
      "Elasticsearch",
      "Lucene",
      "Inverted Index",
      "Sharding",
      "BM25",
      "Full-Text Search"
    ]
  },
  {
    "id": "43",
    "sectionNumber": 43,
    "slug": "vector-databases",
    "title": "Vector Databases, Embeddings & RAG Search Master Interview Bank",
    "shortTitle": "Vector DBs & RAG (35 Qs)",
    "description": "High-dimensional vector embeddings, ANN algorithms (HNSW, IVF-PQ), cosine similarity, vector database architectures (Pinecone, Qdrant, Milvus), and RAG.",
    "questionCount": 35,
    "filename": "35-vector-databases-rag.md",
    "badgeColor": "bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/30",
    "iconName": "Cpu",
    "tags": [
      "Vector Databases",
      "HNSW",
      "Embeddings",
      "Pinecone",
      "Qdrant",
      "RAG",
      "ANN Search",
      "AI"
    ]
  },
  {
    "id": "44",
    "sectionNumber": 44,
    "slug": "apache-spark",
    "title": "Apache Spark & Large-Scale Distributed Data Processing Master Interview Bank",
    "shortTitle": "Apache Spark Big Data (35 Qs)",
    "description": "Spark driver and executor topology, RDDs vs DataFrames, Catalyst query optimizer, Tungsten execution engine, shuffle partitions, and Delta Lake.",
    "questionCount": 35,
    "filename": "36-data-engineering-spark.md",
    "badgeColor": "bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30",
    "iconName": "Zap",
    "tags": [
      "Apache Spark",
      "Big Data",
      "Catalyst Optimizer",
      "Tungsten",
      "RDDs",
      "DataFrames",
      "Delta Lake"
    ]
  },
  {
    "id": "45",
    "sectionNumber": 45,
    "slug": "snowflake",
    "title": "Snowflake Data Cloud & Analytics Architecture Master Interview Bank",
    "shortTitle": "Snowflake Data Cloud (35 Qs)",
    "description": "Snowflake 3-tier architecture, micro-partitioning, virtual warehouses, zero-copy cloning, time travel, Streams & Tasks, Snowpipe, Query Profile, and FinOps.",
    "questionCount": 35,
    "filename": "36-data-warehousing-snowflake.md",
    "badgeColor": "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30",
    "iconName": "Database",
    "tags": [
      "Snowflake",
      "Data Cloud",
      "Virtual Warehouses",
      "Micro-Partitions",
      "Zero-Copy Cloning",
      "Time Travel",
      "Snowpipe"
    ]
  },
  {
    "id": "46",
    "sectionNumber": 46,
    "slug": "bigquery",
    "title": "Google BigQuery Architecture, Analytics & FinOps Master Interview Bank",
    "shortTitle": "Google BigQuery (35 Qs)",
    "description": "BigQuery serverless architecture (Dremel, Capacitor, Jupiter), partitioning, clustering, slot reservations, Storage Write API, BigLake, BQML, and FinOps.",
    "questionCount": 35,
    "filename": "36-data-warehousing-bigquery.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "Database",
    "tags": [
      "BigQuery",
      "Google Cloud",
      "Serverless",
      "Dremel",
      "Capacitor",
      "Slots",
      "Storage Write API",
      "BQML"
    ]
  },
  {
    "id": "47",
    "sectionNumber": 47,
    "slug": "dbt",
    "title": "dbt (Data Build Tool) & Modern Analytics Engineering Master Interview Bank",
    "shortTitle": "dbt Analytics Engineering (35 Qs)",
    "description": "dbt Core & dbt Cloud, DAG compilation, ref() and source(), incremental models (merge, insert_overwrite), snapshots (SCD Type 2), Jinja macros, and Slim CI.",
    "questionCount": 35,
    "filename": "37-data-engineering-dbt.md",
    "badgeColor": "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
    "iconName": "Boxes",
    "tags": [
      "dbt",
      "Analytics Engineering",
      "Incremental Models",
      "Snapshots",
      "SCD Type 2",
      "Jinja Macros",
      "Slim CI",
      "Mesh"
    ]
  },
  {
    "id": "48",
    "sectionNumber": 48,
    "slug": "react-native",
    "title": "React Native & Cross-Platform Mobile Master Interview Bank",
    "shortTitle": "React Native & Expo (35 Qs)",
    "description": "React Native New Architecture (TurboModules, Fabric Renderer, Bridgeless mode, JSI), Hermes bytecode pre-compilation, Reanimated 3, and FlatList profiling.",
    "questionCount": 35,
    "filename": "38-mobile-react-native.md",
    "badgeColor": "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30",
    "iconName": "Smartphone",
    "tags": [
      "React Native",
      "TurboModules",
      "Fabric",
      "JSI",
      "Hermes",
      "Reanimated",
      "MMKV",
      "Mobile"
    ]
  },
  {
    "id": "49",
    "sectionNumber": 49,
    "slug": "flutter",
    "title": "Flutter Engine & Dart Architecture Master Interview Bank",
    "shortTitle": "Flutter & Dart (35 Qs)",
    "description": "Flutter Engine architecture, Impeller rendering engine, Dart Isolates & Event Loop, Widget vs Element vs RenderObject trees, BLoC, and Riverpod.",
    "questionCount": 35,
    "filename": "39-mobile-flutter.md",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30",
    "iconName": "Smartphone",
    "tags": [
      "Flutter",
      "Dart",
      "Impeller",
      "Isolates",
      "BLoC",
      "Riverpod",
      "RenderObject",
      "Mobile"
    ]
  },
  {
    "id": "50",
    "sectionNumber": 50,
    "slug": "swift",
    "title": "Swift Language, Memory Safety & Modern Concurrency Master Interview Bank",
    "shortTitle": "Swift & Concurrency (35 Qs)",
    "description": "Automatic Reference Counting (ARC), Value vs Reference Types, Copy-on-Write, Swift Concurrency (async/await, Actors, Sendable), and Protocols.",
    "questionCount": 35,
    "filename": "40-mobile-swift.md",
    "badgeColor": "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30",
    "iconName": "Code",
    "tags": [
      "Swift",
      "ARC",
      "Actors",
      "Concurrency",
      "Sendable",
      "Protocols",
      "Copy-on-Write"
    ]
  },
  {
    "id": "51",
    "sectionNumber": 51,
    "slug": "ios",
    "title": "Native iOS Engineering, SwiftUI & Platform Architecture Master Interview Bank",
    "shortTitle": "iOS Platform & SwiftUI (35 Qs)",
    "description": "Native iOS Architecture, SwiftUI State & Lifecycle, Combine, SwiftData / Core Data, Keychain & Secure Enclave, Instruments Profiling, and MVVM/TCA.",
    "questionCount": 35,
    "filename": "40-mobile-ios.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "Smartphone",
    "tags": [
      "iOS",
      "SwiftUI",
      "Combine",
      "SwiftData",
      "Core Data",
      "Keychain",
      "Instruments",
      "MVVM"
    ]
  },
  {
    "id": "52",
    "sectionNumber": 52,
    "slug": "kotlin",
    "title": "Kotlin Language, Coroutines & Functional Architecture Master Interview Bank",
    "shortTitle": "Kotlin & Coroutines (35 Qs)",
    "description": "Kotlin Language, Null Safety, Coroutines Architecture, Kotlin Flow, StateFlow vs SharedFlow, Structured Concurrency, K2 Compiler, and Functional Programming.",
    "questionCount": 35,
    "filename": "41-mobile-kotlin.md",
    "badgeColor": "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30",
    "iconName": "Code",
    "tags": [
      "Kotlin",
      "Coroutines",
      "Flow",
      "StateFlow",
      "Null Safety",
      "K2 Compiler",
      "KMP"
    ]
  },
  {
    "id": "53",
    "sectionNumber": 53,
    "slug": "android",
    "title": "Native Android, Jetpack Compose & Clean Architecture Master Interview Bank",
    "shortTitle": "Android & Jetpack Compose (35 Qs)",
    "description": "Android Activity/Fragment Lifecycle, Jetpack Compose Recomposition & Stability, State Hoisting, Room, Hilt Dependency Injection, WorkManager, ART Internals, and Profiling.",
    "questionCount": 35,
    "filename": "41-mobile-android.md",
    "badgeColor": "bg-green-50 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30",
    "iconName": "Smartphone",
    "tags": [
      "Android",
      "Jetpack Compose",
      "Recomposition",
      "Room",
      "Hilt",
      "WorkManager",
      "ART",
      "Macrobenchmark"
    ]
  },
  {
    "id": "54",
    "sectionNumber": 54,
    "slug": "software-testing",
    "title": "Software Testing, QA Automation & Quality Engineering Master Interview Bank",
    "shortTitle": "Software Testing & QA (40 Qs)",
    "description": "Test automation pyramids, unit testing vs integration testing, mocking vs stubbing, Playwright & Cypress, contract testing (Pact), and flaky tests.",
    "questionCount": 40,
    "filename": "42-software-testing-qa-automation.md",
    "badgeColor": "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
    "iconName": "CheckCircle2",
    "tags": [
      "Testing",
      "QA",
      "Playwright",
      "Cypress",
      "Unit Testing",
      "Contract Testing",
      "Automation"
    ]
  },
  {
    "id": "55",
    "sectionNumber": 55,
    "slug": "sre-observability",
    "title": "Site Reliability Engineering (SRE) & Observability Master Interview Bank",
    "shortTitle": "SRE & Observability (35 Qs)",
    "description": "SLI, SLO, SLA calculations, Error Budgets, Prometheus & Grafana monitoring, OpenTelemetry distributed tracing, incident post-mortems, and Chaos Engineering.",
    "questionCount": 35,
    "filename": "43-site-reliability-engineering-sre.md",
    "badgeColor": "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30",
    "iconName": "Activity",
    "tags": [
      "SRE",
      "Observability",
      "SLO",
      "SLI",
      "Prometheus",
      "Grafana",
      "OpenTelemetry",
      "Reliability"
    ]
  },
  {
    "id": "56",
    "sectionNumber": 56,
    "slug": "networking-protocols",
    "title": "Computer Networking, Protocols & Web Communication Master Interview Bank",
    "shortTitle": "Networking & Protocols (35 Qs)",
    "description": "OSI 7-Layer model, TCP 3-way handshake & flow control, UDP, TLS 1.3 encryption handshake, HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC), DNS, and WebSockets.",
    "questionCount": 35,
    "filename": "20-networking-protocols-web-communication.md",
    "badgeColor": "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30",
    "iconName": "Globe",
    "tags": [
      "Networking",
      "TCP/IP",
      "UDP",
      "HTTP/3",
      "QUIC",
      "TLS 1.3",
      "DNS",
      "WebSockets",
      "WebRTC"
    ]
  },
  {
    "id": "57",
    "sectionNumber": 57,
    "slug": "solid-principles",
    "title": "SOLID Principles, Object-Oriented Design & Clean Code Master Interview Bank",
    "shortTitle": "SOLID & OOP Principles (35 Qs)",
    "description": "SOLID Principles (SRP, OCP, LSP, ISP, DIP), High Cohesion & Low Coupling, Composition over Inheritance, Law of Demeter, Code Smells, and Architecture Testing with ArchUnit.",
    "questionCount": 35,
    "filename": "45-software-solid-principles.md",
    "badgeColor": "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    "iconName": "CheckCircle2",
    "tags": [
      "SOLID",
      "SRP",
      "OCP",
      "LSP",
      "ISP",
      "DIP",
      "Clean Code",
      "ArchUnit"
    ]
  },
  {
    "id": "58",
    "sectionNumber": 58,
    "slug": "design-patterns",
    "title": "Gang of Four (GoF) & Enterprise Software Design Patterns Master Interview Bank",
    "shortTitle": "Design Patterns (GoF) (35 Qs)",
    "description": "Creational, Structural, Behavioral, and Architectural Design Patterns: Factory, Builder, Singleton, Adapter, Decorator, Facade, Proxy, Strategy, Observer, Command, Hexagonal, CQRS, and SAGA.",
    "questionCount": 35,
    "filename": "45-software-design-patterns.md",
    "badgeColor": "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30",
    "iconName": "Boxes",
    "tags": [
      "Design Patterns",
      "GoF",
      "Factory",
      "Observer",
      "Strategy",
      "Decorator",
      "Adapter",
      "Architecture"
    ]
  },
  {
    "id": "59",
    "sectionNumber": 59,
    "slug": "domain-driven-design",
    "title": "Domain-Driven Design (DDD) & Clean Architecture Master Interview Bank",
    "shortTitle": "Domain-Driven Design (35 Qs)",
    "description": "Strategic DDD (Bounded Contexts, Ubiquitous Language), Tactical DDD (Aggregates, Aggregate Roots, Entities, Value Objects, Domain Events), and Hexagonal Architecture.",
    "questionCount": 35,
    "filename": "46-domain-driven-design-ddd.md",
    "badgeColor": "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30",
    "iconName": "Compass",
    "tags": [
      "DDD",
      "Domain-Driven Design",
      "Bounded Context",
      "Aggregates",
      "Value Objects",
      "Clean Architecture"
    ]
  },
  {
    "id": "60",
    "sectionNumber": 60,
    "slug": "system-design",
    "title": "System Design, Scalability & Distributed Systems Master Interview Bank",
    "shortTitle": "System Design & Scalability (50 Qs)",
    "description": "CAP Theorem, PACELC, consistent hashing, database sharding, distributed transactions (2PC, SAGA), rate limiters, message brokers, caching patterns, and load balancing.",
    "questionCount": 50,
    "filename": "10-system-design-distributed-systems.md",
    "badgeColor": "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30",
    "iconName": "Boxes",
    "tags": [
      "System Design",
      "Distributed Systems",
      "Scalability",
      "CAP Theorem",
      "Sharding",
      "Rate Limiting",
      "High Availability"
    ]
  },
  {
    "id": "61",
    "sectionNumber": 61,
    "slug": "web-security-owasp",
    "title": "Web Application Security & OWASP Top 10 Master Interview Bank",
    "shortTitle": "Web Security & OWASP (50 Qs)",
    "description": "OWASP Top 10 vulnerabilities, XSS, CSRF, SQL Injection, SSRF, IDOR, Content Security Policy (CSP), CORS, OAuth 2.0 / OIDC, and JWT security.",
    "questionCount": 50,
    "filename": "12-web-security-owasp.md",
    "badgeColor": "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30",
    "iconName": "ShieldCheck",
    "tags": [
      "Security",
      "OWASP Top 10",
      "XSS",
      "CSRF",
      "SQL Injection",
      "SSRF",
      "CSP",
      "OAuth 2.0",
      "Cryptography"
    ]
  },
  {
    "id": "62",
    "sectionNumber": 62,
    "slug": "ai-engineering-llm",
    "title": "AI Engineering, LLM Application Architecture & RAG Master Interview Bank",
    "shortTitle": "AI & LLM Engineering (50 Qs)",
    "description": "LLM application architectures, Retrieval-Augmented Generation (RAG), embeddings, vector search, chunking strategies, prompt engineering, fine-tuning, and AI agents.",
    "questionCount": 50,
    "filename": "13-ai-engineering-llm.md",
    "badgeColor": "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
    "iconName": "Sparkles",
    "tags": [
      "AI Engineering",
      "LLM",
      "RAG",
      "Vector Search",
      "Embeddings",
      "Prompt Engineering",
      "LangChain",
      "AI Agents"
    ]
  },
  {
    "id": "63",
    "sectionNumber": 63,
    "slug": "dsa",
    "title": "Data Structures & Algorithms (DSA) Coding Interview Master Bank",
    "shortTitle": "Data Structures & Algorithms (100 Qs)",
    "description": "Arrays, Two Pointers, Sliding Window, Linked Lists, Trees, Graphs, Dynamic Programming, Heap/Priority Queue, Sorting, and Big-O complexity analysis.",
    "questionCount": 100,
    "filename": "07-data-structures-algorithms.md",
    "badgeColor": "bg-slate-900 text-white border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    "iconName": "Binary",
    "tags": [
      "DSA",
      "Algorithms",
      "Data Structures",
      "Dynamic Programming",
      "Graphs",
      "Trees",
      "Big-O",
      "LeetCode"
    ]
  },
  {
    "id": "64",
    "sectionNumber": 64,
    "slug": "behavioral-hr",
    "title": "Behavioral, Leadership & HR Master Interview Bank",
    "shortTitle": "Behavioral & Leadership (50 Qs)",
    "description": "STAR method responses, technical leadership, conflict resolution, project failure recovery, prioritization, system ownership, and behavioral interview questions.",
    "questionCount": 50,
    "filename": "09-general-behavioral-hr.md",
    "badgeColor": "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30",
    "iconName": "Users",
    "tags": [
      "Behavioral",
      "Leadership",
      "STAR Method",
      "HR Interview",
      "Conflict Resolution",
      "Engineering Culture"
    ]
  }
];

export const ALL_TRACK_SLUGS: string[] = TRACKS.map(t => t.slug);
