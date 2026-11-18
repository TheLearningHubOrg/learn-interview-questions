'use client';

import React from 'react';
import { 
  Check, 
  Sparkles, 
  Layers, 
  RotateCcw, 
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { TrackMeta } from '@/lib/tracks-meta';
import { ROLE_PRESETS, RolePreset } from '@/lib/tech-stack';

interface TechStackSelectorProps {
  tracks: TrackMeta[];
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
  className?: string;
  isCollapsible?: boolean;
}

export function TechStackSelector({
  tracks,
  selectedSlugs,
  onChange,
  className = '',
  isCollapsible = false,
}: TechStackSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(!isCollapsible);

  const isSelected = (slug: string) => selectedSlugs.includes(slug);

  const handleToggle = (slug: string) => {
    if (isSelected(slug)) {
      onChange(selectedSlugs.filter((s) => s !== slug));
    } else {
      onChange([...selectedSlugs, slug]);
    }
  };

  const handleApplyPreset = (preset: RolePreset) => {
    onChange(preset.techSlugs);
  };

  const handleSelectAll = () => {
    onChange(tracks.map((t) => t.slug));
  };

  const handleClear = () => {
    onChange([]);
  };

  // Calculate total questions in currently selected stack
  const selectedQuestionCount = React.useMemo(() => {
    if (selectedSlugs.length === 0) {
      return tracks.reduce((acc, t) => acc + t.questionCount, 0);
    }
    return tracks
      .filter((t) => selectedSlugs.includes(t.slug))
      .reduce((acc, t) => acc + t.questionCount, 0);
  }, [tracks, selectedSlugs]);

  const hasSelection = selectedSlugs.length > 0;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-card border ${hasSelection ? 'border-purple-500/40 ring-1 ring-purple-500/20' : 'border-border'} shadow-sm transition-all ${className}`}>
      {/* Top Header: Title, Preset Roles & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Cpu className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-foreground">
              Personalized Interview Tech Stack
            </h3>
            {hasSelection && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white">
                {selectedSlugs.length} Active
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select the technologies on your resume or job description to filter questions and cheatsheets.
          </p>
        </div>

        {/* Right utility actions */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {hasSelection && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Reset to all technologies"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All</span>
            </button>
          )}

          {isCollapsible && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={isExpanded ? 'Collapse tech stack' : 'Expand tech stack'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Collapsed State Quick Preview */}
      {!isExpanded && (
        <div className="pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-muted-foreground font-medium shrink-0">
              {hasSelection ? 'Targeting:' : 'Active Stack:'}
            </span>
            {hasSelection ? (
              tracks
                .filter((t) => selectedSlugs.includes(t.slug))
                .map((t) => (
                  <span
                    key={t.slug}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 shrink-0"
                  >
                    {t.shortTitle}
                  </span>
                ))
            ) : (
              <span className="text-muted-foreground">
                All 13 technologies (1,864 questions)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer self-start sm:self-auto shrink-0"
          >
            {hasSelection ? `Customize (${selectedQuestionCount} Qs) →` : 'Filter by My Stack →'}
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="pt-3.5 space-y-3.5 animate-in fade-in duration-150">
          {/* Quick Role Stacks Presets */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>1-Click Popular Job Role Stacks:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
              {ROLE_PRESETS.map((preset) => {
                const isPresetActive =
                  preset.techSlugs.length === selectedSlugs.length &&
                  preset.techSlugs.every((s) => selectedSlugs.includes(s));

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      isPresetActive
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-muted/70 hover:bg-muted text-foreground border border-border hover:border-purple-400/50'
                    }`}
                    title={preset.description}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Individual Multi-Select Tech Pills */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              <span>Choose Technologies ({tracks.length} Available):</span>
              <div className="flex items-center gap-2 normal-case font-medium">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                >
                  Select All
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tracks.map((track) => {
                const active = isSelected(track.slug);

                return (
                  <button
                    key={track.slug}
                    type="button"
                    onClick={() => handleToggle(track.slug)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs ring-1 ring-purple-600/30'
                        : 'bg-card hover:bg-card-hover border-border text-foreground hover:border-purple-400/60'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                        active ? 'bg-white text-purple-600' : 'border border-muted-foreground/40 bg-muted/30'
                      }`}
                    >
                      {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{track.shortTitle}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        active ? 'bg-purple-700 text-purple-100' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {track.questionCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Stack Count Status Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-border/50 text-xs">
            <span className="text-muted-foreground font-medium">
              {hasSelection ? (
                <>
                  Targeting <strong className="text-foreground">{selectedSlugs.length}</strong> technologies •{' '}
                  <strong className="text-purple-600 dark:text-purple-400">{selectedQuestionCount}</strong> Q&As
                </>
              ) : (
                <>Showing all 13 technologies (1,864 questions) • Pick technologies above to personalize</>
              )}
            </span>

            {hasSelection && (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
                Stack Filter Active
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
