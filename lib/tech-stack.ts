export interface GranularTech {
  slug: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Databases & Cache' | 'Data Engineering' | 'Messaging & Streaming' | 'Cloud Platforms' | 'DevOps & Systems' | 'Testing & SRE' | 'Architecture & Core';
  icon: string;
  approxQuestionCount: number;
}

export const GRANULAR_TECHS: GranularTech[] = [
  // 1. Frontend Frameworks & Languages
  { slug: 'typescript', name: 'TypeScript & Type Systems', category: 'Frontend', icon: '🔷', approxQuestionCount: 50 },
  { slug: 'angular', name: 'Angular Architecture & Signals', category: 'Frontend', icon: '🅰️', approxQuestionCount: 283 },
  { slug: 'react', name: 'React Core & Hooks', category: 'Frontend', icon: '⚛️', approxQuestionCount: 407 },
  { slug: 'nextjs', name: 'Next.js App Router & SSR', category: 'Frontend', icon: '▲', approxQuestionCount: 50 },
  { slug: 'vue', name: 'Vue.js & Composition API', category: 'Frontend', icon: '💚', approxQuestionCount: 50 },
  { slug: 'nuxt', name: 'Nuxt & Universal SSR', category: 'Frontend', icon: '🟩', approxQuestionCount: 50 },
  { slug: 'svelte', name: 'Svelte & SvelteKit', category: 'Frontend', icon: '🧡', approxQuestionCount: 50 },
  { slug: 'astro', name: 'Astro & Islands Architecture', category: 'Frontend', icon: '🚀', approxQuestionCount: 50 },
  { slug: 'javascript', name: 'Core JavaScript Internals', category: 'Frontend', icon: '🟨', approxQuestionCount: 536 },
  { slug: 'html', name: 'Modern HTML5 & Web APIs', category: 'Frontend', icon: '🌐', approxQuestionCount: 50 },
  { slug: 'css', name: 'Modern CSS3 & Layouts', category: 'Frontend', icon: '🎨', approxQuestionCount: 50 },
  { slug: 'web-vitals', name: 'Core Web Vitals & Perf', category: 'Frontend', icon: '⚡', approxQuestionCount: 50 },
  { slug: 'accessibility', name: 'Web Accessibility (WCAG)', category: 'Frontend', icon: '♿', approxQuestionCount: 50 },

  // 2. Backend & Microservices
  { slug: 'golang', name: 'Go (Golang) & Concurrency', category: 'Backend', icon: '🐹', approxQuestionCount: 50 },
  { slug: 'rust', name: 'Rust & Systems Programming', category: 'Backend', icon: '🦀', approxQuestionCount: 50 },
  { slug: 'java', name: 'Java Core & JVM Internals', category: 'Backend', icon: '☕', approxQuestionCount: 50 },
  { slug: 'spring-boot', name: 'Spring Boot & Microservices', category: 'Backend', icon: '🍃', approxQuestionCount: 50 },
  { slug: 'csharp', name: 'C# & CLR Internals', category: 'Backend', icon: '🔷', approxQuestionCount: 50 },
  { slug: 'aspnet-core', name: 'ASP.NET Core & Web API', category: 'Backend', icon: '🌐', approxQuestionCount: 50 },
  { slug: 'php', name: 'PHP & Zend Engine Internals', category: 'Backend', icon: '🐘', approxQuestionCount: 50 },
  { slug: 'laravel', name: 'Laravel & Ecosystem', category: 'Backend', icon: '🔴', approxQuestionCount: 50 },
  { slug: 'nodejs', name: 'Node.js & Event Loop', category: 'Backend', icon: '🟩', approxQuestionCount: 60 },
  { slug: 'python', name: 'Python & FastAPI', category: 'Backend', icon: '🐍', approxQuestionCount: 65 },
  { slug: 'rest-api', name: 'REST APIs & HTTP', category: 'Backend', icon: '🌐', approxQuestionCount: 25 },
  { slug: 'graphql', name: 'GraphQL & Resolvers', category: 'Backend', icon: '🌸', approxQuestionCount: 15 },
  { slug: 'grpc', name: 'gRPC & Protocol Buffers', category: 'Backend', icon: '📡', approxQuestionCount: 15 },

  // 3. Mobile Engineering (Completely Separated!)
  { slug: 'react-native', name: 'React Native & Expo', category: 'Mobile', icon: '📱', approxQuestionCount: 50 },
  { slug: 'flutter', name: 'Flutter & Dart Engine', category: 'Mobile', icon: '💙', approxQuestionCount: 50 },
  { slug: 'swift', name: 'Swift & Concurrency', category: 'Mobile', icon: '🦅', approxQuestionCount: 50 },
  { slug: 'ios', name: 'Native iOS & SwiftUI', category: 'Mobile', icon: '🍎', approxQuestionCount: 50 },
  { slug: 'kotlin', name: 'Kotlin & Coroutines', category: 'Mobile', icon: '🟣', approxQuestionCount: 50 },
  { slug: 'android', name: 'Native Android & Jetpack Compose', category: 'Mobile', icon: '🤖', approxQuestionCount: 50 },

  // 4. Databases & In-Memory Caching (Completely Separated!)
  { slug: 'postgresql', name: 'PostgreSQL Advanced', category: 'Databases & Cache', icon: '🐘', approxQuestionCount: 50 },
  { slug: 'mysql', name: 'MySQL & InnoDB Engine', category: 'Databases & Cache', icon: '🐬', approxQuestionCount: 50 },
  { slug: 'sql-databases', name: 'Relational SQL & DB Design', category: 'Databases & Cache', icon: '📊', approxQuestionCount: 50 },
  { slug: 'mongodb', name: 'MongoDB & Document NoSQL', category: 'Databases & Cache', icon: '🍃', approxQuestionCount: 50 },
  { slug: 'dynamodb', name: 'DynamoDB Key-Value NoSQL', category: 'Databases & Cache', icon: '⚡', approxQuestionCount: 50 },
  { slug: 'redis', name: 'Redis & Distributed Cache', category: 'Databases & Cache', icon: '⚡', approxQuestionCount: 50 },
  { slug: 'elasticsearch', name: 'Elasticsearch & Search Engines', category: 'Databases & Cache', icon: '🔍', approxQuestionCount: 50 },
  { slug: 'vector-databases', name: 'Vector Databases & RAG', category: 'Databases & Cache', icon: '🧠', approxQuestionCount: 50 },

  // 5. Data Engineering & Big Data (Completely Separated!)
  { slug: 'apache-spark', name: 'Apache Spark & PySpark', category: 'Data Engineering', icon: '💥', approxQuestionCount: 50 },
  { slug: 'snowflake', name: 'Snowflake Data Cloud', category: 'Data Engineering', icon: '❄️', approxQuestionCount: 50 },
  { slug: 'bigquery', name: 'Google BigQuery Architecture', category: 'Data Engineering', icon: '🔍', approxQuestionCount: 50 },
  { slug: 'dbt', name: 'dbt Analytics Engineering', category: 'Data Engineering', icon: '📦', approxQuestionCount: 50 },

  // 6. Messaging & Event Streaming (Completely Separated!)
  { slug: 'rabbitmq', name: 'RabbitMQ & AMQP Broker', category: 'Messaging & Streaming', icon: '🐇', approxQuestionCount: 50 },
  { slug: 'kafka', name: 'Apache Kafka & Event Streaming', category: 'Messaging & Streaming', icon: '🪵', approxQuestionCount: 50 },

  // 7. Cloud Platforms (Completely Separated!)
  { slug: 'aws', name: 'AWS Cloud Architecture', category: 'Cloud Platforms', icon: '☁️', approxQuestionCount: 65 },
  { slug: 'gcp', name: 'Google Cloud Platform (GCP)', category: 'Cloud Platforms', icon: '🌐', approxQuestionCount: 50 },
  { slug: 'azure', name: 'Microsoft Azure Cloud', category: 'Cloud Platforms', icon: '🔷', approxQuestionCount: 50 },

  // 8. DevOps, Containers & Systems (Completely Separated!)
  { slug: 'docker', name: 'Docker & Containerization', category: 'DevOps & Systems', icon: '🐳', approxQuestionCount: 50 },
  { slug: 'kubernetes', name: 'Kubernetes (K8s) Cloud Native', category: 'DevOps & Systems', icon: '☸️', approxQuestionCount: 50 },
  { slug: 'terraform', name: 'Terraform & OpenTofu (IaC)', category: 'DevOps & Systems', icon: '🟣', approxQuestionCount: 50 },
  { slug: 'cicd', name: 'CI/CD & GitHub Actions', category: 'DevOps & Systems', icon: '🔄', approxQuestionCount: 50 },
  { slug: 'gitops', name: 'GitOps & ArgoCD', category: 'DevOps & Systems', icon: '🐙', approxQuestionCount: 50 },
  { slug: 'linux-os', name: 'Linux OS & Kernel Internals', category: 'DevOps & Systems', icon: '🐧', approxQuestionCount: 50 },
  { slug: 'bash-shell', name: 'Bash & Shell Scripting', category: 'DevOps & Systems', icon: '💻', approxQuestionCount: 50 },

  // 9. Testing & Site Reliability (Completely Separated!)
  { slug: 'software-testing', name: 'Software Testing (Playwright/Vitest)', category: 'Testing & SRE', icon: '🧪', approxQuestionCount: 50 },
  { slug: 'sre-observability', name: 'SRE, Prometheus & OpenTelemetry', category: 'Testing & SRE', icon: '📈', approxQuestionCount: 50 },

  // 10. Architecture & Core Engineering (Completely Separated!)
  { slug: 'networking-protocols', name: 'Networking & Web Protocols', category: 'Architecture & Core', icon: '🌐', approxQuestionCount: 50 },
  { slug: 'solid-principles', name: 'SOLID & OOP Principles', category: 'Architecture & Core', icon: '📐', approxQuestionCount: 50 },
  { slug: 'design-patterns', name: 'Gang of Four (GoF) Patterns', category: 'Architecture & Core', icon: '🏛️', approxQuestionCount: 50 },
  { slug: 'domain-driven-design', name: 'Domain-Driven Design (DDD)', category: 'Architecture & Core', icon: '🧩', approxQuestionCount: 50 },
  { slug: 'system-design', name: 'Large-Scale System Design', category: 'Architecture & Core', icon: '🏗️', approxQuestionCount: 50 },
  { slug: 'web-security-owasp', name: 'Web Security & OWASP Top 10', category: 'Architecture & Core', icon: '🛡️', approxQuestionCount: 50 },
  { slug: 'ai-engineering-llm', name: 'AI Engineering & LLM Architecture', category: 'Architecture & Core', icon: '🤖', approxQuestionCount: 50 },
  { slug: 'dsa', name: 'Data Structures & Algorithms', category: 'Architecture & Core', icon: '⚡', approxQuestionCount: 100 },
  { slug: 'behavioral-hr', name: 'Behavioral & Leadership (STAR)', category: 'Architecture & Core', icon: '🤝', approxQuestionCount: 50 },
];

export interface RolePreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  techSlugs: string[];
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'mean-stack',
    label: 'MEAN Stack Full-Stack',
    icon: '🅰️',
    description: 'MongoDB, Express, Angular 19, Node.js & Core JavaScript',
    techSlugs: ['angular', 'typescript', 'nodejs', 'mongodb', 'javascript'],
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
    techSlugs: ['react-native', 'typescript', 'react', 'swift', 'ios', 'kotlin', 'android'],
  },
  {
    id: 'mobile-flutter',
    label: 'Flutter Mobile Engineer',
    icon: '💙',
    description: 'Flutter Engine, Dart Architecture, State Management & Mobile APIs',
    techSlugs: ['flutter', 'swift', 'ios', 'kotlin', 'android', 'rest-api'],
  },
  {
    id: 'sre-devops',
    label: 'DevOps & SRE Platform',
    icon: '☸️',
    description: 'SRE Observability, Linux OS, Kubernetes, Terraform & AWS',
    techSlugs: ['sre-observability', 'linux-os', 'kubernetes', 'terraform', 'aws', 'docker', 'cicd', 'gitops'],
  },
  {
    id: 'qa-automation',
    label: 'QA & Test Automation',
    icon: '🧪',
    description: 'Playwright, Vitest, Jest, MSW, k6 Load Testing & CI/CD',
    techSlugs: ['software-testing', 'cicd', 'typescript'],
  },
  {
    id: 'data-platform',
    label: 'Data & Search Platform',
    icon: '📊',
    description: 'Apache Spark, Snowflake/BigQuery, dbt, Kafka, Elasticsearch & PostgreSQL',
    techSlugs: ['apache-spark', 'snowflake', 'bigquery', 'dbt', 'kafka', 'elasticsearch', 'postgresql', 'python'],
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
    label: 'Vue, Nuxt, Svelte & Modern Web',
    icon: '🚀',
    description: 'Vue 3, Nuxt 3, Svelte 5, Astro, HTML5, CSS3 & Web Vitals',
    techSlugs: ['vue', 'nuxt', 'svelte', 'astro', 'html', 'css', 'web-vitals', 'accessibility', 'javascript'],
  },
  {
    id: 'java-enterprise',
    label: 'Java Spring Enterprise',
    icon: '☕',
    description: 'Java 21, Spring Boot 3, PostgreSQL, Kafka & System Design',
    techSlugs: ['java', 'spring-boot', 'postgresql', 'kafka', 'docker', 'system-design'],
  },
  {
    id: 'dotnet-enterprise',
    label: '.NET & C# Enterprise',
    icon: '🔷',
    description: '.NET 8/9, C# 12, SQL, RabbitMQ, Docker & Clean Architecture',
    techSlugs: ['csharp', 'aspnet-core', 'sql-databases', 'rabbitmq', 'docker', 'system-design'],
  },
  {
    id: 'php-fullstack',
    label: 'PHP & Laravel Full-Stack',
    icon: '🐘',
    description: 'PHP 8.3, Laravel 11, MySQL, Redis & REST APIs',
    techSlugs: ['php', 'laravel', 'mysql', 'redis', 'rest-api'],
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
    // Exact match first
    if (item.trackSlug === tech) return true;

    // Backward compatible aliases
    if (tech === 'angular' || tech === 'angular-ts') {
      return item.trackSlug === 'angular' || item.trackSlug === 'angular-ts';
    }

    if (tech === 'vue') {
      return item.trackSlug === 'vue' || item.trackSlug === 'vue-nuxt';
    }
    if (tech === 'nuxt') {
      return item.trackSlug === 'nuxt' || (item.trackSlug === 'vue-nuxt' && item.tags?.some((t) => t.toLowerCase().includes('nuxt')));
    }

    if (tech === 'svelte') {
      return item.trackSlug === 'svelte' || item.trackSlug === 'svelte-astro';
    }
    if (tech === 'astro') {
      return item.trackSlug === 'astro' || (item.trackSlug === 'svelte-astro' && item.tags?.some((t) => t.toLowerCase().includes('astro')));
    }

    if (tech === 'html') {
      return item.trackSlug === 'html' || item.trackSlug === 'html-css' || item.trackSlug === 'html-css-web-vitals';
    }
    if (tech === 'css') {
      return item.trackSlug === 'css' || (item.trackSlug === 'html-css' && item.tags?.some((t) => t.toLowerCase().includes('css')));
    }

    if (tech === 'web-vitals') {
      return item.trackSlug === 'web-vitals' || item.trackSlug === 'web-vitals-accessibility';
    }
    if (tech === 'accessibility') {
      return item.trackSlug === 'accessibility' || (item.trackSlug === 'web-vitals-accessibility' && item.tags?.some((t) => t.toLowerCase().includes('accessibility') || t.toLowerCase().includes('wcag')));
    }

    if (tech === 'cicd') {
      return item.trackSlug === 'cicd' || item.trackSlug === 'cicd-gitops';
    }
    if (tech === 'gitops') {
      return item.trackSlug === 'gitops' || (item.trackSlug === 'cicd-gitops' && item.tags?.some((t) => t.toLowerCase().includes('gitops') || t.toLowerCase().includes('argo')));
    }

    if (tech === 'snowflake') {
      return item.trackSlug === 'snowflake' || (item.trackSlug === 'data-warehousing' && item.tags?.some((t) => t.toLowerCase().includes('snowflake')));
    }
    if (tech === 'bigquery') {
      return item.trackSlug === 'bigquery' || (item.trackSlug === 'data-warehousing' && item.tags?.some((t) => t.toLowerCase().includes('bigquery')));
    }
    if (tech === 'data-warehousing') {
      return item.trackSlug === 'snowflake' || item.trackSlug === 'bigquery' || item.trackSlug === 'data-warehousing';
    }
    if (tech === 'dbt') {
      return item.trackSlug === 'dbt' || (item.trackSlug === 'data-warehousing' && item.tags?.some((t) => t.toLowerCase().includes('dbt')));
    }

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

    // 4. MongoDB
    if (tech === 'mongodb') {
      return (
        item.trackSlug === 'mongodb' ||
        (item.trackSlug === 'databases' &&
          ((item.questionNumber >= 26 && item.questionNumber <= 34) ||
            item.tags?.some((t) => t.toLowerCase().includes('mongo')) ||
            (item.title && item.title.toLowerCase().includes('mongo'))))
      );
    }

    // 5. Redis
    if (tech === 'redis') {
      return (
        item.trackSlug === 'redis' ||
        (item.trackSlug === 'databases' &&
          ((item.questionNumber >= 35 && item.questionNumber <= 43) ||
            item.tags?.some((t) => t.toLowerCase().includes('redis')) ||
            (item.title && item.title.toLowerCase().includes('redis'))))
      );
    }

    // 6. DynamoDB
    if (tech === 'dynamodb') {
      return (
        item.trackSlug === 'dynamodb' ||
        (item.trackSlug === 'databases' &&
          ((item.questionNumber >= 44 && item.questionNumber <= 58) ||
            item.tags?.some((t) => t.toLowerCase().includes('dynamo')) ||
            (item.title && item.title.toLowerCase().includes('dynamo'))))
      );
    }

    // 7. RabbitMQ
    if (tech === 'rabbitmq') {
      return (
        item.trackSlug === 'rabbitmq' ||
        (item.trackSlug === 'messaging-queues' && item.questionNumber <= 25) ||
        item.tags?.some((t) => t.toLowerCase().includes('rabbitmq'))
      );
    }

    // 8. Apache Kafka
    if (tech === 'kafka') {
      return (
        item.trackSlug === 'kafka' ||
        (item.trackSlug === 'messaging-queues' && item.questionNumber >= 26) ||
        item.tags?.some((t) => t.toLowerCase().includes('kafka'))
      );
    }

    // 9. React Core
    if (tech === 'react') {
      return (
        item.trackSlug === 'react' ||
        (item.trackSlug === 'react-nextjs' && item.questionNumber <= 316) ||
        item.tags?.some((t) => t.toLowerCase().includes('react'))
      );
    }

    // 10. Next.js
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
        item.trackSlug === 'typescript' ||
        item.tags?.some((t) => t.toLowerCase().includes('typescript')) ||
        (item.title && (item.title.toLowerCase().includes('typescript') || item.title.toLowerCase().includes('generics') || item.title.toLowerCase().includes('typing')))
      );
    }

    // 12. Google Cloud Platform (GCP)
    if (tech === 'gcp') {
      return (
        item.trackSlug === 'gcp' ||
        (item.trackSlug === 'cloud-gcp-azure' && item.questionNumber <= 4) ||
        item.tags?.some((t) => t.toLowerCase().includes('gcp') || t.toLowerCase().includes('google cloud'))
      );
    }

    // 13. Microsoft Azure
    if (tech === 'azure') {
      return (
        item.trackSlug === 'azure' ||
        (item.trackSlug === 'cloud-gcp-azure' && item.questionNumber >= 5) ||
        item.tags?.some((t) => t.toLowerCase().includes('azure'))
      );
    }

    // 14. React Native
    if (tech === 'react-native') {
      return (
        item.trackSlug === 'react-native' ||
        (item.trackSlug === 'mobile-development' && item.questionNumber <= 15) ||
        item.tags?.some((t) => t.toLowerCase().includes('react native'))
      );
    }

    // 15. Flutter
    if (tech === 'flutter') {
      return (
        item.trackSlug === 'flutter' ||
        (item.trackSlug === 'mobile-development' && (item.questionNumber >= 16 && item.questionNumber <= 30)) ||
        item.tags?.some((t) => t.toLowerCase().includes('flutter'))
      );
    }

    // 16. Swift & iOS
    if (tech === 'swift') {
      return item.trackSlug === 'swift' || (item.trackSlug === 'ios-swift' && item.tags?.some((t) => t.toLowerCase().includes('swift')));
    }
    if (tech === 'ios') {
      return item.trackSlug === 'ios' || (item.trackSlug === 'ios-swift' && item.tags?.some((t) => t.toLowerCase().includes('ios') || t.toLowerCase().includes('swiftui')));
    }
    if (tech === 'ios-swift') {
      return (
        item.trackSlug === 'swift' ||
        item.trackSlug === 'ios' ||
        item.trackSlug === 'ios-swift' ||
        (item.trackSlug === 'mobile-development' && ((item.questionNumber >= 31 && item.questionNumber <= 37) || item.questionNumber >= 47)) ||
        item.tags?.some((t) => t.toLowerCase().includes('ios') || t.toLowerCase().includes('swift'))
      );
    }

    // 17. Kotlin & Android
    if (tech === 'kotlin') {
      return item.trackSlug === 'kotlin' || (item.trackSlug === 'android-kotlin' && item.tags?.some((t) => t.toLowerCase().includes('kotlin')));
    }
    if (tech === 'android') {
      return item.trackSlug === 'android' || (item.trackSlug === 'android-kotlin' && item.tags?.some((t) => t.toLowerCase().includes('android') || t.toLowerCase().includes('compose')));
    }
    if (tech === 'android-kotlin') {
      return (
        item.trackSlug === 'kotlin' ||
        item.trackSlug === 'android' ||
        item.trackSlug === 'android-kotlin' ||
        (item.trackSlug === 'mobile-development' && (item.questionNumber >= 38 && item.questionNumber <= 46)) ||
        item.tags?.some((t) => t.toLowerCase().includes('android') || t.toLowerCase().includes('kotlin'))
      );
    }

    // 18. Software Testing (Playwright / Vitest)
    if (tech === 'software-testing') {
      return (
        item.trackSlug === 'software-testing' ||
        (item.trackSlug === 'testing-qa-sre' && item.questionNumber <= 30) ||
        item.tags?.some((t) => t.toLowerCase().includes('test') || t.toLowerCase().includes('playwright'))
      );
    }

    // 19. SRE & Observability
    if (tech === 'sre-observability') {
      return (
        item.trackSlug === 'sre-observability' ||
        (item.trackSlug === 'testing-qa-sre' && item.questionNumber >= 31) ||
        item.tags?.some((t) => t.toLowerCase().includes('sre') || t.toLowerCase().includes('prometheus') || t.toLowerCase().includes('observability'))
      );
    }

    // 20. Elasticsearch
    if (tech === 'elasticsearch') {
      return (
        item.trackSlug === 'elasticsearch' ||
        (item.trackSlug === 'search-vector-databases' && item.questionNumber <= 4) ||
        item.tags?.some((t) => t.toLowerCase().includes('elasticsearch') || t.toLowerCase().includes('lucene'))
      );
    }

    // 21. Vector Databases
    if (tech === 'vector-databases') {
      return (
        item.trackSlug === 'vector-databases' ||
        (item.trackSlug === 'search-vector-databases' && item.questionNumber >= 5) ||
        (item.trackSlug === 'ai-engineering-llm' && item.questionNumber >= 11 && item.questionNumber <= 20) ||
        item.tags?.some((t) => t.toLowerCase().includes('vector') || t.toLowerCase().includes('hnsw'))
      );
    }

    // 22. Apache Spark
    if (tech === 'apache-spark') {
      return (
        item.trackSlug === 'apache-spark' ||
        (item.trackSlug === 'data-engineering-spark' && item.questionNumber <= 5) ||
        item.tags?.some((t) => t.toLowerCase().includes('spark'))
      );
    }

    // 23. Linux OS
    if (tech === 'linux-os') {
      return (
        item.trackSlug === 'linux-os' ||
        (item.trackSlug === 'linux-os-shell' && item.questionNumber <= 8) ||
        item.tags?.some((t) => t.toLowerCase().includes('linux') || t.toLowerCase().includes('kernel'))
      );
    }

    // 24. Bash Shell
    if (tech === 'bash-shell') {
      return (
        item.trackSlug === 'bash-shell' ||
        (item.trackSlug === 'linux-os-shell' && item.questionNumber >= 9) ||
        item.tags?.some((t) => t.toLowerCase().includes('bash') || t.toLowerCase().includes('shell'))
      );
    }

    // 25. Design Patterns & SOLID
    if (tech === 'design-patterns') {
      return (
        item.trackSlug === 'design-patterns' ||
        (item.trackSlug === 'design-patterns-ddd' && item.questionNumber <= 6) ||
        item.tags?.some((t) => t.toLowerCase().includes('solid') || t.toLowerCase().includes('pattern'))
      );
    }

    // 26. Domain-Driven Design (DDD)
    if (tech === 'domain-driven-design') {
      return (
        item.trackSlug === 'domain-driven-design' ||
        (item.trackSlug === 'design-patterns-ddd' && item.questionNumber >= 7) ||
        item.tags?.some((t) => t.toLowerCase().includes('ddd') || t.toLowerCase().includes('domain-driven'))
      );
    }

    // 27. Docker
    if (tech === 'docker') {
      return (
        item.trackSlug === 'docker' ||
        (item.trackSlug === 'devops-kubernetes' && item.questionNumber <= 10) ||
        item.tags?.some((t) => t.toLowerCase().includes('docker'))
      );
    }

    // 28. Kubernetes
    if (tech === 'kubernetes') {
      return (
        item.trackSlug === 'kubernetes' ||
        (item.trackSlug === 'devops-kubernetes' && item.questionNumber >= 11 && item.questionNumber <= 35) ||
        item.tags?.some((t) => t.toLowerCase().includes('kubernetes') || t.toLowerCase().includes('k8s'))
      );
    }

    // 29. REST APIs & HTTP
    if (tech === 'rest-api') {
      return (
        item.tags?.some((t) => t.toLowerCase().includes('rest') || t.toLowerCase().includes('http')) ||
        (item.title && (item.title.toLowerCase().includes('rest') || item.title.toLowerCase().includes('http verb') || item.title.toLowerCase().includes('status code')))
      );
    }

    // 30. GraphQL
    if (tech === 'graphql') {
      return (
        item.tags?.some((t) => t.toLowerCase().includes('graphql')) ||
        (item.title && item.title.toLowerCase().includes('graphql'))
      );
    }

    // 31. gRPC
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

export const TECH_STACK_STORAGE_KEY = 'learn_selected_tech_stack';
export const TECH_STACK_UPDATE_EVENT = 'learn_tech_stack_updated';

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
