import { useState, useCallback } from "react";
import type { GameState, Difficulty, LetterResult } from "../types/game";
import { ApiService } from "../services/api";

const MAX_ATTEMPTS = 6;

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    sessionId: null,
    difficulty: null,
    wordLength: 0,
    attempts: [],
    currentAttempt: "",
    gameStatus: "playing",
    isLoading: false,
    error: null,
  });

  const [letterResults, setLetterResults] = useState<LetterResult[][]>([]);

  const startNewGame = useCallback(async (difficulty: Difficulty) => {
    setGameState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const session = await ApiService.getGameSession(difficulty.id);
      setGameState({
        sessionId: session.sessionId,
        difficulty: session.difficulty,
        wordLength: session.wordLenght,
        attempts: [],
        currentAttempt: "",
        gameStatus: "playing",
        isLoading: false,
        error: null,
      });
      setLetterResults([]);
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }));
    }
  }, []);

  const addLetter = useCallback(
    (letter: string) => {
      if (gameState.gameStatus !== "playing") return;

      const upperLetter = letter.toLowerCase();
      if (gameState.currentAttempt.length < gameState.wordLength) {
        setGameState((prev) => ({
          ...prev,
          currentAttempt: prev.currentAttempt + upperLetter,
        }));
      }
    },
    [
      gameState.gameStatus,
      gameState.currentAttempt.length,
      gameState.wordLength,
    ]
  );

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== "playing") return;

    setGameState((prev) => ({
      ...prev,
      currentAttempt: prev.currentAttempt.slice(0, -1),
    }));
  }, [gameState.gameStatus]);

  const submitAttempt = useCallback(async () => {
    if (
      gameState.gameStatus !== "playing" ||
      gameState.currentAttempt.length !== gameState.wordLength ||
      !gameState.sessionId ||
      gameState.isLoading
    ) {
      return;
    }

    setGameState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const results = await ApiService.checkWord(
        gameState.sessionId,
        gameState.currentAttempt.toLowerCase()
      );

      const newAttempts = [...gameState.attempts, gameState.currentAttempt];
      const newLetterResults = [...letterResults, results];

      const isWon = results.every((result) => result.solution === "correct");
      const isLost = newAttempts.length >= MAX_ATTEMPTS && !isWon;

      setGameState((prev) => ({
        ...prev,
        attempts: newAttempts,
        currentAttempt: "",
        gameStatus: isWon ? "won" : isLost ? "lost" : "playing",
        isLoading: false,
      }));

      setLetterResults(newLetterResults);
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }));
    }
  }, [
    gameState.gameStatus,
    gameState.currentAttempt,
    gameState.wordLength,
    gameState.sessionId,
    gameState.isLoading,
    gameState.attempts,
    letterResults,
  ]);

  const resetGame = useCallback(() => {
    setGameState({
      sessionId: null,
      difficulty: null,
      wordLength: 0,
      attempts: [],
      currentAttempt: "",
      gameStatus: "playing",
      isLoading: false,
      error: null,
    });
    setLetterResults([]);
  }, []);

  return {
    gameState,
    letterResults,
    addLetter,
    removeLetter,
    submitAttempt,
    startNewGame,
    resetGame,
  };
};
