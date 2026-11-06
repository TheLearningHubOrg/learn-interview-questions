import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';
import { getGlobalSearchIndex } from '@/lib/tracks';

export const metadata: Metadata = {
  title: 'Master Full-Stack & Cloud Interview Question Bank (745+ Questions)',
  description: 'Comprehensive, production-tested interview question bank covering Angular, React, Next.js, TypeScript, Python, Node.js, Databases, AWS Cloud Architecture, and Data Structures & Algorithms.',
  keywords: [
    'interview questions',
    'full stack interview',
    'angular interview',
    'react interview',
    'nextjs interview',
    'python interview',
    'nodejs interview',
    'aws cloud architecture',
    'dsa interview',
    'neetcode'
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
      </body>
    </html>
  );
}

