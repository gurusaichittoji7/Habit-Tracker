import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Moon, 
  ChevronRight, 
  Sun, 
  Laptop, 
  HelpCircle, 
  ShieldAlert, 
  ChevronDown,
  User,
  Mail,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { UserProfile, Preferences } from '../types';

interface SettingsTabProps {
  profile: UserProfile;
  preferences: Preferences;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
  onPreferencesUpdate: (updatedPreferences: Preferences) => void;
  onResetData: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  profile,
  preferences,
  onProfileUpdate,
  onPreferencesUpdate,
  onResetData,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempEmail, setTempEmail] = useState(profile.email);

  const [activeSupportIndex, setActiveSupportIndex] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [quietHoursEditing, setQuietHoursEditing] = useState(false);
  const [tempQuietStart, setTempQuietStart] = useState(preferences.quietHoursStart);
  const [tempQuietEnd, setTempQuietEnd] = useState(preferences.quietHoursEnd);

  // Save profile modifications
  const handleSaveProfile = () => {
    onProfileUpdate({
      ...profile,
      name: tempName,
      email: tempEmail,
    });
    setIsEditingProfile(false);
  };

  // Toggle Preferences toggle reminders
  const handleToggleReminders = () => {
    onPreferencesUpdate({
      ...preferences,
      dailyReminders: !preferences.dailyReminders,
    });
  };

  // Change Appearance
  const handleThemeChange = (themeMode: 'light' | 'dark' | 'system') => {
    onPreferencesUpdate({
      ...preferences,
      theme: themeMode,
    });
  };

  // Save Quiet Hours
  const handleSaveQuietHours = () => {
    onPreferencesUpdate({
      ...preferences,
      quietHoursStart: tempQuietStart,
      quietHoursEnd: tempQuietEnd,
    });
    setQuietHoursEditing(false);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Profile Section */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Profile
        </h3>
        
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border-[0.5px] border-outline-variant/60 dark:border-neutral-800 habit-card-shadow transition-colors">
          <AnimatePresence mode="wait">
            {!isEditingProfile ? (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20 dark:ring-emerald-500/20">
                  <img
                    alt="User Profile"
                    className="w-full h-full object-cover"
                    src={profile.avatarUrl}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-headline text-lg font-bold text-on-surface dark:text-neutral-100">
                    {profile.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant dark:text-neutral-400 font-medium">
                    {profile.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTempName(profile.name);
                    setTempEmail(profile.email);
                    setIsEditingProfile(true);
                  }}
                  className="text-xs font-bold text-primary dark:text-emerald-400 px-3 py-1.5 rounded-full hover:bg-primary/5 dark:hover:bg-emerald-500/5 transition-all"
                >
                  Edit
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="profile-edit"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-700 py-1">
                    <User className="h-4 w-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      className="w-full bg-transparent border-none text-sm text-on-surface dark:text-neutral-100 focus:ring-0 p-0 font-medium"
                      placeholder="Name"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-700 py-1">
                    <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
                    <input
                      type="email"
                      className="w-full bg-transparent border-none text-sm text-on-surface dark:text-neutral-100 focus:ring-0 p-0 font-medium"
                      placeholder="Email Address"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 px-3 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="text-xs font-bold text-white bg-primary dark:bg-emerald-600 px-3.5 py-1.5 rounded-full hover:opacity-95 transition-all flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Preferences
        </h3>
        
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border-[0.5px] border-outline-variant/60 dark:border-neutral-800 habit-card-shadow overflow-hidden transition-colors">
          {/* Daily Reminders row */}
          <div className="p-4 flex items-center justify-between border-b border-outline-variant/10 dark:border-neutral-700/50">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/5 text-primary dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-on-surface dark:text-neutral-150">
                Daily Reminders
              </span>
            </div>
            
            {/* Custom slider toggle */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preferences.dailyReminders}
                onChange={handleToggleReminders}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                preferences.dailyReminders ? 'bg-primary dark:bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}>
                <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm slider-dot pointer-events-none transform ${
                  preferences.dailyReminders ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </label>
          </div>

          {/* Quiet Hours row */}
          <div className="p-4 flex flex-col justify-center gap-2">
            {!quietHoursEditing ? (
              <div 
                onClick={() => {
                  setTempQuietStart(preferences.quietHoursStart);
                  setTempQuietEnd(preferences.quietHoursEnd);
                  setQuietHoursEditing(true);
                }}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/5 text-primary dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-on-surface dark:text-neutral-150">
                      Quiet Hours
                    </span>
                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">
                      {preferences.quietHoursStart} - {preferences.quietHoursEnd}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3">
                  <Moon className="h-4 w-4 text-primary dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-neutral-400">Configure Quiet Range</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pb-1">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">Rest Start</span>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-outline-variant/50 rounded-lg px-2 py-1.5 text-xs font-semibold focus:ring-primary focus:border-primary border-none shadow-sm text-center"
                      value={tempQuietStart}
                      onChange={(e) => setTempQuietStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase">Rest End</span>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border border-outline-variant/50 rounded-lg px-2 py-1.5 text-xs font-semibold focus:ring-primary focus:border-primary border-none shadow-sm text-center"
                      value={tempQuietEnd}
                      onChange={(e) => setTempQuietEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setQuietHoursEditing(false)}
                    className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 px-3 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveQuietHours}
                    className="text-xs font-bold text-white bg-primary dark:bg-emerald-600 px-3.5 py-1 rounded-lg hover:opacity-95 transition-all"
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Appearance
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {/* Light button */}
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all hover:bg-primary/5 focus:outline-none ${
              preferences.theme === 'light'
                ? 'border-primary bg-primary/5 dark:border-emerald-500 dark:bg-emerald-500/5'
                : 'border-outline-variant/50 bg-white dark:bg-neutral-800 dark:border-neutral-800'
            }`}
          >
            <Sun className={`h-5 w-5 ${preferences.theme === 'light' ? 'text-primary dark:text-emerald-400' : 'text-on-surface-variant'}`} />
            <span className="text-xs font-headline font-semibold">Light</span>
          </button>

          {/* Dark button */}
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all hover:bg-primary/5 focus:outline-none ${
              preferences.theme === 'dark'
                ? 'border-primary bg-primary/5 dark:border-emerald-500 dark:bg-emerald-500/5'
                : 'border-outline-variant/50 bg-white dark:bg-neutral-800 dark:border-neutral-800'
            }`}
          >
            <Moon className={`h-5 w-5 ${preferences.theme === 'dark' ? 'text-primary dark:text-emerald-400' : 'text-on-surface-variant'}`} />
            <span className="text-xs font-headline font-semibold">Dark</span>
          </button>

          {/* System button */}
          <button
            onClick={() => handleThemeChange('system')}
            className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all hover:bg-primary/5 focus:outline-none ${
              preferences.theme === 'system'
                ? 'border-primary bg-primary/5 dark:border-emerald-500 dark:bg-emerald-500/5'
                : 'border-outline-variant/50 bg-white dark:bg-neutral-800 dark:border-neutral-800'
            }`}
          >
            <Laptop className={`h-5 w-5 ${preferences.theme === 'system' ? 'text-primary dark:text-emerald-400' : 'text-on-surface-variant'}`} />
            <span className="text-xs font-headline font-semibold">System</span>
          </button>
        </div>
      </section>

      {/* Support Section */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Support Center
        </h3>
        
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border-[0.5px] border-outline-variant/60 dark:border-neutral-800 habit-card-shadow overflow-hidden transition-colors">
          {/* Help Center item */}
          <div className="border-b border-outline-variant/15 dark:border-neutral-700/50">
            <button
              onClick={() => setActiveSupportIndex(activeSupportIndex === 0 ? null : 0)}
              className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-secondary dark:text-emerald-400" />
                <span className="text-sm font-medium text-on-surface dark:text-neutral-100">Help Center</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${activeSupportIndex === 0 ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeSupportIndex === 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-neutral-50/50 dark:bg-neutral-900/10 px-4 pb-4 text-xs text-on-surface-variant dark:text-neutral-400 leading-relaxed space-y-2 border-t border-outline-variant/5 dark:border-neutral-800/50 pt-2"
                >
                  <p><strong>What is Serene Habit?</strong></p>
                  <p>Serene Habit is a soft-minimalist ritual tracking app built to promote mental clarity and sustainable growth without gamified stress.</p>
                  <p><strong>How is Consistency calculated?</strong></p>
                  <p>Consistency is measured as the percentage of completed days over the trailing 30 days. Perfect consistency yields 100%.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Privacy Policy item */}
          <div>
            <button
              onClick={() => setActiveSupportIndex(activeSupportIndex === 1 ? null : 1)}
              className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-secondary dark:text-emerald-400" />
                <span className="text-sm font-medium text-on-surface dark:text-neutral-100">Privacy Policy</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${activeSupportIndex === 1 ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeSupportIndex === 1 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-neutral-50/50 dark:bg-neutral-900/10 px-4 pb-4 text-xs text-on-surface-variant dark:text-neutral-400 leading-relaxed space-y-2 border-t border-outline-variant/5 dark:border-neutral-800/50 pt-2"
                >
                  <p><strong>Your Data is 100% Yours.</strong></p>
                  <p>Serene Habit operates serverless using client-side `localStorage`. We do not track, collect, upload, share, or sell any of your routines, habits, or private email data.</p>
                  <p>Your mind and your habits shouldn't be commodities. Feel secure offline!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Log Out or State Clearing Section */}
      <section className="pt-3 space-y-4">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-4 rounded-2xl border-[0.5px] border-outline-variant dark:border-neutral-800 text-error font-headline font-bold text-sm bg-white dark:bg-neutral-800 hover:bg-error-container/10 dark:hover:bg-rose-950/15 transition-colors active:scale-[0.98] duration-150 relative overflow-hidden"
          >
            Log Out & Clear Cache
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl border border-error bg-error-container/20 dark:bg-rose-950/20 text-center space-y-3"
          >
            <p className="text-xs font-semibold text-error leading-relaxed">
              Are you sure? This will delete all custom habits, completions history, profile updates, and restore default templates.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 active:scale-95 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-error text-white active:scale-95 transition-all outline-none"
              >
                Yes, Reset Clear
              </button>
            </div>
          </motion.div>
        )}
        
        <p className="text-center font-headline text-[11px] text-neutral-400 dark:text-neutral-550 uppercase tracking-widest font-semibold">
          Version 2.4.0 (Build 102)
        </p>
      </section>
    </div>
  );
};
export default SettingsTab;
