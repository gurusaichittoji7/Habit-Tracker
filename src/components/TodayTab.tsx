import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Flame, 
  Plus, 
  Terminal, 
  Send, 
  BookOpen, 
  Code, 
  Activity, 
  Heart,
  Brain,
  Quote,
  Sparkles
} from 'lucide-react';
import { Habit, CategoryType, UserProfile } from '../types';

interface TodayTabProps {
  habits: Habit[];
  profile: UserProfile;
  selectedDate: string;
  onToggleHabit: (habitId: string) => void;
  onNavigateToAddHabit: () => void;
  quote: string;
  onRefreshQuote: () => void;
}

// Function to select category-appropriate Lucide icon
export const getHabitIcon = (habit: Habit) => {
  const name = habit.name.toLowerCase();
  if (name.includes('build') || name.includes('project')) return <Terminal className="h-5 w-5" />;
  if (name.includes('application') || name.includes('apply') || name.includes('send')) return <Send className="h-5 w-5" />;
  if (name.includes('read') || name.includes('concept') || name.includes('book')) return <BookOpen className="h-5 w-5" />;
  if (name.includes('leetcode') || name.includes('solve') || name.includes('problem')) return <Code className="h-5 w-5" />;
  if (name.includes('step') || name.includes('walk') || name.includes('run') || name.includes('10k')) return <Activity className="h-5 w-5" />;

  // Category fallbacks
  switch (habit.category) {
    case 'health':
      return <Heart className="h-5 w-5" />;
    case 'development':
      return <Terminal className="h-5 w-5" />;
    case 'learning':
      return <BookOpen className="h-5 w-5" />;
    case 'creativity':
      return <Sparkles className="h-5 w-5" />;
    default:
      return <Check className="h-5 w-5" />;
  }
};

export const TodayTab: React.FC<TodayTabProps> = ({
  habits,
  profile,
  selectedDate,
  onToggleHabit,
  onNavigateToAddHabit,
  quote,
  onRefreshQuote,
}) => {
  // Compute completion counts
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => !!h.history[selectedDate]).length;
  const completionPercentage = totalHabits > 0 
    ? Math.round((completedHabits / totalHabits) * 100) 
    : 0;

  // Render variables for circular SVG
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="space-y-6 pb-28">
      {/* Dynamic Welcome Heading */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Today • May 31, 2026
          </p>
          <h2 className="font-headline text-2xl font-bold text-on-surface dark:text-neutral-100 italic">
            Hello, {profile.name.split(' ')[0]}
          </h2>
        </div>
        <button
          onClick={onRefreshQuote}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary dark:text-emerald-400 dark:bg-emerald-500/5 dark:border-emerald-500/20 active:scale-95 transition-all"
          title="Refresh daily inspiration"
        >
          <Sparkles className="h-3 w-3" />
          <span>Mindful Quote</span>
        </button>
      </div>

      {/* Hero Circular Progress & Mindful overview */}
      <section className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border-[0.5px] border-outline-variant dark:border-neutral-800 habit-card-shadow flex items-center justify-between gap-4 transition-all hover:border-primary/20 dark:hover:border-emerald-500/20">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Today's Progress
          </h3>
          <p className="font-headline text-3xl font-extrabold text-primary dark:text-emerald-400">
            {completedHabits} <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">of</span> {totalHabits}
          </p>
          <p className="text-xs text-on-surface-variant dark:text-neutral-400 leading-relaxed max-w-[200px]">
            {completionPercentage === 100 
              ? "Magnificent! You've completed everything today! ✨" 
              : completionPercentage > 50 
                ? "You're doing fantastic. Just keep that serene flow going."
                : "A journey of a thousand steps starts right here."}
          </p>
        </div>

        {/* Beautiful Animated SVG Circular Ring */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track ring */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-neutral-100 dark:stroke-neutral-700 fill-transparent"
              strokeWidth="8"
            />
            {/* Animated Active Completion bar */}
            <motion.circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-primary dark:stroke-emerald-500 fill-transparent"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>
          {/* Centered label */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-headline text-lg font-bold text-on-surface dark:text-neutral-100">
              {completionPercentage}%
            </span>
            <span className="text-[9px] uppercase font-semibold text-neutral-400 tracking-wider">
              Done
            </span>
          </div>
        </div>
      </section>

      {/* Intimate Quote Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quote}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="relative overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 p-4 border-[0.5px] border-outline-variant/50 dark:border-neutral-800/50 flex gap-3"
        >
          <Quote className="h-5 w-5 text-primary/30 dark:text-emerald-500/30 shrink-0 rotate-180" />
          <p className="text-xs text-on-surface-variant dark:text-neutral-300 font-medium italic leading-relaxed">
            "{quote}"
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Habit Checklist Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-headline font-semibold text-on-surface dark:text-neutral-200">
            Habit Checklist
          </h4>
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
            {completedHabits}/{totalHabits} completed
          </span>
        </div>

        {totalHabits === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-outline-variant dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-800">
            <p className="text-sm font-medium text-on-surface-variant dark:text-neutral-400">No habits registered for today!</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-[250px] mx-auto">Create a beautiful habit to begin your tracking routine.</p>
            <button
              onClick={onNavigateToAddHabit}
              className="mt-4 px-4 py-2 text-xs font-semibold text-on-primary bg-primary dark:bg-emerald-600 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              Add Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const isCompleted = !!habit.history[selectedDate];
              return (
                <motion.div
                  key={habit.id}
                  layoutId={`habit-layout-${habit.id}`}
                  onClick={() => onToggleHabit(habit.id)}
                  className={`group relative overflow-hidden rounded-2xl border-[0.5px] p-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                    isCompleted
                      ? 'bg-neutral-50/50 dark:bg-neutral-800/40 border-primary/20 dark:border-emerald-500/20 shadow-sm'
                      : 'bg-white dark:bg-neutral-800 border-outline-variant/60 dark:border-neutral-800/60 habit-card-shadow hover:border-primary/20 dark:hover:border-emerald-500/20'
                  }`}
                >
                  {/* Visual indication bar side accent */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1 transition-all ${
                    isCompleted 
                      ? 'bg-primary dark:bg-emerald-500' 
                      : 'bg-neutral-200 dark:bg-neutral-700 opacity-0 group-hover:opacity-100'
                  }`} />

                  {/* Left block information */}
                  <div className="flex items-center gap-4 pl-1">
                    {/* Integrated custom category color background */}
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-primary/10 text-primary dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-secondary-container/20 text-on-secondary-container dark:bg-emerald-950/20 dark:text-emerald-300'
                    }`}>
                      {getHabitIcon(habit)}
                    </div>

                    <div className="space-y-0.5">
                      <p className={`font-headline text-sm font-bold tracking-tight transition-all duration-300 ${
                        isCompleted 
                          ? 'text-neutral-400 dark:text-neutral-500 line-through' 
                          : 'text-on-surface dark:text-neutral-150'
                      }`}>
                        {habit.name}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                          {habit.category}
                        </span>
                        
                        {habit.streak > 0 && (
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-semibold text-[10px]">
                            <Flame className="h-2.5 w-2.5 fill-amber-500 stroke-amber-600 dark:stroke-amber-400" />
                            <span>{habit.streak}d streak</span>
                          </div>
                        )}
                        
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                          • Goal: {habit.goalValue} {habit.goalUnit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right block checkbox item */}
                  <div className="relative shrink-0 pr-1">
                    <motion.div
                      animate={isCompleted ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.3, type: 'spring' }}
                      className={`h-7 w-7 rounded-lg flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? 'bg-primary border-primary dark:bg-emerald-600 dark:border-emerald-600'
                          : 'border-outline-variant dark:border-neutral-700 group-hover:border-primary/60 dark:group-hover:border-emerald-500/60'
                      }`}
                    >
                      {isCompleted && (
                        <Check className="h-4 w-4 stroke-[3px] text-white" />
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Action Added Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <motion.button
          onClick={onNavigateToAddHabit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 dark:bg-emerald-600 dark:shadow-emerald-950/10 hover:opacity-95 focus:outline-none transition-all duration-150"
          aria-label="Add a beautiful new habit"
        >
          <Plus className="h-6 w-6 stroke-[2.5px]" />
        </motion.button>
      </div>
    </div>
  );
};
export default TodayTab;
