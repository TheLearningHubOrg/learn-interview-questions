'use client';

import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  codeString: string;
  children: React.ReactNode;
}

export function CodeBlock({ language, codeString, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const cleanLang = (language || 'code').toLowerCase().trim();

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border bg-card shadow-sm dark:shadow-xl text-left transition-colors">
      {/* Code Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/70 dark:bg-[#121520] border-b border-border select-none transition-colors">
        <div className="flex items-center gap-3">
          {/* Mac-style traffic dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="h-3 w-px bg-border" />
          {/* Language badge */}
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5" />
            <span>{cleanLang}</span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:text-slate-900 bg-card hover:bg-muted border border-border shadow-xs dark:text-slate-300 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] sm:text-sm font-mono leading-relaxed bg-slate-50 dark:bg-[#0b0d14] text-slate-900 dark:text-[#f1f5f9] scrollbar-thin scrollbar-thumb-border m-0 transition-colors">
        <code className={`language-${cleanLang}`}>{children}</code>
      </pre>
    </div>
  );
}

