import { useMemo, useState } from "react";

export default function GuessNumber() {
  const target = useMemo(() => Math.floor(Math.random() * 100) + 1, []);
  const [tries, setTries] = useState<number[]>([]);
  const [guess, setGuess] = useState("");

  const won = tries.length > 0 && tries[tries.length - 1] === target;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(guess, 10);
    if (isNaN(n) || n < 1 || n > 100) return;
    setTries([...tries, n]);
    setGuess("");
  };

  return (
    <div className="max-w-md">
      <p className="font-serif-body text-[15px] text-ink-soft">
        Find the number between <strong>1</strong> and <strong>100</strong>. Each guess
        tells you higher or lower.
      </p>

      <form onSubmit={submit} className="mt-5 flex gap-3">
        <label className="sr-only" htmlFor="gn-input">Your guess</label>
        <input
          id="gn-input"
          type="number"
          inputMode="numeric"
          min={1}
          max={100}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={won}
          placeholder="1–100"
          className="flex-1 bg-transparent border-b rule py-2 text-[17px] font-serif-body focus:outline-none focus:border-accent disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={won}
          className="font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-2 border rule hover:bg-ink hover:text-paper disabled:opacity-50 transition-colors"
        >
          Guess
        </button>
      </form>

      <ol className="mt-6 space-y-1 font-mono text-[13px]">
        {tries.map((n, i) => (
          <li key={i} className="flex items-baseline gap-3">
            <span className="text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-ink tabular-nums w-8">{n}</span>
            <span
              className={
                n === target
                  ? "text-accent"
                  : "text-muted-foreground"
              }
            >
              {n === target ? "— exact" : n < target ? "— too low" : "— too high"}
            </span>
          </li>
        ))}
      </ol>

      {won && (
        <p className="mt-6 font-serif-body text-[1.1rem] text-accent">
          Found in {tries.length} {tries.length === 1 ? "try" : "tries"}.
        </p>
      )}
    </div>
  );
}
