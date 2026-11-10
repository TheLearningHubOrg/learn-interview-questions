import { TrackMeta, TRACKS } from './tracks-meta';
import { recordStudyActivity } from './study-streak';

export interface BookmarkItem {
  trackSlug: string;
  trackTitle: string;
  sectionNumber: number;
  questionNumber: number;
  questionTitle: string;
  timestamp: number;
}

export interface TrackProgress {
  trackSlug: string;
  trackTitle: string;
  sectionNumber: number;
  studiedCount: number;
  totalCount: number;
  percent: number;
  bookmarkedCount: number;
}

export interface GlobalStudyStats {
  totalStudied: number;
  totalQuestions: number;
  overallPercent: number;
  tracksMastered: number;
  totalTracks: number;
  totalBookmarks: number;
  trackBreakdown: TrackProgress[];
}

const BOOKMARKS_STORAGE_KEY = 'interviewhub_bookmarks';
const STUDIED_PREFIX = 'studied_';

export const BOOKMARKS_UPDATE_EVENT = 'interviewhub_bookmarks_update';
export const STUDY_PROGRESS_UPDATE_EVENT = 'interviewhub_study_progress_update';

// ---------------------------------------------------------------------
// Bookmarks APIs
// ---------------------------------------------------------------------

export function getAllBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getTrackBookmarks(trackSlug: string): BookmarkItem[] {
  return getAllBookmarks().filter((b) => b.trackSlug === trackSlug);
}

export function isQuestionBookmarked(trackSlug: string, questionNumber: number): boolean {
  return getAllBookmarks().some(
    (b) => b.trackSlug === trackSlug && b.questionNumber === questionNumber
  );
}

export function toggleBookmark(item: BookmarkItem): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getAllBookmarks();
    const index = current.findIndex(
      (b) => b.trackSlug === item.trackSlug && b.questionNumber === item.questionNumber
    );

    let next: BookmarkItem[];
    let isNowBookmarked = false;

    if (index >= 0) {
      // Remove
      next = current.filter((_, i) => i !== index);
      isNowBookmarked = false;
    } else {
      // Add
      next = [item, ...current];
      isNowBookmarked = true;
    }

    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(BOOKMARKS_UPDATE_EVENT));
    window.dispatchEvent(new Event(STUDY_PROGRESS_UPDATE_EVENT));
    return isNowBookmarked;
  } catch {
    return false;
  }
}

export function removeBookmark(trackSlug: string, questionNumber: number): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getAllBookmarks();
    const next = current.filter(
      (b) => !(b.trackSlug === trackSlug && b.questionNumber === questionNumber)
    );
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(BOOKMARKS_UPDATE_EVENT));
    window.dispatchEvent(new Event(STUDY_PROGRESS_UPDATE_EVENT));
  } catch {}
}

export function clearAllBookmarks(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
    window.dispatchEvent(new Event(BOOKMARKS_UPDATE_EVENT));
    window.dispatchEvent(new Event(STUDY_PROGRESS_UPDATE_EVENT));
  } catch {}
}

// ---------------------------------------------------------------------
// Study Progress APIs
// ---------------------------------------------------------------------

export function getTrackStudiedMap(trackSlug: string): Record<number, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(`${STUDIED_PREFIX}${trackSlug}`);
    if (!raw) return {};
    return JSON.parse(raw) as Record<number, boolean>;
  } catch {
    return {};
  }
}

export function setTrackStudiedMap(trackSlug: string, map: Record<number, boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STUDIED_PREFIX}${trackSlug}`, JSON.stringify(map));
    window.dispatchEvent(new Event(STUDY_PROGRESS_UPDATE_EVENT));
  } catch {}
}

export function toggleQuestionStudied(trackSlug: string, questionNumber: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const map = getTrackStudiedMap(trackSlug);
    const updatedStatus = !map[questionNumber];
    map[questionNumber] = updatedStatus;
    setTrackStudiedMap(trackSlug, map);
    if (updatedStatus) {
      recordStudyActivity();
    }
    return updatedStatus;
  } catch {
    return false;
  }
}

export function getGlobalStudyStats(tracks: TrackMeta[] = TRACKS): GlobalStudyStats {
  const bookmarks = getAllBookmarks();
  let totalStudied = 0;
  let totalQuestions = 0;
  let tracksMastered = 0;

  const trackBreakdown: TrackProgress[] = tracks.map((t) => {
    const studiedMap = getTrackStudiedMap(t.slug);
    const studiedCount = Object.values(studiedMap).filter(Boolean).length;
    const totalCount = t.questionCount;
    const percent = Math.min(100, Math.round((studiedCount / totalCount) * 100));
    const trackBookmarks = bookmarks.filter((b) => b.trackSlug === t.slug).length;

    totalStudied += studiedCount;
    totalQuestions += totalCount;
    if (studiedCount >= totalCount && totalCount > 0) {
      tracksMastered++;
    }

    return {
      trackSlug: t.slug,
      trackTitle: t.shortTitle,
      sectionNumber: t.sectionNumber,
      studiedCount,
      totalCount,
      percent,
      bookmarkedCount: trackBookmarks,
    };
  });

  const overallPercent = totalQuestions > 0 ? Math.min(100, Math.round((totalStudied / totalQuestions) * 100)) : 0;

  return {
    totalStudied,
    totalQuestions,
    overallPercent,
    tracksMastered,
    totalTracks: tracks.length,
    totalBookmarks: bookmarks.length,
    trackBreakdown,
  };
}

export function resetAllStudyProgress(tracks: TrackMeta[] = TRACKS): void {
  if (typeof window === 'undefined') return;
  try {
    for (const t of tracks) {
      localStorage.removeItem(`${STUDIED_PREFIX}${t.slug}`);
    }
    window.dispatchEvent(new Event(STUDY_PROGRESS_UPDATE_EVENT));
  } catch {}
}

// ---------------------------------------------------------------------
// Active Recall / Flashcard Mode APIs
// ---------------------------------------------------------------------

const FLASHCARD_STORAGE_KEY = 'interviewhub_flashcard_mode';
export const FLASHCARD_MODE_UPDATE_EVENT = 'interviewhub_flashcard_mode_update';

export function getFlashcardMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(FLASHCARD_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setFlashcardMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FLASHCARD_STORAGE_KEY, String(enabled));
    window.dispatchEvent(new Event(FLASHCARD_MODE_UPDATE_EVENT));
  } catch {}
}

export function toggleFlashcardMode(): boolean {
  const current = getFlashcardMode();
  setFlashcardMode(!current);
  return !current;
}


