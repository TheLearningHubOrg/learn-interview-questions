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
  ArrowRight,
  Sparkles
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
};

interface TrackCardProps {
  track: TrackMeta;
}

export function TrackCard({ track }: TrackCardProps) {
  const IconComponent = ICON_MAP[track.iconName] || Code2;

  return (
    <Link
      href={`/tracks/${track.slug}`}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card/60 hover:bg-card border border-border hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1"
    >
      <div>
        {/* Header Icon + Question Pill */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl border bg-gradient-to-br ${track.badgeColor}`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-border text-slate-300 border border-border group-hover:border-purple-500/30 group-hover:text-purple-300 transition-colors">
            {track.questionCount} Questions
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-2">
          {track.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {track.description}
        </p>
      </div>

      <div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
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

        {/* CTA */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
          <span>Start Study Session</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

