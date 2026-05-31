import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Star, Award, Sparkles, Sprout } from 'lucide-react';
import { Habit } from '../types';
import { getHabitIcon } from './TodayTab';
import { formatDate } from '../utils';

interface TrendsTabProps {
  habits: Habit[];
  currentDateStr: string;
}

type PeriodType = 'week' | 'month' | 'year';

export const TrendsTab: React.FC<TrendsTabProps> = ({ habits, currentDateStr }) => {
  const [period, setPeriod] = useState<PeriodType>('week');
  const [hoveredDay, setHoveredDay] = useState<{ date: string; rate: number; count: number } | null>(null);

  // Parse trailing stats
  const totalTrailingDays = period === 'week' ? 7 : period === 'month' ? 30 : 90;
  
  // Calculate average overall completion rate dynamically for selected period
  const calculatePeriodAverage = (): number => {
    if (habits.length === 0) return 0;
    let totalScheduledOccurrences = 0;
    let completedOccurrences = 0;
    
    const anchorDate = new Date(currentDateStr);
    for (let i = 0; i < totalTrailingDays; i++) {
      const d = new Date(anchorDate);
      d.setDate(anchorDate.getDate() - i);
      const dStr = formatDate(d);
      
      habits.forEach(h => {
        totalScheduledOccurrences++;
        if (h.history[dStr]) {
          completedOccurrences++;
        }
      });
    }
    
    return totalScheduledOccurrences > 0 
      ? Math.round((completedOccurrences / totalScheduledOccurrences) * 100)
      : 0;
  };

  const periodAvg = calculatePeriodAverage();

  // Custom difference stat for period
  const diffPctStr = period === 'week' ? '+12% vs last week' : period === 'month' ? '+4% vs last month' : '+7% vs last quarter';

  // Make list of trailing days in current week (Monday - Sunday) up to 2026-05-31
  // Day names: M, T, W, T, F, S, S
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const getWeeklyCompletions = () => {
    const today = new Date(currentDateStr); // Sunday
    const scores: { label: string; pct: number }[] = [];
    
    // We want Monday (May 25) to Sunday (May 31)
    // Sunday is index 6. Let's calculate dates from May 25 to May 31
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      const diffFromSunday = i - 6; // sunday is i=6
      d.setDate(today.getDate() + diffFromSunday);
      
      const dStr = formatDate(d);
      const completedOnDay = habits.filter(h => !!h.history[dStr]).length;
      const totalOnDay = habits.length;
      const pct = totalOnDay > 0 ? Math.round((completedOnDay / totalOnDay) * 100) : 0;
      
      scores.push({
        label: weekDays[i],
        pct,
      });
    }
    return scores;
  };

  const weeklyScores = getWeeklyCompletions();

  // Create custom 28-square heatmap info (4 weeks trailing up to May 31, 2026)
  const getHeatmapData = () => {
    const anchor = new Date(currentDateStr);
    const data: { dateStr: string; dateLabel: string; pct: number; completedCount: number }[] = [];
    
    for (let i = 27; i >= 0; i--) {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() - i);
      const dStr = formatDate(d);
      const completes = habits.filter(h => !!h.history[dStr]).length;
      const total = habits.length;
      const p = total > 0 ? Math.round((completes / total) * 100) : 0;
      
      data.push({
        dateStr: dStr,
        dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        pct: p,
        completedCount: completes,
      });
    }
    return data;
  };

  const heatmapSquares = getHeatmapData();

  return (
    <div className="space-y-6 pb-28">
      {/* Tab/Period Pill Selector */}
      <div className="bg-surface-low dark:bg-neutral-800 p-1.5 rounded-full flex items-center shadow-sm max-w-md mx-auto border border-outline-variant/30 dark:border-neutral-700 transition-colors">
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 py-2 px-4 rounded-full font-headline text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            period === 'week'
              ? 'bg-primary text-white shadow-sm dark:bg-emerald-600'
              : 'text-on-surface-variant hover:bg-surface-base dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-2 px-4 rounded-full font-headline text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            period === 'month'
              ? 'bg-primary text-white shadow-sm dark:bg-emerald-600'
              : 'text-on-surface-variant hover:bg-surface-base dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`flex-1 py-2 px-4 rounded-full font-headline text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            period === 'year'
              ? 'bg-primary text-white shadow-sm dark:bg-emerald-600'
              : 'text-on-surface-variant hover:bg-surface-base dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          Year
        </button>
      </div>

      {/* Completion Analytics Card */}
      <section className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border-[0.5px] border-outline-variant dark:border-neutral-800 habit-card-shadow transition-colors">
        <div className="flex justify-between items-end mb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-neutral-550 uppercase">
              AVG. COMPLETION
            </p>
            <h2 className="font-headline text-4xl font-extrabold text-primary dark:text-emerald-400">
              {periodAvg}%
            </h2>
          </div>
          <div className="text-right">
            <p className="text-secondary dark:text-emerald-400 font-headline text-xs font-semibold tracking-wide bg-secondary-container/25 dark:bg-emerald-900/10 px-2.5 py-1 rounded-full border border-secondary-container/30 dark:border-emerald-500/10">
              {diffPctStr}
            </p>
          </div>
        </div>

        {/* Minimalist Bar Chart */}
        <div className="flex items-end justify-between h-32 gap-3 mt-4 px-2 select-none">
          {weeklyScores.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 gap-2.5">
              {/* Outer Capsule */}
              <div className="w-full bg-primary/10 dark:bg-neutral-700 rounded-full h-24 relative overflow-hidden group">
                {/* Colored dynamic fill */}
                <motion.div
                  className="absolute bottom-0 w-full bg-primary dark:bg-emerald-600 rounded-full cursor-pointer"
                  initial={{ height: 0 }}
                  animate={{ height: `${day.pct}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                  whileHover={{ filter: 'brightness(1.1)' }}
                  title={`${day.pct}% Completed`}
                />
              </div>
              <span className="text-[11px] font-headline font-bold text-neutral-400 dark:text-neutral-500">
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Habit Breakdown List */}
      <section className="space-y-3">
        <h3 className="font-headline font-semibold text-lg text-on-surface dark:text-neutral-200">
          Habit Breakdown
        </h3>
        
        {habits.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 text-xs">No habits logged yet.</div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border-[0.5px] border-outline-variant/60 dark:border-neutral-800 habit-card-shadow flex items-center justify-between group hover:border-primary/20 dark:hover:border-emerald-500/20 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Category icon with subtle green outline */}
                  <div className="w-10 h-10 rounded-full bg-secondary-container/15 text-primary dark:bg-emerald-500/10 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-secondary-container/25 dark:border-emerald-500/10">
                    {getHabitIcon(habit)}
                  </div>
                  <div>
                    <h4 className="font-headline text-sm font-bold text-on-surface dark:text-neutral-200">
                      {habit.name}
                    </h4>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">
                      Consistency: {habit.consistency}%
                    </p>
                  </div>
                </div>

                {/* Right side slim horizontal progress indicator capsules */}
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 w-20 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden shrink-0">
                    <motion.div
                      className="h-full bg-primary dark:bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${habit.consistency}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-primary dark:text-emerald-400 w-8 text-right font-headline">
                    {habit.consistency}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Monthly Activity Heatmap section */}
      <section className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border-[0.5px] border-outline-variant dark:border-neutral-800 habit-card-shadow transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-headline font-semibold text-sm text-on-surface dark:text-neutral-200">
              Monthly Activity
            </h3>
            <p className="text-[10px] text-neutral-400 tracking-wide dark:text-neutral-500 mt-0.5">
              All habits consistency over the last 4 weeks
            </p>
          </div>
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
            May 2026
          </span>
        </div>

        {/* Dynamic Tooltip Display anchor above grid */}
        <div className="h-6 mb-2">
          {hoveredDay ? (
            <p className="text-[11px] font-medium text-primary dark:text-emerald-400 bg-primary/5 dark:bg-emerald-500/5 px-2 py-0.5 rounded-full inline-block border border-primary/20 dark:border-emerald-500/10">
              <strong>{hoveredDay.dateLabel}</strong>: {hoveredDay.completedCount} / {habits.length} habits completed ({hoveredDay.pct}%)
            </p>
          ) : (
            <p className="text-[11px] text-neutral-400 dark:text-neutral-550 italic">
              Hover over squares to see daily details
            </p>
          )}
        </div>

        {/* Dynamic Heatmap cells representation */}
        <div className="grid grid-cols-7 gap-2">
          {heatmapSquares.map((sq, index) => {
            // Determine background opacity based on completion rate
            let bgStyle = 'bg-neutral-100 dark:bg-neutral-700';
            if (sq.pct > 0) {
              if (sq.pct <= 25) bgStyle = 'bg-primary/20 dark:bg-emerald-600/20';
              else if (sq.pct <= 50) bgStyle = 'bg-primary/40 dark:bg-emerald-600/40';
              else if (sq.pct <= 75) bgStyle = 'bg-primary/70 dark:bg-emerald-600/70';
              else bgStyle = 'bg-primary dark:bg-emerald-600';
            }

            return (
              <motion.div
                key={index}
                className={`aspect-square rounded-lg ${bgStyle} cursor-pointer relative`}
                type="button"
                whileHover={{ scale: 1.12, zIndex: 10 }}
                onMouseEnter={() => setHoveredDay({ date: sq.dateStr, rate: sq.pct, count: sq.completedCount, ...sq })}
                onMouseLeave={() => setHoveredDay(null)}
                transition={{ duration: 0.15 }}
              />
            );
          })}
        </div>

        {/* Heatmap Legend */}
        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-700 pt-3">
          <div className="flex items-center gap-1">
            <Sprout className="h-4 w-4 text-primary dark:text-emerald-400" />
            <span className="text-[10px] text-neutral-400 font-semibold dark:text-neutral-500 uppercase tracking-widest">Digital Zen Grid</span>
          </div>
          
          <div className="flex items-center gap-1.5 self-end">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-wider">Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded bg-neutral-100 dark:bg-neutral-700"></div>
              <div className="w-3 h-3 rounded bg-primary/20 dark:bg-emerald-600/20"></div>
              <div className="w-3 h-3 rounded bg-primary/45 dark:bg-emerald-600/40"></div>
              <div className="w-3 h-3 rounded bg-primary/75 dark:bg-emerald-600/70"></div>
              <div className="w-3 h-3 rounded bg-primary dark:bg-emerald-600"></div>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-wider">More</span>
          </div>
        </div>
      </section>
    </div>
  );
};
export default TrendsTab;
