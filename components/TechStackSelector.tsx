'use client';

import React, { useState, useMemo } from 'react';
import { 
  Check, 
  Sparkles, 
  Layers, 
  RotateCcw, 
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Filter
} from 'lucide-react';
import { TrackMeta } from '@/lib/tracks-meta';
import { ROLE_PRESETS, RolePreset, GRANULAR_TECHS, GranularTech } from '@/lib/tech-stack';

interface TechStackSelectorProps {
  tracks?: TrackMeta[];
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
  className?: string;
  isCollapsible?: boolean;
}

type CategoryType =
  | 'all'
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'Databases & Cache'
  | 'Data Engineering'
  | 'Messaging & Streaming'
  | 'Cloud Platforms'
  | 'DevOps & Systems'
  | 'Testing & SRE'
  | 'Architecture & Core';

const CATEGORIES: { id: CategoryType; label: string; icon: string }[] = [
  { id: 'all', label: 'All Techs', icon: '⚡' },
  { id: 'Frontend', label: 'Frontend', icon: '⚛️' },
  { id: 'Backend', label: 'Backend', icon: '☕' },
  { id: 'Mobile', label: 'Mobile', icon: '📱' },
  { id: 'Databases & Cache', label: 'Databases', icon: '🐘' },
  { id: 'Data Engineering', label: 'Data Engineering', icon: '📊' },
  { id: 'Messaging & Streaming', label: 'Messaging', icon: '🐇' },
  { id: 'Cloud Platforms', label: 'Cloud Platforms', icon: '☁️' },
  { id: 'DevOps & Systems', label: 'DevOps & Linux', icon: '☸️' },
  { id: 'Testing & SRE', label: 'Testing & SRE', icon: '🧪' },
  { id: 'Architecture & Core', label: 'Architecture & DSA', icon: '🏗️' },
];

export function TechStackSelector({
  tracks = [],
  selectedSlugs,
  onChange,
  className = '',
  isCollapsible = false,
}: TechStackSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

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
    onChange(GRANULAR_TECHS.map((t) => t.slug));
  };

  const handleClear = () => {
    onChange([]);
  };

  const handleSelectCategory = (cat: CategoryType) => {
    if (cat === 'all') {
      handleSelectAll();
      return;
    }
    const catSlugs = GRANULAR_TECHS.filter((t) => t.category === cat).map((t) => t.slug);
    const newSlugs = Array.from(new Set([...selectedSlugs, ...catSlugs]));
    onChange(newSlugs);
  };

  // Filtered techs based on active category
  const displayedTechs = useMemo(() => {
    if (activeCategory === 'all') return GRANULAR_TECHS;
    return GRANULAR_TECHS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  // Calculate total questions in currently selected stack
  const selectedQuestionCount = useMemo(() => {
    if (selectedSlugs.length === 0) {
      return GRANULAR_TECHS.reduce((acc, t) => acc + t.approxQuestionCount, 0);
    }
    return GRANULAR_TECHS
      .filter((t) => selectedSlugs.includes(t.slug))
      .reduce((acc, t) => acc + t.approxQuestionCount, 0);
  }, [selectedSlugs]);

  const hasSelection = selectedSlugs.length > 0;

  return (
    <div className={`p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-card border ${hasSelection ? 'border-purple-500/40 ring-1 ring-purple-500/20' : 'border-border'} shadow-sm transition-all ${className}`}>
      {/* Top Header: Title, Preset Roles & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 sm:pb-3 border-b border-border/60">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              Personalized Interview Tech Stack
            </h3>
            {hasSelection && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shrink-0">
                {selectedSlugs.length} Active
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            Select the technologies on your resume to tailor questions and cheatsheets.
          </p>
        </div>

        {/* Right utility actions */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {hasSelection && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer min-h-[30px] touch-manipulation"
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
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center touch-manipulation"
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
            <span className="text-muted-foreground font-medium shrink-0 text-[11px] sm:text-xs">
              {hasSelection ? 'Targeting:' : 'Active Stack:'}
            </span>
            {hasSelection ? (
              GRANULAR_TECHS
                .filter((t) => selectedSlugs.includes(t.slug))
                .map((t) => (
                  <span
                    key={t.slug}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] sm:text-xs bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 shrink-0"
                  >
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </span>
                ))
            ) : (
              <span className="text-muted-foreground text-[11px] sm:text-xs">
                All {GRANULAR_TECHS.length} technologies (2,719+ questions)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="font-bold text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer self-start sm:self-auto shrink-0 min-h-[30px] flex items-center touch-manipulation"
          >
            {hasSelection ? `Customize (${selectedQuestionCount} Qs) →` : 'Filter by My Stack →'}
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="pt-3 space-y-3 animate-in fade-in duration-150">
          {/* Quick Role Stacks Presets */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
              <span>1-Click Popular Job Role Stacks:</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x -mx-1 px-1">
              {ROLE_PRESETS.map((preset) => {
                const isPresetActive =
                  preset.techSlugs.length === selectedSlugs.length &&
                  preset.techSlugs.every((s) => selectedSlugs.includes(s));

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer min-h-[32px] touch-manipulation ${
                      isPresetActive
                        ? 'bg-purple-600 text-white shadow-xs ring-1 ring-purple-600'
                        : 'bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400/60'
                    }`}
                    title={preset.description}
                  >
                    <span className="text-xs sm:text-sm">{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Tabs for Fast Discovery */}
          <div className="pt-0.5">
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x -mx-1 px-1 border-b border-border/50">
              {CATEGORIES.map((cat) => {
                const isCatActive = activeCategory === cat.id;
                const count = cat.id === 'all' 
                  ? GRANULAR_TECHS.length 
                  : GRANULAR_TECHS.filter((t) => t.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[30px] touch-manipulation ${
                      isCatActive
                        ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Individual Multi-Select Tech Pills */}
          <div>
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              <span className="truncate">
                {activeCategory === 'all' ? 'All Technologies' : activeCategory} ({displayedTechs.length}):
              </span>
              <div className="flex items-center gap-2 normal-case font-medium flex-wrap">
                {activeCategory !== 'all' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectCategory(activeCategory)}
                      className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer touch-manipulation py-0.5"
                    >
                      + Add All in {activeCategory}
                    </button>
                    <span>•</span>
                  </>
                )}
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer touch-manipulation py-0.5"
                >
                  Select All
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer touch-manipulation py-0.5"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {displayedTechs.map((tech) => {
                const active = isSelected(tech.slug);

                return (
                  <button
                    key={tech.slug}
                    type="button"
                    onClick={() => handleToggle(tech.slug)}
                    title={tech.name}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all cursor-pointer min-h-[32px] touch-manipulation shadow-[0_1px_2px_rgba(0,0,0,0.03)] max-w-full ${
                      active
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-600 shadow-sm shadow-purple-500/25 ring-2 ring-purple-500/30'
                        : 'bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 hover:border-purple-400/60'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 transition-colors ${
                        active ? 'bg-white text-purple-600' : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="shrink-0 text-xs sm:text-sm">{tech.icon}</span>
                    <span className="truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none text-left">
                      {tech.name}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] px-1.5 py-0.2 sm:py-0.5 rounded-md font-mono font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {tech.approxQuestionCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Stack Count Status Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pt-2 sm:pt-2.5 border-t border-border/50 text-[11px] sm:text-xs">
            <span className="text-muted-foreground font-medium">
              {hasSelection ? (
                <>
                  Targeting <strong className="text-foreground">{selectedSlugs.length}</strong> technologies •{' '}
                  <strong className="text-purple-600 dark:text-purple-400">{selectedQuestionCount}</strong> Q&As
                </>
              ) : (
                <>Showing all {GRANULAR_TECHS.length} technologies (2,719+ questions) • Pick technologies above to personalize</>
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
