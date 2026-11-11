'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, 
  X, 
  Baby, 
  Briefcase, 
  HelpCircle, 
  Send, 
  Copy, 
  Check, 
  Key, 
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export type AiExplainMode = 'eli5' | 'staff' | 'followups' | 'custom';

interface AiExplainDrawerProps {
  questionTitle: string;
  questionContent: string;
  isOpen: boolean;
  onClose: () => void;
}

const API_KEY_STORAGE_KEY = 'interviewhub_gemini_api_key';

export function AiExplainDrawer({
  questionTitle,
  questionContent,
  isOpen,
  onClose,
}: AiExplainDrawerProps) {
  const [activeMode, setActiveMode] = useState<AiExplainMode>('eli5');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyInputOpen, setIsKeyInputOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Load saved API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(API_KEY_STORAGE_KEY) || '';
      setApiKey(saved);
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset or re-fetch when question changes
  useEffect(() => {
    setExplanation(null);
    setError(null);
  }, [questionTitle]);

  const handleSaveApiKey = (keyVal: string) => {
    setApiKey(keyVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STORAGE_KEY, keyVal);
    }
    setIsKeyInputOpen(false);
  };

  const handleFetchExplanation = async (modeToUse: AiExplainMode = activeMode, promptText: string = customPrompt) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionTitle,
          questionContent,
          mode: modeToUse,
          customPrompt: promptText,
          userApiKey: apiKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'MISSING_API_KEY') {
          setIsKeyInputOpen(true);
        }
        throw new Error(data.message || 'Failed to generate explanation');
      }

      setExplanation(data.text);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while contacting Gemini AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode: AiExplainMode) => {
    setActiveMode(newMode);
    if (newMode !== 'custom') {
      handleFetchExplanation(newMode);
    }
  };

  const handleCopy = async () => {
    if (!explanation) return;
    try {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-card h-full border-l border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Explain with AI</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                  Gemini 2.0 Flash (Latest Free)
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate max-w-[260px] sm:max-w-md">
                {questionTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsKeyInputOpen((prev) => !prev)}
              className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                apiKey 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                  : 'border-border bg-muted hover:border-purple-400 text-muted-foreground'
              }`}
              title={apiKey ? 'Gemini API Key configured (Click to edit)' : 'Configure Gemini API Key'}
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Configuration Dropdown / Drawer */}
        {isKeyInputOpen && (
          <div className="p-4 bg-muted/70 border-b border-border text-xs animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-500" />
                <span>Google Gemini API Key</span>
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-muted-foreground mb-3 text-[11px] leading-relaxed">
              Google provides free access with Gemini 2.0 Flash on Google AI Studio. Your key stays stored 100% locally in your browser.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => handleSaveApiKey(apiKey)}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shrink-0 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="p-3 bg-muted/40 border-b border-border flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => handleModeChange('eli5')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeMode === 'eli5'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>ELI5 Analogy</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('staff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeMode === 'staff'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Staff Nuance & Trade-offs</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('followups')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeMode === 'followups'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interviewer Follow-ups</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('custom')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeMode === 'custom'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask a Doubt</span>
          </button>
        </div>

        {/* Custom Prompt Box (shown only when Ask a Doubt is active) */}
        {activeMode === 'custom' && (
          <div className="p-3 bg-card border-b border-border flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="e.g., Why would we pick this over Redis? Or explain line 12..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFetchExplanation('custom', customPrompt);
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-muted text-foreground text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="button"
              disabled={loading || !customPrompt.trim()}
              onClick={() => handleFetchExplanation('custom', customPrompt)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-sm text-foreground space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-foreground">Thinking with Gemini AI...</p>
                <p className="text-xs text-muted-foreground mt-0.5">Synthesizing practical engineering analogies and breakdown</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              {!apiKey && (
                <button
                  type="button"
                  onClick={() => setIsKeyInputOpen(true)}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Configure Free Gemini API Key →
                </button>
              )}
            </div>
          )}

          {!loading && !error && !explanation && (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="font-bold text-foreground text-base">Break down this question with AI</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Choose a preset above to generate an intuitive beginner-friendly analogy, staff-engineer architectural trade-offs, or the toughest follow-up interview questions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleFetchExplanation(activeMode)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer active:scale-95"
              >
                ✨ Generate {activeMode === 'eli5' ? 'ELI5 Analogy' : activeMode === 'staff' ? 'Staff Nuance' : 'Follow-up Questions'}
              </button>
            </div>
          )}

          {!loading && explanation && (
            <div className="prose dark:prose-invert prose-purple max-w-none text-sm leading-relaxed animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border not-prose mb-4">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  AI Breakdown: {activeMode.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-muted hover:bg-card border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFetchExplanation(activeMode)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {explanation}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
          <span>Tip: Press <kbd className="font-mono bg-card px-1.5 py-0.5 rounded border border-border">Esc</kbd> to close</span>
          <span>InterviewHub AI Assistant</span>
        </div>
      </div>
    </div>
  );
}

