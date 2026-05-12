import { useEffect, useMemo, useState } from "react";

const SYMBOLS = ["∫", "∑", "∏", "√", "∂", "∇", "∞", "Ω"];

type Card = {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
};

function buildDeck(): Card[] {
  const pool = [...SYMBOLS, ...SYMBOLS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.map((symbol, id) => ({
    id,
    symbol,
    flipped: false,
    matched: false,
  }));
}

export default function MemoryMatch() {
  const initial = useMemo(() => buildDeck(), []);
  const [cards, setCards] = useState<Card[]>(initial);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  const won = cards.every((c) => c.matched);

  useEffect(() => {
    if (!locked) return;
    const t = setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => (c.matched ? c : { ...c, flipped: false })),
      );
      setSelected(null);
      setLocked(false);
    }, 700);
    return () => clearTimeout(t);
  }, [locked]);

  const click = (idx: number) => {
    if (locked || won) return;
    const card = cards[idx];
    if (card.flipped || card.matched) return;

    const next = cards.map((c, i) =>
      i === idx ? { ...c, flipped: true } : c,
    );

    if (selected === null) {
      setCards(next);
      setSelected(idx);
      return;
    }

    setMoves((m) => m + 1);
    const first = next[selected];
    if (first.symbol === card.symbol) {
      setCards(
        next.map((c, i) =>
          i === idx || i === selected ? { ...c, matched: true } : c,
        ),
      );
      setSelected(null);
    } else {
      setCards(next);
      setLocked(true);
    }
  };

  const reset = () => {
    setCards(buildDeck());
    setSelected(null);
    setLocked(false);
    setMoves(0);
  };

  return (
    <div className="max-w-[22rem]">
      <p className="font-serif-body text-[15px] text-ink-soft mb-4">
        Flip two cards. If the glyphs match, they stay. Clear the table.
      </p>
      <div className="grid grid-cols-4 gap-1.5 aspect-square">
        {cards.map((c, i) => {
          const visible = c.flipped || c.matched;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => click(i)}
              disabled={visible || locked || won}
              className={[
                "border rule grid place-items-center font-display text-2xl md:text-3xl transition-colors",
                visible
                  ? c.matched
                    ? "bg-accent-wash text-accent border-accent/40"
                    : "bg-paper text-ink"
                  : "bg-paper-deep/40 text-transparent hover:bg-paper-deep/70",
              ].join(" ")}
              aria-label={visible ? `Card ${i + 1}: ${c.symbol}` : `Card ${i + 1}: hidden`}
            >
              {visible ? c.symbol : "·"}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {won ? `Cleared in ${moves} turns.` : `Turns · ${moves}`}
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
