import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://learn-interview-questions.vercel.app'),
  title: {
    default: 'Master Full-Stack, Cloud, System Design, AI, Mobile & SRE Interview Bank (2,719+ Questions across 30 Tracks)',
    template: '%s | InterviewHub PRO',
  },
  description: 'Comprehensive, production-tested engineering interview question bank with 2,719+ questions and answers across 30 specialized tracks covering Go 1.22+, Rust, PHP 8.3 & Laravel 11, Java 21, Spring Boot 3, .NET 8/9, C# 12, Mobile (React Native, Flutter, iOS, Android), Testing & SRE (Playwright, Vitest, k6, OpenTelemetry), Networking Protocols, Linux OS & Shell, Design Patterns, Data Engineering & Spark, Search & Vector DBs, GCP & Azure, Angular, React, Vue, Svelte, Astro, RabbitMQ, Kafka, Terraform, Kubernetes, System Design, AI Engineering, Web Security, Python, Node.js, Databases, AWS Cloud, and DSA.',
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
    title: 'Master Full-Stack, Cloud, System Design, AI, Mobile & SRE Interview Bank (2,719+ Qs across 30 Tracks)',
    description: '2,719+ production-tested questions with 100% code coverage across 30 tracks: Go, Rust, PHP/Laravel, Java, .NET, Mobile, Testing/SRE, Networking, Linux, Design Patterns, Spark, Vector DBs, GCP, Azure, React, Angular, AWS, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Full-Stack, Cloud, System Design, AI, Mobile & SRE Interview Bank',
    description: '2,719+ production-tested engineering interview questions across 30 tracks with 100% code examples.',
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
