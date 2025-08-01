import { useEffect } from "react";
import { useGame } from "../hooks/useGame";
import { GameBoard } from "./GameBoard";
import { VirtualKeyboard } from "./VirtualKeyboard";
import { DifficultySelector } from "./DifficultySelector";
import { GameResult } from "../pages/GameResultPage";

export const Game = () => {
  const {
    gameState,
    letterResults,
    addLetter,
    removeLetter,
    submitAttempt,
    startNewGame,
    resetGame,
  } = useGame();

  useEffect(() => {
    const handleAddLetter = (event: CustomEvent) => {
      addLetter(event.detail);
    };

    const handleRemoveLetter = () => {
      removeLetter();
    };

    const handleSubmitAttempt = () => {
      submitAttempt();
    };

    window.addEventListener("addLetter", handleAddLetter as EventListener);
    window.addEventListener("removeLetter", handleRemoveLetter);
    window.addEventListener("submitAttempt", handleSubmitAttempt);

    return () => {
      window.removeEventListener("addLetter", handleAddLetter as EventListener);
      window.removeEventListener("removeLetter", handleRemoveLetter);
      window.removeEventListener("submitAttempt", handleSubmitAttempt);
    };
  }, [addLetter, removeLetter, submitAttempt]);

  const handlePlayAgain = () => {
    resetGame();
  };

  if (!gameState.sessionId) {
    return (
      <div className="game-container">
        <DifficultySelector
          startNewGame={startNewGame}
          isLoading={gameState.isLoading}
        />
      </div>
    );
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Wordle</h1>
        <p className="game-subtitle">
          Dificultad: {gameState.difficulty?.name} ({gameState.wordLength}{" "}
          letras)
        </p>
        <p className="game-info">Intentos: {gameState.attempts.length}/6</p>
      </header>

      <main className="game-main">
        {gameState.error && (
          <div className="error-message">{gameState.error}</div>
        )}

        <GameBoard
          attempts={gameState.attempts}
          currentAttempt={gameState.currentAttempt}
          wordLength={gameState.wordLength}
          letterResults={letterResults}
        />

        <VirtualKeyboard
          keyEvent={addLetter}
          deleteEvent={removeLetter}
          enterEvent={submitAttempt}
          letterResults={letterResults}
        />

        {gameState.isLoading && (
          <div className="loading-text">
            <div className="loading-spinner"></div>
            <span>Verificando palabra...</span>
          </div>
        )}
      </main>

      <GameResult
        gameStatus={gameState.gameStatus}
        attempts={gameState.attempts}
        handlePlayAgain={handlePlayAgain}
      />
    </div>
  );
};
