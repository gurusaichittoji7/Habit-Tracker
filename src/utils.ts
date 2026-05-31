import { Habit, CategoryType, UserProfile, Preferences } from './types';

// Helper to get formatted date string: YYYY-MM-DD
export function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Generate dates of the last 28 days up to today
export function getLastNDays(n: number): Date[] {
  const dates: Date[] = [];
  const today = new Date('2026-05-31'); // Anchor to current context date
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d);
  }
  return dates;
}

// Generate deterministic history based on consistency percentage to make the heatmap looks exactly like mock
export function generateHistory(consistencyPct: number, daysAgoCount: number = 30): { [key: string]: boolean } {
  const history: { [key: string]: boolean } = {};
  const today = new Date('2026-05-31');
  
  for (let i = 1; i <= daysAgoCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    
    // Use a deterministic seed to make sure it is stable on loads
    const seed = (parseInt(dateStr.replace(/-/g, '')) * i) % 100;
    if (seed < consistencyPct) {
      history[dateStr] = true;
    }
  }
  return history;
}

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Build any project',
    category: 'development',
    frequency: 'Daily',
    goalValue: 1,
    goalUnit: 'Sessions',
    reminderEnabled: true,
    reminderTime: '10:00 AM',
    streak: 8,
    consistency: 92,
    history: generateHistory(92, 35),
    createdAt: '2026-04-20',
  },
  {
    id: 'habit-2',
    name: 'Do 5 applications',
    category: 'development',
    frequency: 'Daily',
    goalValue: 5,
    goalUnit: 'Applications',
    reminderEnabled: false,
    reminderTime: '02:00 PM',
    streak: 2,
    consistency: 65,
    history: generateHistory(65, 35),
    createdAt: '2026-04-20',
  },
  {
    id: 'habit-3',
    name: 'Read a concept',
    category: 'learning',
    frequency: 'Daily',
    goalValue: 1,
    goalUnit: 'Concepts',
    reminderEnabled: true,
    reminderTime: '09:00 AM',
    streak: 15,
    consistency: 100,
    history: generateHistory(100, 35),
    createdAt: '2026-04-20',
  },
  {
    id: 'habit-4',
    name: 'Solve problem in leetcode',
    category: 'learning',
    frequency: 'Daily',
    goalValue: 1,
    goalUnit: 'Problems',
    reminderEnabled: true,
    reminderTime: '04:00 PM',
    streak: 4,
    consistency: 80,
    history: generateHistory(80, 35),
    createdAt: '2026-04-20',
  },
  {
    id: 'habit-5',
    name: '10K steps',
    category: 'health',
    frequency: 'Daily',
    goalValue: 10000,
    goalUnit: 'Steps',
    reminderEnabled: true,
    reminderTime: '08:00 AM',
    streak: 7,
    consistency: 85,
    history: generateHistory(85, 35),
    createdAt: '2026-04-20',
  }
];

export const DEFAULT_USER: UserProfile = {
  name: 'Alex Rivers',
  email: 'alex.rivers@serenehabit.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6gSSLypDfgyxr4SK2oFfqXaH1G1MvQbfDTeFs306IztnKQ6jxaUNBmnPbQrsyexAP7cAUaygTI8YKvgaroI9sfNfw3EqWv0-IK9FRuhJvJd3Z9XpJXbNat_Q7lxtMfKcpZ1n2InQqKV0vOyhk6kXM4ZJwPeA00mZ1HjEjkAGxpiaOyalli4Qh0X8FVHWzf-elrSf5IJ4jdxQqmDUTD4NwnLjuvbOzTM6p_AzoNTCJX8N4OqNjduxYNh1oGgXWGhQt2PVvOv8us2U',
};

export const DEFAULT_PREFERENCES: Preferences = {
  dailyReminders: true,
  quietHoursEnabled: true,
  quietHoursStart: '10:00 PM',
  quietHoursEnd: '07:00 AM',
  theme: 'light',
};

// Calculate the current streak of a habit based on its history up to today (May 31, 2026)
export function calculateStreak(history: { [key: string]: boolean }, todayStr: string): number {
  let streak = 0;
  const currDate = new Date(todayStr);
  
  // If completed today, starting counting from today. Else check yesterday
  let checkDate = new Date(currDate);
  
  if (history[todayStr]) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Check if finished yesterday, if not yesterday either, streak is 0
    const yesterday = new Date(currDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    if (history[yesterdayStr]) {
      checkDate = yesterday;
    } else {
      return 0;
    }
  }

  while (true) {
    const checkDateStr = formatDate(checkDate);
    if (history[checkDateStr]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// Calculate consistency (percentage of completion over trailing 30 days)
export function calculateConsistency(history: { [key: string]: boolean }, todayStr: string): number {
  const today = new Date(todayStr);
  let completedCount = 0;
  const daysToCheck = 30;
  
  for (let i = 0; i < daysToCheck; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    if (history[dateStr]) {
      completedCount++;
    }
  }
  
  return Math.round((completedCount / daysToCheck) * 100);
}

// Motivational dynamic messages
export const CONTEMPLATIONS = [
  "Consistency is the bridge between goals and accomplishment.",
  "Small acts, when multiplied by millions of people, can transform the world.",
  "Slow progress is better than no progress. Stay calm and carry on.",
  "Your habits are the daily investments that shape your character.",
  "Be patient with yourself. Self-growth is tender; it's holy ground."
];
