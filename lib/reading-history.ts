export interface LastReadItem {
  trackSlug: string;
  trackTitle: string;
  sectionNumber: number;
  questionNumber: number;
  questionTitle: string;
  timestamp: number;
}

const GLOBAL_KEY = 'interviewhub_last_read';
const TRACK_PREFIX = 'interviewhub_last_read_';

export function saveLastRead(item: LastReadItem): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GLOBAL_KEY, JSON.stringify(item));
    localStorage.setItem(`${TRACK_PREFIX}${item.trackSlug}`, item.questionNumber.toString());
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export function getGlobalLastRead(): LastReadItem | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(GLOBAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastReadItem;
  } catch {
    return null;
  }
}

export function getTrackLastRead(trackSlug: string): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${TRACK_PREFIX}${trackSlug}`);
    if (!raw) return null;
    const num = parseInt(raw, 10);
    return isNaN(num) ? null : num;
  } catch {
    return null;
  }
}

export function clearGlobalLastRead(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GLOBAL_KEY);
  } catch {
    // Ignore storage errors
  }
}

