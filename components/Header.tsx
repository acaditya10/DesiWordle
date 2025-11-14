
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <header className="w-full p-2 sm:p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
      <h1 className="text-xl sm:text-3xl font-bold tracking-wide sm:tracking-wider">
        THE BEST WORD GAME
      </h1>
      <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </header>
  );
};
