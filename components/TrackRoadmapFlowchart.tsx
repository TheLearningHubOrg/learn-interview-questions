'use client';

import React, { useState } from 'react';
import { 
  Milestone, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { TRACK_ROADMAP_META } from '@/lib/track-roadmap-meta';

export interface RoadmapPartInfo {
  partName: string;
  count: number;
  startNum: number;
  endNum: number;
  questionNumbers: number[];
}

interface TrackRoadmapFlowchartProps {
  trackSlug: string;
  parts: RoadmapPartInfo[];
  studiedMap: Record<number, boolean>;
  selectedPart: string | null;
  onSelectPart: (partName: string | null) => void;
}

export function TrackRoadmapFlowchart({
  trackSlug,
  parts,
  studiedMap,
  selectedPart,
  onSelectPart,
}: TrackRoadmapFlowchartProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!parts || parts.length <= 1) {
    return null;
  }

  const trackMeta = TRACK_ROADMAP_META[trackSlug] || {};

  return (
    <div className="mb-10 rounded-2xl bg-card border border-border overflow-hidden shadow-sm transition-all">
      {/* Header Bar */}
      <div className="px-5 py-4 bg-muted/40 dark:bg-card/60 border-b border-border flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Milestone className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">
                Curriculum Roadmap & Learning Path
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
                {parts.length} Stages
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Visual progression through core architectural topics • Click any stage to focus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedPart && (
            <button
              type="button"
              onClick={() => onSelectPart(null)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 hover:bg-purple-200 transition-colors"
            >
              <span>Clear Filter</span>
              <X className="h-3 w-3" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-background hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all"
            aria-label={isExpanded ? 'Collapse Roadmap' : 'Expand Roadmap'}
          >
            <span>{isExpanded ? 'Hide Flowchart' : 'Show Flowchart'}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Flowchart Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-gradient-to-b from-card to-background">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 relative">
            {parts.map((p, index) => {
              const stageNum = index + 1;
              const meta = trackMeta[stageNum];
              const isSelected = selectedPart === p.partName;

              // Calculate studied progress for this stage
              const studiedInStage = p.questionNumbers.filter(
                (num) => studiedMap[num]
              ).length;
              const percent = p.count > 0 ? Math.round((studiedInStage / p.count) * 100) : 0;
              const isCompleted = studiedInStage === p.count && p.count > 0;

              // Derive title & subtitle if not explicitly in meta
              const title = meta?.shortTitle || p.partName.replace(/^Part \d+:?\s*/i, '').split('(')[0].trim();
              const subtitle = meta?.subtitle || `Questions ${p.startNum} through ${p.endNum}`;

              return (
                <div key={p.partName} className="relative group">
                  <button
                    type="button"
                    onClick={() => onSelectPart(isSelected ? null : p.partName)}
                    className={`w-full text-left p-4 rounded-xl border transition-all h-full flex flex-col justify-between relative cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500 shadow-md shadow-purple-500/10 ring-2 ring-purple-500/30'
                        : isCompleted
                        ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10'
                        : 'bg-card hover:bg-muted/60 border-border hover:border-purple-300 dark:hover:border-purple-500/40'
                    }`}
                  >
                    {/* Top Row: Stage Number & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-muted text-muted-foreground group-hover:bg-purple-500/20 group-hover:text-purple-600 dark:group-hover:text-purple-300'
                          }`}
                        >
                          {stageNum < 10 ? `0${stageNum}` : stageNum}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                          Stage {stageNum}
                        </span>
                      </div>

                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Done</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60">
                          Q{p.startNum}–{p.endNum}
                        </span>
                      )}
                    </div>

                    {/* Stage Title & Subtitle */}
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                        {title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {subtitle}
                      </p>
                    </div>

                    {/* Progress Bar & Question Count */}
                    <div className="pt-2 border-t border-border/60">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1 font-mono">
                        <span>{p.count} Questions</span>
                        <span className={isCompleted ? 'text-emerald-600 font-bold' : ''}>
                          {studiedInStage}/{p.count} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-500'
                              : isSelected
                              ? 'bg-purple-500'
                              : 'bg-purple-500/60'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Flow Connector Arrow on large screens for consecutive steps */}
                  {index < parts.length - 1 && (
                    <div className="hidden xl:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-muted-foreground/30">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Tip: Click any stage card above to instantly filter the question bank to that topic.</span>
            </span>
            <span className="font-mono text-[11px]">
              {parts.length} Connected Milestones
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

