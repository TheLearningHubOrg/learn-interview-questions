import { TRACKS, TrackMeta } from './tracks-meta';

export const TECH_STACK_STORAGE_KEY = 'interviewhub_selected_techs';
export const TECH_STACK_UPDATE_EVENT = 'interviewhub-tech-stack-update';

export interface RolePreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  techSlugs: string[];
}

export interface GranularTech {
  slug: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Databases & Cache' | 'Messaging & Streaming' | 'Cloud, DevOps & IaC' | 'Architecture & Core';
  icon: string;
  approxQuestionCount: number;
}

export const GRANULAR_TECHS: GranularTech[] = [
  // 1. Frontend Frameworks & Languages
  { slug: 'react', name: 'React Core & Hooks', category: 'Frontend', icon: '⚛️', approxQuestionCount: 408 },
  { slug: 'nextjs', name: 'Next.js & Full-Stack RSC', category: 'Frontend', icon: '▲', approxQuestionCount: 37 },
  { slug: 'angular-ts', name: 'Angular 19 & Signals', category: 'Frontend', icon: '🅰️', approxQuestionCount: 283 },
  { slug: 'typescript', name: 'TypeScript & Typings', category: 'Frontend', icon: '🔷', approxQuestionCount: 65 },
  { slug: 'vue-nuxt', name: 'Vue 3 & Nuxt 3', category: 'Frontend', icon: '💚', approxQuestionCount: 20 },
  { slug: 'astro', name: 'Astro (Islands & Zero-JS)', category: 'Frontend', icon: '🚀', approxQuestionCount: 15 },
  { slug: 'svelte', name: 'Svelte 5 & SvelteKit', category: 'Frontend', icon: '🧡', approxQuestionCount: 15 },
  { slug: 'javascript', name: 'Core JavaScript & Web', category: 'Frontend', icon: '🟨', approxQuestionCount: 536 },

  // 2. Backend & Microservices
  { slug: 'golang', name: 'Go (Golang) & Concurrency', category: 'Backend', icon: '🐹', approxQuestionCount: 50 },
  { slug: 'java-spring', name: 'Java 21 & Spring Boot 3', category: 'Backend', icon: '☕', approxQuestionCount: 50 },
  { slug: 'dotnet-csharp', name: '.NET 8/9 & C# 12', category: 'Backend', icon: '🔷', approxQuestionCount: 50 },
  { slug: 'nodejs', name: 'Node.js & Express', category: 'Backend', icon: '🟩', approxQuestionCount: 60 },
  { slug: 'python', name: 'Python & FastAPI', category: 'Backend', icon: '🐍', approxQuestionCount: 65 },
  { slug: 'rest-api', name: 'REST APIs & HTTP', category: 'Backend', icon: '🌐', approxQuestionCount: 25 },
  { slug: 'graphql', name: 'GraphQL & Resolvers', category: 'Backend', icon: '🌸', approxQuestionCount: 15 },
  { slug: 'grpc', name: 'gRPC & Protocol Buffers', category: 'Backend', icon: '📡', approxQuestionCount: 15 },

  // 3. Databases & In-Memory Caching (Explicitly Separated!)
  { slug: 'postgresql', name: 'PostgreSQL', category: 'Databases & Cache', icon: '🐘', approxQuestionCount: 20 },
  { slug: 'mysql', name: 'MySQL & InnoDB', category: 'Databases & Cache', icon: '🐬', approxQuestionCount: 15 },
  { slug: 'sql', name: 'Relational SQL & DB Design', category: 'Databases & Cache', icon: '📊', approxQuestionCount: 25 },
  { slug: 'mongodb', name: 'MongoDB & Document NoSQL', category: 'Databases & Cache', icon: '🍃', approxQuestionCount: 15 },
  { slug: 'dynamodb', name: 'DynamoDB (AWS NoSQL)', category: 'Databases & Cache', icon: '⚡', approxQuestionCount: 10 },
  { slug: 'redis', name: 'Redis & In-Memory Caching', category: 'Databases & Cache', icon: '⚡', approxQuestionCount: 15 },

  // 4. Messaging & Event Streaming
  { slug: 'rabbitmq', name: 'RabbitMQ & AMQP', category: 'Messaging & Streaming', icon: '🐇', approxQuestionCount: 25 },
  { slug: 'kafka', name: 'Apache Kafka & Streaming', category: 'Messaging & Streaming', icon: '🪵', approxQuestionCount: 25 },

  // 5. Cloud, DevOps & Infrastructure as Code (IaC)
  { slug: 'terraform', name: 'Terraform & OpenTofu (IaC)', category: 'Cloud, DevOps & IaC', icon: '🟣', approxQuestionCount: 40 },
  { slug: 'kubernetes', name: 'Kubernetes (K8s) & GitOps', category: 'Cloud, DevOps & IaC', icon: '☸️', approxQuestionCount: 35 },
  { slug: 'docker', name: 'Docker & Containers', category: 'Cloud, DevOps & IaC', icon: '🐳', approxQuestionCount: 10 },
  { slug: 'cicd', name: 'CI/CD & GitHub Actions', category: 'Cloud, DevOps & IaC', icon: '🔄', approxQuestionCount: 15 },
  { slug: 'aws', name: 'AWS Cloud Architecture', category: 'Cloud, DevOps & IaC', icon: '☁️', approxQuestionCount: 65 },

  // 6. Architecture, Security & Core Engineering
  { slug: 'system-design', name: 'System Design & Distributed Systems', category: 'Architecture & Core', icon: '🏗️', approxQuestionCount: 50 },
  { slug: 'web-security-owasp', name: 'Web Security & OWASP Top 10', category: 'Architecture & Core', icon: '🛡️', approxQuestionCount: 50 },
  { slug: 'ai-engineering-llm', name: 'AI Engineering & LLM Systems', category: 'Architecture & Core', icon: '🤖', approxQuestionCount: 50 },
  { slug: 'dsa', name: 'DSA Patterns & Live Coding', category: 'Architecture & Core', icon: '🧩', approxQuestionCount: 100 },
  { slug: 'behavioral-hr', name: 'Behavioral & Leadership (STAR)', category: 'Architecture & Core', icon: '🤝', approxQuestionCount: 50 },
];

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'mean-stack',
    label: 'MEAN Stack Full-Stack',
    icon: '🅰️',
    description: 'MongoDB, Express, Angular 19, Node.js & Core JavaScript',
    techSlugs: ['angular-ts', 'nodejs', 'mongodb', 'javascript'],
  },
  {
    id: 'mern-stack',
    label: 'MERN Stack Full-Stack',
    icon: '⚛️',
    description: 'MongoDB, Express, React Core, Node.js & JavaScript',
    techSlugs: ['react', 'nodejs', 'mongodb', 'javascript'],
  },
  {
    id: 'fullstack-nextjs',
    label: 'Next.js & Modern React',
    icon: '▲',
    description: 'Next.js RSC, React Core, PostgreSQL & TypeScript',
    techSlugs: ['nextjs', 'react', 'postgresql', 'typescript', 'javascript'],
  },
  {
    id: 'golang-cloud',
    label: 'Go Cloud & Microservices',
    icon: '🐹',
    description: 'Golang 1.22+, gRPC, Docker, Kubernetes & System Design',
    techSlugs: ['golang', 'grpc', 'docker', 'kubernetes', 'system-design'],
  },
  {
    id: 'modern-frameworks-hub',
    label: 'Astro, Vue & Svelte Hub',
    icon: '🚀',
    description: 'Astro Islands, Vue 3/Nuxt 3, Svelte 5 & Modern Web Vitals',
    techSlugs: ['astro', 'vue-nuxt', 'svelte', 'javascript'],
  },
  {
    id: 'java-enterprise',
    label: 'Java Spring Enterprise',
    icon: '☕',
    description: 'Java 21, Spring Boot 3, PostgreSQL, Kafka & System Design',
    techSlugs: ['java-spring', 'postgresql', 'kafka', 'docker', 'system-design'],
  },
  {
    id: 'dotnet-enterprise',
    label: '.NET & C# Enterprise',
    icon: '🔷',
    description: '.NET 8/9, C# 12, SQL, RabbitMQ, Docker & Clean Architecture',
    techSlugs: ['dotnet-csharp', 'sql', 'rabbitmq', 'docker', 'system-design'],
  },
  {
    id: 'devops-platform',
    label: 'DevOps, SRE & Platform',
    icon: '☸️',
    description: 'Terraform IaC, Kubernetes, Docker, CI/CD, AWS & Security',
    techSlugs: ['terraform', 'kubernetes', 'docker', 'cicd', 'aws', 'web-security-owasp'],
  },
  {
    id: 'event-driven-architect',
    label: 'Event-Driven Architect',
    icon: '🐇',
    description: 'RabbitMQ, Apache Kafka, Redis Caching & Distributed System Design',
    techSlugs: ['rabbitmq', 'kafka', 'redis', 'system-design'],
  },
  {
    id: 'backend-python',
    label: 'Python Cloud Backend',
    icon: '🐍',
    description: 'Python & FastAPI, PostgreSQL, Redis & AWS Cloud',
    techSlugs: ['python', 'postgresql', 'redis', 'aws', 'system-design'],
  },
  {
    id: 'ai-engineer',
    label: 'AI & LLM Systems Engineer',
    icon: '🤖',
    description: 'AI Engineering/RAG, Python, PostgreSQL & System Design',
    techSlugs: ['ai-engineering-llm', 'python', 'postgresql', 'system-design'],
  },
  {
    id: 'coding-core',
    label: 'Live Coding & Algorithms',
    icon: '⚡',
    description: 'DSA Patterns, TypeScript/JavaScript Internals & Behavioral STAR',
    techSlugs: ['dsa', 'typescript', 'javascript', 'behavioral-hr'],
  },
];

export function isQuestionInSelectedTech(
  item: { trackSlug: string; questionNumber: number; part?: string; tags?: string[]; title?: string },
  selectedTechSlugs: string[]
): boolean {
  if (selectedTechSlugs.length === 0) return true;

  return selectedTechSlugs.some((tech) => {
    // 1. PostgreSQL (Specific to Postgres)
    if (tech === 'postgresql') {
      return (
        item.trackSlug === 'databases' &&
        ((item.questionNumber >= 17 && item.questionNumber <= 24) ||
          item.questionNumber === 59 ||
          item.tags?.some((t) => t.toLowerCase().includes('postgres')) ||
          (item.title && item.title.toLowerCase().includes('postgres')))
      );
    }

    // 2. MySQL (Specific to MySQL)
    if (tech === 'mysql') {
      return (
        item.trackSlug === 'databases' &&
        ((item.questionNumber >= 61 && item.questionNumber <= 65) ||
          item.tags?.some((t) => t.toLowerCase().includes('mysql')) ||
          (item.title && item.title.toLowerCase().includes('mysql')))
      );
    }

    // 3. Relational SQL & DB Fundamentals (ACID, Normalization, Joins, Indexes, B-Trees)
    if (tech === 'sql') {
      return (
        item.trackSlug === 'databases' &&
        ((item.questionNumber >= 1 && item.questionNumber <= 16) ||
          item.questionNumber === 19 ||
          item.questionNumber === 20 ||
          item.questionNumber === 21 ||
          item.questionNumber === 22 ||
          item.questionNumber === 25 ||
          item.tags?.some((t) => t.toLowerCase().includes('acid') || t.toLowerCase().includes('sql') || t.toLowerCase().includes('index')))
      );
    }

    // 4. MongoDB & Document NoSQL
    if (tech === 'mongodb') {
      return (
        item.trackSlug === 'databases' &&
        ((item.questionNumber >= 26 && item.questionNumber <= 35) ||
          item.questionNumber === 38 ||
          item.questionNumber === 39 ||
          item.tags?.some((t) => t.toLowerCase().includes('mongo') || t.toLowerCase().includes('nosql')) ||
          (item.part && item.part.toLowerCase().includes('nosql')))
      );
    }

    // 5. DynamoDB (AWS NoSQL)
    if (tech === 'dynamodb') {
      return (
        item.trackSlug === 'databases' &&
        (item.questionNumber === 36 ||
          item.questionNumber === 37 ||
          item.tags?.some((t) => t.toLowerCase().includes('dynamo')) ||
          (item.title && item.title.toLowerCase().includes('dynamo')))
      );
    }

    // 6. Redis & In-Memory Caching
    if (tech === 'redis') {
      return (
        (item.trackSlug === 'databases' &&
          ((item.questionNumber >= 41 && item.questionNumber <= 50) ||
            item.tags?.some((t) => t.toLowerCase().includes('redis') || t.toLowerCase().includes('cache')))) ||
        (item.trackSlug === 'messaging-queues' && item.questionNumber >= 33 && item.questionNumber <= 36)
      );
    }

    // 7. RabbitMQ & AMQP
    if (tech === 'rabbitmq') {
      return (
        item.trackSlug === 'messaging-queues' &&
        (item.questionNumber <= 15 ||
          item.questionNumber === 37 ||
          item.questionNumber === 38 ||
          item.tags?.some((t) => t.toLowerCase().includes('rabbitmq') || t.toLowerCase().includes('amqp')) ||
          (item.title && item.title.toLowerCase().includes('rabbitmq')))
      );
    }

    // 8. Apache Kafka & Streaming
    if (tech === 'kafka') {
      return (
        item.trackSlug === 'messaging-queues' &&
        ((item.questionNumber >= 16 && item.questionNumber <= 32) ||
          item.questionNumber >= 46 ||
          item.tags?.some((t) => t.toLowerCase().includes('kafka')) ||
          (item.title && item.title.toLowerCase().includes('kafka')))
      );
    }

    // 9. TypeScript & Typings
    if (tech === 'typescript') {
      return (
        item.tags?.some((t) => t.toLowerCase().includes('typescript')) ||
        (item.title && (item.title.toLowerCase().includes('typescript') || item.title.toLowerCase().includes('generics') || item.title.toLowerCase().includes('typing'))) ||
        (item.trackSlug === 'angular-ts' && item.questionNumber <= 25)
      );
    }

    // 10. Astro (Islands & Zero-JS)
    if (tech === 'astro') {
      return (
        item.trackSlug === 'modern-frameworks' &&
        (item.questionNumber <= 15 ||
          item.tags?.some((t) => t.toLowerCase().includes('astro')) ||
          (item.title && item.title.toLowerCase().includes('astro')))
      );
    }

    // 11. Vue 3 & Nuxt 3
    if (tech === 'vue-nuxt') {
      return (
        item.trackSlug === 'modern-frameworks' &&
        ((item.questionNumber >= 16 && item.questionNumber <= 32) ||
          item.tags?.some((t) => t.toLowerCase().includes('vue') || t.toLowerCase().includes('nuxt')) ||
          (item.title && (item.title.toLowerCase().includes('vue') || item.title.toLowerCase().includes('nuxt'))))
      );
    }

    // 12. Svelte 5 & SvelteKit
    if (tech === 'svelte') {
      return (
        item.trackSlug === 'modern-frameworks' &&
        ((item.questionNumber >= 33 && item.questionNumber <= 45) ||
          item.tags?.some((t) => t.toLowerCase().includes('svelte')) ||
          (item.title && item.title.toLowerCase().includes('svelte')))
      );
    }

    // 13. React Core & Hooks (Excluding Next.js)
    if (tech === 'react') {
      return (
        item.trackSlug === 'react-nextjs' &&
        !(item.questionNumber >= 317 && item.questionNumber <= 353)
      );
    }

    // 14. Next.js & Full-Stack RSC (Excluding pure React Core)
    if (tech === 'nextjs') {
      return (
        item.trackSlug === 'react-nextjs' &&
        ((item.questionNumber >= 317 && item.questionNumber <= 353) ||
          item.tags?.some((t) => t.toLowerCase().includes('next')) ||
          (item.title && item.title.toLowerCase().includes('next')) ||
          (item.part && item.part.toLowerCase().includes('next')))
      );
    }

    // 15. Golang & Microservices
    if (tech === 'golang') {
      return item.trackSlug === 'golang';
    }

    // 16. REST APIs & HTTP
    if (tech === 'rest-api') {
      return (
        item.tags?.some((t) => t.toLowerCase().includes('rest') || t.toLowerCase().includes('http')) ||
        (item.title && (item.title.toLowerCase().includes('rest') || item.title.toLowerCase().includes('http verb') || item.title.toLowerCase().includes('status code')))
      );
    }

    // 17. GraphQL & Resolvers
    if (tech === 'graphql') {
      return (
        item.tags?.some((t) => t.toLowerCase().includes('graphql')) ||
        (item.title && item.title.toLowerCase().includes('graphql'))
      );
    }

    // 18. gRPC & Protocol Buffers
    if (tech === 'grpc') {
      return (
        (item.trackSlug === 'golang' && item.questionNumber === 31) ||
        item.tags?.some((t) => t.toLowerCase().includes('grpc') || t.toLowerCase().includes('protobuf')) ||
        (item.title && (item.title.toLowerCase().includes('grpc') || item.title.toLowerCase().includes('protocol buffer')))
      );
    }

    // 19. CI/CD & GitHub Actions
    if (tech === 'cicd') {
      return (
        (item.trackSlug === 'devops-kubernetes' && item.questionNumber >= 36 && item.questionNumber <= 42) ||
        (item.trackSlug === 'terraform-iac' && item.questionNumber >= 21 && item.questionNumber <= 25) ||
        item.tags?.some((t) => t.toLowerCase().includes('ci/cd') || t.toLowerCase().includes('github action')) ||
        (item.title && (item.title.toLowerCase().includes('ci/cd') || item.title.toLowerCase().includes('pipeline') || item.title.toLowerCase().includes('github action')))
      );
    }

    // 20. Terraform & IaC
    if (tech === 'terraform') {
      return (
        item.trackSlug === 'terraform-iac' ||
        (item.trackSlug === 'devops-kubernetes' && (item.questionNumber === 43 || item.questionNumber === 44))
      );
    }

    // 21. Kubernetes (K8s) & GitOps
    if (tech === 'kubernetes') {
      return (
        (item.trackSlug === 'devops-kubernetes' && item.questionNumber >= 11 && item.questionNumber <= 35) ||
        (item.trackSlug === 'terraform-iac' && item.questionNumber >= 26 && item.questionNumber <= 34)
      );
    }

    // 22. Docker & Containers
    if (tech === 'docker') {
      return (
        item.trackSlug === 'devops-kubernetes' &&
        (item.questionNumber <= 10 ||
          item.tags?.some((t) => t.toLowerCase().includes('docker') || t.toLowerCase().includes('container')) ||
          (item.part && item.part.toLowerCase().includes('docker')))
      );
    }

    // Default 1:1 track match (e.g. java-spring, dotnet-csharp, angular-ts, python, nodejs, aws, dsa, etc.)
    return item.trackSlug === tech;
  });
}

export function getSelectedTechSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TECH_STACK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setSelectedTechSlugs(slugs: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TECH_STACK_STORAGE_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent(TECH_STACK_UPDATE_EVENT, { detail: slugs }));
  } catch (err) {
    console.error('Failed to save selected tech stack:', err);
  }
}
