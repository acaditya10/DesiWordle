
import React from 'react';

interface ScoreBoardProps {
  wins: number;
  losses: number;
  streak: number;
  maxStreak: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ wins, losses, streak, maxStreak }) => {
  return (
    <div className="flex justify-center items-center gap-4 sm:gap-8 my-2 px-2">
      <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-lg p-2 min-w-[70px]">
        <p className="text-lg sm:text-xl font-bold">{wins}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wins</p>
      </div>
      <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-lg p-2 min-w-[70px]">
        <p className="text-lg sm:text-xl font-bold">{streak}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Streak</p>
      </div>
       <div className="text-center bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2 min-w-[70px] border border-yellow-200 dark:border-yellow-800">
        <p className="text-lg sm:text-xl font-bold text-yellow-700 dark:text-yellow-500">{maxStreak}</p>
        <p className="text-[10px] sm:text-xs text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Max</p>
      </div>
    </div>
  );
};
