'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Copy, 
  ListOrdered, 
  BookOpen, 
  ChevronRight,
  Hash
} from 'lucide-react';
import { TrackMeta } from '@/lib/tracks';

interface TrackReaderProps {
  track: TrackMeta;
  markdown: string;
  allTracks: TrackMeta[];
}

export function TrackReader({ track, markdown, allTracks }: TrackReaderProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  // Find previous and next track
  const currentIndex = allTracks.findIndex((t) => t.slug === track.slug);
  const prevTrack = currentIndex > 0 ? allTracks[currentIndex - 1] : null;
  const nextTrack = currentIndex < allTracks.length - 1 ? allTracks[currentIndex + 1] : null;

  // Extract Table of Contents from markdown
  const toc = useMemo(() => {
    const lines = markdown.split('\n');
    const items: { id: string; title: string; level: number }[] = [];

    for (const line of lines) {
      if (line.startsWith('## Part ') || line.startsWith('## PART ')) {
        const title = line.replace(/^##\s+/, '').trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        items.push({ id, title, level: 2 });
      }
    }
    return items;
  }, [markdown]);

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-purple-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/#tracks" className="hover:text-purple-400 transition-colors">
          Tracks
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-200 font-medium truncate">{track.shortTitle}</span>
      </div>

      {/* Track Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Track {track.id}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-border text-slate-300">
              {track.questionCount} Master Questions
            </span>
          </div>

          {/* Quick Track Switcher */}
          <div className="flex items-center gap-2">
            {prevTrack && (
              <Link
                href={`/tracks/${prevTrack.slug}`}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-card-hover border border-border hover:border-purple-500/30 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                title={prevTrack.shortTitle}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev Track</span>
              </Link>
            )}
            {nextTrack && (
              <Link
                href={`/tracks/${nextTrack.slug}`}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-card-hover border border-border hover:border-purple-500/30 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                title={nextTrack.shortTitle}
              >
                <span className="hidden sm:inline">Next Track</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          {track.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-6">
          {track.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {track.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs rounded-lg bg-background text-slate-300 border border-border font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid: Sticky Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-4 rounded-2xl bg-card/60 border border-border">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-4 pb-2 border-b border-border">
            <ListOrdered className="h-4 w-4" />
            <span>Table of Contents</span>
          </div>

          <nav className="space-y-1">
            {toc.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={`#${item.id}`}
                className="block text-xs py-1.5 px-2 rounded-lg text-slate-400 hover:text-white hover:bg-card-hover transition-colors leading-relaxed line-clamp-1"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* Markdown Body */}
          <article className="markdown-body p-6 sm:p-10 rounded-2xl bg-card border border-border shadow-md">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
              components={{
                h2({ children, ...props }) {
                  return (
                    <h2
                      {...props}
                      className="text-xl sm:text-2xl font-bold text-white border-b border-border pb-3 mt-12 mb-6 scroll-mt-24 flex items-center gap-2"
                    >
                      <Hash className="h-5 w-5 text-purple-400" />
                      {children}
                    </h2>
                  );
                },
                h3({ children, ...props }) {
                  return (
                    <h3
                      {...props}
                      className="text-base sm:text-lg font-bold text-purple-300 mt-8 mb-3 scroll-mt-24"
                    >
                      {children}
                    </h3>
                  );
                },
                pre({ children, ...props }) {
                  return (
                    <div className="relative group my-4">
                      <pre {...props}>{children}</pre>
                    </div>
                  );
                },
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  const codeString = String(children).replace(/\n$/, '');

                  if (isInline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  const blockId = Math.random().toString(36).substring(7);

                  return (
                    <div className="relative">
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                        {match && (
                          <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-background/80 border border-border">
                            {match[1]}
                          </span>
                        )}
                        <button
                          onClick={() => handleCopyCode(codeString, blockId)}
                          className="px-2 py-1 text-xs rounded-md bg-border/80 hover:bg-border text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                          title="Copy Code"
                        >
                          {copiedCodeId === blockId ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span className="text-[11px]">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </div>
                  );
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </article>

          {/* Footer Track Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            {prevTrack ? (
              <Link
                href={`/tracks/${prevTrack.slug}`}
                className="p-5 rounded-xl bg-card border border-border hover:border-purple-500/40 hover:bg-card-hover transition-all group"
              >
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-1 transition-transform" />
                  <span>Previous Track</span>
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {prevTrack.title}
                </p>
              </Link>
            ) : <div />}

            {nextTrack ? (
              <Link
                href={`/tracks/${nextTrack.slug}`}
                className="p-5 rounded-xl bg-card border border-border hover:border-purple-500/40 hover:bg-card-hover transition-all text-right group"
              >
                <div className="flex items-center justify-end gap-2 text-xs text-slate-400 mb-1">
                  <span>Next Track</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {nextTrack.title}
                </p>
              </Link>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
}

