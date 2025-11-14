
export enum LetterState {
  CORRECT,
  MISPLACED,
  INCORRECT,
  EMPTY,
}

export interface EvaluatedGuess {
  guess: string;
  evaluation: LetterState[];
}

export type KeyStateMap = { [key: string]: LetterState };
