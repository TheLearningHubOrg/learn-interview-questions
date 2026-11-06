import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';
import { getGlobalSearchIndex } from '@/lib/tracks';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Master Full-Stack, Cloud & Core JavaScript Interview Question Bank (1,260+ Questions)',
  description: 'Comprehensive, production-tested interview question bank with 1,260+ questions covering Core JavaScript Internals, Angular, React, Next.js, TypeScript, Python, Node.js, Databases, AWS Cloud Architecture, and Data Structures & Algorithms.',
  keywords: [
    'javascript interview questions',
    'core javascript',
    'es6 interview',
    'full stack interview',
    'angular interview',
    'react interview',
    'nextjs interview',
    'python interview',
    'nodejs interview',
    'aws cloud architecture',
    'dsa interview',
    'neetcode',
    'interview questions bank'
  ],
  authors: [{ name: 'The Learning Hub Org' }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchIndex = await getGlobalSearchIndex();

  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen">
        <ClientShell searchIndex={searchIndex}>{children}</ClientShell>
        <Analytics />
      </body>
    </html>
  );
}
