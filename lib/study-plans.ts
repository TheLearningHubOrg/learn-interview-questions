import { getTrackStudiedMap } from './study-progress';

export interface PlanQuestionItem {
  trackSlug: string;
  trackName: string;
  questionNumber: number;
  day: number;
  topic: string;
  title: string;
  importance: 'MUST_KNOW' | 'HIGH_YIELD' | 'STAFF_LEVEL';
}

export interface StudyPlanDay {
  dayNumber: number;
  title: string;
  focus: string;
  questions: PlanQuestionItem[];
}

export interface StudyPlan {
  id: string;
  title: string;
  tagline: string;
  description: string;
  durationDays: number;
  totalQuestions: number;
  questionsPerDay: number;
  iconName: string;
  gradient: string;
  badge: string;
  days: StudyPlanDay[];
}

export const STUDY_PLANS: StudyPlan[] = [
  {
    id: '7-day-sprint',
    title: '7-Day High-Yield Sprint',
    tagline: 'Last-mile preparation for upcoming on-sites',
    description: 'A focused, high-impact curriculum of 35 must-know interview questions across System Design, Frontend, Backend Internals, Databases, Cloud, Security, AI, and Algorithms. Perfect for 1-week pre-interview cramming.',
    durationDays: 7,
    totalQuestions: 35,
    questionsPerDay: 5,
    iconName: 'Zap',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    badge: '35 Questions • 7 Days',
    days: [
      {
        dayNumber: 1,
        title: 'System Design & Scalability',
        focus: 'CAP Theorem, Consistent Hashing, Rate Limiting & TinyURL',
        questions: [
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 1,
            day: 1,
            topic: 'Distributed Systems',
            title: 'Latency vs. Throughput, Consistency vs. Availability (CAP Theorem)',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 2,
            day: 1,
            topic: 'Distributed Storage',
            title: 'Consistent Hashing with Virtual Nodes & Data Partitioning',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 4,
            day: 1,
            topic: 'Traffic Control',
            title: 'Distributed Rate Limiting: Token Bucket vs. Sliding Window Counter',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 8,
            day: 1,
            topic: 'ID Generation',
            title: 'Distributed Unique ID Generation (Snowflake, UUIDv7, Ticket Servers)',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 14,
            day: 1,
            topic: 'Classic Architecture',
            title: 'Design TinyURL / Scalable URL Shortener Service',
            importance: 'MUST_KNOW',
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Frontend & React 18/19 Architecture',
        focus: 'Virtual DOM, Fiber Work Loop, Concurrent Mode & Custom Hooks',
        questions: [
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 1,
            day: 2,
            topic: 'Core React',
            title: 'What is React and what are its key features?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 15,
            day: 2,
            topic: 'Reconciliation',
            title: 'Virtual DOM vs Real DOM and Reconciliation Mechanics',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 46,
            day: 2,
            topic: 'Fiber Architecture',
            title: 'React Fiber Architecture: Two-phase render & work-loop',
            importance: 'STAFF_LEVEL',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 88,
            day: 2,
            topic: 'Concurrency',
            title: 'React 18 Concurrent Features: Transitions, Suspense, and Hydration',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 120,
            day: 2,
            topic: 'Hooks & Clean Code',
            title: 'Custom Hooks design patterns and memory leak prevention',
            importance: 'HIGH_YIELD',
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Backend Runtime & Concurrency',
        focus: 'Libuv Event Loop, Streams, CPython GC & AsyncIO',
        questions: [
          {
            trackSlug: 'nodejs',
            trackName: 'Node.js',
            questionNumber: 1,
            day: 3,
            topic: 'Node Architecture',
            title: 'Node.js Runtime Architecture: V8, Libuv, and C++ Bindings',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'nodejs',
            trackName: 'Node.js',
            questionNumber: 5,
            day: 3,
            topic: 'Event Loop',
            title: 'Libuv Event Loop Phases: Timers, Poll, Check, and Close Callbacks',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'nodejs',
            trackName: 'Node.js',
            questionNumber: 12,
            day: 3,
            topic: 'I/O & Streams',
            title: 'Streams, Backpressure, and High-Performance File I/O',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'python',
            trackName: 'Python & FastAPI',
            questionNumber: 1,
            day: 3,
            topic: 'Python Internals',
            title: 'CPython Memory Model: Reference Counting and Generational GC',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'python',
            trackName: 'Python & FastAPI',
            questionNumber: 8,
            day: 3,
            topic: 'Async Python',
            title: 'AsyncIO Event Loop, Coroutines, and Cooperative Multitasking',
            importance: 'MUST_KNOW',
          },
        ],
      },
      {
        dayNumber: 4,
        title: 'High-Performance Databases & Indexing',
        focus: 'B-Trees, ACID Isolations, MVCC & Distributed Caching',
        questions: [
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 1,
            day: 4,
            topic: 'SQL vs NoSQL',
            title: 'Relational vs. NoSQL: Consistency, Query Flexibility, and Horizontal Scaling',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 4,
            day: 4,
            topic: 'Indexing',
            title: 'Database Index Internals: B-Tree vs B+ Tree vs Hash Index',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 8,
            day: 4,
            topic: 'Transactions',
            title: 'Transaction Isolation Levels & Dirty, Non-Repeatable, and Phantom Reads',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 15,
            day: 4,
            topic: 'MVCC',
            title: 'Multi-Version Concurrency Control (MVCC) in PostgreSQL and MySQL InnoDB',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 22,
            day: 4,
            topic: 'Caching',
            title: 'Distributed Caching Patterns: Cache-Aside, Write-Through, Write-Behind',
            importance: 'HIGH_YIELD',
          },
        ],
      },
      {
        dayNumber: 5,
        title: 'Cloud Architecture & Web Security',
        focus: 'AWS VPC Networking, Lambda Concurrency, OWASP Top 10 & Auth',
        questions: [
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 1,
            day: 5,
            topic: 'Architecture Pillars',
            title: 'AWS Well-Architected Framework: The 6 Pillars of Production Systems',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 8,
            day: 5,
            topic: 'Networking',
            title: 'Enterprise VPC Architecture: Multi-AZ Subnets, NAT Gateways, and Route Tables',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 22,
            day: 5,
            topic: 'Serverless',
            title: 'Serverless Scale: Lambda Execution Lifecycle, Concurrency, and Cold Starts',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 1,
            day: 5,
            topic: 'Application Defense',
            title: 'OWASP Top 10 Breakdown: Injection, Broken Auth, and SSRF',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 8,
            day: 5,
            topic: 'Browser Defense',
            title: 'Cross-Site Scripting (XSS) vs Cross-Site Request Forgery (CSRF) Defenses',
            importance: 'MUST_KNOW',
          },
        ],
      },
      {
        dayNumber: 6,
        title: 'Containers, Kubernetes & AI Engineering',
        focus: 'Linux Namespaces, Pod Lifecycles, RAG Architecture & Vector Search',
        questions: [
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 1,
            day: 6,
            topic: 'Containers',
            title: 'Container Internals: Linux Namespaces, Cgroups, and Union Filesystems',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 8,
            day: 6,
            topic: 'Kubernetes',
            title: 'Kubernetes Pod Lifecycle, Init Containers, and Probes (Liveness/Readiness)',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 16,
            day: 6,
            topic: 'Deployments',
            title: 'Zero-Downtime Deployment Strategies: Rolling, Blue-Green, and Canary',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 1,
            day: 6,
            topic: 'RAG Systems',
            title: 'RAG Architecture: Dense Embeddings, Vector Databases, and Chunking',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 8,
            day: 6,
            topic: 'Vector Search',
            title: 'Vector Indexing: HNSW vs IVF-PQ Algorithmic Trade-Offs',
            importance: 'STAFF_LEVEL',
          },
        ],
      },
      {
        dayNumber: 7,
        title: 'Core DSA Patterns & Leadership / HR STAR',
        focus: 'Hash Maps, Linked Lists, Graph DFS/BFS & Executive Storytelling',
        questions: [
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 1,
            day: 7,
            topic: 'Two Pointers / Map',
            title: 'Two Sum (Hash Map Pattern)',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 15,
            day: 7,
            topic: 'Linked Lists',
            title: 'Reverse Linked List (In-Place Pointer Manipulation)',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 30,
            day: 7,
            topic: 'Graph Traversal',
            title: 'Number of Islands (Breadth-First & Depth-First Search on Grid)',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 1,
            day: 7,
            topic: 'Elevator Pitch',
            title: 'Tell me about yourself: The Present-Past-Future Narrative Framework',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 8,
            day: 7,
            topic: 'Conflict Resolution',
            title: 'Describe a severe technical conflict with an engineer and how you resolved it',
            importance: 'MUST_KNOW',
          },
        ],
      },
    ],
  },
  {
    id: '30-day-master',
    title: '30-Day Senior & Staff Curriculum',
    tagline: 'Comprehensive month-long mastery track',
    description: '3 deep-dive architectural and coding questions every day for 30 consecutive days. Spans all 13 core disciplines to transform you into an unstoppable candidate for L5, Senior, and Staff Software Engineering positions.',
    durationDays: 30,
    totalQuestions: 90,
    questionsPerDay: 3,
    iconName: 'Trophy',
    gradient: 'from-purple-600 via-indigo-600 to-violet-600',
    badge: '90 Questions • 30 Days',
    days: [
      {
        dayNumber: 1,
        title: 'JavaScript Core: Engine & Event Loop',
        focus: 'Call Stack, Microtasks, Garbage Collection',
        questions: [
          { trackSlug: 'javascript', trackName: 'JavaScript', questionNumber: 1, day: 1, topic: 'Call Stack', title: 'What is the Execution Context and Call Stack in JavaScript?', importance: 'MUST_KNOW' },
          { trackSlug: 'javascript', trackName: 'JavaScript', questionNumber: 12, day: 1, topic: 'Event Loop', title: 'Macrotask vs Microtask Queues: Order of Execution', importance: 'MUST_KNOW' },
          { trackSlug: 'javascript', trackName: 'JavaScript', questionNumber: 25, day: 1, topic: 'Closures', title: 'Lexical Scoping and Closures: Memory implications and use cases', importance: 'MUST_KNOW' },
        ],
      },
      {
        dayNumber: 2,
        title: 'JavaScript Deep Dive: Prototypes & Promises',
        focus: 'Prototypal Inheritance, Promise Chaining, Async/Await',
        questions: [
          { trackSlug: 'javascript', trackName: 'JavaScript', questionNumber: 38, day: 2, topic: 'Prototypes', title: 'Prototype Chain and Inheriting Properties in ES5 vs ES6 Classes', importance: 'HIGH_YIELD' },
          { trackSlug: 'javascript', trackName: 'JavaScript', questionNumber: 52, day: 2, topic: 'Promises', title: 'Promise states, Promise.all, Promise.allSettled, and error handling', importance: 'MUST_KNOW' },
          { trackSlug: 'javascript', trackName: 'JavaScript', questionNumber: 74, day: 2, topic: 'Async/Await', title: 'Under the hood of async/await: Generator functions and yield', importance: 'STAFF_LEVEL' },
        ],
      },
      {
        dayNumber: 3,
        title: 'React Fundamentals: Rendering & Fiber',
        focus: 'JSX Compilation, Virtual DOM, Fiber Reconciliation',
        questions: [
          { trackSlug: 'react-nextjs', trackName: 'React & Next.js', questionNumber: 5, day: 3, topic: 'JSX', title: 'How does JSX compile and how does React create elements?', importance: 'MUST_KNOW' },
          { trackSlug: 'react-nextjs', trackName: 'React & Next.js', questionNumber: 20, day: 3, topic: 'Component Lifecycle', title: 'React component render phases: Render vs Commit', importance: 'MUST_KNOW' },
          { trackSlug: 'react-nextjs', trackName: 'React & Next.js', questionNumber: 46, day: 3, topic: 'Fiber Internals', title: 'React Fiber Architecture: Two-phase render & work-loop', importance: 'STAFF_LEVEL' },
        ],
      },
      {
        dayNumber: 4,
        title: 'React Advanced: State & Performance',
        focus: 'useMemo, useCallback, Context Optimization, React 19 Actions',
        questions: [
          { trackSlug: 'react-nextjs', trackName: 'React & Next.js', questionNumber: 62, day: 4, topic: 'Memoization', title: 'When to use useMemo and useCallback vs when it hurts performance', importance: 'MUST_KNOW' },
          { trackSlug: 'react-nextjs', trackName: 'React & Next.js', questionNumber: 95, day: 4, topic: 'Context', title: 'React Context re-render pitfalls and how to optimize state selectors', importance: 'HIGH_YIELD' },
          { trackSlug: 'react-nextjs', trackName: 'React & Next.js', questionNumber: 150, day: 4, topic: 'React 19', title: 'Server Components vs Client Components in React 19 / Next.js', importance: 'MUST_KNOW' },
        ],
      },
      {
        dayNumber: 5,
        title: 'Angular Architecture & Signals',
        focus: 'Zone.js, Angular Signals, Dependency Injection',
        questions: [
          { trackSlug: 'angular-ts', trackName: 'Angular & Signals', questionNumber: 1, day: 5, topic: 'Core Architecture', title: 'Angular Core Architecture: Modules, Components, and Templates', importance: 'MUST_KNOW' },
          { trackSlug: 'angular-ts', trackName: 'Angular & Signals', questionNumber: 18, day: 5, topic: 'Dependency Injection', title: 'Hierarchical Dependency Injection: Root, Platform, and Element Injectors', importance: 'HIGH_YIELD' },
          { trackSlug: 'angular-ts', trackName: 'Angular & Signals', questionNumber: 45, day: 5, topic: 'Signals', title: 'Angular Signals vs RxJS: Push/Pull reactivity and glitch-free execution', importance: 'STAFF_LEVEL' },
        ],
      },
      {
        dayNumber: 6,
        title: 'Backend Node.js Architecture',
        focus: 'Libuv, Streams, Worker Threads & Clustering',
        questions: [
          { trackSlug: 'nodejs', trackName: 'Node.js', questionNumber: 3, day: 6, topic: 'Event Loop', title: 'Why Node.js is single-threaded and how it achieves asynchronous I/O', importance: 'MUST_KNOW' },
          { trackSlug: 'nodejs', trackName: 'Node.js', questionNumber: 15, day: 6, topic: 'Worker Threads', title: 'Child Processes vs Worker Threads: When to use each for CPU-bound tasks', importance: 'HIGH_YIELD' },
          { trackSlug: 'nodejs', trackName: 'Node.js', questionNumber: 28, day: 6, topic: 'Memory Profiling', title: 'Debugging memory leaks in Node.js with heap snapshots and V8 inspector', importance: 'STAFF_LEVEL' },
        ],
      },
      {
        dayNumber: 7,
        title: 'Backend Python & FastAPI',
        focus: 'GIL, Type Hints, Pydantic & Async Frameworks',
        questions: [
          { trackSlug: 'python', trackName: 'Python & FastAPI', questionNumber: 4, day: 7, topic: 'Global Interpreter Lock', title: 'The Python GIL: How it affects concurrency and sub-interpreter futures', importance: 'MUST_KNOW' },
          { trackSlug: 'python', trackName: 'Python & FastAPI', questionNumber: 15, day: 7, topic: 'FastAPI Architecture', title: 'FastAPI performance benefits: Starlette ASGI and Pydantic v2 Rust core', importance: 'HIGH_YIELD' },
          { trackSlug: 'python', trackName: 'Python & FastAPI', questionNumber: 26, day: 7, topic: 'Async ORM', title: 'SQLAlchemy 2.0 Async Session management and connection pool tuning', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 8,
        title: 'Database Foundations: Relational Storage',
        focus: 'B-Trees, WAL, Indexing & Query Optimizers',
        questions: [
          { trackSlug: 'databases', trackName: 'Databases', questionNumber: 2, day: 8, topic: 'Storage Engines', title: 'How Relational Databases store rows on disk: Pages, Slotted Pages, and Row vs Columnar', importance: 'HIGH_YIELD' },
          { trackSlug: 'databases', trackName: 'Databases', questionNumber: 6, day: 8, topic: 'B+ Tree Indexing', title: 'Why B+ Trees are preferred over B-Trees and Binary Search Trees for disk storage', importance: 'MUST_KNOW' },
          { trackSlug: 'databases', trackName: 'Databases', questionNumber: 11, day: 8, topic: 'Write-Ahead Log', title: 'Write-Ahead Logging (WAL) and Crash Recovery in PostgreSQL', importance: 'STAFF_LEVEL' },
        ],
      },
      {
        dayNumber: 9,
        title: 'Database Transactions & NoSQL Scaling',
        focus: 'ACID, MVCC, Sharding, DynamoDB Single Table',
        questions: [
          { trackSlug: 'databases', trackName: 'Databases', questionNumber: 9, day: 9, topic: 'Isolation Anomalies', title: 'Snapshot Isolation vs Serializable: Phantom Reads and Write Skew', importance: 'STAFF_LEVEL' },
          { trackSlug: 'databases', trackName: 'Databases', questionNumber: 18, day: 9, topic: 'Partitioning', title: 'Horizontal Sharding: Range-based vs Hash-based partitioning strategies', importance: 'HIGH_YIELD' },
          { trackSlug: 'databases', trackName: 'Databases', questionNumber: 32, day: 9, topic: 'DynamoDB', title: 'DynamoDB Single-Table Design: Partition Keys, Sort Keys, and GSIs', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 10,
        title: 'Caching & Real-Time Data Pipelines',
        focus: 'Redis Data Structures, Eviction Policies, Kafka',
        questions: [
          { trackSlug: 'databases', trackName: 'Databases', questionNumber: 24, day: 10, topic: 'Redis Data Types', title: 'Redis internal data structures: Strings, Hashes, Sorted Sets (Skip Lists)', importance: 'MUST_KNOW' },
          { trackSlug: 'databases', trackName: 'Databases', questionNumber: 28, day: 10, topic: 'Cache Stampede', title: 'Preventing Cache Stampede / Thundering Herd with Mutex and Probabilistic Early Expiration', importance: 'HIGH_YIELD' },
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 18, day: 10, topic: 'Message Queues', title: 'Apache Kafka Architecture: Partitions, Offsets, Consumer Groups, and Exactly-Once Semantics', importance: 'MUST_KNOW' },
        ],
      },
      {
        dayNumber: 11,
        title: 'System Design: Core Foundations',
        focus: 'DNS, Load Balancers, Reverse Proxies, Back-of-the-envelope',
        questions: [
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 3, day: 11, topic: 'Load Balancing', title: 'Layer 4 vs Layer 7 Load Balancing: Algorithms and Health Checks', importance: 'MUST_KNOW' },
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 6, day: 11, topic: 'Estimation', title: 'Back-of-the-envelope calculations: QPS, Bandwidth, and Storage estimation', importance: 'MUST_KNOW' },
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 10, day: 11, topic: 'Resilience', title: 'Circuit Breakers, Bulkheads, and Exponential Backoff with Jitter', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 12,
        title: 'System Design: Real-World Architecture I',
        focus: 'TinyURL, Rate Limiter, Notification Service',
        questions: [
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 14, day: 12, topic: 'System Design', title: 'Design TinyURL / Scalable URL Shortener Service', importance: 'MUST_KNOW' },
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 4, day: 12, topic: 'System Design', title: 'Distributed Rate Limiting: Token Bucket vs. Sliding Window Counter', importance: 'MUST_KNOW' },
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 16, day: 12, topic: 'System Design', title: 'Design a Distributed Notification System (Push, SMS, Email)', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 13,
        title: 'System Design: Real-World Architecture II',
        focus: 'WhatsApp / Chat, News Feed, Uber Geospatial',
        questions: [
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 22, day: 13, topic: 'System Design', title: 'Design a Real-Time Chat System like WhatsApp / Slack (WebSockets, Presence)', importance: 'MUST_KNOW' },
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 25, day: 13, topic: 'System Design', title: 'Design a Social Media News Feed like Twitter / X (Fan-out on write vs read)', importance: 'MUST_KNOW' },
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 30, day: 13, topic: 'System Design', title: 'Design a Ride-Hailing Service like Uber / Lyft (Geohashes, QuadTrees)', importance: 'STAFF_LEVEL' },
        ],
      },
      {
        dayNumber: 14,
        title: 'AWS Cloud Architecture: Compute & Storage',
        focus: 'EC2, ECS Fargate, S3, Aurora Serverless',
        questions: [
          { trackSlug: 'aws', trackName: 'AWS Cloud', questionNumber: 4, day: 14, topic: 'Compute Comparison', title: 'EC2 vs ECS Fargate vs EKS vs Lambda: Choosing the right compute tier', importance: 'MUST_KNOW' },
          { trackSlug: 'aws', trackName: 'AWS Cloud', questionNumber: 12, day: 14, topic: 'Storage Tiers', title: 'Amazon S3 Storage Classes, Lifecycle Policies, and Consistency Model', importance: 'HIGH_YIELD' },
          { trackSlug: 'aws', trackName: 'AWS Cloud', questionNumber: 19, day: 14, topic: 'Relational Cloud DB', title: 'Amazon Aurora Architecture: Shared Storage Engine and Global Replication', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 15,
        title: 'AWS Cloud Architecture: Security & IAM',
        focus: 'IAM Evaluation, KMS Key Management, Secrets Manager',
        questions: [
          { trackSlug: 'aws', trackName: 'AWS Cloud', questionNumber: 15, day: 15, topic: 'IAM Evaluation', title: 'AWS IAM Policy Evaluation Logic: Explicit Deny, SCPs, and Permission Boundaries', importance: 'MUST_KNOW' },
          { trackSlug: 'aws', trackName: 'AWS Cloud', questionNumber: 28, day: 15, topic: 'Encryption', title: 'AWS KMS: Symmetric vs Asymmetric Keys, Envelope Encryption, and Key Rotation', importance: 'HIGH_YIELD' },
          { trackSlug: 'aws', trackName: 'AWS Cloud', questionNumber: 35, day: 15, topic: 'Zero Trust Cloud', title: 'Implementing Zero-Trust Architecture across AWS VPCs with PrivateLink', importance: 'STAFF_LEVEL' },
        ],
      },
      {
        dayNumber: 16,
        title: 'DevOps: Docker & Container Runtimes',
        focus: 'Dockerfile Optimization, Multi-Stage Builds, Rootless Containers',
        questions: [
          { trackSlug: 'devops-kubernetes', trackName: 'DevOps & K8s', questionNumber: 2, day: 16, topic: 'Docker Layering', title: 'How Docker Layer Caching works and how to design minimal multi-stage builds', importance: 'MUST_KNOW' },
          { trackSlug: 'devops-kubernetes', trackName: 'DevOps & K8s', questionNumber: 5, day: 16, topic: 'Container Security', title: 'Running containers without root: User namespaces and non-root UID enforcement', importance: 'HIGH_YIELD' },
          { trackSlug: 'devops-kubernetes', trackName: 'DevOps & K8s', questionNumber: 10, day: 16, topic: 'Container Runtimes', title: 'CRI, OCI, and Containerd: How Kubernetes executes containers on worker nodes', importance: 'STAFF_LEVEL' },
        ],
      },
      {
        dayNumber: 17,
        title: 'DevOps: Kubernetes Core Architecture',
        focus: 'Control Plane, etcd, Scheduling, CNI / CoreDNS',
        questions: [
          { trackSlug: 'devops-kubernetes', trackName: 'DevOps & K8s', questionNumber: 12, day: 17, topic: 'Control Plane', title: 'Kubernetes Control Plane components: API Server, etcd, Controller Manager, Scheduler', importance: 'MUST_KNOW' },
          { trackSlug: 'devops-kubernetes', trackName: 'DevOps & K8s', questionNumber: 18, day: 17, topic: 'Networking', title: 'Kubernetes Networking Model: Pod-to-Pod communication, CNI, and Services', importance: 'MUST_KNOW' },
          { trackSlug: 'devops-kubernetes', trackName: 'DevOps & K8s', questionNumber: 24, day: 17, topic: 'Auto-Scaling', title: 'Horizontal Pod Autoscaler (HPA) vs Cluster Autoscaler vs Karpenter', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 18,
        title: 'Web Security: Injection & Authentication',
        focus: 'SQLi, NoSQLi, JWT vs Session Cookies, Refresh Tokens',
        questions: [
          { trackSlug: 'web-security-owasp', trackName: 'Web Security', questionNumber: 3, day: 18, topic: 'Injection Attacks', title: 'SQL and Command Injection prevention: Prepared statements and ORM boundaries', importance: 'MUST_KNOW' },
          { trackSlug: 'web-security-owasp', trackName: 'Web Security', questionNumber: 10, day: 18, topic: 'Token Security', title: 'JWT vs Opaque Server-side Sessions: Revocation, Key Rotation, and XSS risks', importance: 'MUST_KNOW' },
          { trackSlug: 'web-security-owasp', trackName: 'Web Security', questionNumber: 14, day: 18, topic: 'OAuth 2.0', title: 'OAuth 2.0 and OpenID Connect (OIDC): PKCE flow for Single Page Applications', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 19,
        title: 'Web Security: Browser Protections & Cryptography',
        focus: 'CSP, CORS, Argon2id, mTLS, CSRF Tokens',
        questions: [
          { trackSlug: 'web-security-owasp', trackName: 'Web Security', questionNumber: 12, day: 19, topic: 'CORS vs CSP', title: 'CORS is NOT security: Difference between Same-Origin Policy, CORS, and CSP', importance: 'MUST_KNOW' },
          { trackSlug: 'web-security-owasp', trackName: 'Web Security', questionNumber: 20, day: 19, topic: 'Password Hashing', title: 'Password Storage Cryptography: Argon2id vs Bcrypt vs PBKDF2 parameters', importance: 'HIGH_YIELD' },
          { trackSlug: 'web-security-owasp', trackName: 'Web Security', questionNumber: 28, day: 19, topic: 'mTLS', title: 'Mutual TLS (mTLS) for microservices: Handshake mechanics and certificate rotation', importance: 'STAFF_LEVEL' },
        ],
      },
      {
        dayNumber: 20,
        title: 'AI Engineering: RAG & Vector Search',
        focus: 'Chunking, Dense Embeddings, HNSW, Hybrid Search',
        questions: [
          { trackSlug: 'ai-engineering-llm', trackName: 'AI & LLMs', questionNumber: 2, day: 20, topic: 'Document Chunking', title: 'Document Chunking strategies for RAG: Fixed, Semantic, and Recursive chunking', importance: 'MUST_KNOW' },
          { trackSlug: 'ai-engineering-llm', trackName: 'AI & LLMs', questionNumber: 6, day: 20, topic: 'Vector Distances', title: 'Cosine Similarity vs Dot Product vs Euclidean Distance in Vector Search', importance: 'MUST_KNOW' },
          { trackSlug: 'ai-engineering-llm', trackName: 'AI & LLMs', questionNumber: 12, day: 20, topic: 'Hybrid Search', title: 'Hybrid Search: Combining BM25 Keyword Search with Dense Vector Search using RRF', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 21,
        title: 'AI Engineering: LLM Serving & Autonomous Agents',
        focus: 'vLLM PagedAttention, KV Cache, MCP, Tool Calling',
        questions: [
          { trackSlug: 'ai-engineering-llm', trackName: 'AI & LLMs', questionNumber: 18, day: 21, topic: 'LLM Serving', title: 'vLLM PagedAttention and KV Cache Management: Memory fragmentation reduction', importance: 'STAFF_LEVEL' },
          { trackSlug: 'ai-engineering-llm', trackName: 'AI & LLMs', questionNumber: 25, day: 21, topic: 'Agentic Architectures', title: 'ReAct Prompting, Tool Calling, and Autonomous Agent loops with Error Recovery', importance: 'MUST_KNOW' },
          { trackSlug: 'ai-engineering-llm', trackName: 'AI & LLMs', questionNumber: 32, day: 21, topic: 'MCP Protocol', title: 'Model Context Protocol (MCP): Architecture, Client-Server interactions, and security', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 22,
        title: 'DSA: Two Pointers & Sliding Window',
        focus: 'Array Manipulation, Substrings, Palindromes',
        questions: [
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 3, day: 22, topic: 'Sliding Window', title: 'Longest Substring Without Repeating Characters (Sliding Window)', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 6, day: 22, topic: 'Two Pointers', title: '3Sum: Sorting and Two Pointer Convergence', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 11, day: 22, topic: 'Container / Area', title: 'Container With Most Water: Greedy Two-Pointer proofs', importance: 'MUST_KNOW' },
        ],
      },
      {
        dayNumber: 23,
        title: 'DSA: Linked Lists & Fast-Slow Pointers',
        focus: 'Cycle Detection, Merge Lists, LRU Cache',
        questions: [
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 16, day: 23, topic: 'Cycle Detection', title: 'Linked List Cycle: Floyd’s Tortoise and Hare algorithm', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 21, day: 23, topic: 'Merging', title: 'Merge Two Sorted Lists (Iterative and Recursive)', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 28, day: 23, topic: 'Data Structure Design', title: 'LRU Cache Design: Hash Map + Doubly Linked List in O(1)', importance: 'MUST_KNOW' },
        ],
      },
      {
        dayNumber: 24,
        title: 'DSA: Binary Trees & Tree Traversals',
        focus: 'DFS/BFS, Lowest Common Ancestor, Invert Tree',
        questions: [
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 35, day: 24, topic: 'Tree Inversion', title: 'Invert / Flip Binary Tree (DFS vs BFS)', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 38, day: 24, topic: 'Maximum Depth', title: 'Maximum Depth of Binary Tree and Diameter of Binary Tree', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 44, day: 24, topic: 'LCA', title: 'Lowest Common Ancestor of a Binary Search Tree and Binary Tree', importance: 'MUST_KNOW' },
        ],
      },
      {
        dayNumber: 25,
        title: 'DSA: Graphs & Matrix Traversal',
        focus: 'Number of Islands, Clone Graph, Topological Sort',
        questions: [
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 30, day: 25, topic: 'Grid Graph', title: 'Number of Islands (Breadth-First & Depth-First Search on Grid)', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 52, day: 25, topic: 'Graph Cloning', title: 'Clone Graph using Hash Map visited registry', importance: 'HIGH_YIELD' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 58, day: 25, topic: 'Topological Sort', title: 'Course Schedule: Cycle detection in Directed Graph (Kahn’s Algorithm)', importance: 'MUST_KNOW' },
        ],
      },
      {
        dayNumber: 26,
        title: 'DSA: Dynamic Programming Foundations',
        focus: 'Memoization, Tabulation, Climbing Stairs, Coin Change',
        questions: [
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 65, day: 26, topic: '1D DP', title: 'Climbing Stairs & House Robber: Optimal Substructure identification', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 72, day: 26, topic: 'Knapsack Variant', title: 'Coin Change: Minimum coins to make amount (Unbounded Knapsack)', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 80, day: 26, topic: 'Subsequences', title: 'Longest Increasing Subsequence: O(N^2) DP vs O(N log N) Binary Search', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 27,
        title: 'DSA: Backtracking & Trie Structures',
        focus: 'Word Search, Subsets, Trie Prefix Matching',
        questions: [
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 85, day: 27, topic: 'Trie Design', title: 'Implement Trie (Prefix Tree): Insert, Search, and StartsWith in O(L)', importance: 'MUST_KNOW' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 88, day: 27, topic: 'Backtracking', title: 'Word Search on Matrix with Backtracking & Visited State Restoration', importance: 'HIGH_YIELD' },
          { trackSlug: 'dsa', trackName: 'Algorithms', questionNumber: 94, day: 27, topic: 'Combinatorics', title: 'Subsets and Permutations: Decision tree generation mechanics', importance: 'HIGH_YIELD' },
        ],
      },
      {
        dayNumber: 28,
        title: 'Behavioral & Leadership: STAR Foundations',
        focus: 'Impact Storytelling, Technical Conflict, Failure Post-Mortem',
        questions: [
          { trackSlug: 'behavioral-hr', trackName: 'Behavioral & HR', questionNumber: 3, day: 28, topic: 'High-Impact Project', title: 'Tell me about the most complex technical project you led from scratch', importance: 'MUST_KNOW' },
          { trackSlug: 'behavioral-hr', trackName: 'Behavioral & HR', questionNumber: 8, day: 28, topic: 'Conflict Resolution', title: 'Describe a severe technical conflict with an engineer and how you resolved it', importance: 'MUST_KNOW' },
          { trackSlug: 'behavioral-hr', trackName: 'Behavioral & HR', questionNumber: 12, day: 28, topic: 'Failure & Ownership', title: 'Tell me about a production outage or major mistake you made and what you learned', importance: 'MUST_KNOW' },
        ],
      },
      {
        dayNumber: 29,
        title: 'Behavioral & Leadership: Cross-Functional & Mentorship',
        focus: 'Mentoring Junior Engineers, Disagree and Commit, Scope Growth',
        questions: [
          { trackSlug: 'behavioral-hr', trackName: 'Behavioral & HR', questionNumber: 16, day: 29, topic: 'Mentorship', title: 'How have you mentored junior or mid-level engineers to promote their growth?', importance: 'HIGH_YIELD' },
          { trackSlug: 'behavioral-hr', trackName: 'Behavioral & HR', questionNumber: 22, day: 29, topic: 'Product Alignment', title: 'Tell me about a time you had to push back on a Product Manager or Executive deadline', importance: 'HIGH_YIELD' },
          { trackSlug: 'behavioral-hr', trackName: 'Behavioral & HR', questionNumber: 28, day: 29, topic: 'Disagree & Commit', title: 'Tell me about a time you strongly disagreed with an architecture decision but committed', importance: 'MUST_KNOW' },
        ],
      },
      {
        dayNumber: 30,
        title: 'Final Mastery: Staff-Level Systems & Salary Negotiation',
        focus: 'Multi-Region High Availability, Compensation Negotiation, Culture',
        questions: [
          { trackSlug: 'system-design', trackName: 'System Design', questionNumber: 42, day: 30, topic: 'Disaster Recovery', title: 'Multi-Region Active-Active Distributed Database Architecture & Latency mitigation', importance: 'STAFF_LEVEL' },
          { trackSlug: 'behavioral-hr', trackName: 'Behavioral & HR', questionNumber: 35, day: 30, topic: 'Offer Negotiation', title: 'How to negotiate your compensation package: Competing offers, equity, and leverage', importance: 'MUST_KNOW' },
          { trackSlug: 'behavioral-hr', trackName: 'Behavioral & HR', questionNumber: 45, day: 30, topic: 'Reverse Interviewing', title: 'Top 10 questions to ask the interviewer to evaluate engineering culture and red flags', importance: 'MUST_KNOW' },
        ],
      },
    ],
  },
];

export function getAllStudyPlans(): StudyPlan[] {
  return STUDY_PLANS;
}

export function getStudyPlanById(id: string): StudyPlan | undefined {
  return STUDY_PLANS.find((p) => p.id === id);
}

export interface StudyPlanDayProgress {
  dayNumber: number;
  total: number;
  studied: number;
  isCompleted: boolean;
}

export interface StudyPlanProgress {
  totalQuestions: number;
  studiedCount: number;
  percent: number;
  dayProgress: StudyPlanDayProgress[];
  isFullyCompleted: boolean;
}

/**
 * Calculates current progress of a study plan by checking user's studied status in localStorage
 */
export function getStudyPlanProgress(plan: StudyPlan): StudyPlanProgress {
  if (typeof window === 'undefined') {
    return {
      totalQuestions: plan.totalQuestions,
      studiedCount: 0,
      percent: 0,
      dayProgress: plan.days.map((d) => ({
        dayNumber: d.dayNumber,
        total: d.questions.length,
        studied: 0,
        isCompleted: false,
      })),
      isFullyCompleted: false,
    };
  }

  let totalStudied = 0;
  const dayProgress: StudyPlanDayProgress[] = [];

  for (const day of plan.days) {
    let dayStudied = 0;
    for (const q of day.questions) {
      const studiedMap = getTrackStudiedMap(q.trackSlug);
      if (studiedMap[q.questionNumber]) {
        dayStudied++;
        totalStudied++;
      }
    }
    dayProgress.push({
      dayNumber: day.dayNumber,
      total: day.questions.length,
      studied: dayStudied,
      isCompleted: dayStudied >= day.questions.length && day.questions.length > 0,
    });
  }

  const percent = Math.min(
    100,
    plan.totalQuestions > 0 ? Math.round((totalStudied / plan.totalQuestions) * 100) : 0
  );

  return {
    totalQuestions: plan.totalQuestions,
    studiedCount: totalStudied,
    percent,
    dayProgress,
    isFullyCompleted: totalStudied >= plan.totalQuestions && plan.totalQuestions > 0,
  };
}

/**
 * Checks if a specific question is part of any study plan
 */
export function getQuestionStudyPlanBadges(trackSlug: string, questionNumber: number): {
  planId: string;
  planTitle: string;
  dayNumber: number;
  importance: 'MUST_KNOW' | 'HIGH_YIELD' | 'STAFF_LEVEL';
}[] {
  const matches: {
    planId: string;
    planTitle: string;
    dayNumber: number;
    importance: 'MUST_KNOW' | 'HIGH_YIELD' | 'STAFF_LEVEL';
  }[] = [];

  for (const plan of STUDY_PLANS) {
    for (const day of plan.days) {
      for (const q of day.questions) {
        if (q.trackSlug === trackSlug && q.questionNumber === questionNumber) {
          matches.push({
            planId: plan.id,
            planTitle: plan.title,
            dayNumber: day.dayNumber,
            importance: q.importance,
          });
        }
      }
    }
  }

  return matches;
}

export const ACTIVE_PLAN_UPDATE_EVENT = 'interviewhub_active_plan_update';

/**
 * Returns the user's selected active sprint plan ID ('7-day-sprint' or '30-day-master')
 */
export function getActiveStudyPlanId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('interviewhub_active_study_plan') || '7-day-sprint';
  } catch {
    return null;
  }
}

/**
 * Sets the user's active sprint plan ID
 */
export function setActiveStudyPlanId(planId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (planId) {
      localStorage.setItem('interviewhub_active_study_plan', planId);
    } else {
      localStorage.removeItem('interviewhub_active_study_plan');
    }
    window.dispatchEvent(new CustomEvent(ACTIVE_PLAN_UPDATE_EVENT, { detail: { planId } }));
  } catch {}
}

/**
 * Returns the current active day for a plan: the first uncompleted day
 */
export function getPlanActiveDayNumber(plan: StudyPlan): number {
  const progress = getStudyPlanProgress(plan);
  const uncompleted = progress.dayProgress.find((d) => !d.isCompleted);
  if (uncompleted) {
    return uncompleted.dayNumber;
  }
  return 1;
}

/**
 * Finds the next unstudied question in a plan, starting from a given day
 */
export function getNextUnstudiedQuestionInPlan(
  plan: StudyPlan,
  startFromDay?: number
): { question: PlanQuestionItem; day: StudyPlanDay } | null {
  if (typeof window === 'undefined') {
    return plan.days[0]?.questions[0] ? { question: plan.days[0].questions[0], day: plan.days[0] } : null;
  }

  const startDay = startFromDay || 1;
  // First search forward from startDay
  for (let d = startDay; d <= plan.durationDays; d++) {
    const day = plan.days.find((item) => item.dayNumber === d);
    if (!day) continue;
    for (const q of day.questions) {
      const map = getTrackStudiedMap(q.trackSlug);
      if (!map[q.questionNumber]) {
        return { question: q, day };
      }
    }
  }

  // Then wrap around from day 1 to startDay - 1
  for (let d = 1; d < startDay; d++) {
    const day = plan.days.find((item) => item.dayNumber === d);
    if (!day) continue;
    for (const q of day.questions) {
      const map = getTrackStudiedMap(q.trackSlug);
      if (!map[q.questionNumber]) {
        return { question: q, day };
      }
    }
  }

  // If all are completed, default to first question of day 1
  return plan.days[0]?.questions[0] ? { question: plan.days[0].questions[0], day: plan.days[0] } : null;
}

export interface SprintQuestionNavigation {
  plan: StudyPlan;
  day: StudyPlanDay;
  dayNumber: number;
  dayIndex: number;
  dayTotal: number;
  overallIndex: number;
  overallTotal: number;
  importance: 'MUST_KNOW' | 'HIGH_YIELD' | 'STAFF_LEVEL';
  prevQuestion: PlanQuestionItem | null;
  nextQuestion: PlanQuestionItem | null;
  isLastInDay: boolean;
  isFirstInDay: boolean;
  isLastInPlan: boolean;
  dayStudiedCount: number;
  dayPercent: number;
  isDayComplete: boolean;
}

/**
 * Returns contextual sprint navigation for a given question if it belongs to a plan
 */
export function getSprintQuestionNavigation(
  trackSlug: string,
  questionNumber: number,
  preferredPlanId?: string | null
): SprintQuestionNavigation | null {
  const activeId = preferredPlanId || getActiveStudyPlanId();
  let targetPlan = STUDY_PLANS.find((p) => p.id === activeId);

  // Check if question exists in targetPlan
  let questionFound = false;
  if (targetPlan) {
    for (const d of targetPlan.days) {
      if (d.questions.some((q) => q.trackSlug === trackSlug && q.questionNumber === questionNumber)) {
        questionFound = true;
        break;
      }
    }
  }

  // If not in preferred plan, check other plans
  if (!questionFound) {
    for (const plan of STUDY_PLANS) {
      for (const d of plan.days) {
        if (d.questions.some((q) => q.trackSlug === trackSlug && q.questionNumber === questionNumber)) {
          targetPlan = plan;
          questionFound = true;
          break;
        }
      }
      if (questionFound) break;
    }
  }

  if (!targetPlan || !questionFound) return null;

  // Flatten all questions
  const allList: { question: PlanQuestionItem; day: StudyPlanDay }[] = [];
  for (const day of targetPlan.days) {
    for (const q of day.questions) {
      allList.push({ question: q, day });
    }
  }

  const currentIndex = allList.findIndex(
    (item) => item.question.trackSlug === trackSlug && item.question.questionNumber === questionNumber
  );

  if (currentIndex === -1) return null;

  const currentItem = allList[currentIndex];
  const currentDay = currentItem.day;
  const dayQuestions = currentDay.questions;
  const dayIndex = dayQuestions.findIndex(
    (q) => q.trackSlug === trackSlug && q.questionNumber === questionNumber
  );

  let dayStudiedCount = 0;
  for (const q of dayQuestions) {
    const map = getTrackStudiedMap(q.trackSlug);
    if (map[q.questionNumber]) dayStudiedCount++;
  }

  const prevQuestion = currentIndex > 0 ? allList[currentIndex - 1].question : null;
  const nextQuestion = currentIndex < allList.length - 1 ? allList[currentIndex + 1].question : null;

  return {
    plan: targetPlan,
    day: currentDay,
    dayNumber: currentDay.dayNumber,
    dayIndex: dayIndex + 1,
    dayTotal: dayQuestions.length,
    overallIndex: currentIndex + 1,
    overallTotal: allList.length,
    importance: currentItem.question.importance,
    prevQuestion,
    nextQuestion,
    isLastInDay: dayIndex === dayQuestions.length - 1,
    isFirstInDay: dayIndex === 0,
    isLastInPlan: currentIndex === allList.length - 1,
    dayStudiedCount,
    dayPercent: Math.round((dayStudiedCount / dayQuestions.length) * 100),
    isDayComplete: dayStudiedCount >= dayQuestions.length,
  };
}

