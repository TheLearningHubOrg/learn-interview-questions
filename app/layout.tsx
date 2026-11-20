import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://learn-interview-questions.vercel.app'),
  title: {
    default: 'Master Full-Stack, Cloud, System Design, AI, Mobile & SRE Interview Bank (3,600+ Questions across 64 Separated Tracks)',
    template: '%s | InterviewHub PRO',
  },
  description: 'Comprehensive, production-tested engineering interview question bank with 3,600+ questions and answers across 64 specialized, fully separated tracks: React, Next.js, Angular, Vue, Svelte, Astro, JavaScript, TypeScript, HTML/CSS, Web Vitals, Go, Rust, Java, Spring Boot, C#, ASP.NET Core, PHP, Laravel, Python, Node.js, PostgreSQL, MySQL, SQL, MongoDB, Redis, DynamoDB, AWS, GCP, Azure, Docker, Kubernetes, Terraform, CI/CD, Linux, Bash, RabbitMQ, Kafka, Elasticsearch, Vector DBs, Spark, Snowflake, BigQuery, React Native, Flutter, Swift, iOS, Kotlin, Android, Testing, SRE, Networking, SOLID Principles, Design Patterns, DDD, System Design, Security, AI/LLM, and DSA.',
  keywords: [
    'interview questions',
    'javascript interview questions',
    'angular interview questions',
    'react interview questions',
    'nextjs interview questions',
    'core javascript',
    'system design interview',
    'distributed systems',
    'mobile engineering interview',
    'react native flutter',
    'ios swift android kotlin',
    'software testing interview',
    'playwright vitest',
    'sre site reliability engineering',
    'opentelemetry prometheus grafana',
    'networking tcp ip http3',
    'linux operating systems',
    'software design patterns solid ddd',
    'rust systems programming',
    'php laravel interview',
    'data engineering apache spark',
    'search engines vector databases',
    'gcp google cloud azure',
    'ai engineering interview',
    'llm architecture',
    'rag vector search',
    'web security interview',
    'owasp top 10',
    'devops interview questions',
    'kubernetes docker',
    'terraform iac',
    'full stack developer interview',
    'golang microservices',
    'java spring boot',
    'dotnet csharp',
    'python fastapi interview',
    'nodejs event loop',
    'aws cloud architecture',
    'dsa patterns',
    'behavioral interview questions'
  ],
  authors: [{ name: 'The Learning Hub Org', url: 'https://github.com/TheLearningHubOrg' }],
  creator: 'The Learning Hub Org',
  publisher: 'The Learning Hub Org',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://learn-interview-questions.vercel.app',
    siteName: 'InterviewHub PRO - The Learning Hub Org',
    title: 'Master Full-Stack, Cloud, System Design, AI, Mobile & SRE Interview Bank (3,600+ Qs across 64 Tracks)',
    description: '3,600+ production-tested questions with 100% code coverage across 64 tracks: TypeScript, Angular, React, Vue, Nuxt, Svelte, Astro, Go, Rust, Java, Spring Boot, C#, ASP.NET Core, PHP, Laravel, Swift, iOS, Kotlin, Android, Mobile, Testing/SRE, Networking, Linux, SOLID, Design Patterns, Snowflake, BigQuery, dbt, Cloud, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Full-Stack, Cloud, System Design, AI, Mobile & SRE Interview Bank',
    description: '3,600+ production-tested engineering interview questions across 64 tracks with 100% code examples.',
    creator: '@TheLearningHub',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#090a0f' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Instant theme resolver before hydration to eliminate FOUT flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('interviewhub-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)||t===null;if(d){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <ClientShell>{children}</ClientShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
