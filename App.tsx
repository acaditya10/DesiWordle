import React, { useState, useEffect, useCallback } from 'react';
import { getWordAndHint } from './services/geminiService';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { GameModal } from './components/GameModal';
import { Notification } from './components/Notification';
import { Footer } from './components/Footer';
import { LetterState, EvaluatedGuess, KeyStateMap } from './types';

const MAX_ATTEMPTS = 3;
const WORD_LENGTH = 5;

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [secretWord, setSecretWord] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [guesses, setGuesses] = useState<EvaluatedGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameState, setGameState] = useState<'LOADING' | 'PLAYING' | 'WON' | 'LOST'>('LOADING');
  const [keyStates, setKeyStates] = useState<KeyStateMap>({});
  const [notification, setNotification] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  
  // State for score tracking
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load stats from localStorage on initial load
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('gameStats');
      if (savedStats) {
        const { wins, losses, streak } = JSON.parse(savedStats);
        setWins(wins || 0);
        setLosses(losses || 0);
        setStreak(streak || 0);
      }
    } catch (error) {
      console.error("Failed to parse stats from localStorage", error);
    }
  }, []);

  const startNewGame = useCallback(async () => {
    setGameState('LOADING');
    setGuesses([]);
    setCurrentGuess('');
    setKeyStates({});
    const { word, hint } = await getWordAndHint();
    setSecretWord(word);
    setHint(hint);
    setGameState('PLAYING');
  }, []);

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== 'PLAYING') return;

    if (key === 'Enter') {
      if (currentGuess.length !== WORD_LENGTH) {
        showNotification('Not enough letters');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        return;
      }
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/i.test(key)) {
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  }, [currentGuess, gameState]);

  const submitGuess = () => {
    const evaluation = evaluateGuess(currentGuess, secretWord);
    const newGuesses = [...guesses, { guess: currentGuess, evaluation }];
    setGuesses(newGuesses);
    
    const newKeyStates = { ...keyStates };
    currentGuess.split('').forEach((letter, index) => {
      const state = evaluation[index];
      if (!newKeyStates[letter] || state === LetterState.CORRECT) {
        newKeyStates[letter] = state;
      } else if (state === LetterState.MISPLACED && newKeyStates[letter] !== LetterState.CORRECT) {
        newKeyStates[letter] = state;
      } else if (!newKeyStates[letter]) {
        newKeyStates[letter] = LetterState.INCORRECT;
      }
    });
    setKeyStates(newKeyStates);
    
    setCurrentGuess('');

    if (currentGuess === secretWord) {
      setTimeout(() => {
        const newWins = wins + 1;
        const newStreak = streak + 1;
        setWins(newWins);
        setStreak(newStreak);
        localStorage.setItem('gameStats', JSON.stringify({ wins: newWins, losses, streak: newStreak }));
        setGameState('WON');
      }, 500);
    } else if (newGuesses.length === MAX_ATTEMPTS) {
      setTimeout(() => {
        const newLosses = losses + 1;
        setLosses(newLosses);
        setStreak(0);
        localStorage.setItem('gameStats', JSON.stringify({ wins, losses: newLosses, streak: 0 }));
        setGameState('LOST');
      }, 500);
    }
  };

  const evaluateGuess = (guess: string, secret: string): LetterState[] => {
    const result: LetterState[] = Array(WORD_LENGTH).fill(LetterState.INCORRECT);
    const secretLetters = secret.split('');
    const guessLetters = guess.split('');
    
    // First pass for correct letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] === secretLetters[i]) {
            result[i] = LetterState.CORRECT;
            secretLetters[i] = ''; // Mark as used
        }
    }

    // Second pass for misplaced letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (result[i] !== LetterState.CORRECT) {
            const misplacedIndex = secretLetters.indexOf(guessLetters[i]);
            if (misplacedIndex > -1) {
                result[i] = LetterState.MISPLACED;
                secretLetters[misplacedIndex] = ''; // Mark as used
            }
        }
    }
    return result;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKeyPress(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Notification message={notification} />
      
      <div className="w-full">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <ScoreBoard wins={wins} losses={losses} streak={streak} />
      </div>
      
      <main className="flex flex-col items-center justify-center flex-grow w-full px-2 sm:px-4">
        {gameState === 'LOADING' ? (
          <div className="text-2xl font-semibold animate-pulse">Loading a new word...</div>
        ) : (
          <>
            <div className="text-center mb-4 p-4 rounded-lg bg-light-surface dark:bg-dark-surface shadow-md max-w-md w-full">
              <h2 className="text-lg font-bold text-light-primary dark:text-dark-primary">Hint</h2>
              <p className="mt-1 italic">{hint}</p>
            </div>
            <GameBoard 
              guesses={guesses} 
              currentGuess={currentGuess} 
              maxAttempts={MAX_ATTEMPTS}
              wordLength={WORD_LENGTH}
              isShaking={isShaking}
            />
          </>
        )}
      </main>

      <div className="w-full flex flex-col items-center">
        {gameState !== 'LOADING' && (
          <Keyboard onKeyPress={handleKeyPress} keyStates={keyStates} />
        )}
        <Footer />
      </div>

      {(gameState === 'WON' || gameState === 'LOST') && (
        <GameModal 
          gameState={gameState} 
          secretWord={secretWord} 
          attempts={guesses.length}
          onPlayAgain={startNewGame}
        />
      )}
    </div>
  );
};

export default App;