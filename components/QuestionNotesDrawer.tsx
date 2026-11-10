'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  PencilLine, 
  Save, 
  Trash2, 
  Download, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp,
  FileText
} from 'lucide-react';
import { 
  getQuestionNote, 
  saveQuestionNote, 
  deleteQuestionNote, 
  downloadNotesFile, 
  NOTES_UPDATE_EVENT 
} from '@/lib/study-notes';

interface QuestionNotesDrawerProps {
  trackSlug: string;
  trackTitle: string;
  questionNumber: number;
  questionTitle: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function QuestionNotesDrawer({
  trackSlug,
  trackTitle,
  questionNumber,
  questionTitle,
  isOpen,
  onToggle,
}: QuestionNotesDrawerProps) {
  const [noteText, setNoteText] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing note when question changes
  useEffect(() => {
    const existing = getQuestionNote(trackSlug, questionNumber);
    setNoteText(existing);
    setIsSaved(true);
  }, [trackSlug, questionNumber]);

  // Listen for storage events (e.g. cross-tab updates)
  useEffect(() => {
    const onNotesUpdate = () => {
      const existing = getQuestionNote(trackSlug, questionNumber);
      setNoteText(existing);
    };
    window.addEventListener(NOTES_UPDATE_EVENT, onNotesUpdate);
    return () => window.removeEventListener(NOTES_UPDATE_EVENT, onNotesUpdate);
  }, [trackSlug, questionNumber]);

  // Auto-save note with debounce
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteText(val);
    setIsSaved(false);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      saveQuestionNote({
        trackSlug,
        trackTitle,
        questionNumber,
        questionTitle,
        content: val,
      });
      setIsSaved(true);
    }, 600);
  };

  const handleClear = () => {
    if (window.confirm('Clear your personal notes for this question?')) {
      deleteQuestionNote(trackSlug, questionNumber);
      setNoteText('');
      setIsSaved(true);
    }
  };

  const hasNote = noteText.trim().length > 0;

  return (
    <div className="mt-8 border border-border rounded-2xl bg-card overflow-hidden shadow-sm transition-all">
      {/* Header Bar: Toggle open/close */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            hasNote
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-muted text-muted-foreground'
          }`}>
            <PencilLine className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                My Personal Notes & Cheat Sheet
              </span>
              {hasNote && (
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Note Added
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isOpen ? 'Press N to collapse • Autosaves locally' : 'Click to jot down trade-offs, reminders, or company interview nuances (Press N)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content Area */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-border bg-card animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Private notes for Q{questionNumber}</span>
            </span>

            <div className="flex items-center gap-2">
              {isSaved ? (
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Saved locally</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 animate-pulse">
                  <Save className="w-3 h-3" />
                  <span>Saving...</span>
                </span>
              )}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={noteText}
            onChange={handleChange}
            placeholder="Jot down your key takeaways, company-specific nuances, edge cases, mnemonics, or tricky interview trade-offs..."
            rows={5}
            className="w-full p-3.5 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all resize-y leading-relaxed"
          />

          {/* Bottom Toolbar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 pt-2">
            <span className="text-[11px] text-muted-foreground font-mono">
              Supports markdown formatting
            </span>

            <div className="flex items-center gap-2">
              {hasNote && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                  title="Delete note for this question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}

              <button
                type="button"
                onClick={downloadNotesFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border transition-all cursor-pointer"
                title="Download all your saved notes as a .md file"
              >
                <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Export Notes (.md)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
