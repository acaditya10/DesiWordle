import React, { useState, useEffect, useCallback } from 'react';
import { getWordAndHint } from './services/geminiService';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { GameModal } from './components/GameModal';
import { Notification } from './components/Notification';
import { Footer } from './components/Footer';
import { WelcomeModal } from './components/WelcomeModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { LetterState, EvaluatedGuess, KeyStateMap, LeaderboardEntry } from './types';

const MAX_ATTEMPTS = 3;
const WORD_LENGTH = 5;

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
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
  const [maxStreak, setMaxStreak] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initial game load
  useEffect(() => {
    startNewGame();
    // Load leaderboard initially
    loadLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user stats when name is set
  useEffect(() => {
    if (userName) {
      try {
        const savedStats = localStorage.getItem(`stats_${userName}`);
        if (savedStats) {
          const { wins, losses, streak, maxStreak } = JSON.parse(savedStats);
          setWins(wins || 0);
          setLosses(losses || 0);
          setStreak(streak || 0);
          setMaxStreak(maxStreak || 0);
        } else {
          // Reset stats for new user
          setWins(0);
          setLosses(0);
          setStreak(0);
          setMaxStreak(0);
        }
      } catch (error) {
        console.error("Failed to parse stats from localStorage", error);
      }
    }
  }, [userName]);

  const loadLeaderboard = () => {
    try {
      const savedLeaderboard = localStorage.getItem('desiWordle_leaderboard');
      if (savedLeaderboard) {
        setLeaderboard(JSON.parse(savedLeaderboard));
      }
    } catch (e) {
      console.error("Failed to load leaderboard", e);
    }
  };

  const handleUserWelcome = (name: string) => {
    setUserName(name);
    setShowWelcome(false);
  };

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

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== 'PLAYING' || showWelcome || showLeaderboard) return;

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
  }, [currentGuess, gameState, showWelcome, showLeaderboard]);

  const updateLeaderboard = (newWins: number, newMaxStreak: number) => {
    try {
      let entries: LeaderboardEntry[] = [];
      const saved = localStorage.getItem('desiWordle_leaderboard');
      if (saved) entries = JSON.parse(saved);

      const existingIndex = entries.findIndex(e => e.name === userName);
      const entry: LeaderboardEntry = {
        name: userName,
        wins: newWins,
        maxStreak: newMaxStreak,
        lastPlayed: Date.now()
      };

      if (existingIndex >= 0) {
        entries[existingIndex] = { 
            ...entries[existingIndex], 
            ...entry,
            // Keep the absolute best max streak if for some reason local state is lower (unlikely)
            maxStreak: Math.max(entries[existingIndex].maxStreak, newMaxStreak),
            wins: newWins
        };
      } else {
        entries.push(entry);
      }

      // Sort by Max Streak descending
      entries.sort((a, b) => b.maxStreak - a.maxStreak);
      
      // Keep top 10
      const top10 = entries.slice(0, 10);
      
      localStorage.setItem('desiWordle_leaderboard', JSON.stringify(top10));
      setLeaderboard(top10);
    } catch (e) {
      console.error("Failed to update leaderboard", e);
    }
  };

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
        const newMaxStreak = Math.max(newStreak, maxStreak);
        
        setWins(newWins);
        setStreak(newStreak);
        setMaxStreak(newMaxStreak);
        
        const stats = { wins: newWins, losses, streak: newStreak, maxStreak: newMaxStreak };
        localStorage.setItem(`stats_${userName}`, JSON.stringify(stats));
        updateLeaderboard(newWins, newMaxStreak);
        
        setGameState('WON');
      }, 500);
    } else if (newGuesses.length === MAX_ATTEMPTS) {
      setTimeout(() => {
        const newLosses = losses + 1;
        const newStreak = 0;
        // Max streak remains same
        
        setLosses(newLosses);
        setStreak(newStreak);
        
        const stats = { wins, losses: newLosses, streak: newStreak, maxStreak };
        localStorage.setItem(`stats_${userName}`, JSON.stringify(stats));
        // Still update leaderboard to reflect lastPlayed or wins if needed (though wins didnt change)
        updateLeaderboard(wins, maxStreak);
        
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
      {showWelcome && <WelcomeModal onComplete={handleUserWelcome} />}
      
      <LeaderboardModal 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
        entries={leaderboard}
        currentUserName={userName}
      />

      <Notification message={notification} />
      
      <div className="w-full">
        <Header 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          onOpenLeaderboard={() => setShowLeaderboard(true)}
        />
        <ScoreBoard wins={wins} losses={losses} streak={streak} maxStreak={maxStreak} />
      </div>
      
      <main className="flex flex-col items-center justify-center flex-grow w-full px-2 sm:px-4">
        {gameState === 'LOADING' ? (
          <div className="text-2xl font-semibold animate-pulse mt-10">Loading a new word...</div>
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
        {gameState !== 'LOADING' && !showWelcome && (
          <Keyboard onKeyPress={handleKeyPress} keyStates={keyStates} />
        )}
        <Footer />
      </div>

      {(gameState === 'WON' || gameState === 'LOST') && (
        <GameModal 
          gameState={gameState} 
          secretWord={secretWord} 
          guesses={guesses}
          onPlayAgain={startNewGame}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default App;