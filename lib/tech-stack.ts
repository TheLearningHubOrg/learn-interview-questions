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
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Databases & Cache' | 'Data Engineering' | 'Messaging & Streaming' | 'Cloud Platforms' | 'DevOps & Systems' | 'Testing & SRE' | 'Architecture & Core';
  icon: string;
  approxQuestionCount: number;
}

export const GRANULAR_TECHS: GranularTech[] = [
  // 1. Frontend Frameworks & Languages
  { slug: 'react', name: 'React Core & Hooks', category: 'Frontend', icon: '⚛️', approxQuestionCount: 407 },
  { slug: 'nextjs', name: 'Next.js & Server Actions', category: 'Frontend', icon: '▲', approxQuestionCount: 37 },
  { slug: 'angular-ts', name: 'Angular 19 & Signals', category: 'Frontend', icon: '🅰️', approxQuestionCount: 283 },
  { slug: 'typescript', name: 'TypeScript & Typings', category: 'Frontend', icon: '🔷', approxQuestionCount: 50 },
  { slug: 'vue-nuxt', name: 'Vue 3 & Nuxt 3', category: 'Frontend', icon: '💚', approxQuestionCount: 17 },
  { slug: 'svelte-astro', name: 'Svelte 5 & Astro', category: 'Frontend', icon: '🧡', approxQuestionCount: 33 },
  { slug: 'javascript', name: 'Core JavaScript Internals', category: 'Frontend', icon: '🟨', approxQuestionCount: 536 },
  { slug: 'html-css', name: 'Modern HTML5 & CSS3', category: 'Frontend', icon: '🎨', approxQuestionCount: 15 },
  { slug: 'web-vitals-accessibility', name: 'Web Vitals & Accessibility', category: 'Frontend', icon: '♿', approxQuestionCount: 12 },

  // 2. Backend & Microservices
  { slug: 'golang', name: 'Go (Golang) & Concurrency', category: 'Backend', icon: '🐹', approxQuestionCount: 50 },
  { slug: 'rust', name: 'Rust & Systems Programming', category: 'Backend', icon: '🦀', approxQuestionCount: 15 },
  { slug: 'java-spring', name: 'Java 21 & Spring Boot 3', category: 'Backend', icon: '☕', approxQuestionCount: 50 },
  { slug: 'dotnet-csharp', name: '.NET 8/9 & C# 12', category: 'Backend', icon: '🔷', approxQuestionCount: 50 },
  { slug: 'php-laravel', name: 'PHP 8.3 & Laravel 11', category: 'Backend', icon: '🐘', approxQuestionCount: 15 },
  { slug: 'nodejs', name: 'Node.js & Event Loop', category: 'Backend', icon: '🟩', approxQuestionCount: 60 },
  { slug: 'python', name: 'Python & FastAPI', category: 'Backend', icon: '🐍', approxQuestionCount: 65 },
  { slug: 'rest-api', name: 'REST APIs & HTTP', category: 'Backend', icon: '🌐', approxQuestionCount: 25 },
  { slug: 'graphql', name: 'GraphQL & Resolvers', category: 'Backend', icon: '🌸', approxQuestionCount: 15 },
  { slug: 'grpc', name: 'gRPC & Protocol Buffers', category: 'Backend', icon: '📡', approxQuestionCount: 15 },

  // 3. Mobile Engineering (Completely Separated!)
  { slug: 'react-native', name: 'React Native & Expo', category: 'Mobile', icon: '📱', approxQuestionCount: 15 },
  { slug: 'flutter', name: 'Flutter & Dart Engine', category: 'Mobile', icon: '💙', approxQuestionCount: 15 },
  { slug: 'ios-swift', name: 'Native iOS & Swift 6', category: 'Mobile', icon: '🍎', approxQuestionCount: 11 },
  { slug: 'android-kotlin', name: 'Native Android & Kotlin', category: 'Mobile', icon: '🤖', approxQuestionCount: 9 },

  // 4. Databases & In-Memory Caching (Completely Separated!)
  { slug: 'postgresql', name: 'PostgreSQL Advanced', category: 'Databases & Cache', icon: '🐘', approxQuestionCount: 15 },
  { slug: 'mysql', name: 'MySQL & InnoDB Engine', category: 'Databases & Cache', icon: '🐬', approxQuestionCount: 10 },
  { slug: 'sql-databases', name: 'Relational SQL & DB Design', category: 'Databases & Cache', icon: '📊', approxQuestionCount: 17 },
  { slug: 'mongodb', name: 'MongoDB & Document NoSQL', category: 'Databases & Cache', icon: '🍃', approxQuestionCount: 12 },
  { slug: 'dynamodb', name: 'DynamoDB Key-Value NoSQL', category: 'Databases & Cache', icon: '⚡', approxQuestionCount: 6 },
  { slug: 'redis', name: 'Redis & Distributed Cache', category: 'Databases & Cache', icon: '⚡', approxQuestionCount: 11 },
  { slug: 'elasticsearch', name: 'Elasticsearch & Search Engines', category: 'Databases & Cache', icon: '🔍', approxQuestionCount: 7 },
  { slug: 'vector-databases', name: 'Vector Databases & RAG', category: 'Databases & Cache', icon: '🧠', approxQuestionCount: 6 },

  // 5. Data Engineering & Big Data (Completely Separated!)
  { slug: 'apache-spark', name: 'Apache Spark & PySpark', category: 'Data Engineering', icon: '💥', approxQuestionCount: 9 },
  { slug: 'data-warehousing', name: 'Snowflake, BigQuery & dbt', category: 'Data Engineering', icon: '❄️', approxQuestionCount: 8 },

  // 6. Messaging & Event Streaming (Completely Separated!)
  { slug: 'rabbitmq', name: 'RabbitMQ & AMQP Broker', category: 'Messaging & Streaming', icon: '🐇', approxQuestionCount: 25 },
  { slug: 'kafka', name: 'Apache Kafka & Event Streaming', category: 'Messaging & Streaming', icon: '🪵', approxQuestionCount: 24 },

  // 7. Cloud Platforms (Completely Separated!)
  { slug: 'aws', name: 'AWS Cloud Architecture', category: 'Cloud Platforms', icon: '☁️', approxQuestionCount: 65 },
  { slug: 'gcp', name: 'Google Cloud Platform (GCP)', category: 'Cloud Platforms', icon: '🌐', approxQuestionCount: 9 },
  { slug: 'azure', name: 'Microsoft Azure Cloud', category: 'Cloud Platforms', icon: '🔷', approxQuestionCount: 7 },

  // 8. DevOps, Containers & Systems (Completely Separated!)
  { slug: 'docker', name: 'Docker & Containerization', category: 'DevOps & Systems', icon: '🐳', approxQuestionCount: 10 },
  { slug: 'kubernetes', name: 'Kubernetes (K8s) Cloud Native', category: 'DevOps & Systems', icon: '☸️', approxQuestionCount: 25 },
  { slug: 'terraform', name: 'Terraform & OpenTofu (IaC)', category: 'DevOps & Systems', icon: '🟣', approxQuestionCount: 50 },
  { slug: 'cicd-gitops', name: 'CI/CD Pipelines & GitOps', category: 'DevOps & Systems', icon: '🔄', approxQuestionCount: 15 },
  { slug: 'linux-os', name: 'Linux OS & Kernel Internals', category: 'DevOps & Systems', icon: '🐧', approxQuestionCount: 12 },
  { slug: 'bash-shell', name: 'Bash & Shell Scripting', category: 'DevOps & Systems', icon: '💻', approxQuestionCount: 10 },

  // 9. Testing & Site Reliability (Completely Separated!)
  { slug: 'software-testing', name: 'Software Testing (Playwright/Vitest)', category: 'Testing & SRE', icon: '🧪', approxQuestionCount: 30 },
  { slug: 'sre-observability', name: 'SRE, Prometheus & OpenTelemetry', category: 'Testing & SRE', icon: '📈', approxQuestionCount: 20 },

  // 10. Architecture & Core Engineering (Completely Separated!)
  { slug: 'networking-protocols', name: 'Networking & Web Protocols', category: 'Architecture & Core', icon: '🌐', approxQuestionCount: 25 },
  { slug: 'design-patterns', name: 'GoF Design Patterns & SOLID', category: 'Architecture & Core', icon: '🏛️', approxQuestionCount: 10 },
  { slug: 'domain-driven-design', name: 'Domain-Driven Design (DDD)', category: 'Architecture & Core', icon: '🧩', approxQuestionCount: 10 },
  { slug: 'system-design', name: 'Large-Scale System Design', category: 'Architecture & Core', icon: '🏗️', approxQuestionCount: 50 },
  { slug: 'web-security-owasp', name: 'Web Security & OWASP Top 10', category: 'Architecture & Core', icon: '🛡️', approxQuestionCount: 50 },
  { slug: 'ai-engineering-llm', name: 'AI Engineering & LLM Architecture', category: 'Architecture & Core', icon: '🤖', approxQuestionCount: 50 },
  { slug: 'dsa', name: 'Data Structures & Algorithms', category: 'Architecture & Core', icon: '⚡', approxQuestionCount: 100 },
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
    id: 'mobile-react-native',
    label: 'React Native Mobile Engineer',
    icon: '📱',
    description: 'React Native, Expo, TypeScript, iOS & Android Internals',
    techSlugs: ['react-native', 'typescript', 'react', 'ios-swift', 'android-kotlin'],
  },
  {
    id: 'mobile-flutter',
    label: 'Flutter Mobile Engineer',
    icon: '💙',
    description: 'Flutter Engine, Dart Architecture, State Management & Mobile APIs',
    techSlugs: ['flutter', 'ios-swift', 'android-kotlin', 'rest-api'],
  },
  {
    id: 'sre-devops',
    label: 'DevOps & SRE Platform',
    icon: '☸️',
    description: 'SRE Observability, Linux OS, Kubernetes, Terraform & AWS',
    techSlugs: ['sre-observability', 'linux-os', 'kubernetes', 'terraform', 'aws', 'docker'],
  },
  {
    id: 'qa-automation',
    label: 'QA & Test Automation',
    icon: '🧪',
    description: 'Playwright, Vitest, Jest, MSW, k6 Load Testing & CI/CD',
    techSlugs: ['software-testing', 'cicd-gitops', 'typescript'],
  },
  {
    id: 'data-platform',
    label: 'Data & Search Platform',
    icon: '📊',
    description: 'Apache Spark, Data Warehousing, Kafka, Elasticsearch & PostgreSQL',
    techSlugs: ['apache-spark', 'data-warehousing', 'kafka', 'elasticsearch', 'postgresql', 'python'],
  },
  {
    id: 'golang-cloud',
    label: 'Go Cloud & Microservices',
    icon: '🐹',
    description: 'Golang 1.22+, gRPC, Docker, Kubernetes & System Design',
    techSlugs: ['golang', 'grpc', 'docker', 'kubernetes', 'system-design'],
  },
  {
    id: 'systems-rust',
    label: 'Rust Systems & Low-Level',
    icon: '🦀',
    description: 'Rust, Linux OS, Networking Protocols & Distributed Systems',
    techSlugs: ['rust', 'linux-os', 'networking-protocols', 'system-design'],
  },
  {
    id: 'modern-frameworks-hub',
    label: 'Vue, Svelte & Modern Web',
    icon: '🚀',
    description: 'Vue 3/Nuxt 3, Svelte 5/Astro, HTML5/CSS3 & Web Vitals',
    techSlugs: ['vue-nuxt', 'svelte-astro', 'html-css', 'web-vitals-accessibility', 'javascript'],
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
    techSlugs: ['dotnet-csharp', 'sql-databases', 'rabbitmq', 'docker', 'system-design'],
  },
  {
    id: 'php-fullstack',
    label: 'PHP & Laravel Full-Stack',
    icon: '🐘',
    description: 'PHP 8.3, Laravel 11, MySQL, Redis & REST APIs',
    techSlugs: ['php-laravel', 'mysql', 'redis', 'rest-api'],
  },
  {
    id: 'gcp-cloud-architect',
    label: 'Google Cloud (GCP) Architect',
    icon: '🌐',
    description: 'GCP GKE, Cloud Run, BigQuery, Spanner & Terraform',
    techSlugs: ['gcp', 'kubernetes', 'terraform', 'system-design'],
  },
  {
    id: 'azure-cloud-architect',
    label: 'Azure Cloud Architect',
    icon: '🔷',
    description: 'Azure AKS, Container Apps, Cosmos DB, Azure SQL & Terraform',
    techSlugs: ['azure', 'kubernetes', 'terraform', 'system-design'],
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
        item.trackSlug === 'postgresql' ||
        (item.trackSlug === 'databases' &&
          ((item.questionNumber >= 17 && item.questionNumber <= 24) ||
            item.questionNumber === 59 ||
            item.tags?.some((t) => t.toLowerCase().includes('postgres')) ||
            (item.title && item.title.toLowerCase().includes('postgres'))))
      );
    }

    // 2. MySQL (Specific to MySQL)
    if (tech === 'mysql') {
      return (
        item.trackSlug === 'mysql' ||
        (item.trackSlug === 'databases' &&
          ((item.questionNumber >= 60 && item.questionNumber <= 65) ||
            item.tags?.some((t) => t.toLowerCase().includes('mysql')) ||
            (item.title && item.title.toLowerCase().includes('mysql'))))
      );
    }

    // 3. Relational SQL & DB Fundamentals
    if (tech === 'sql-databases' || tech === 'sql') {
      return (
        item.trackSlug === 'sql-databases' ||
        (item.trackSlug === 'databases' &&
          ((item.questionNumber >= 1 && item.questionNumber <= 16) ||
            item.questionNumber === 25 ||
            item.tags?.some((t) => t.toLowerCase().includes('acid') || t.toLowerCase().includes('sql') || t.toLowerCase().includes('index'))))
      );
    }

    // 4. MongoDB & Document NoSQL
    if (tech === 'mongodb') {
      return (
        item.trackSlug === 'mongodb' ||
        (item.trackSlug === 'databases' &&
          ((item.questionNumber >= 26 && item.questionNumber <= 35) ||
            item.questionNumber === 38 ||
            item.questionNumber === 39 ||
            item.tags?.some((t) => t.toLowerCase().includes('mongo'))))
      );
    }

    // 5. DynamoDB (AWS NoSQL)
    if (tech === 'dynamodb') {
      return (
        item.trackSlug === 'dynamodb' ||
        (item.trackSlug === 'databases' &&
          (item.questionNumber === 36 ||
            item.questionNumber === 37 ||
            item.tags?.some((t) => t.toLowerCase().includes('dynamo')) ||
            (item.title && item.title.toLowerCase().includes('dynamo'))))
      );
    }

    // 6. Redis & In-Memory Caching
    if (tech === 'redis') {
      return (
        item.trackSlug === 'redis' ||
        (item.trackSlug === 'databases' &&
          ((item.questionNumber >= 40 && item.questionNumber <= 50) ||
            item.tags?.some((t) => t.toLowerCase().includes('redis') || t.toLowerCase().includes('cache'))))
      );
    }

    // 7. RabbitMQ & AMQP
    if (tech === 'rabbitmq') {
      return (
        item.trackSlug === 'rabbitmq' ||
        (item.trackSlug === 'messaging-queues' &&
          (item.questionNumber <= 25 ||
            item.tags?.some((t) => t.toLowerCase().includes('rabbitmq')) ||
            (item.title && item.title.toLowerCase().includes('rabbitmq'))))
      );
    }

    // 8. Apache Kafka & Streaming
    if (tech === 'kafka') {
      return (
        item.trackSlug === 'kafka' ||
        (item.trackSlug === 'messaging-queues' &&
          (item.questionNumber >= 26 ||
            item.tags?.some((t) => t.toLowerCase().includes('kafka')) ||
            (item.title && item.title.toLowerCase().includes('kafka'))))
      );
    }

    // 9. React Core (Excluding Next.js)
    if (tech === 'react') {
      return (
        item.trackSlug === 'react' ||
        (item.trackSlug === 'react-nextjs' &&
          !(item.questionNumber >= 317 && item.questionNumber <= 353))
      );
    }

    // 10. Next.js App Router
    if (tech === 'nextjs') {
      return (
        item.trackSlug === 'nextjs' ||
        (item.trackSlug === 'react-nextjs' &&
          ((item.questionNumber >= 317 && item.questionNumber <= 353) ||
            item.tags?.some((t) => t.toLowerCase().includes('next')) ||
            (item.title && item.title.toLowerCase().includes('next'))))
      );
    }

    // 11. TypeScript & Typings
    if (tech === 'typescript') {
      return (
        item.tags?.some((t) => t.toLowerCase().includes('typescript')) ||
        (item.title && (item.title.toLowerCase().includes('typescript') || item.title.toLowerCase().includes('generics') || item.title.toLowerCase().includes('typing'))) ||
        (item.trackSlug === 'angular-ts' && item.questionNumber <= 25)
      );
    }

    // 12. Vue 3 & Nuxt 3
    if (tech === 'vue-nuxt' || tech === 'vue') {
      return (
        item.trackSlug === 'vue-nuxt' ||
        (item.trackSlug === 'modern-frameworks' &&
          ((item.questionNumber >= 16 && item.questionNumber <= 32) ||
            item.tags?.some((t) => t.toLowerCase().includes('vue') || t.toLowerCase().includes('nuxt')) ||
            (item.title && (item.title.toLowerCase().includes('vue') || item.title.toLowerCase().includes('nuxt')))))
      );
    }

    // 13. Svelte & Astro
    if (tech === 'svelte-astro' || tech === 'svelte' || tech === 'astro') {
      return (
        item.trackSlug === 'svelte-astro' ||
        (item.trackSlug === 'modern-frameworks' &&
          (item.questionNumber <= 15 || item.questionNumber >= 33 ||
            item.tags?.some((t) => t.toLowerCase().includes('svelte') || t.toLowerCase().includes('astro'))))
      );
    }

    // 14. Google Cloud Platform (GCP)
    if (tech === 'gcp') {
      return (
        item.trackSlug === 'gcp' ||
        (item.trackSlug === 'cloud-gcp-azure' && item.questionNumber <= 4) ||
        item.tags?.some((t) => t.toLowerCase().includes('gcp') || t.toLowerCase().includes('google cloud'))
      );
    }

    // 15. Microsoft Azure
    if (tech === 'azure') {
      return (
        item.trackSlug === 'azure' ||
        (item.trackSlug === 'cloud-gcp-azure' && item.questionNumber >= 5) ||
        item.tags?.some((t) => t.toLowerCase().includes('azure'))
      );
    }

    // 16. React Native
    if (tech === 'react-native') {
      return (
        item.trackSlug === 'react-native' ||
        (item.trackSlug === 'mobile-development' && item.questionNumber <= 15) ||
        item.tags?.some((t) => t.toLowerCase().includes('react native'))
      );
    }

    // 17. Flutter
    if (tech === 'flutter') {
      return (
        item.trackSlug === 'flutter' ||
        (item.trackSlug === 'mobile-development' && (item.questionNumber >= 16 && item.questionNumber <= 30)) ||
        item.tags?.some((t) => t.toLowerCase().includes('flutter'))
      );
    }

    // 18. Native iOS (Swift)
    if (tech === 'ios-swift') {
      return (
        item.trackSlug === 'ios-swift' ||
        (item.trackSlug === 'mobile-development' && ((item.questionNumber >= 31 && item.questionNumber <= 37) || item.questionNumber >= 47)) ||
        item.tags?.some((t) => t.toLowerCase().includes('ios') || t.toLowerCase().includes('swift'))
      );
    }

    // 19. Native Android (Kotlin)
    if (tech === 'android-kotlin') {
      return (
        item.trackSlug === 'android-kotlin' ||
        (item.trackSlug === 'mobile-development' && (item.questionNumber >= 38 && item.questionNumber <= 46)) ||
        item.tags?.some((t) => t.toLowerCase().includes('android') || t.toLowerCase().includes('kotlin'))
      );
    }

    // 20. Software Testing (Playwright / Vitest)
    if (tech === 'software-testing') {
      return (
        item.trackSlug === 'software-testing' ||
        (item.trackSlug === 'testing-qa-sre' && item.questionNumber <= 30) ||
        item.tags?.some((t) => t.toLowerCase().includes('test') || t.toLowerCase().includes('playwright'))
      );
    }

    // 21. SRE & Observability
    if (tech === 'sre-observability') {
      return (
        item.trackSlug === 'sre-observability' ||
        (item.trackSlug === 'testing-qa-sre' && item.questionNumber >= 31) ||
        item.tags?.some((t) => t.toLowerCase().includes('sre') || t.toLowerCase().includes('prometheus') || t.toLowerCase().includes('observability'))
      );
    }

    // 22. Elasticsearch
    if (tech === 'elasticsearch') {
      return (
        item.trackSlug === 'elasticsearch' ||
        (item.trackSlug === 'search-vector-databases' && item.questionNumber <= 4) ||
        item.tags?.some((t) => t.toLowerCase().includes('elasticsearch') || t.toLowerCase().includes('lucene'))
      );
    }

    // 23. Vector Databases
    if (tech === 'vector-databases') {
      return (
        item.trackSlug === 'vector-databases' ||
        (item.trackSlug === 'search-vector-databases' && item.questionNumber >= 5) ||
        (item.trackSlug === 'ai-engineering-llm' && item.questionNumber >= 11 && item.questionNumber <= 20) ||
        item.tags?.some((t) => t.toLowerCase().includes('vector') || t.toLowerCase().includes('hnsw'))
      );
    }

    // 24. Apache Spark
    if (tech === 'apache-spark') {
      return (
        item.trackSlug === 'apache-spark' ||
        (item.trackSlug === 'data-engineering-spark' && item.questionNumber <= 5) ||
        item.tags?.some((t) => t.toLowerCase().includes('spark'))
      );
    }

    // 25. Data Warehousing
    if (tech === 'data-warehousing') {
      return (
        item.trackSlug === 'data-warehousing' ||
        (item.trackSlug === 'data-engineering-spark' && item.questionNumber >= 6) ||
        item.tags?.some((t) => t.toLowerCase().includes('snowflake') || t.toLowerCase().includes('bigquery') || t.toLowerCase().includes('dbt'))
      );
    }

    // 26. Linux OS
    if (tech === 'linux-os') {
      return (
        item.trackSlug === 'linux-os' ||
        (item.trackSlug === 'linux-os-shell' && item.questionNumber <= 8) ||
        item.tags?.some((t) => t.toLowerCase().includes('linux') || t.toLowerCase().includes('kernel'))
      );
    }

    // 27. Bash Shell
    if (tech === 'bash-shell') {
      return (
        item.trackSlug === 'bash-shell' ||
        (item.trackSlug === 'linux-os-shell' && item.questionNumber >= 9) ||
        item.tags?.some((t) => t.toLowerCase().includes('bash') || t.toLowerCase().includes('shell'))
      );
    }

    // 28. Design Patterns & SOLID
    if (tech === 'design-patterns') {
      return (
        item.trackSlug === 'design-patterns' ||
        (item.trackSlug === 'design-patterns-ddd' && item.questionNumber <= 6) ||
        item.tags?.some((t) => t.toLowerCase().includes('solid') || t.toLowerCase().includes('pattern'))
      );
    }

    // 29. Domain-Driven Design (DDD)
    if (tech === 'domain-driven-design') {
      return (
        item.trackSlug === 'domain-driven-design' ||
        (item.trackSlug === 'design-patterns-ddd' && item.questionNumber >= 7) ||
        item.tags?.some((t) => t.toLowerCase().includes('ddd') || t.toLowerCase().includes('domain-driven'))
      );
    }

    // 30. HTML & CSS
    if (tech === 'html-css') {
      return (
        item.trackSlug === 'html-css' ||
        (item.trackSlug === 'html-css-web-vitals' && item.questionNumber <= 8) ||
        item.tags?.some((t) => t.toLowerCase().includes('html') || t.toLowerCase().includes('css'))
      );
    }

    // 31. Web Vitals & Accessibility
    if (tech === 'web-vitals-accessibility') {
      return (
        item.trackSlug === 'web-vitals-accessibility' ||
        (item.trackSlug === 'html-css-web-vitals' && item.questionNumber >= 9) ||
        item.tags?.some((t) => t.toLowerCase().includes('accessibility') || t.toLowerCase().includes('vitals') || t.toLowerCase().includes('wcag'))
      );
    }

    // 32. Docker
    if (tech === 'docker') {
      return (
        item.trackSlug === 'docker' ||
        (item.trackSlug === 'devops-kubernetes' && item.questionNumber <= 10) ||
        item.tags?.some((t) => t.toLowerCase().includes('docker'))
      );
    }

    // 33. Kubernetes
    if (tech === 'kubernetes') {
      return (
        item.trackSlug === 'kubernetes' ||
        (item.trackSlug === 'devops-kubernetes' && item.questionNumber >= 11 && item.questionNumber <= 35) ||
        item.tags?.some((t) => t.toLowerCase().includes('kubernetes') || t.toLowerCase().includes('k8s'))
      );
    }

    // 34. CI/CD & GitOps
    if (tech === 'cicd-gitops' || tech === 'cicd') {
      return (
        item.trackSlug === 'cicd-gitops' ||
        (item.trackSlug === 'devops-kubernetes' && item.questionNumber >= 36) ||
        item.tags?.some((t) => t.toLowerCase().includes('ci/cd') || t.toLowerCase().includes('gitops'))
      );
    }

    // 35. REST APIs & HTTP
    if (tech === 'rest-api') {
      return (
        item.tags?.some((t) => t.toLowerCase().includes('rest') || t.toLowerCase().includes('http')) ||
        (item.title && (item.title.toLowerCase().includes('rest') || item.title.toLowerCase().includes('http verb') || item.title.toLowerCase().includes('status code')))
      );
    }

    // 36. GraphQL
    if (tech === 'graphql') {
      return (
        item.tags?.some((t) => t.toLowerCase().includes('graphql')) ||
        (item.title && item.title.toLowerCase().includes('graphql'))
      );
    }

    // 37. gRPC
    if (tech === 'grpc') {
      return (
        (item.trackSlug === 'golang' && item.questionNumber === 31) ||
        item.tags?.some((t) => t.toLowerCase().includes('grpc') || t.toLowerCase().includes('protobuf')) ||
        (item.title && (item.title.toLowerCase().includes('grpc') || item.title.toLowerCase().includes('protocol buffer')))
      );
    }

    // Default 1:1 track match
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
