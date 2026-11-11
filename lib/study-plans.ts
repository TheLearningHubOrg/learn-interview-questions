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
            questionNumber: 3,
            day: 1,
            topic: 'CAP & PACELC',
            title: 'The CAP Theorem & PACELC Theorem Deep-Dive.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 6,
            day: 1,
            topic: 'Consistent Hashing',
            title: 'Consistent Hashing and Virtual Nodes: Mitigating Hot-Spots and Rebalancing.',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 12,
            day: 1,
            topic: 'Distributed Rate Limiter',
            title: 'Design a Distributed Rate Limiter.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 17,
            day: 1,
            topic: 'Unique ID Generator',
            title: 'Design a Distributed Unique ID Generator (Twitter Snowflake ID).',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 11,
            day: 1,
            topic: 'URL Shortener (TinyURL)',
            title: 'Design a Distributed URL Shortener (TinyURL / Bit.ly).',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 2,
        title: 'Frontend & React Architecture',
        focus: 'Virtual DOM, Fiber Architecture, Concurrent Mode & Custom Hooks',
        questions: [
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 1,
            day: 2,
            topic: 'Core React',
            title: 'What is React?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 16,
            day: 2,
            topic: 'Virtual DOM',
            title: 'What is Virtual DOM?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 19,
            day: 2,
            topic: 'React Fiber',
            title: 'What is React Fiber?',
            importance: 'STAFF_LEVEL',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 228,
            day: 2,
            topic: 'Concurrent Rendering',
            title: 'Explain concurrent rendering with an example',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 312,
            day: 2,
            topic: 'Custom Hooks',
            title: 'How do you share state logic between components using custom hooks?',
            importance: 'HIGH_YIELD',
          }
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
            topic: 'Node.js Architecture',
            title: 'What is Node.js, and how does its single-threaded, event-driven, non-blocking I/O runtime work?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'nodejs',
            trackName: 'Node.js',
            questionNumber: 7,
            day: 3,
            topic: 'Event Loop Phases',
            title: 'Node.js Event Loop Phases in exact order.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'nodejs',
            trackName: 'Node.js',
            questionNumber: 23,
            day: 3,
            topic: 'Streams & Backpressure',
            title: 'Stream Backpressure and `pipeline()`.',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'python',
            trackName: 'Python & FastAPI',
            questionNumber: 6,
            day: 3,
            topic: 'CPython Memory & GC',
            title: 'Memory management in Python: Reference Counting & Generational GC:',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'python',
            trackName: 'Python & FastAPI',
            questionNumber: 27,
            day: 3,
            topic: 'AsyncIO Coroutines',
            title: 'AsyncIO: Coroutines, Tasks, and Futures:',
            importance: 'MUST_KNOW',
          }
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
            title: 'What is a Database Management System (DBMS), and what are the foundational differences between Relational (SQL) and Non-Relational (NoSQL) databases?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 11,
            day: 4,
            topic: 'B-Tree Indexing',
            title: 'How do B-Tree indexes work internally?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 9,
            day: 4,
            topic: 'Isolation Levels',
            title: 'SQL Transaction Isolation Levels:',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 24,
            day: 4,
            topic: 'MVCC & VACUUM',
            title: 'MVCC and VACUUM in PostgreSQL:',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 43,
            day: 4,
            topic: 'Caching Strategies',
            title: 'Caching Strategies:',
            importance: 'HIGH_YIELD',
          }
        ],
      },
      {
        dayNumber: 5,
        title: 'Cloud Architecture & Web Security',
        focus: 'AWS VPC Networking, Serverless Scale, OWASP Top 10 & Auth',
        questions: [
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 1,
            day: 5,
            topic: 'Cloud & Global Infra',
            title: 'What is Cloud Computing, and how is the AWS Global Infrastructure structured (Regions, Availability Zones, and Edge Locations)?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 6,
            day: 5,
            topic: 'VPC Architecture',
            title: 'Design a secure VPC for a 3-tier web application (Web, App, Database).',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 4,
            day: 5,
            topic: 'Compute & Lambda Scaling',
            title: 'How do you decide between deploying an application on EC2, ECS (Fargate), EKS, or serverless Lambda?',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 11,
            day: 5,
            topic: 'BOLA / IDOR Defense',
            title: 'Broken Object Level Authorization (BOLA / IDOR): Why it is the #1 API vulnerability and how to prevent it.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 12,
            day: 5,
            topic: 'XSS Defense Mechanics',
            title: 'Cross-Site Scripting (XSS): Reflected vs. Stored vs. DOM-Based XSS mechanics and cookie exfiltration.',
            importance: 'MUST_KNOW',
          }
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
            questionNumber: 2,
            day: 6,
            topic: 'Container Isolation',
            title: 'Containers vs. Virtual Machines: How do Linux Namespaces and Control Groups (cgroups) isolate processes?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 16,
            day: 6,
            topic: 'Pod Lifecycle & State',
            title: 'Pod Lifecycle & State Machine: Pending, Running, Succeeded, Failed, and graceful shutdown sequencing.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 30,
            day: 6,
            topic: 'Zero-Downtime Rollouts',
            title: 'Zero-Downtime Rolling Updates: maxSurge, maxUnavailable, readiness gates, and preStop socket draining.',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 1,
            day: 6,
            topic: 'RAG Architecture Matrix',
            title: 'RAG vs. In-Context Learning vs. Fine-Tuning: Architectural Trade-Offs & Decision Matrix',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 4,
            day: 6,
            topic: 'Vector Indexing (HNSW)',
            title: 'Vector Database Indexing Internals: HNSW vs. IVF-PQ Trade-Offs',
            importance: 'STAFF_LEVEL',
          }
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
            questionNumber: 6,
            day: 7,
            topic: 'Hash Map Pattern',
            title: 'Two Sum.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 37,
            day: 7,
            topic: 'In-Place Linked List',
            title: 'Reverse a Linked List.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 80,
            day: 7,
            topic: 'Graph Grid BFS/DFS',
            title: 'Number of Islands.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 1,
            day: 7,
            topic: 'Self Introduction & Story',
            title: 'Tell me about yourself and walk me through your engineering background.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 12,
            day: 7,
            topic: 'STAR Technical Conflict',
            title: 'Tell me about a time you had a strong technical disagreement with a Tech Lead, Architect, or peer.',
            importance: 'MUST_KNOW',
          }
        ],
      }
    ],
  },
  {
    id: '30-day-master',
    title: '30-Day Senior & Staff Curriculum',
    tagline: 'Complete full-stack mastery from primitives to staff-level systems',
    description: 'A comprehensive 30-day journey covering JavaScript, React, Angular, Node, Python, Databases, Cloud Architecture, DevOps, Security, AI Engineering, DSA, and Executive Behavioral Leadership.',
    durationDays: 30,
    totalQuestions: 90,
    questionsPerDay: 3,
    iconName: 'Trophy',
    gradient: 'from-purple-600 via-indigo-600 to-cyan-500',
    badge: '90 Questions • 30 Days',
    days: [
      {
        dayNumber: 1,
        title: 'JavaScript Core: Engine & Event Loop',
        focus: 'Call Stack, Microtasks, Garbage Collection',
        questions: [
          {
            trackSlug: 'javascript',
            trackName: 'JavaScript',
            questionNumber: 439,
            day: 1,
            topic: 'Global Execution Context',
            title: 'What is global execution context?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'javascript',
            trackName: 'JavaScript',
            questionNumber: 241,
            day: 1,
            topic: 'Event Loop Mechanics',
            title: 'What is the event loop',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'javascript',
            trackName: 'JavaScript',
            questionNumber: 242,
            day: 1,
            topic: 'Call Stack & Memory',
            title: 'What is the call stack',
            importance: 'HIGH_YIELD',
          }
        ],
      },
      {
        dayNumber: 2,
        title: 'JavaScript Deep Dive: Prototypes & Promises',
        focus: 'Prototypal Inheritance, Promise Chaining, Async/Await',
        questions: [
          {
            trackSlug: 'javascript',
            trackName: 'JavaScript',
            questionNumber: 5,
            day: 2,
            topic: 'Prototype Chain',
            title: 'What is a prototype chain',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'javascript',
            trackName: 'JavaScript',
            questionNumber: 67,
            day: 2,
            topic: 'Promise Chaining',
            title: 'What is promise chaining',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'javascript',
            trackName: 'JavaScript',
            questionNumber: 483,
            day: 2,
            topic: 'Promise Combinators',
            title: 'What is Promise.any and when should it be used?',
            importance: 'HIGH_YIELD',
          }
        ],
      },
      {
        dayNumber: 3,
        title: 'React Fundamentals: Rendering & Fiber',
        focus: 'JSX Compilation, Virtual DOM, Fiber Reconciliation',
        questions: [
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 16,
            day: 3,
            topic: 'Virtual DOM Mechanics',
            title: 'What is Virtual DOM?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 19,
            day: 3,
            topic: 'React Fiber Architecture',
            title: 'What is React Fiber?',
            importance: 'STAFF_LEVEL',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 28,
            day: 3,
            topic: 'Reconciliation Algorithm',
            title: 'What is reconciliation?',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 4,
        title: 'React Advanced: State & Performance',
        focus: 'Concurrent Mode, Server Components, Custom Hooks',
        questions: [
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 228,
            day: 4,
            topic: 'Concurrent Rendering',
            title: 'Explain concurrent rendering with an example',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 236,
            day: 4,
            topic: 'React Server Components',
            title: 'What are React Server components?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'react-nextjs',
            trackName: 'React & Next.js',
            questionNumber: 312,
            day: 4,
            topic: 'Custom Hooks Sharing',
            title: 'How do you share state logic between components using custom hooks?',
            importance: 'HIGH_YIELD',
          }
        ],
      },
      {
        dayNumber: 5,
        title: 'Angular Architecture & Signals',
        focus: 'Zone.js, Angular Signals, Dependency Injection',
        questions: [
          {
            trackSlug: 'angular-ts',
            trackName: 'Angular & TypeScript',
            questionNumber: 17,
            day: 5,
            topic: 'Dependency Injection',
            title: 'What is dependency injection in Angular?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'angular-ts',
            trackName: 'Angular & TypeScript',
            questionNumber: 243,
            day: 5,
            topic: 'NgZone & Change Detection',
            title: 'What is NgZone?',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'angular-ts',
            trackName: 'Angular & TypeScript',
            questionNumber: 280,
            day: 5,
            topic: 'Angular Signals',
            title: 'What are Angular Signals?',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 6,
        title: 'Backend Node.js Architecture',
        focus: 'Libuv, Event Loop, Streams & Thread Pool',
        questions: [
          {
            trackSlug: 'nodejs',
            trackName: 'Node.js',
            questionNumber: 6,
            day: 6,
            topic: 'Core Architecture',
            title: 'Node.js fundamental architecture: V8, Libuv, c-ares, llhttp.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'nodejs',
            trackName: 'Node.js',
            questionNumber: 7,
            day: 6,
            topic: 'Event Loop Phases',
            title: 'Node.js Event Loop Phases in exact order.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'nodejs',
            trackName: 'Node.js',
            questionNumber: 10,
            day: 6,
            topic: 'Libuv Thread Pool',
            title: 'The Libuv Thread Pool.',
            importance: 'HIGH_YIELD',
          }
        ],
      },
      {
        dayNumber: 7,
        title: 'Backend Python & FastAPI',
        focus: 'GIL, Type Hints, Pydantic & Async Frameworks',
        questions: [
          {
            trackSlug: 'python',
            trackName: 'Python & FastAPI',
            questionNumber: 6,
            day: 7,
            topic: 'Reference Counting & GC',
            title: 'Memory management in Python: Reference Counting & Generational GC:',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'python',
            trackName: 'Python & FastAPI',
            questionNumber: 7,
            day: 7,
            topic: 'Global Interpreter Lock',
            title: 'What is the Global Interpreter Lock (GIL) and free-threaded Python?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'python',
            trackName: 'Python & FastAPI',
            questionNumber: 27,
            day: 7,
            topic: 'AsyncIO Coroutines',
            title: 'AsyncIO: Coroutines, Tasks, and Futures:',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 8,
        title: 'Database Foundations: Relational Storage',
        focus: 'B-Trees, Indexing & Query Optimizers',
        questions: [
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 6,
            day: 8,
            topic: 'ACID Properties',
            title: 'What are the ACID properties in relational databases?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 11,
            day: 8,
            topic: 'B-Tree Internals',
            title: 'How do B-Tree indexes work internally?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 14,
            day: 8,
            topic: 'EXPLAIN ANALYZE',
            title: 'EXPLAIN vs EXPLAIN ANALYZE:',
            importance: 'HIGH_YIELD',
          }
        ],
      },
      {
        dayNumber: 9,
        title: 'Database Transactions & NoSQL Scaling',
        focus: 'ACID, MVCC, Sharding, DynamoDB Single Table',
        questions: [
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 9,
            day: 9,
            topic: 'Transaction Isolation Levels',
            title: 'SQL Transaction Isolation Levels:',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 10,
            day: 9,
            topic: 'Dirty & Phantom Reads',
            title: 'Dirty Reads vs Non-Repeatable Reads vs Phantom Reads:',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 24,
            day: 9,
            topic: 'MVCC & VACUUM',
            title: 'MVCC and VACUUM in PostgreSQL:',
            importance: 'HIGH_YIELD',
          }
        ],
      },
      {
        dayNumber: 10,
        title: 'Caching & Real-Time Data Pipelines',
        focus: 'Redis Data Structures, Eviction Policies, Kafka',
        questions: [
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 41,
            day: 10,
            topic: 'Redis In-Memory Engine',
            title: 'Why single-threaded Redis handles 100k+ ops/sec:',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'databases',
            trackName: 'Databases',
            questionNumber: 43,
            day: 10,
            topic: 'Caching Strategies',
            title: 'Caching Strategies:',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 9,
            day: 10,
            topic: 'RabbitMQ vs Apache Kafka',
            title: 'Message Brokers vs Event Streaming: RabbitMQ vs Apache Kafka.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 11,
        title: 'System Design: Core Foundations',
        focus: 'CAP Theorem, Load Balancers, Consistent Hashing',
        questions: [
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 3,
            day: 11,
            topic: 'CAP & PACELC Theorem',
            title: 'The CAP Theorem & PACELC Theorem Deep-Dive.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 5,
            day: 11,
            topic: 'Layer 4 vs Layer 7 Load Balancing',
            title: 'Load Balancing Algorithms and Layer 4 vs Layer 7 Reverse Proxies.',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 6,
            day: 11,
            topic: 'Consistent Hashing',
            title: 'Consistent Hashing and Virtual Nodes: Mitigating Hot-Spots and Rebalancing.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 12,
        title: 'System Design: Real-World Architecture I',
        focus: 'TinyURL, Rate Limiter, Notification Service',
        questions: [
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 11,
            day: 12,
            topic: 'Distributed URL Shortener',
            title: 'Design a Distributed URL Shortener (TinyURL / Bit.ly).',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 12,
            day: 12,
            topic: 'Distributed Rate Limiter',
            title: 'Design a Distributed Rate Limiter.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 22,
            day: 12,
            topic: 'Distributed Notification Service',
            title: 'Design a Distributed Notification Service (APNs, FCM, SMS, and Email).',
            importance: 'HIGH_YIELD',
          }
        ],
      },
      {
        dayNumber: 13,
        title: 'System Design: Real-World Architecture II',
        focus: 'WhatsApp / Chat, News Feed, Uber Geospatial',
        questions: [
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 13,
            day: 13,
            topic: 'Real-Time Chat System',
            title: 'Design a Real-Time Chat System (WhatsApp / Slack / Discord).',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 14,
            day: 13,
            topic: 'Social Media Feed (Fan-Out)',
            title: 'Design Twitter / Social Media Feed System (Fan-Out on Write vs Fan-Out on Read).',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 15,
            day: 13,
            topic: 'Ride-Sharing Proximity',
            title: 'Design a Proximity / Ride-Sharing Service (Uber / Lyft).',
            importance: 'STAFF_LEVEL',
          }
        ],
      },
      {
        dayNumber: 14,
        title: 'AWS Cloud Architecture: Compute & Storage',
        focus: 'EC2, ECS Fargate, S3, Aurora Serverless',
        questions: [
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 4,
            day: 14,
            topic: 'EC2 vs ECS vs EKS vs Lambda',
            title: 'How do you decide between deploying an application on EC2, ECS (Fargate), EKS, or serverless Lambda?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 6,
            day: 14,
            topic: '3-Tier VPC Architecture',
            title: 'Design a secure VPC for a 3-tier web application (Web, App, Database).',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 36,
            day: 14,
            topic: 'S3 vs EBS vs EFS Storage',
            title: 'S3 vs EBS vs EFS.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 15,
        title: 'AWS Cloud Architecture: Security & IAM',
        focus: 'IAM Evaluation, KMS Key Management, Secrets Manager',
        questions: [
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 52,
            day: 15,
            topic: 'IAM User, Group, Role & Policy',
            title: 'IAM User vs Group vs Role vs Policy.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 53,
            day: 15,
            topic: 'IAM Policy Evaluation Logic',
            title: 'IAM Policy Evaluation Logic.',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'aws',
            trackName: 'AWS Cloud',
            questionNumber: 54,
            day: 15,
            topic: 'AWS KMS Envelope Encryption',
            title: 'IAM Instance Profiles.',
            importance: 'STAFF_LEVEL',
          }
        ],
      },
      {
        dayNumber: 16,
        title: 'DevOps: Docker & Container Runtimes',
        focus: 'Dockerfile Optimization, Multi-Stage Builds, Rootless Containers',
        questions: [
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 2,
            day: 16,
            topic: 'Linux Namespaces & Cgroups',
            title: 'Containers vs. Virtual Machines: How do Linux Namespaces and Control Groups (cgroups) isolate processes?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 3,
            day: 16,
            topic: 'Overlay2 Copy-on-Write',
            title: 'Container Storage & UnionFS / Overlay2: How does the Copy-on-Write (CoW) mechanism work in Docker?',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 4,
            day: 16,
            topic: 'Production Dockerfile Optimization',
            title: 'How do you optimize Dockerfiles for minimum image size, security, and build layer caching in production?',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 17,
        title: 'DevOps: Kubernetes Core Architecture',
        focus: 'Control Plane, etcd, Scheduling, CNI / CoreDNS',
        questions: [
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 11,
            day: 17,
            topic: 'Control Plane Architecture',
            title: 'Kubernetes Control Plane Architecture: How do Control Plane components and Worker Node agents interact?',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 12,
            day: 17,
            topic: 'etcd Raft Consensus',
            title: 'The etcd Distributed Datastore: Raft consensus, quorum calculation, snapshot backups, and write latency.',
            importance: 'STAFF_LEVEL',
          },
          {
            trackSlug: 'devops-kubernetes',
            trackName: 'DevOps & K8s',
            questionNumber: 16,
            day: 17,
            topic: 'Pod Lifecycle & Shutdown',
            title: 'Pod Lifecycle & State Machine: Pending, Running, Succeeded, Failed, and graceful shutdown sequencing.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 18,
        title: 'Web Security: Injection & Authentication',
        focus: 'SQLi, BOLA / IDOR, Secure Session Cookies',
        questions: [
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 5,
            day: 18,
            topic: 'Session Management & Token Storage',
            title: 'Session Management & Token Storage: Why localStorage is vulnerable to XSS and how to configure secure cookies.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 11,
            day: 18,
            topic: 'Broken Object Level Authorization',
            title: 'Broken Object Level Authorization (BOLA / IDOR): Why it is the #1 API vulnerability and how to prevent it.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 16,
            day: 18,
            topic: 'SQL Injection Defense',
            title: 'SQL Injection (SQLi) & Second-Order SQLi: Prepared statements, ORM vulnerabilities, and blind SQLi.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 19,
        title: 'Web Security: Browser Protections & Cryptography',
        focus: 'CSP, CORS, CSRF, Security Headers',
        questions: [
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 6,
            day: 19,
            topic: 'CORS Protocol Deep-Dive',
            title: 'CORS Protocol Deep-Dive: Preflight OPTIONS requests, credentialed origins, and the wildcard credential trap.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 13,
            day: 19,
            topic: 'Content Security Policy (CSP)',
            title: 'Content Security Policy (CSP): Nonce-based architecture, strict-dynamic, and eliminating unsafe-inline.',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'web-security-owasp',
            trackName: 'Web Security',
            questionNumber: 14,
            day: 19,
            topic: 'Cross-Site Request Forgery (CSRF)',
            title: 'Cross-Site Request Forgery (CSRF): SameSite cookies, Double Submit Cookie pattern, and sync tokens.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 20,
        title: 'AI Engineering: RAG & Vector Search',
        focus: 'Chunking, Dense Embeddings, HNSW, Hybrid Search',
        questions: [
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 1,
            day: 20,
            topic: 'RAG Architecture Matrix',
            title: 'RAG vs. In-Context Learning vs. Fine-Tuning: Architectural Trade-Offs & Decision Matrix',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 2,
            day: 20,
            topic: 'Document Chunking Strategies',
            title: 'Document Chunking Strategies: Fixed-Size, Recursive, Semantic & Late Chunking',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 4,
            day: 20,
            topic: 'Vector Indexing (HNSW vs IVF-PQ)',
            title: 'Vector Database Indexing Internals: HNSW vs. IVF-PQ Trade-Offs',
            importance: 'STAFF_LEVEL',
          }
        ],
      },
      {
        dayNumber: 21,
        title: 'AI Engineering: LLM Serving & Autonomous Agents',
        focus: 'vLLM PagedAttention, KV Cache, MCP, Tool Calling',
        questions: [
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 11,
            day: 21,
            topic: 'Autoregressive & KV Cache',
            title: 'Autoregressive Generation & The KV Cache: Memory Footprint & Scaling Formulas',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 21,
            day: 21,
            topic: 'The ReAct Pattern for Agents',
            title: 'The ReAct Pattern (Reason + Act): Thought-Action-Observation Loop & Production Trade-Offs',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'ai-engineering-llm',
            trackName: 'AI & LLMs',
            questionNumber: 23,
            day: 21,
            topic: 'Model Context Protocol (MCP)',
            title: 'Model Context Protocol (MCP): Client-Host-Server Architecture & Dynamic Tool Discovery',
            importance: 'STAFF_LEVEL',
          }
        ],
      },
      {
        dayNumber: 22,
        title: 'DSA: Two Pointers & Sliding Window',
        focus: 'Array Manipulation, Substrings, Palindromes',
        questions: [
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 6,
            day: 22,
            topic: 'Two Sum',
            title: 'Two Sum.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 21,
            day: 22,
            topic: '3Sum',
            title: '3Sum.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 24,
            day: 22,
            topic: 'Longest Substring Without Repeating Characters',
            title: 'Longest Substring Without Repeating Characters.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 23,
        title: 'DSA: Linked Lists & Fast-Slow Pointers',
        focus: 'Cycle Detection, Merge Lists, Reverse Lists',
        questions: [
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 37,
            day: 23,
            topic: 'Reverse a Linked List',
            title: 'Reverse a Linked List.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 38,
            day: 23,
            topic: 'Merge Two Sorted Lists',
            title: 'Merge Two Sorted Lists.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 39,
            day: 23,
            topic: 'Linked List Cycle (Floyd’s Algorithm)',
            title: 'Linked List Cycle (Floyd’s Tortoise and Hare).',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 24,
        title: 'DSA: Binary Trees & Tree Traversals',
        focus: 'DFS/BFS, Lowest Common Ancestor, Invert Tree',
        questions: [
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 53,
            day: 24,
            topic: 'Invert / Flip Binary Tree',
            title: 'Invert / Flip Binary Tree.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 54,
            day: 24,
            topic: 'Maximum Depth of Binary Tree',
            title: 'Maximum Depth of Binary Tree.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 59,
            day: 24,
            topic: 'Lowest Common Ancestor (LCA)',
            title: 'Lowest Common Ancestor (LCA) of BST & Binary Tree.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 25,
        title: 'DSA: Graphs & Matrix Traversal',
        focus: 'Number of Islands, Clone Graph, Topological Sort',
        questions: [
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 80,
            day: 25,
            topic: 'Number of Islands',
            title: 'Number of Islands.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 81,
            day: 25,
            topic: 'Clone Graph',
            title: 'Clone Graph.',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 84,
            day: 25,
            topic: 'Course Schedule (Cycle Detection)',
            title: 'Course Schedule (I & II).',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 26,
        title: 'DSA: Dynamic Programming Foundations',
        focus: 'Memoization, Tabulation, Climbing Stairs, Coin Change',
        questions: [
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 91,
            day: 26,
            topic: 'Climbing Stairs',
            title: 'Climbing Stairs.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 93,
            day: 26,
            topic: 'House Robber',
            title: 'House Robber (I & II).',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 94,
            day: 26,
            topic: 'Coin Change',
            title: 'Coin Change.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 27,
        title: 'DSA: Backtracking & Trie Structures',
        focus: 'Word Search, Subsets, Trie Prefix Matching',
        questions: [
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 65,
            day: 27,
            topic: 'Implement Trie (Prefix Tree)',
            title: 'Implement Trie (Prefix Tree).',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 73,
            day: 27,
            topic: 'Subsets (Power Set)',
            title: 'Subsets (Power Set).',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'dsa',
            trackName: 'Algorithms',
            questionNumber: 77,
            day: 27,
            topic: 'Word Search in Grid',
            title: 'Word Search in Grid.',
            importance: 'HIGH_YIELD',
          }
        ],
      },
      {
        dayNumber: 28,
        title: 'Behavioral & Leadership: STAR Foundations',
        focus: 'Impact Storytelling, Technical Conflict, Failure Post-Mortem',
        questions: [
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 1,
            day: 28,
            topic: 'Self Introduction Narrative',
            title: 'Tell me about yourself and walk me through your engineering background.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 11,
            day: 28,
            topic: 'STAR Behavioral Framework',
            title: 'Describe a situation where you solved an ambiguous or poorly-defined technical problem.',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 12,
            day: 28,
            topic: 'Technical Disagreement with Peer',
            title: 'Tell me about a time you had a strong technical disagreement with a Tech Lead, Architect, or peer.',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 29,
        title: 'Behavioral & Leadership: Cross-Functional & Mentorship',
        focus: 'Mentoring Junior Engineers, Disagree and Commit, Scope Growth',
        questions: [
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 16,
            day: 29,
            topic: 'Mentoring Junior Engineers',
            title: 'Tell me about a time you mentored a junior engineer, intern, or unblocked a struggling colleague.',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 17,
            day: 29,
            topic: 'Handling High-Stress Production Deadlines',
            title: 'Describe a situation where you had to make a painful technical compromise or incur intentional technical debt.',
            importance: 'HIGH_YIELD',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 26,
            day: 29,
            topic: 'Engineering Leadership & Code Review Culture',
            title: 'What is your philosophy and framework for conducting constructive, high-velocity code reviews?',
            importance: 'MUST_KNOW',
          }
        ],
      },
      {
        dayNumber: 30,
        title: 'Final Mastery: Staff-Level Systems & Salary Negotiation',
        focus: 'Multi-Region High Availability, Compensation Negotiation, Culture',
        questions: [
          {
            trackSlug: 'system-design',
            trackName: 'System Design',
            questionNumber: 48,
            day: 30,
            topic: 'High Availability Sizing (Four Nines)',
            title: 'High Availability Sizing: 99.9% vs 99.99% ("Four Nines") Downtime Budgets.',
            importance: 'STAFF_LEVEL',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 48,
            day: 30,
            topic: 'Salary & Total Comp Negotiation',
            title: 'How should you handle the question: "What are your salary and total compensation expectations?"',
            importance: 'MUST_KNOW',
          },
          {
            trackSlug: 'behavioral-hr',
            trackName: 'Behavioral & HR',
            questionNumber: 45,
            day: 30,
            topic: 'Questions to Ask the Interviewer',
            title: 'What strategic questions should you ask the Hiring Manager at the end of the interview?',
            importance: 'MUST_KNOW',
          }
        ],
      }
    ],
  }
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

