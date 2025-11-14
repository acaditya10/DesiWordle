
import React from 'react';

interface GameModalProps {
  gameState: 'WON' | 'LOST';
  secretWord: string;
  attempts: number;
  onPlayAgain: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ gameState, secretWord, attempts, onPlayAgain }) => {
  const isWin = gameState === 'WON';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-light-surface dark:bg-dark-surface p-8 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4 animate-pop-in">
        <h2 className={`text-4xl font-extrabold mb-4 ${isWin ? 'text-light-correct dark:text-dark-correct' : 'text-red-500'}`}>
          {isWin ? 'You Won!' : 'Game Over'}
        </h2>
        
        <p className="text-lg mb-2">The word was:</p>
        <div className="text-3xl font-bold tracking-widest text-light-primary dark:text-dark-primary mb-6">
          {secretWord}
        </div>

        {isWin && (
          <p className="mb-6">You guessed it in {attempts} {attempts === 1 ? 'try' : 'tries'}.</p>
        )}
        
        <button
          onClick={onPlayAgain}
          className="w-full py-3 px-6 bg-light-primary dark:bg-dark-primary text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 transition-opacity duration-200 text-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
