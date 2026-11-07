'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy, Code2, Layers } from 'lucide-react';

export interface LanguageBlock {
  label: string; // 'Python 3', 'Java', 'C++', 'TypeScript'
  lang: string;  // 'python', 'java', 'cpp', 'typescript'
  code: string;
}

interface MultiLangCodeTabsProps {
  blocks: LanguageBlock[];
}

export function MultiLangCodeTabs({ blocks }: MultiLangCodeTabsProps) {
  const [activeLabel, setActiveLabel] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('interviewhub-dsa-lang');
        if (stored && blocks.some((b) => b.label.toLowerCase() === stored.toLowerCase())) {
          return stored;
        }
      } catch {}
    }
    return blocks[0]?.label || 'Python 3';
  });

  const [copied, setCopied] = useState(false);

  // Sync preference with localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('interviewhub-dsa-lang');
      if (stored && blocks.some((b) => b.label.toLowerCase() === stored.toLowerCase())) {
        setActiveLabel(stored);
      }
    } catch {}
  }, [blocks]);

  const selectLanguage = (label: string) => {
    setActiveLabel(label);
    try {
      localStorage.setItem('interviewhub-dsa-lang', label);
    } catch {}
  };

  const isAll = activeLabel === 'all';
  const activeBlock = blocks.find((b) => b.label === activeLabel) || blocks[0];

  const handleCopy = async () => {
    try {
      const textToCopy = isAll
        ? blocks.map((b) => `// ================= ${b.label} =================\n${b.code}`).join('\n\n')
        : activeBlock?.code || '';
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getLangIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('python')) return '🐍';
    if (l.includes('javascript') || l === 'js') return '🟨';
    if (l.includes('typescript') || l === 'ts') return '🔷';
    if (l.includes('java')) return '☕';
    if (l.includes('c++') || l.includes('cpp')) return '⚡';
    if (l.includes('go')) return '🐹';
    if (l.includes('rust')) return '🦀';
    return '💻';
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border bg-card shadow-sm dark:shadow-xl text-left transition-colors">
      {/* Tab Navigation Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/70 dark:bg-[#121520] border-b border-border gap-2 select-none min-w-0 transition-colors">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
          {/* Mac-style traffic dots */}
          <div className="flex items-center gap-1.5 hidden md:flex shrink-0" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <span className="h-3 w-px bg-border hidden md:inline-block shrink-0" />

          {/* Horizontally Scrollable Language Tabs */}
          <div 
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-0.5 min-w-0 flex-1 scroll-smooth touch-pan-x"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {blocks.map((b) => {
              const isActive = activeLabel === b.label;
              return (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => selectLanguage(b.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30 font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="text-[12px]">{getLangIcon(b.label)}</span>
                  <span>{b.label}</span>
                </button>
              );
            })}

            {/* All Languages Tab */}
            <button
              type="button"
              onClick={() => selectLanguage('all')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isAll
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30 font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All ({blocks.length})</span>
            </button>
          </div>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-card hover:bg-muted border border-border shadow-xs dark:text-slate-300 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Copy {isAll ? 'All' : activeBlock?.label}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display Area */}
      {isAll ? (
        <div className="divide-y divide-border">
          {blocks.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between px-4 py-1.5 bg-muted/50 dark:bg-[#0e111a] text-xs font-mono font-semibold text-purple-700 dark:text-purple-400 border-b border-border transition-colors">
                <span>{getLangIcon(b.label)} {b.label}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{b.lang}</span>
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                components={{
                  pre({ children }) { return <>{children}</>; },
                  code({ className, children }) {
                    return (
                      <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] sm:text-sm font-mono leading-relaxed bg-slate-50 dark:bg-[#0b0d14] text-slate-900 dark:text-[#f1f5f9] scrollbar-thin scrollbar-thumb-border m-0 transition-colors">
                        <code className={className}>{children}</code>
                      </pre>
                    );
                  }
                }}
              >
                {`\`\`\`${b.lang}\n${b.code}\n\`\`\``}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
          components={{
            pre({ children }) { return <>{children}</>; },
            code({ className, children }) {
              return (
                <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] sm:text-sm font-mono leading-relaxed bg-slate-50 dark:bg-[#0b0d14] text-slate-900 dark:text-[#f1f5f9] scrollbar-thin scrollbar-thumb-border m-0 transition-colors">
                  <code className={className}>{children}</code>
                </pre>
              );
            }
          }}
        >
          {`\`\`\`${activeBlock.lang}\n${activeBlock.code}\n\`\`\``}
        </ReactMarkdown>
      )}
    </div>
  );
}
