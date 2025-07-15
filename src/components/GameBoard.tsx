import { useEffect } from "react";
import type { LetterResult } from "../types/game";

interface GameBoardProps {
  attempts: string[];
  currentAttempt: string;
  wordLength: number;
  letterResults: LetterResult[][];
  maxAttempts?: number;
}

export const GameBoard = ({
  attempts,
  currentAttempt,
  wordLength,
  letterResults,
  maxAttempts = 6,
}: GameBoardProps) => {
  const getLetterStatus = (
    rowIndex: number,
    colIndex: number
  ): "correct" | "elsewhere" | "absent" | null => {
    if (rowIndex >= letterResults.length) return null;
    return letterResults[rowIndex][colIndex]?.solution || null;
  };

  const getCurrentRowContent = (colIndex: number): string => {
    return colIndex < currentAttempt.length ? currentAttempt[colIndex] : "";
  };

  const getAttemptRowContent = (rowIndex: number, colIndex: number): string => {
    const attempt = attempts[rowIndex];
    return attempt && colIndex < attempt.length ? attempt[colIndex] : "";
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const submitEvent = new CustomEvent("submitAttempt");
        window.dispatchEvent(submitEvent);
      } else if (event.key === "Backspace") {
        const removeEvent = new CustomEvent("removeLetter");
        window.dispatchEvent(removeEvent);
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        const addEvent = new CustomEvent("addLetter", { detail: event.key });
        window.dispatchEvent(addEvent);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="game-board">
      <div className="board-matrix">
        {Array.from({ length: maxAttempts }, (_, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {Array.from({ length: wordLength }, (_, colIndex) => {
              const isCurrentRow = rowIndex === attempts.length;
              const letter = isCurrentRow
                ? getCurrentRowContent(colIndex)
                : getAttemptRowContent(rowIndex, colIndex);
              const status = getLetterStatus(rowIndex, colIndex);
              const isFilled = letter !== "";

              return (
                <div
                  key={colIndex}
                  className={`
                    board-cell
                    ${isFilled ? "filled" : ""}
                    ${status === "correct" ? "correct" : ""}
                    ${status === "elsewhere" ? "elsewhere" : ""}
                    ${status === "absent" ? "absent" : ""}
                  `}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
