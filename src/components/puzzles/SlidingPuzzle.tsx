import { useMemo, useState } from "react";

const SIZE = 4;
const TOTAL = SIZE * SIZE;
const SOLVED = Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL);

function emptyIndex(tiles: number[]) {
  return tiles.indexOf(0);
}

function neighbours(idx: number): number[] {
  const r = Math.floor(idx / SIZE);
  const c = idx % SIZE;
  const out: number[] = [];
  if (r > 0) out.push(idx - SIZE);
  if (r < SIZE - 1) out.push(idx + SIZE);
  if (c > 0) out.push(idx - 1);
  if (c < SIZE - 1) out.push(idx + 1);
  return out;
}

function shuffled(): number[] {
  const tiles = [...SOLVED];
  let empty = emptyIndex(tiles);
  let prev = -1;
  for (let i = 0; i < 200; i++) {
    const opts = neighbours(empty).filter((n) => n !== prev);
    const pick = opts[Math.floor(Math.random() * opts.length)];
    [tiles[empty], tiles[pick]] = [tiles[pick], tiles[empty]];
    prev = empty;
    empty = pick;
  }
  if (tiles.every((v, i) => v === SOLVED[i])) return shuffled();
  return tiles;
}

export default function SlidingPuzzle() {
  const initial = useMemo(() => shuffled(), []);
  const [tiles, setTiles] = useState<number[]>(initial);
  const [moves, setMoves] = useState(0);

  const solved = tiles.every((v, i) => v === SOLVED[i]);

  const click = (idx: number) => {
    if (solved) return;
    const empty = emptyIndex(tiles);
    if (!neighbours(idx).includes(empty)) return;
    const next = [...tiles];
    [next[idx], next[empty]] = [next[empty], next[idx]];
    setTiles(next);
    setMoves(moves + 1);
  };

  const reset = () => {
    setTiles(shuffled());
    setMoves(0);
  };

  return (
    <div className="max-w-[22rem]">
      <p className="font-serif-body text-[15px] text-ink-soft mb-4">
        Slide a numbered tile into the empty square. Set them in order, one to fifteen.
      </p>
      <div className="grid grid-cols-4 gap-1.5 aspect-square border rule p-1.5 bg-paper-deep/40">
        {tiles.map((n, i) => {
          if (n === 0) {
            return <div key={i} aria-hidden className="bg-transparent" />;
          }
          const movable = neighbours(i).includes(emptyIndex(tiles)) && !solved;
          const inPlace = n === SOLVED[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => click(i)}
              disabled={!movable}
              className={[
                "grid place-items-center border rule font-display text-2xl md:text-3xl tabular-nums transition-colors",
                inPlace ? "text-accent" : "text-ink",
                movable ? "bg-paper hover:bg-paper-deep/60 cursor-pointer" : "bg-paper cursor-default",
              ].join(" ")}
              aria-label={`Tile ${n}`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {solved ? `Solved in ${moves} moves.` : `Moves · ${moves}`}
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
