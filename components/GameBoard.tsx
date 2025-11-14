import React from 'react';
import { LetterState, EvaluatedGuess } from '../types';

interface GameBoardProps {
  guesses: EvaluatedGuess[];
  currentGuess: string;
  maxAttempts: number;
  wordLength: number;
  isShaking: boolean;
}

const getTileClass = (state?: LetterState): string => {
    switch (state) {
        case LetterState.CORRECT:
            return 'bg-light-correct dark:bg-dark-correct text-white border-light-correct dark:border-dark-correct';
        case LetterState.MISPLACED:
            return 'bg-light-misplaced dark:bg-dark-misplaced text-white border-light-misplaced dark:border-dark-misplaced';
        case LetterState.INCORRECT:
            return 'bg-light-incorrect dark:bg-dark-incorrect text-white border-light-incorrect dark:border-dark-incorrect';
        default:
            return 'bg-transparent border-gray-400 dark:border-gray-500';
    }
};

export const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentGuess, maxAttempts, wordLength, isShaking }) => {
    const rows = [];

    for (let i = 0; i < maxAttempts; i++) {
        const isCurrentRow = i === guesses.length;
        const guessData = guesses[i];
        
        const tiles = [];
        for (let j = 0; j < wordLength; j++) {
            const letter = isCurrentRow ? currentGuess[j] : (guessData?.guess[j] || '');
            const state = guessData?.evaluation[j];
            const hasLetter = !!letter;

            const tileClasses = getTileClass(state);
            const animationClass = guessData ? 'animate-flip-in' : '';
            const popInClass = hasLetter && isCurrentRow ? 'animate-pop-in' : '';

            tiles.push(
                <div
                    key={j}
                    style={{ animationDelay: `${j * 100}ms` }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold uppercase ${tileClasses} ${animationClass} ${popInClass}`}
                >
                    {letter}
                </div>
            );
        }
        
        const shakeClass = isCurrentRow && isShaking ? 'animate-shake' : '';
        rows.push(<div key={i} className={`grid grid-cols-5 gap-1 sm:gap-1.5 ${shakeClass}`}>{tiles}</div>);
    }

    return (
        <div className="grid grid-rows-3 gap-1 sm:gap-1.5 mb-6 sm:mb-8">
            {rows}
        </div>
    );
};
