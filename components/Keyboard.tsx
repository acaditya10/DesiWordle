import React from 'react';
import { LetterState, KeyStateMap } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStates: KeyStateMap;
}

const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

const getKeyClass = (state?: LetterState): string => {
    switch (state) {
        case LetterState.CORRECT:
            return 'bg-light-correct dark:bg-dark-correct text-white';
        case LetterState.MISPLACED:
            return 'bg-light-misplaced dark:bg-dark-misplaced text-white';
        case LetterState.INCORRECT:
            return 'bg-light-incorrect dark:bg-dark-incorrect text-white';
        default:
            return 'bg-gray-300 dark:bg-gray-500 hover:bg-gray-400 dark:hover:bg-gray-600';
    }
};

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyStates }) => {
  return (
    <div className="w-full max-w-lg mx-auto p-1 sm:p-2 mb-2 sm:mb-4">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5 my-1 sm:my-1.5">
          {row.map(key => {
            const isSpecialKey = key === 'Enter' || key === 'Backspace';
            const keyState = keyStates[key];
            const baseClasses = "h-12 sm:h-14 flex items-center justify-center rounded-md font-semibold cursor-pointer transition-colors duration-200";
            const sizeClass = isSpecialKey ? 'px-2 sm:px-4 text-xs sm:text-sm flex-grow' : 'w-7 sm:w-9 md:w-11 text-sm sm:text-base md:text-lg';
            const colorClass = getKeyClass(keyState);

            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`${baseClasses} ${sizeClass} ${colorClass}`}
              >
                {key === 'Backspace' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
