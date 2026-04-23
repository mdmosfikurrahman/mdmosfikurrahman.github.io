import { useEffect, useState } from "react";

type Cell = "X" | "O" | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(board: Cell[]): Cell | "draw" | null {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every((c) => c)) return "draw";
  return null;
}

function pickAiMove(board: Cell[]): number {
  const empties = board
    .map((c, i) => (c ? null : i))
    .filter((i): i is number => i !== null);
  // Win if possible
  for (const i of empties) {
    const trial = [...board];
    trial[i] = "O";
    if (winner(trial) === "O") return i;
  }
  // Block otherwise
  for (const i of empties) {
    const trial = [...board];
    trial[i] = "X";
    if (winner(trial) === "X") return i;
  }
  // Prefer centre, then corners, then edges
  const priority = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  for (const i of priority) if (empties.includes(i)) return i;
  return empties[0];
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(null));
  const [myTurn, setMyTurn] = useState(true);
  const result = winner(board);

  useEffect(() => {
    if (!myTurn && !result) {
      const t = setTimeout(() => {
        setBoard((b) => {
          const i = pickAiMove(b);
          const next = [...b];
          next[i] = "O";
          return next;
        });
        setMyTurn(true);
      }, 420);
      return () => clearTimeout(t);
    }
  }, [myTurn, result]);

  const click = (i: number) => {
    if (!myTurn || board[i] || result) return;
    const next = [...board];
    next[i] = "X";
    setBoard(next);
    setMyTurn(false);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setMyTurn(true);
  };

  const status =
    result === "X"
      ? "You win."
      : result === "O"
      ? "Machine wins."
      : result === "draw"
      ? "Draw."
      : myTurn
      ? "Your move."
      : "Thinking…";

  return (
    <div className="max-w-[18rem]">
      <div className="grid grid-cols-3 gap-1 aspect-square border rule">
        {board.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => click(i)}
            disabled={!!c || !!result || !myTurn}
            className="bg-paper hover:bg-paper-deep/60 font-display text-[2.4rem] md:text-5xl grid place-items-center transition-colors disabled:cursor-default leading-none"
            aria-label={c ? `Cell ${i + 1}: ${c}` : `Cell ${i + 1}: empty`}
          >
            <span className={c === "X" ? "text-accent" : "text-ink"}>{c}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {status}
        </p>
        <button
          type="button"
          onClick={reset}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent hover:underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
