export interface StudyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudiedDate: string | null; // YYYY-MM-DD
  activeDates: string[]; // List of unique YYYY-MM-DD dates
  totalActiveDays: number;
  studiedToday: boolean;
}

const STREAK_STORAGE_KEY = 'interviewhub_study_streak';
export const STREAK_UPDATE_EVENT = 'interviewhub_streak_update';

/**
 * Format a Date object as YYYY-MM-DD in local time
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate difference in days between two YYYY-MM-DD strings (date2 - date1)
 */
function getDayDifference(dateStr1: string, dateStr2: string): number {
  try {
    const d1 = new Date(`${dateStr1}T00:00:00`);
    const d2 = new Date(`${dateStr2}T00:00:00`);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * Get current streak information
 */
export function getStudyStreak(): StudyStreakData {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastStudiedDate: null,
      activeDates: [],
      totalActiveDays: 0,
      studiedToday: false,
    };
  }

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    const today = getLocalDateString();

    if (!raw) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastStudiedDate: null,
        activeDates: [],
        totalActiveDays: 0,
        studiedToday: false,
      };
    }

    const data = JSON.parse(raw) as {
      currentStreak: number;
      longestStreak: number;
      lastStudiedDate: string | null;
      activeDates?: string[];
      totalActiveDays?: number;
    };

    const lastDate = data.lastStudiedDate;
    const activeDates = Array.isArray(data.activeDates) ? data.activeDates : [];
    const totalActiveDays = data.totalActiveDays || activeDates.length;
    let currentStreak = data.currentStreak || 0;
    const longestStreak = data.longestStreak || currentStreak;

    if (!lastDate) {
      return {
        currentStreak: 0,
        longestStreak,
        lastStudiedDate: null,
        activeDates,
        totalActiveDays,
        studiedToday: false,
      };
    }

    const diff = getDayDifference(lastDate, today);
    const studiedToday = diff === 0;

    // If more than 1 day has elapsed since last study date, streak is broken
    if (diff > 1) {
      currentStreak = 0;
    }

    return {
      currentStreak,
      longestStreak,
      lastStudiedDate: lastDate,
      activeDates,
      totalActiveDays,
      studiedToday,
    };
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastStudiedDate: null,
      activeDates: [],
      totalActiveDays: 0,
      studiedToday: false,
    };
  }
}

/**
 * Record a study activity (e.g. question marked studied or flashcard mastered)
 */
export function recordStudyActivity(): StudyStreakData {
  if (typeof window === 'undefined') {
    return getStudyStreak();
  }

  try {
    const today = getLocalDateString();
    const streak = getStudyStreak();

    // Already studied today
    if (streak.lastStudiedDate === today) {
      return streak;
    }

    let nextCurrentStreak = 1;
    let nextLongestStreak = streak.longestStreak;
    const activeDates = [...streak.activeDates.filter((d) => d !== today), today];
    let totalActiveDays = streak.totalActiveDays;

    if (streak.lastStudiedDate) {
      const diff = getDayDifference(streak.lastStudiedDate, today);
      if (diff === 1) {
        // Consecutive day
        nextCurrentStreak = streak.currentStreak + 1;
      } else {
        // Streak broken
        nextCurrentStreak = 1;
      }
    } else {
      nextCurrentStreak = 1;
    }

    if (nextCurrentStreak > nextLongestStreak) {
      nextLongestStreak = nextCurrentStreak;
    }

    totalActiveDays += 1;

    const payload = {
      currentStreak: nextCurrentStreak,
      longestStreak: nextLongestStreak,
      lastStudiedDate: today,
      activeDates: activeDates.slice(-90), // Keep last 90 days of activity
      totalActiveDays,
    };

    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event(STREAK_UPDATE_EVENT));

    return {
      ...payload,
      studiedToday: true,
    };
  } catch {
    return getStudyStreak();
  }
}

/**
 * Get the 7 days of the current week (Monday through Sunday)
 */
export interface WeekDayStatus {
  dayName: string;
  dayNumber: number;
  dateStr: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isStudied: boolean;
}

export function getCurrentWeekDays(activeDates: string[]): WeekDayStatus[] {
  const now = new Date();
  const todayStr = getLocalDateString(now);

  // Determine Monday of the current week
  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = (currentDay + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);

  const days: WeekDayStatus[] = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = getLocalDateString(d);
    const isToday = dateStr === todayStr;
    const diff = getDayDifference(dateStr, todayStr);

    days.push({
      dayName: dayNames[i],
      dayNumber: d.getDate(),
      dateStr,
      isToday,
      isPast: diff > 0,
      isFuture: diff < 0,
      isStudied: activeDates.includes(dateStr),
    });
  }

  return days;
}
