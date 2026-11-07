'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Atom, 
  Database, 
  Terminal, 
  Cpu,
  Server, 
  Cloud, 
  Code2, 
  FileCode,
  Users,
  ArrowRight,
  Play,
  List
} from 'lucide-react';
import { TrackMeta } from '@/lib/tracks-meta';

const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Atom,
  Database,
  Terminal,
  Cpu,
  Server,
  Cloud,
  Code2,
  FileCode,
  Users,
};

interface TrackCardProps {
  track: TrackMeta;
}

export function TrackCard({ track }: TrackCardProps) {
  const IconComponent = ICON_MAP[track.iconName] || Code2;

  return (
    <div className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-purple-400/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
      <div>
        {/* Header Icon + Question Pill */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl border ${track.badgeColor} shadow-sm`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Section {track.sectionNumber}
            </span>
          </div>

          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-muted text-foreground border border-border group-hover:border-purple-400/40 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {track.questionCount} Questions
          </span>
        </div>

        {/* Title */}
        <Link href={`/sections/${track.slug}/1`} className="block">
          <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
            {track.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {track.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {track.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border"
            >
              {tag}
            </span>
          ))}
          {track.tags.length > 4 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-md text-muted-foreground opacity-75">
              +{track.tags.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: Start Q1 vs Overview */}
      <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
        <Link
          href={`/sections/${track.slug}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2.5 rounded-lg hover:bg-muted"
        >
          <List className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          <span>All Questions</span>
        </Link>

        <Link
          href={`/sections/${track.slug}/1`}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 py-1.5 px-3 rounded-lg transition-all active:scale-95"
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Start Q1</span>
          <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
        </Link>
      </div>
    </div>
  );
}
