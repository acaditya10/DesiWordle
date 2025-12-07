
import React, { useState } from 'react';

interface WelcomeModalProps {
  onComplete: (name: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    onComplete(name.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] animate-fade-in backdrop-blur-sm">
      <div className="bg-light-surface dark:bg-dark-surface p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 animate-pop-in border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-light-primary dark:text-dark-primary">
          Welcome to Desi Wordle
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Enter your name to start playing and track your stats on the leaderboard.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:outline-none transition-all"
              autoFocus
              maxLength={15}
            />
            {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-light-primary dark:bg-dark-primary text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Start Playing
          </button>
        </form>
      </div>
    </div>
  );
};
