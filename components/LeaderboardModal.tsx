
import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  currentUserName: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, entries, currentUserName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-light-surface dark:bg-dark-surface p-6 rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.699-3.181a1 1 0 011.827 1.035L17.47 5.88l1.373 3.205a1 1 0 01-1.054 1.39h-2.298l-1.02 6.118a1 1 0 01-1.964-.325L12.98 11.5H7.02l.473 4.768a1 1 0 01-1.964.325L4.509 10.47H2.211a1 1 0 01-1.054-1.39l1.373-3.205L1.52 3.856a1 1 0 011.827-1.035l1.699 3.181L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Leaderboard
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {entries.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No records yet. Be the first!</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-sm uppercase text-gray-500 dark:text-gray-400">
                  <th className="py-2 px-3 font-semibold text-center w-12">#</th>
                  <th className="py-2 px-3 font-semibold">Player</th>
                  <th className="py-2 px-3 font-semibold text-right">Max Streak</th>
                  <th className="py-2 px-3 font-semibold text-right">Wins</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => {
                  const isCurrentUser = entry.name === currentUserName;
                  return (
                    <tr 
                      key={`${entry.name}-${index}`} 
                      className={`
                        border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors
                        ${isCurrentUser ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                      `}
                    >
                      <td className="py-3 px-3 text-center font-mono font-bold text-gray-400">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </td>
                      <td className={`py-3 px-3 font-medium ${isCurrentUser ? 'text-light-primary dark:text-dark-primary' : ''}`}>
                        {entry.name} {isCurrentUser && '(You)'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-orange-500">
                        {entry.maxStreak}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-600 dark:text-gray-400">
                        {entry.wins}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
