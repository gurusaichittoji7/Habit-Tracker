import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Terminal, 
  BookOpen, 
  Palette, 
  Flag, 
  Calendar as CalendarIcon, 
  Bell, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Habit, CategoryType } from '../types';

interface AddHabitTabProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'streak' | 'history' | 'consistency' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const AddHabitTab: React.FC<AddHabitTabProps> = ({ onAddHabit, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('health');
  
  const [frequency, setFrequency] = useState('Daily');
  const [goalValue, setGoalValue] = useState<number>(30);
  const [goalUnit, setGoalUnit] = useState('Minutes');
  
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00'); // HTML time input layout
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setErrorMsg('Please write a beautiful name for your habit! ✨');
      return;
    }
    
    setErrorMsg(null);
    
    // Format reminder output nicely (e.g., '08:00 AM')
    const formatTimeWithPeriod = (timeStr: string): string => {
      const [hoursStr, minutesStr] = timeStr.split(':');
      const hours = parseInt(hoursStr);
      const isAm = hours < 12;
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const period = isAm ? 'AM' : 'PM';
      return `${String(formattedHours).padStart(2, '0')}:${minutesStr} ${period}`;
    };

    onAddHabit({
      name: name.trim(),
      category,
      frequency,
      goalValue: Number(goalValue) || 1,
      goalUnit,
      reminderEnabled,
      reminderTime: formatTimeWithPeriod(reminderTime),
    });
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Visual top bar header or inline spacing */}
      <div className="text-center md:text-left space-y-1">
        <h2 className="font-headline text-lg font-bold text-on-surface dark:text-neutral-100 italic">
          Design a sustainable habit
        </h2>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
          Routines shape your environment. Begin small, persist gently.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Habit Name Input */}
        <section className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">
            Habit Name
          </label>
          <input
            type="text"
            className="w-full bg-transparent border-0 border-b-[1.5px] border-outline-variant focus:border-primary focus:ring-0 px-0 py-2.5 font-headline text-2xl text-on-surface dark:text-neutral-100 placeholder:text-outline-variant dark:border-neutral-700 dark:focus:border-emerald-500 transition-all outline-none"
            placeholder="e.g., Morning Meditation"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
          />
        </section>

        {/* Category Row Chips */}
        <section className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">
            Category
          </label>
          <div className="flex flex-wrap gap-2.5 select-none">
            {/* Health */}
            <button
              type="button"
              onClick={() => setCategory('health')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-headline font-semibold uppercase tracking-wider transition-all duration-200 outline-none ${
                category === 'health'
                  ? 'bg-primary border-primary text-white dark:bg-emerald-600 dark:border-emerald-600'
                  : 'bg-white border-outline-variant/65 text-on-surface-variant hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700/60 dark:text-neutral-300 dark:hover:bg-neutral-700/40'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Health</span>
            </button>

            {/* Development */}
            <button
              type="button"
              onClick={() => setCategory('development')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-headline font-semibold uppercase tracking-wider transition-all duration-200 outline-none ${
                category === 'development'
                  ? 'bg-primary border-primary text-white dark:bg-emerald-600 dark:border-emerald-600'
                  : 'bg-white border-outline-variant/65 text-on-surface-variant hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700/60 dark:text-neutral-300 dark:hover:bg-neutral-700/40'
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>Development</span>
            </button>

            {/* Learning */}
            <button
              type="button"
              onClick={() => setCategory('learning')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-headline font-semibold uppercase tracking-wider transition-all duration-200 outline-none ${
                category === 'learning'
                  ? 'bg-primary border-primary text-white dark:bg-emerald-600 dark:border-emerald-600'
                  : 'bg-white border-outline-variant/65 text-on-surface-variant hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700/60 dark:text-neutral-300 dark:hover:bg-neutral-700/40'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Learning</span>
            </button>

            {/* Creativity */}
            <button
              type="button"
              onClick={() => setCategory('creativity')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-headline font-semibold uppercase tracking-wider transition-all duration-200 outline-none ${
                category === 'creativity'
                  ? 'bg-primary border-primary text-white dark:bg-emerald-600 dark:border-emerald-600'
                  : 'bg-white border-outline-variant/65 text-on-surface-variant hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700/60 dark:text-neutral-300 dark:hover:bg-neutral-700/40'
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>Creativity</span>
            </button>
          </div>
        </section>

        {/* Asymmetrical Grid: Frequency & Goal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Frequency Card */}
          <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-outline-variant/40 dark:border-neutral-800 space-y-3 shadow-sm select-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-555">
                Frequency
              </span>
              <CalendarIcon className="h-4 w-4 text-primary dark:text-emerald-400 opacity-60" />
            </div>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-transparent border-none text-base font-medium text-on-surface dark:text-neutral-100 focus:ring-0 p-0 cursor-pointer outline-none"
            >
              <option className="dark:bg-neutral-800" value="Daily">Daily</option>
              <option className="dark:bg-neutral-800" value="Weekly">Weekly</option>
              <option className="dark:bg-neutral-800" value="Specific Days">Specific Days</option>
            </select>
          </div>

          {/* Goal Card */}
          <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-outline-variant/40 dark:border-neutral-800 space-y-3 shadow-sm select-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-555">
                Daily Goal
              </span>
              <Flag className="h-4 w-4 text-primary dark:text-emerald-400 opacity-60" />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                className="w-16 bg-neutral-50 dark:bg-neutral-900 focus:bg-transparent text-center border border-outline-variant/40 dark:border-neutral-700 rounded-lg px-2 py-1 text-sm font-semibold focus:ring-primary focus:border-primary focus:outline-none shrink-0"
                value={goalValue}
                onChange={(e) => setGoalValue(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <select
                value={goalUnit}
                onChange={(e) => setGoalUnit(e.target.value)}
                className="flex-grow bg-transparent border-none text-sm font-medium text-on-surface dark:text-neutral-100 focus:ring-0 p-0 cursor-pointer outline-none"
              >
                <option className="dark:bg-neutral-800" value="Minutes">Minutes</option>
                <option className="dark:bg-neutral-800" value="Hours">Hours</option>
                <option className="dark:bg-neutral-800" value="Steps">Steps</option>
                <option className="dark:bg-neutral-800" value="Sessions">Sessions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reminder Box */}
        <section className="bg-primary/5 dark:bg-neutral-800/40 p-5 rounded-2xl border border-primary/10 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/15 text-primary dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-headline text-sm font-bold text-on-surface dark:text-neutral-100">
                  Daily Reminder
                </h4>
                <p className="text-[11px] text-on-surface-variant dark:text-neutral-400 leading-tight">
                  Get a gentle nudge to stay on track
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={() => setReminderEnabled(!reminderEnabled)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                reminderEnabled ? 'bg-primary dark:bg-emerald-600' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}>
                <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm slider-dot pointer-events-none transform ${
                  reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </div>
            </label>
          </div>

          {reminderEnabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="flex justify-center pt-2 overflow-hidden"
            >
              <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 px-5 py-2.5 rounded-xl border border-outline-variant/30 dark:border-neutral-750 shadow-sm">
                <Clock className="h-4 w-4 text-primary dark:text-emerald-400" />
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="font-headline text-lg font-bold text-primary dark:text-emerald-400 bg-transparent border-none p-0 focus:ring-0 cursor-pointer outline-none w-20"
                />
              </div>
            </motion.div>
          )}
        </section>

        {/* Visual Inspiration Card */}
        <section className="relative overflow-hidden rounded-2xl aspect-[16/7] group select-none shadow-md">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Linen Curtian filtered morning sunlight zen garden"
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSj_SYJAa3qj4Hq7qzXVIBvFqdUwQXEGXYxeuAeH04rXzpVi4iLEX1QLjzkEhCwhQTNxURPncJDmR9dg_aU27wSC_xUw6uCpNy-TB6HETd86Y15AmEc4qUrtcnfwd2MLsrtv956VHBrkkI_iB4LTZuyBZWtgNKr2AMjXp3k3a-jPKrQnZQL1OsYA9wC5FnYkVeHQTf3QgnYd-FJKWsjSCT3a_p-E-RrLMDHW-IzIvu6_ap9DYQjMJ7d0TI6cS3hq7ccyFP7QEwtcQ"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/10 to-transparent flex flex-col justify-end p-4">
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-neutral-200 opacity-80">
              Reflection
            </span>
            <p className="text-white font-headline text-xs md:text-sm font-semibold italic leading-snug mt-1">
              "Consistency is the bridge between goals and accomplishment."
            </p>
          </div>
        </section>

        {/* Error reporting popup alert block */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-4 py-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30 text-xs font-semibold">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Persistent Bottom floated action bar */}
        <div className="fixed bottom-24 left-0 right-0 px-6 z-40 max-w-2xl mx-auto">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white h-14 rounded-full font-headline font-bold text-sm shadow-xl shadow-primary/20 dark:bg-emerald-600 dark:shadow-emerald-950/10 hover:opacity-[0.98] outline-none flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Create Habit</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
};
export default AddHabitTab;
