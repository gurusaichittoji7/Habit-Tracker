import React from 'react';
import { Calendar, BarChart3, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-[0.5px] border-outline-variant/30 bg-surface/80 dark:bg-neutral-900/80 dark:border-neutral-800 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-20 max-w-2xl items-center justify-around px-6 pb-2">
        {/* Today Tab */}
        <button
          onClick={() => onTabChange('today')}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-1.5 transition-all duration-200 ${
            activeTab === 'today'
              ? 'text-primary dark:text-emerald-400 font-semibold'
              : 'text-on-surface-variant hover:text-primary dark:text-neutral-400 dark:hover:text-emerald-400'
          }`}
        >
          <Calendar className={`h-5 w-5 ${activeTab === 'today' ? 'scale-110 stroke-[2.5px]' : ''}`} />
          <span className="font-headline text-[11px] uppercase tracking-wider">Today</span>
        </button>

        {/* Trends Tab */}
        <button
          onClick={() => onTabChange('trends')}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-1.5 transition-all duration-200 ${
            activeTab === 'trends'
              ? 'text-primary dark:text-emerald-400 font-semibold'
              : 'text-on-surface-variant hover:text-primary dark:text-neutral-400 dark:hover:text-emerald-400'
          }`}
        >
          <BarChart3 className={`h-5 w-5 ${activeTab === 'trends' ? 'scale-110 stroke-[2.5px]' : ''}`} />
          <span className="font-headline text-[11px] uppercase tracking-wider">Trends</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-1.5 transition-all duration-200 ${
            activeTab === 'settings'
              ? 'text-primary dark:text-emerald-400 font-semibold'
              : 'text-on-surface-variant hover:text-primary dark:text-neutral-400 dark:hover:text-emerald-400'
          }`}
        >
          <Settings className={`h-5 w-5 ${activeTab === 'settings' ? 'scale-110 stroke-[2.5px]' : ''}`} />
          <span className="font-headline text-[11px] uppercase tracking-wider">Settings</span>
        </button>
      </div>
    </nav>
  );
};
export default BottomNavBar;
