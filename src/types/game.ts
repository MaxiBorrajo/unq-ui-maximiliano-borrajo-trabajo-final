export interface Difficulty {
  id: string;
  name: string;
}

export interface GameSession {
  sessionId: string;
  difficulty: Difficulty;
  wordLenght: number;
}

export interface AnswerBody {
  sessionId: string;
  word: string;
}

export interface LetterResult {
  letter: string;
  solution: "correct" | "elsewhere" | "absent";
}

export interface GameState {
  sessionId: string | null;
  difficulty: Difficulty | null;
  wordLength: number;
  attempts: string[];
  currentAttempt: string;
  gameStatus: "playing" | "won" | "lost";
  isLoading: boolean;
  error: string | null;
}

export type GameStatus = "playing" | "won" | "lost";
