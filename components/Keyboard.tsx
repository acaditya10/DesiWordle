
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
            return 'bg-light-correct/80 dark:bg-dark-correct/80 text-white border-white/20';
        case LetterState.MISPLACED:
            return 'bg-light-misplaced/80 dark:bg-dark-misplaced/80 text-white border-white/20';
        case LetterState.INCORRECT:
            return 'bg-light-incorrect/60 dark:bg-dark-incorrect/60 text-white/70 border-white/5';
        default:
            return 'bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 text-light-text dark:text-dark-text border-white/10 dark:border-white/5';
    }
};

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyStates }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 mb-4 sm:mb-8 rounded-2xl bg-white/5 dark:bg-black/10 backdrop-blur-xl border border-white/10 shadow-2xl">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5 sm:gap-2 my-1.5 sm:my-2">
          {row.map(key => {
            const isSpecialKey = key === 'Enter' || key === 'Backspace';
            const keyState = keyStates[key];
            
            const baseClasses = "h-12 sm:h-14 flex items-center justify-center rounded-xl font-bold cursor-pointer transition-all duration-200 active:scale-95 backdrop-blur-md border shadow-sm";
            const sizeClass = isSpecialKey ? 'px-3 sm:px-6 text-xs sm:text-sm flex-grow' : 'w-8 sm:w-10 md:w-12 text-sm sm:text-lg';
            const colorClass = getKeyClass(keyState);

            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`${baseClasses} ${sizeClass} ${colorClass}`}
              >
                {key === 'Backspace' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
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
