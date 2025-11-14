import { WORD_BANK } from "../wordBank";

export const getWordAndHint = async (): Promise<{ word: string, hint: string }> => {
  // Select a random word from the local word bank
  const randomIndex = Math.floor(Math.random() * WORD_BANK.length);
  const selected = WORD_BANK[randomIndex];
  
  // Return a promise to maintain the async function signature,
  // making it a non-breaking change for the App component.
  return Promise.resolve(selected);
};