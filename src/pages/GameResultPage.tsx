import type { GameStatus } from "../types/game";

interface GameResultProps {
  gameStatus: GameStatus;
  attempts: string[];
  handlePlayAgain: () => void;
}

export const GameResult = ({
  gameStatus,
  attempts,
  handlePlayAgain,
}: GameResultProps) => {
  const isWon = gameStatus === "won";
  const isLost = gameStatus === "lost";

  if (!isWon && !isLost) return null;

  return (
    <div className="game-result">
      <div className="result-modal">
        <div className={`result-emoji ${isWon ? "won" : "lost"}`}>
          {isWon ? "🎉" : "😔"}
        </div>

        <h2 className="result-title">
          {isWon ? "¡Felicitaciones!" : "¡Mejor suerte la próxima!"}
        </h2>

        <p className="result-message">
          {isWon
            ? `Lo lograste en ${attempts.length} intento${
                attempts.length > 1 ? "s" : ""
              }`
            : "Se acabaron los intentos"}
        </p>

        <div className="attempts-container">
          <h3 className="attempts-title">Tus intentos:</h3>
          <div className="attempts-list">
            {attempts.map((attempt, index) => (
              <div key={index} className="attempt-item">
                {attempt}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handlePlayAgain} className="play-again-button">
          Jugar de Nuevo
        </button>
      </div>
    </div>
  );
};
