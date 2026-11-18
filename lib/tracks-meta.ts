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
    shortTitle: 'Databases (PostgreSQL, MySQL, SQL)',
    description: 'PostgreSQL, MySQL, Relational SQL design, ACID, B-Tree indexes, MVCC, MongoDB aggregation, DynamoDB, Redis caching, and real-time scaling.',
    questionCount: 65,
    filename: '03-backend-databases-system-design.md',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    iconName: 'Database',
    tags: ['PostgreSQL', 'MySQL', 'SQL', 'MongoDB', 'DynamoDB', 'Redis', 'ACID', 'Indexing']
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
    description: '100 core problems from Blind 75 and NeetCode 150 with complete multi-language implementations in Python 3, JavaScript, TypeScript, Java, and C++ across Arrays, Trees, Graphs, and DP.',
    questionCount: 100,
    filename: '07-data-structures-algorithms.md',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30',
    iconName: 'Code2',
    tags: ['Python 3', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Blind 75', 'NeetCode', 'Graphs', 'DP']
  },
  {
    id: '08',
    sectionNumber: 8,
    slug: 'javascript',
    title: 'Core JavaScript Master: Prototypes, Closures, Event Loop, ES6+ & Web APIs',
    shortTitle: 'JavaScript Internals (536 Qs)',
    description: 'The definitive 536 JavaScript interview questions covering Object prototypes, closures, event loop, Promises, ES6-ES2024, Web APIs, DOM, and performance.',
    questionCount: 536,
    filename: '08-frontend-javascript.md',
    badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/30',
    iconName: 'FileCode',
    tags: ['JavaScript', 'ES6+', 'Prototypes', 'Event Loop', 'Closures', 'Promises', 'Web APIs', 'V8']
  },
  {
    id: '09',
    sectionNumber: 9,
    slug: 'behavioral-hr',
    title: 'General Behavioral, HR & Engineering Leadership Master: The STAR Framework (50 Qs)',
    shortTitle: 'Behavioral & Leadership (50 Qs)',
    description: 'The definitive 50 behavioral and leadership interview questions with battle-tested STAR method response templates, blameless post-mortems, and salary negotiation.',
    questionCount: 50,
    filename: '09-general-behavioral-hr.md',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30',
    iconName: 'Users',
    tags: ['STAR Method', 'Behavioral', 'Leadership', 'HR', 'Conflict Resolution', 'Post-Mortems', 'Culture', 'Negotiation']
  },
  {
    id: '10',
    sectionNumber: 10,
    slug: 'system-design',
    title: 'Large-Scale System Design & Distributed Architecture Master (50 Qs)',
    shortTitle: 'System Design (50 Qs)',
    description: 'The definitive 50 system design interview questions covering distributed systems trade-offs, real-world architectures (TinyURL, Rate Limiter, WhatsApp, Twitter, Uber, Netflix), consensus, and back-of-the-envelope calculations.',
    questionCount: 50,
    filename: '10-system-design-distributed-systems.md',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30',
    iconName: 'Network',
    tags: ['System Design', 'Distributed Systems', 'Microservices', 'Kafka', 'Redis', 'Consistent Hashing', 'CAP Theorem', 'TinyURL', 'Rate Limiter']
  },
  {
    id: '11',
    sectionNumber: 11,
    slug: 'devops-kubernetes',
    title: 'DevOps, Containers, Kubernetes & Cloud Infrastructure Master (50 Qs)',
    shortTitle: 'DevOps & Kubernetes (50 Qs)',
    description: 'The definitive 50 DevOps interview questions covering Docker internals, Kubernetes control plane, CNI/CSI, Pod lifecycles, HPA, ArgoCD GitOps, CI/CD security, Terraform, and Prometheus/Grafana SRE observability.',
    questionCount: 50,
    filename: '11-devops-containers-kubernetes.md',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
    iconName: 'Server',
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'GitOps', 'Terraform', 'Prometheus', 'ArgoCD', 'SRE']
  },
  {
    id: '12',
    sectionNumber: 12,
    slug: 'web-security-owasp',
    title: 'Web Security, Application Defense & OWASP Top 10 Master (50 Qs)',
    shortTitle: 'Web Security & OWASP (50 Qs)',
    description: 'The definitive 50 application security interview questions covering OWASP Top 10, BOLA/IDOR, XSS, CSRF, SSRF, CSP nonces, JWT security, OAuth 2.0 PKCE, Argon2id, mTLS, and DevSecOps pipelines.',
    questionCount: 50,
    filename: '12-web-security-owasp.md',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
    iconName: 'Lock',
    tags: ['Security', 'OWASP Top 10', 'XSS', 'CSRF', 'SSRF', 'IDOR', 'BOLA', 'Cryptography', 'JWT', 'OAuth 2.0']
  },
  {
    id: '13',
    sectionNumber: 13,
    slug: 'ai-engineering-llm',
    title: 'AI Engineering, LLM Architecture & Agentic Systems Master (50 Qs)',
    shortTitle: 'AI Engineering & LLMs (50 Qs)',
    description: 'The definitive 50 AI engineering interview questions covering RAG pipelines, Vector Search (HNSW), vLLM PagedAttention, KV cache sizing, FlashAttention, Autonomous Agents, Model Context Protocol (MCP), OWASP Top 10 for LLMs, and LoRA/DPO fine-tuning.',
    questionCount: 50,
    filename: '13-ai-engineering-llm.md',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/30',
    iconName: 'Bot',
    tags: ['AI Engineering', 'RAG', 'Vector Search', 'vLLM', 'MCP', 'Agents', 'LoRA', 'DPO', 'OWASP for LLMs', 'FlashAttention']
  },
  {
    id: '14',
    sectionNumber: 14,
    slug: 'java-spring',
    title: 'Full-Stack & Enterprise Java Master: Core Java 21, Spring Boot 3, JPA & Microservices (50 Qs)',
    shortTitle: 'Java & Spring Boot (50 Qs)',
    description: 'JVM internals, ZGC/G1, Virtual Threads (Project Loom), Spring Boot 3 auto-configuration, Spring Data JPA, Hibernate L1/L2 caching, Spring Security 6, Kafka, and Microservices.',
    questionCount: 50,
    filename: '14-backend-java-spring-boot.md',
    badgeColor: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
    iconName: 'Coffee',
    tags: ['Java 21', 'Spring Boot 3', 'Spring Data JPA', 'Hibernate', 'JVM', 'Virtual Threads', 'Spring Security', 'Kafka', 'Microservices']
  },
  {
    id: '15',
    sectionNumber: 15,
    slug: 'dotnet-csharp',
    title: 'Full-Stack & Enterprise .NET Master: C# 12, CLR Internals, ASP.NET Core & EF Core (50 Qs)',
    shortTitle: '.NET & C# (50 Qs)',
    description: 'CLR memory management, GC generations, Span<T>, ASP.NET Core middleware, Minimal APIs, Entity Framework Core 8, LINQ execution, Dapper, and Clean Architecture microservices.',
    questionCount: 50,
    filename: '15-backend-dotnet-csharp.md',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30',
    iconName: 'Code',
    tags: ['C# 12', '.NET 8/9', 'ASP.NET Core', 'EF Core', 'CLR', 'Span<T>', 'LINQ', 'Clean Architecture', 'Microservices']
  },
  {
    id: '16',
    sectionNumber: 16,
    slug: 'modern-frameworks',
    title: 'Modern Frontend Frameworks: Astro, Vue 3, Nuxt 3 & Svelte 5 (50 Qs)',
    shortTitle: 'Astro, Vue 3 & Svelte (50 Qs)',
    description: 'Astro Islands architecture, Server Islands, Content Collections, Zero-JS, Vue 3 Composition API & Proxy reactivity, Nuxt 3 Nitro SSR, and Svelte 5 Runes & surgical DOM compilation.',
    questionCount: 50,
    filename: '16-frontend-modern-frameworks-astro-vue-svelte.md',
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30',
    iconName: 'Sparkles',
    tags: ['Astro', 'Vue 3', 'Nuxt 3', 'Svelte 5', 'SvelteKit', 'Islands Architecture', 'Runes', 'Nitro Engine']
  },
  {
    id: '17',
    sectionNumber: 17,
    slug: 'messaging-queues',
    title: 'Distributed Messaging & Event Streaming: RabbitMQ & Apache Kafka (50 Qs)',
    shortTitle: 'RabbitMQ & Kafka (50 Qs)',
    description: 'RabbitMQ AMQP protocol, Exchanges, Dead Letter Queues, Quorum Queues, Apache Kafka distributed commit log, Partitions, Consumer Groups, Exactly-Once Semantics, and KRaft.',
    questionCount: 50,
    filename: '17-messaging-event-queues-rabbitmq-kafka.md',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    iconName: 'Network',
    tags: ['RabbitMQ', 'Apache Kafka', 'AMQP', 'DLQ', 'Quorum Queues', 'Consumer Groups', 'Exactly-Once', 'Event Sourcing']
  },
  {
    id: '18',
    sectionNumber: 18,
    slug: 'terraform-iac',
    title: 'Infrastructure as Code & Cloud Automation: Terraform, OpenTofu & GitOps (50 Qs)',
    shortTitle: 'Terraform & IaC (50 Qs)',
    description: 'Terraform state architecture, S3/DynamoDB remote locking, Modules, Drift detection, OpenTofu, Kubernetes IaC with Helm/ArgoCD, and Policy as Code.',
    questionCount: 50,
    filename: '18-devops-infrastructure-as-code-terraform.md',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/30',
    iconName: 'Server',
    tags: ['Terraform', 'OpenTofu', 'IaC', 'State Locking', 'GitOps', 'ArgoCD', 'Kubernetes', 'HCL', 'Drift Detection']
  },
  {
    id: '19',
    sectionNumber: 19,
    slug: 'golang',
    title: 'Full-Stack & Cloud-Native Go Master: Concurrency, Goroutines, Channels & Microservices (50 Qs)',
    shortTitle: 'Go & Microservices (50 Qs)',
    description: 'Go 1.22+ GMP Scheduler, Goroutines, Channels, Memory Model, Escape Analysis, Slices/Maps Internals, Context, gRPC, and High-Throughput Microservices.',
    questionCount: 50,
    filename: '19-backend-golang-microservices.md',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30',
    iconName: 'Cpu',
    tags: ['Go 1.22+', 'Golang', 'Goroutines', 'Channels', 'GMP Scheduler', 'gRPC', 'Escape Analysis', 'Microservices', 'Clean Architecture']
  }
];
