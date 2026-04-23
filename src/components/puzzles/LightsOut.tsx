import { useMemo, useState } from "react";

const SIZE = 3;

function toggleAt(board: boolean[], idx: number) {
  const row = Math.floor(idx / SIZE);
  const col = idx % SIZE;
  const deltas: [number, number][] = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (const [dr, dc] of deltas) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
      board[r * SIZE + c] = !board[r * SIZE + c];
    }
  }
}

function randomBoard(): boolean[] {
  const board = Array<boolean>(SIZE * SIZE).fill(false);
  const toggles = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < toggles; i++) {
    toggleAt(board, Math.floor(Math.random() * board.length));
  }
  return board.every((b) => !b) ? randomBoard() : board;
}

export default function LightsOut() {
  const initial = useMemo(() => randomBoard(), []);
  const [board, setBoard] = useState<boolean[]>(initial);
  const [moves, setMoves] = useState(0);
  const won = board.every((b) => !b);

  const click = (idx: number) => {
    if (won) return;
    const next = [...board];
    toggleAt(next, idx);
    setBoard(next);
    setMoves(moves + 1);
  };

  const reset = () => {
    setBoard(randomBoard());
    setMoves(0);
  };

  return (
    <div className="max-w-[18rem]">
      <p className="font-serif-body text-[15px] text-ink-soft mb-4">
        Click a tile to flip it and its neighbours. Turn every light off.
      </p>
      <div className="grid grid-cols-3 gap-1.5 aspect-square">
        {board.map((on, i) => (
          <button
            key={i}
            type="button"
            onClick={() => click(i)}
            disabled={won}
            className={[
              "border rule transition-all duration-150",
              on ? "bg-accent border-accent" : "bg-paper-deep/40",
              won ? "cursor-default" : "hover:scale-[0.98]",
            ].join(" ")}
            aria-label={`Tile ${i + 1}, ${on ? "on" : "off"}`}
          />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {won ? `Solved in ${moves} moves.` : `Moves · ${moves}`}
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
