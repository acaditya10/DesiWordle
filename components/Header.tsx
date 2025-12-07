
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  onOpenLeaderboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode, onOpenLeaderboard }) => {
  return (
    <header className="w-full p-3 sm:p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700 bg-light-bg dark:bg-dark-bg z-10 sticky top-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenLeaderboard}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
          title="Leaderboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </button>
        <h1 className="text-lg sm:text-2xl font-bold tracking-wide">
          DESI WORDLE
        </h1>
      </div>
      <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </header>
  );
};
