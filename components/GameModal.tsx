
import React, { useState } from 'react';
import { EvaluatedGuess, LetterState } from '../types';

interface GameModalProps {
  gameState: 'WON' | 'LOST';
  secretWord: string;
  guesses: EvaluatedGuess[];
  onPlayAgain: () => void;
  isDarkMode: boolean;
}

export const GameModal: React.FC<GameModalProps> = ({ gameState, secretWord, guesses, onPlayAgain, isDarkMode }) => {
  const isWin = gameState === 'WON';
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = 2; // For higher resolution
      const width = 600;
      // Height depends on number of guesses + header/footer
      const headerHeight = 160;
      const rowHeight = 70;
      const footerHeight = 100;
      const height = headerHeight + (guesses.length * rowHeight) + footerHeight + 20;

      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // Background
      ctx.fillStyle = isDarkMode ? '#121212' : '#f5f5f5';
      ctx.fillRect(0, 0, width, height);

      // Title
      ctx.fillStyle = isDarkMode ? '#e0e0e0' : '#121212';
      ctx.font = 'bold 40px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DESI WORDLE', width / 2, 60);

      // Result Text
      ctx.font = '24px sans-serif';
      ctx.fillStyle = isDarkMode ? '#a0a0a0' : '#606060';
      const dateStr = new Date().toLocaleDateString();
      const resultText = isWin 
        ? `Won in ${guesses.length}/3 • ${dateStr}`
        : `Better luck next time • ${dateStr}`;
      ctx.fillText(resultText, width / 2, 100);

      // Grid
      const boxSize = 50;
      const gap = 10;
      const startX = (width - (5 * boxSize + 4 * gap)) / 2;
      const startY = 140;

      const colors = {
        correct: isDarkMode ? '#538d4e' : '#6aaa64',
        misplaced: isDarkMode ? '#b59f3b' : '#c9b458',
        incorrect: isDarkMode ? '#3a3a3c' : '#787c7e',
        text: '#ffffff'
      };

      guesses.forEach((guessRow, rowIndex) => {
        guessRow.evaluation.forEach((state, colIndex) => {
          const x = startX + colIndex * (boxSize + gap);
          const y = startY + rowIndex * (boxSize + gap); // Vertical gap logic
          
          let fill = colors.incorrect;
          if (state === LetterState.CORRECT) fill = colors.correct;
          if (state === LetterState.MISPLACED) fill = colors.misplaced;

          // Draw rounded rect
          ctx.fillStyle = fill;
          ctx.beginPath();
          ctx.roundRect(x, y, boxSize, boxSize, 8);
          ctx.fill();

          // Draw Letter
          ctx.fillStyle = colors.text;
          ctx.font = 'bold 28px sans-serif';
          ctx.textBaseline = 'middle';
          ctx.fillText(guessRow.guess[colIndex], x + boxSize / 2, y + boxSize / 2 + 2);
        });
      });

      // Footer / Secret Word (if lost)
      const footerY = startY + (guesses.length * (boxSize + gap)) + 40;
      
      if (!isWin) {
        ctx.fillStyle = isDarkMode ? '#bb86fc' : '#6200ee';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(`Word was: ${secretWord}`, width / 2, footerY);
      } else {
         ctx.fillStyle = colors.correct;
         ctx.font = 'bold 30px sans-serif';
         ctx.fillText('Great Job!', width / 2, footerY);
      }
      
      // Credit
      ctx.fillStyle = isDarkMode ? '#555' : '#aaa';
      ctx.font = '16px sans-serif';
      ctx.fillText('made by Aditya Chandra', width / 2, height - 30);


      // Export
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `desi-wordle-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to generate image', e);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
      <div className="bg-light-surface dark:bg-dark-surface p-8 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4 animate-pop-in border border-gray-200 dark:border-gray-700">
        <h2 className={`text-4xl font-extrabold mb-4 ${isWin ? 'text-light-correct dark:text-dark-correct' : 'text-red-500'}`}>
          {isWin ? 'You Won!' : 'Game Over'}
        </h2>
        
        <p className="text-lg mb-2 text-gray-600 dark:text-gray-300">The word was:</p>
        <div className="text-3xl font-bold tracking-widest text-light-primary dark:text-dark-primary mb-6">
          {secretWord}
        </div>

        {isWin && (
          <p className="mb-6 text-gray-700 dark:text-gray-200">You guessed it in <span className="font-bold">{guesses.length}</span> {guesses.length === 1 ? 'try' : 'tries'}.</p>
        )}
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full py-3 px-6 bg-light-secondary dark:bg-dark-secondary text-black font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSharing ? (
              'Generating...'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Result
              </>
            )}
          </button>

          <button
            onClick={onPlayAgain}
            className="w-full py-3 px-6 bg-light-primary dark:bg-dark-primary text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 transition-all duration-200"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
