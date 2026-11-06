import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Atom, 
  Database, 
  Terminal, 
  Cpu, 
  Cloud, 
  Code2, 
  FileCode,
  ArrowRight,
  Play,
  List
} from 'lucide-react';
import { TrackMeta } from '@/lib/tracks';

const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Atom,
  Database,
  Terminal,
  Cpu,
  Cloud,
  Code2,
  FileCode,
};

interface TrackCardProps {
  track: TrackMeta;
}

export function TrackCard({ track }: TrackCardProps) {
  const IconComponent = ICON_MAP[track.iconName] || Code2;

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card/60 hover:bg-card border border-border hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1">
      <div>
        {/* Header Icon + Question Pill */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${track.badgeColor}`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Section {track.sectionNumber}
            </span>
          </div>

          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-border text-slate-300 border border-border group-hover:border-purple-500/30 group-hover:text-purple-300 transition-colors">
            {track.questionCount} Questions
          </span>
        </div>

        {/* Title */}
        <Link href={`/sections/${track.slug}/1`} className="block">
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-2">
            {track.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {track.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {track.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-background/80 text-slate-400 border border-border"
            >
              {tag}
            </span>
          ))}
          {track.tags.length > 4 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-md text-slate-500">
              +{track.tags.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: Start Q1 vs Overview */}
      <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
        <Link
          href={`/sections/${track.slug}`}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-card-hover"
        >
          <List className="h-3.5 w-3.5 text-purple-400" />
          <span>All Questions</span>
        </Link>

        <Link
          href={`/sections/${track.slug}/1`}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 hover:border-purple-500 py-1.5 px-3 rounded-lg transition-all"
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Start Q1</span>
          <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
        </Link>
      </div>
    </div>
  );
}
