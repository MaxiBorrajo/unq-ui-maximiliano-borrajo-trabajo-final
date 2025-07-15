import { useState, useEffect } from "react";
import type { Difficulty } from "../types/game";
import { ApiService } from "../services/api";

interface DifficultySelectorProps {
  startNewGame: (difficulty: Difficulty) => void;
  isLoading?: boolean;
}

export const DifficultySelector = ({
  startNewGame,
  isLoading,
}: DifficultySelectorProps) => {
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDifficulties = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getDifficulties();
        setDifficulties(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar las dificultades"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDifficulties();
  }, []);

  if (loading) {
    return (
      <div className="difficulty-selector">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="difficulty-selector">
        <div className="error-message">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="difficulty-button"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="difficulty-selector">
      <h2 className="difficulty-title">Selecciona la Dificultad</h2>

      {isLoading && (
        <div className="loading-text">
          <div className="loading-spinner"></div>
          <span>Iniciando juego...</span>
        </div>
      )}

      <div className="difficulty-grid">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.id}
            onClick={() => startNewGame(difficulty)}
            disabled={isLoading}
            className="difficulty-button"
          >
            {difficulty.name}
          </button>
        ))}
      </div>

      
    </div>
  );
};
