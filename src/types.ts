export type CategoryType = 'health' | 'development' | 'learning' | 'creativity';

export interface Habit {
  id: string;
  name: string;
  category: CategoryType;
  frequency: string;
  goalValue: number;
  goalUnit: string;
  reminderEnabled: boolean;
  reminderTime: string;
  streak: number;
  consistency: number; // e.g. 92
  history: { [dateStr: string]: boolean }; // e.g. '2026-05-31': true
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Preferences {
  dailyReminders: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  theme: 'light' | 'dark' | 'system';
}

export type ActiveTab = 'today' | 'trends' | 'settings' | 'add_habit';
