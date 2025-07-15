import type { LetterResult } from "../types/game";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  letterResults: LetterResult[][];
}

export const VirtualKeyboard = ({
  onKeyPress,
  onBackspace,
  onEnter,
  letterResults,
}: VirtualKeyboardProps) => {
  const getKeyStatus = (
    key: string
  ): "correct" | "elsewhere" | "absent" | null => {
    const flatResults = letterResults.flat();
    const keyResults = flatResults.filter(
      (result) => result.letter.toUpperCase() === key.toUpperCase()
    );

    if (keyResults.length === 0) return null;

    const hasCorrect = keyResults.some(
      (result) => result.solution === "correct"
    );
    if (hasCorrect) return "correct";

    const hasElsewhere = keyResults.some(
      (result) => result.solution === "elsewhere"
    );
    if (hasElsewhere) return "elsewhere";

    return "absent";
  };

  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <div className="virtual-keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {rowIndex === 2 && (
            <button onClick={onEnter} className="keyboard-key enter">
              ENTER
            </button>
          )}

          {row.map((key) => {
            const status = getKeyStatus(key);
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  keyboard-key
                  ${status === "correct" ? "correct" : ""}
                  ${status === "elsewhere" ? "elsewhere" : ""}
                  ${status === "absent" ? "absent" : ""}
                `}
              >
                {key}
              </button>
            );
          })}

          {rowIndex === 2 && (
            <button onClick={onBackspace} className="keyboard-key backspace">
              ←
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
