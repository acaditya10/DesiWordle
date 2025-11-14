import React from 'react';

interface ScoreBoardProps {
  wins: number;
  losses: number;
  streak: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ wins, losses, streak }) => {
  return (
    <div className="flex justify-center items-center space-x-6 sm:space-x-10 my-2">
      <div className="text-center">
        <p className="text-xl sm:text-2xl font-bold">{wins}</p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 tracking-wider">Wins</p>
      </div>
      <div className="text-center">
        <p className="text-xl sm:text-2xl font-bold">{losses}</p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 tracking-wider">Losses</p>
      </div>
      <div className="text-center">
        <p className="text-xl sm:text-2xl font-bold">{streak}</p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 tracking-wider">Streak</p>
      </div>
    </div>
  );
};
