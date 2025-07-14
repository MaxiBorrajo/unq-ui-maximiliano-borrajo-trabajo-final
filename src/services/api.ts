import type {
  Difficulty,
  GameSession,
  AnswerBody,
  LetterResult,
} from "../types/game";

const API_BASE_URL = "https://word-api-hmlg.vercel.app";

export class ApiService {
  static async getDifficulties(): Promise<Difficulty[]> {
    const response = await fetch(`${API_BASE_URL}/api/difficulties`);
    if (!response.ok) {
      throw new Error("Error al obtener las dificultades");
    }
    return response.json();
  }

  static async getGameSession(difficultyId: string): Promise<GameSession> {
    const response = await fetch(
      `${API_BASE_URL}/api/difficulties/${difficultyId}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener la sesión de juego");
    }
    return response.json();
  }

  static async checkWord(
    sessionId: string,
    word: string
  ): Promise<LetterResult[]> {
    const response = await fetch(`${API_BASE_URL}/api/checkWord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, word } as AnswerBody),
    });

    if (response.status === 400) {
      throw new Error("Palabra no válida");
    }

    if (response.status === 404) {
      throw new Error("Sesión no encontrada");
    }

    if (!response.ok) {
      throw new Error("Error al verificar la palabra");
    }

    return response.json();
  }
}
