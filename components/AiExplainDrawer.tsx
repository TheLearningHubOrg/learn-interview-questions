'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, 
  X, 
  Lightbulb, 
  Zap, 
  HelpCircle, 
  Send, 
  Copy, 
  Check, 
  Key, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

import { generateAiExplanation, AiExplainMode } from '@/lib/ai-explain';

export type { AiExplainMode };

interface AiExplainDrawerProps {
  questionTitle: string;
  questionContent: string;
  isOpen: boolean;
  onClose: () => void;
}

const API_KEY_STORAGE_KEY = 'interviewhub_gemini_api_key';

const QUICK_PROMPT_CHIPS = [
  { label: '💡 Simpler Analogy', prompt: 'Explain this using a completely different, even simpler real-world analogy.' },
  { label: '💻 Code Snippet', prompt: 'Show a minimal, clean practical code example demonstrating this with inline comments.' },
  { label: '⏱️ 60-Sec Answer', prompt: 'How do I answer this concisely in an interview in 60 seconds or less?' },
  { label: '⚠️ Common Pitfalls', prompt: 'What are the most common mistakes candidates make when explaining or implementing this?' },
];

export function AiExplainDrawer({
  questionTitle,
  questionContent,
  isOpen,
  onClose,
}: AiExplainDrawerProps) {
  const [activeMode, setActiveMode] = useState<AiExplainMode>('simple');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyInputOpen, setIsKeyInputOpen] = useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Cache explanations per question and mode so switching tabs is instant
  const [cache, setCache] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when mode or question changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeMode, questionTitle]);

  // Load saved API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(API_KEY_STORAGE_KEY) || '';
      setApiKey(saved);
      setTempKeyInput(saved);
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

  // Reset cache and errors when question changes
  useEffect(() => {
    setCache({});
    setError(null);
    setActiveMode('simple');
  }, [questionTitle]);

  // Auto-generate on open if drawer opens and not yet generated
  useEffect(() => {
    if (isOpen && !cache['simple'] && !loading && !needsApiKey) {
      handleFetchExplanation('simple');
    }
  }, [isOpen]);

  const handleSaveApiKey = (keyVal: string) => {
    const trimmed = keyVal.trim();
    setApiKey(trimmed);
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
    }
    setIsKeyInputOpen(false);
    setNeedsApiKey(false);
    setError(null);
    // Auto-fetch immediately with the new key
    handleFetchExplanation(activeMode, customPrompt, trimmed);
  };

  const handleFetchExplanation = async (
    modeToUse: AiExplainMode = activeMode,
    promptText: string = customPrompt,
    keyToUse: string = apiKey
  ) => {
    setLoading(true);
    setError(null);
    setNeedsApiKey(false);

    try {
      const result = await generateAiExplanation({
        questionTitle,
        questionContent,
        mode: modeToUse,
        customPrompt: promptText,
        userApiKey: keyToUse,
      });

      if (!result.ok) {
        if (result.needsApiKey) {
          setNeedsApiKey(true);
          setLoading(false);
          return;
        }
        throw new Error(result.message || 'Failed to generate explanation');
      }

      setCache((prev) => ({
        ...prev,
        [modeToUse === 'custom' ? `custom_${Date.now()}` : modeToUse]: result.text,
      }));
      if (modeToUse === 'custom') {
        setCache((prev) => ({ ...prev, active_custom: result.text }));
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while contacting Gemini AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode: AiExplainMode) => {
    setActiveMode(newMode);
    if (newMode !== 'custom') {
      if (!cache[newMode]) {
        handleFetchExplanation(newMode);
      }
    }
  };

  const handleQuickPromptClick = (chipPrompt: string) => {
    setActiveMode('custom');
    setCustomPrompt(chipPrompt);
    handleFetchExplanation('custom', chipPrompt);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || loading) return;
    setActiveMode('custom');
    handleFetchExplanation('custom', customPrompt);
  };

  const handleCopy = async () => {
    const textToCopy = activeMode === 'custom' ? (cache['active_custom'] || '') : (cache[activeMode] || '');
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!isOpen) return null;

  const currentContent = activeMode === 'custom' ? cache['active_custom'] : cache[activeMode];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-card h-full border-l border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-foreground">Explain with AI</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 whitespace-nowrap">
                  Gemini 2.0 Flash
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate max-w-full mt-0.5 font-medium">
                {questionTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsKeyInputOpen((prev) => !prev)}
              className={`p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                apiKey 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20' 
                  : 'border-border bg-muted hover:border-purple-400 text-muted-foreground'
              }`}
              title={apiKey ? 'Gemini API Key saved (Click to change)' : 'Set Gemini API Key'}
              aria-label="Configure API Key"
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Modal / Banner if user clicks key icon */}
        {isKeyInputOpen && (
          <div className="p-4 bg-muted/80 border-b border-border text-xs animate-in slide-in-from-top duration-200 shrink-0">
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
                <span>Get Free Key (Google AI Studio)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-muted-foreground mb-3 text-[11px] leading-relaxed">
              Google provides 100% free API keys with Gemini 2.0 Flash. Your key stays saved locally in your browser.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-foreground font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => handleSaveApiKey(tempKeyInput)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shrink-0 cursor-pointer text-center"
              >
                Save Key
              </button>
            </div>
          </div>
        )}

        {/* Mode Selector Tabs (Intuitive, Simple Labels) */}
        <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => handleModeChange('simple')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              activeMode === 'simple'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Simple Summary</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('key_points')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              activeMode === 'key_points'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Key Takeaways</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('followups')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              activeMode === 'followups'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Follow-up Questions</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('custom');
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              activeMode === 'custom'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-purple-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </div>

        {/* Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 text-sm text-foreground space-y-4">
          {/* First-time API Key Onboarding Card */}
          {needsApiKey && (
            <div className="py-8 px-4 max-w-md mx-auto text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                <Key className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Unlock Instant AI Explanations</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Get plain-English summaries, real-world analogies, and interviewer follow-up questions powered by Google Gemini 2.0 Flash (100% free).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/60 border border-border text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Step 1: Get free API key</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold hover:underline"
                  >
                    <span>Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-foreground block mb-1">Step 2: Paste key here</span>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={tempKeyInput}
                      onChange={(e) => setTempKeyInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-foreground font-mono text-xs focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      disabled={!tempKeyInput.trim()}
                      onClick={() => handleSaveApiKey(tempKeyInput)}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <span>Start</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                🔒 Your API key is stored 100% locally in your browser and never shared.
              </p>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center animate-in fade-in">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/40 border-t-transparent animate-spin" />
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {activeMode === 'simple' && 'Simplifying concept in plain English...'}
                  {activeMode === 'key_points' && 'Extracting key takeaways & trade-offs...'}
                  {activeMode === 'followups' && 'Predicting top interview follow-up questions...'}
                  {activeMode === 'custom' && 'Formulating practical answer...'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Powered by Google Gemini 2.0 Flash</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {!loading && error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsKeyInputOpen(true)}
                className="mt-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Configure Gemini API Key →
              </button>
            </div>
          )}

          {/* Rendered Explanation Markdown */}
          {!loading && currentContent && (
            <div className="prose dark:prose-invert prose-purple max-w-none text-sm leading-relaxed animate-in fade-in duration-200">
              {/* Action Toolbar on Top of Response */}
              <div className="flex items-center justify-between pb-3 border-b border-border not-prose mb-4">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {activeMode === 'simple' && 'Simple Summary & Everyday Analogy'}
                    {activeMode === 'key_points' && 'Core Takeaways & Pitfalls'}
                    {activeMode === 'followups' && 'Predicted Follow-Up Questions'}
                    {activeMode === 'custom' && (customPrompt || 'AI Answer')}
                  </span>
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
                    onClick={() => handleFetchExplanation(activeMode, customPrompt)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Regenerate"
                    aria-label="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h3: ({ children }) => (
                    <h3 className="text-sm sm:text-base font-bold text-foreground mt-4 mb-2 flex items-center gap-1.5 border-b border-border/40 pb-1">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed my-2">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm my-2 text-foreground/90">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">
                      {children}
                    </li>
                  ),
                  pre: ({ children }) => (
                    <pre className="overflow-x-auto p-3 sm:p-4 rounded-xl bg-muted/80 border border-border font-mono text-[11px] sm:text-xs my-3 scrollbar-thin">
                      {children}
                    </pre>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="px-1.5 py-0.5 rounded bg-muted border border-border/50 text-[11px] sm:text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {currentContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-border bg-card/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
            Quick Ask:
          </span>
          {QUICK_PROMPT_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              disabled={loading}
              onClick={() => handleQuickPromptClick(chip.prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted/70 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-300 border border-border hover:border-purple-400 transition-all shrink-0 whitespace-nowrap cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar (Simple, ChatGPT-style) */}
        <form 
          onSubmit={handleCustomSubmit}
          className="p-3 sm:p-4 border-t border-border bg-card flex items-center gap-2 shrink-0"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask any follow-up question or doubt..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/60 text-foreground text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500 placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !customPrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm active:scale-95"
            aria-label="Send question"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
          <span>Tip: Press <kbd className="font-mono bg-card px-1.5 py-0.5 rounded border border-border">Esc</kbd> to close</span>
          <span>InterviewHub AI Assistant</span>
        </div>
      </div>
    </div>
  );
}
