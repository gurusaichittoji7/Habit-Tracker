import React from 'react';
import { Sprout, User, ArrowLeft, MoreVertical } from 'lucide-react';

interface HeaderProps {
  title: string;
  onProfileClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onProfileClick,
  onBackClick,
  showBackButton = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b-[0.5px] border-outline-variant bg-surface px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900 transition-colors duration-200">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <button
              onClick={onBackClick}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-surface-low dark:text-emerald-400 dark:hover:bg-neutral-800 transition-colors active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-emerald-500/10">
              <Sprout className="h-6 w-6 text-primary dark:text-emerald-400" />
            </div>
          )}
          <h1 className="font-headline text-xl font-semibold tracking-tight text-primary dark:text-emerald-400">
            {title}
          </h1>
        </div>
        
        <div>
          {showBackButton ? (
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-low dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors active:scale-95">
              <MoreVertical className="h-5 w-5" />
            </button>
          ) : (
            onProfileClick && (
              <button
                onClick={onProfileClick}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-low dark:hover:bg-neutral-800 transition-colors active:scale-95 duration-150"
                aria-label="View Profile Settings"
              >
                <User className="h-6 w-6 text-on-surface-variant dark:text-neutral-300" />
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
