'use client';

import React, { useEffect, useState, useRef } from 'react';
import { GitBranch, Code2, Copy, Check, Eye } from 'lucide-react';

interface MermaidBlockProps {
  chart: string;
}

let mermaidLoadingPromise: Promise<any> | null = null;

function getMermaid(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject('SSR');
  if ((window as any).mermaid) return Promise.resolve((window as any).mermaid);

  if (mermaidLoadingPromise) return mermaidLoadingPromise;

  mermaidLoadingPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('mermaid-cdn-script') as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).mermaid) {
        resolve((window as any).mermaid);
      } else {
        existing.addEventListener('load', () => resolve((window as any).mermaid));
        existing.addEventListener('error', reject);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'mermaid-cdn-script';
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).mermaid) {
        resolve((window as any).mermaid);
      } else {
        reject(new Error('Mermaid failed to attach to window'));
      }
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return mermaidLoadingPromise;
}

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diagram' | 'source'>('diagram');
  const [copied, setCopied] = useState(false);
  const renderId = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let isMounted = true;

    const purgeMermaidBodyArtifacts = () => {
      if (typeof document === 'undefined') return;
      document
        .querySelectorAll('body > svg[id^="mermaid-"], body > svg.error-icon, body > [id^="dmermaid"]')
        .forEach((el) => el.remove());
    };

    // Purge any stale Mermaid error elements on mount
    purgeMermaidBodyArtifacts();

    getMermaid()
      .then(async (mermaid) => {
        // Prevent mermaid from writing unstyled error SVGs directly to document.body
        mermaid.parseError = () => {
          purgeMermaidBodyArtifacts();
        };

        const isDark = document.documentElement.classList.contains('dark');
        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          themeVariables: isDark
            ? {
                primaryColor: '#7c3aed',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#a78bfa',
                lineColor: '#94a3b8',
                secondaryColor: '#1e293b',
                tertiaryColor: '#0f172a',
              }
            : {
                primaryColor: '#8b5cf6',
                primaryTextColor: '#0f172a',
                primaryBorderColor: '#7c3aed',
                lineColor: '#64748b',
                secondaryColor: '#f1f5f9',
                tertiaryColor: '#ffffff',
              },
        });

        try {
          // Clean and defensively sanitize chart input
          let cleanChart = chart.trim();
          // Normalize invalid sequence arrows in flowcharts
          if (/^(flowchart|graph)\s+/m.test(cleanChart)) {
            cleanChart = cleanChart.replace(/-->>/g, '-->').replace(/<<--/g, '<--');
          }
          const { svg: renderedSvg } = await mermaid.render(renderId.current, cleanChart);
          purgeMermaidBodyArtifacts();
          if (isMounted) {
            setSvg(renderedSvg);
            setError(null);
          }
        } catch (renderErr: any) {
          purgeMermaidBodyArtifacts();
          if (isMounted) {
            setError(renderErr?.message || 'Diagram syntax parse error');
          }
        }
      })
      .catch((loadErr) => {
        purgeMermaidBodyArtifacts();
        if (isMounted) {
          setError('Unable to load diagram rendering engine (offline mode)');
        }
      });

    return () => {
      isMounted = false;
      purgeMermaidBodyArtifacts();
    };
  }, [chart]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const showDiagram = activeTab === 'diagram' && svg && !error;

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border bg-card shadow-sm dark:shadow-xl text-left transition-colors">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/70 dark:bg-[#121520] border-b border-border select-none transition-colors flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {/* Mac-style traffic dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Architecture Flowchart</span>
          </div>
        </div>

        {/* View Mode Toggle & Copy */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-background/80 rounded-lg p-0.5 border border-border text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('diagram')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTab === 'diagram'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Diagram</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('source')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTab === 'source'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Source</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground bg-background hover:bg-muted border border-border transition-all cursor-pointer"
            title="Copy flowchart definition"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {showDiagram ? (
        <div className="p-4 sm:p-8 bg-card flex justify-center items-center overflow-x-auto min-h-[220px]">
          <div
            className="mermaid-svg-container max-w-full [&>svg]:max-w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      ) : (
        <div className="relative">
          <pre className="p-4 overflow-x-auto bg-[#0d1117] text-slate-200 text-xs sm:text-[13px] font-mono leading-relaxed">
            <code>{chart.trim()}</code>
          </pre>
          {error && activeTab === 'diagram' && (
            <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setActiveTab('source')}
                className="underline font-bold"
              >
                View Source
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

