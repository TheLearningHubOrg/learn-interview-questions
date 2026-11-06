import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';
import { getGlobalSearchIndex } from '@/lib/tracks';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://learn-interview-questions.vercel.app'),
  title: {
    default: 'Master Full-Stack, Cloud, React, Angular & Core JavaScript Interview Bank (1,500+ Questions)',
    template: '%s | InterviewHub PRO',
  },
  description: 'Comprehensive, battle-tested engineering interview question bank with 1,500+ questions and answers covering Angular 2-19, React 18/19, Core JavaScript Internals, Python, Node.js, Databases, AWS Cloud Architecture, and Data Structures & Algorithms.',
  keywords: [
    'interview questions',
    'javascript interview questions',
    'angular interview questions',
    'react interview questions',
    'nextjs interview questions',
    'core javascript',
    'full stack developer interview',
    'python fastapi interview',
    'nodejs event loop',
    'aws cloud architecture',
    'dsa patterns',
    'blind 75',
    'neetcode 150',
    'system design interview'
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
    title: 'Master Full-Stack, Cloud, React, Angular & Core JavaScript Interview Bank (1,500+ Qs)',
    description: '1,500+ production-tested questions with 100% code coverage across Angular, React, Core JS, Databases, Python, Node.js, AWS Cloud, and DSA.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Full-Stack, Cloud, React, Angular & Core JavaScript Interview Bank',
    description: '1,500+ production-tested engineering interview questions with 100% code examples.',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchIndex = await getGlobalSearchIndex();

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
        <ClientShell searchIndex={searchIndex}>{children}</ClientShell>
        <Analytics />
      </body>
    </html>
  );
}
