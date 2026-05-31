import { useState, useEffect } from 'react';
import { ActiveTab, Habit, UserProfile, Preferences } from './types';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { TodayTab } from './components/TodayTab';
import { TrendsTab } from './components/TrendsTab';
import { SettingsTab } from './components/SettingsTab';
import { AddHabitTab } from './components/AddHabitTab';
import { 
  DEFAULT_HABITS, 
  DEFAULT_USER, 
  DEFAULT_PREFERENCES, 
  CONTEMPLATIONS,
  formatDate,
  calculateStreak,
  calculateConsistency
} from './utils';

export default function App() {
  // --- Constants ---
  const selectedDate = '2026-05-31'; // Selected anchor date representing Today

  // --- States ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  
  // Loaded from LocalStorage or seeded defaults
  const [habits, setHabits] = useState<Habit[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  
  // Random daily quote
  const [quote, setQuote] = useState(CONTEMPLATIONS[0]);

  // --- Initial Loading State ---
  useEffect(() => {
    // 1. Load Habits
    const cachedHabits = localStorage.getItem('serene_habits');
    if (cachedHabits) {
      try {
        setHabits(JSON.parse(cachedHabits));
      } catch (err) {
        setHabits(DEFAULT_HABITS);
      }
    } else {
      setHabits(DEFAULT_HABITS);
      localStorage.setItem('serene_habits', JSON.stringify(DEFAULT_HABITS));
    }

    // 2. Load Profile
    const cachedProfile = localStorage.getItem('serene_profile');
    if (cachedProfile) {
      try {
        setProfile(JSON.parse(cachedProfile));
      } catch (err) {
        setProfile(DEFAULT_USER);
      }
    } else {
      setProfile(DEFAULT_USER);
    }

    // 3. Load Preferences
    const cachedPrefs = localStorage.getItem('serene_preferences');
    if (cachedPrefs) {
      try {
        const parsed = JSON.parse(cachedPrefs);
        setPreferences(parsed);
      } catch (err) {
        setPreferences(DEFAULT_PREFERENCES);
      }
    } else {
      setPreferences(DEFAULT_PREFERENCES);
    }
  }, []);

  // --- Theme Controller Sync ---
  useEffect(() => {
    const handleThemeSync = () => {
      const { theme } = preferences;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference detection
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    handleThemeSync();

    // Listen to media queries changes if System theme selected
    const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (preferences.theme === 'system') {
        handleThemeSync();
      }
    };

    systemThemeMedia.addEventListener('change', handleSystemChange);
    return () => {
      systemThemeMedia.removeEventListener('change', handleSystemChange);
    };
  }, [preferences.theme]);

  // --- Persistence Side-effects ---
  const saveHabitsToStorage = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    localStorage.setItem('serene_habits', JSON.stringify(updatedHabits));
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('serene_profile', JSON.stringify(updatedProfile));
  };

  const handlePreferencesUpdate = (updatedPrefs: Preferences) => {
    setPreferences(updatedPrefs);
    localStorage.setItem('serene_preferences', JSON.stringify(updatedPrefs));
  };

  // --- Data Handlers ---
  // Toggling habit checkboxes for Today
  const handleToggleHabit = (habitId: string) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const currentComplete = !!h.history[selectedDate];
        const updatedHistory = { ...h.history };

        if (currentComplete) {
          delete updatedHistory[selectedDate];
        } else {
          updatedHistory[selectedDate] = true;
        }

        // Recompute analytics recursively
        const currentStreak = calculateStreak(updatedHistory, selectedDate);
        const consistencyRating = calculateConsistency(updatedHistory, selectedDate);

        return {
          ...h,
          history: updatedHistory,
          streak: currentStreak,
          consistency: consistencyRating,
        };
      }
      return h;
    });

    saveHabitsToStorage(updated);
  };

  // Creating a new mindful custom habit
  const handleAddHabit = (newHabitObj: Omit<Habit, 'id' | 'streak' | 'history' | 'consistency' | 'createdAt'>) => {
    const freshHabitObj: Habit = {
      id: `habit-${Date.now()}`,
      streak: 0,
      consistency: 0,
      history: {},
      createdAt: selectedDate,
      ...newHabitObj,
    };

    const updated = [...habits, freshHabitObj];
    saveHabitsToStorage(updated);
    setActiveTab('today');
  };

  // Profile Log Out / Clearing Cache
  const handleResetData = () => {
    localStorage.removeItem('serene_habits');
    localStorage.removeItem('serene_profile');
    localStorage.removeItem('serene_preferences');
    
    setHabits(DEFAULT_HABITS);
    setProfile(DEFAULT_USER);
    setPreferences(DEFAULT_PREFERENCES);
    setActiveTab('today');
  };

  // Random quotes dispatcher
  const handleRefreshQuote = () => {
    const filtered = CONTEMPLATIONS.filter(q => q !== quote);
    const randomIdx = Math.floor(Math.random() * filtered.length);
    setQuote(filtered[randomIdx]);
  };

  // Header Title Adapter
  const getHeaderTitle = (): string => {
    switch (activeTab) {
      case 'today':
        return 'Today';
      case 'trends':
        return 'Trends';
      case 'settings':
        return 'Settings';
      case 'add_habit':
        return 'Add Habit';
      default:
        return 'Serene Habit';
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-neutral-900 text-on-surface dark:text-neutral-200 flex flex-col transition-colors duration-300">
      
      {/* Central Header Component */}
      <Header
        title={getHeaderTitle()}
        onProfileClick={() => setActiveTab('settings')}
        onBackClick={() => setActiveTab('today')}
        showBackButton={activeTab === 'add_habit'}
      />

      {/* Main Tab/Content Body Area */}
      <main className="flex-grow max-w-2xl w-full mx-auto px-6 pt-6 pb-24">
        {activeTab === 'today' && (
          <TodayTab
            habits={habits}
            profile={profile}
            selectedDate={selectedDate}
            onToggleHabit={handleToggleHabit}
            onNavigateToAddHabit={() => setActiveTab('add_habit')}
            quote={quote}
            onRefreshQuote={handleRefreshQuote}
          />
        )}

        {activeTab === 'trends' && (
          <TrendsTab
            habits={habits}
            currentDateStr={selectedDate}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            profile={profile}
            preferences={preferences}
            onProfileUpdate={handleProfileUpdate}
            onPreferencesUpdate={handlePreferencesUpdate}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'add_habit' && (
          <AddHabitTab
            onAddHabit={handleAddHabit}
            onCancel={() => setActiveTab('today')}
          />
        )}
      </main>

      {/* Persistent Fluid Navigation bar bottom drawer */}
      <BottomNavBar
        activeTab={activeTab === 'add_habit' ? 'today' : activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
