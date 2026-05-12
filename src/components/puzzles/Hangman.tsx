import { useMemo, useState } from "react";

const WORDS = [
  "manuscript",
  "epigraph",
  "footnote",
  "abstract",
  "citation",
  "compendium",
  "catalogue",
  "annotation",
  "monograph",
  "treatise",
  "proceedings",
  "errata",
  "marginalia",
  "addendum",
  "preface",
  "kernel",
  "schema",
  "throughput",
  "asynchronous",
  "topology",
];

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const MAX_WRONG = 6;

export default function Hangman() {
  const word = useMemo(
    () => WORDS[Math.floor(Math.random() * WORDS.length)],
    [],
  );
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set<string>());

  const wrong = [...guessed].filter((l) => !word.includes(l)).length;
  const revealed = word
    .split("")
    .every((l) => guessed.has(l));
  const lost = wrong >= MAX_WRONG;
  const over = revealed || lost;

  const guess = (letter: string) => {
    if (over || guessed.has(letter)) return;
    const next = new Set(guessed);
    next.add(letter);
    setGuessed(next);
  };

  const reset = () => setGuessed(new Set<string>());

  return (
    <div className="max-w-[28rem]">
      <p className="font-serif-body text-[15px] text-ink-soft mb-4">
        Guess the word, one letter at a time. Six wrong guesses and the gallows.
      </p>

      <div className="flex items-baseline gap-2 md:gap-3 mb-6 flex-wrap">
        {word.split("").map((l, i) => {
          const shown = guessed.has(l) || lost;
          return (
            <span
              key={i}
              className={[
                "inline-block font-display text-3xl md:text-4xl tabular-nums border-b rule px-1.5 min-w-[1.1em] text-center transition-colors",
                shown ? (lost && !guessed.has(l) ? "text-accent" : "text-ink") : "text-transparent",
              ].join(" ")}
            >
              {shown ? l : "·"}
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 mb-6" aria-label={`Wrong guesses: ${wrong} of ${MAX_WRONG}`}>
        {Array.from({ length: MAX_WRONG }).map((_, i) => (
          <span
            key={i}
            className={[
              "inline-block w-3 h-3 border rule transition-colors",
              i < wrong ? "bg-accent border-accent/60" : "bg-transparent",
            ].join(" ")}
            aria-hidden
          />
        ))}
        <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {wrong} / {MAX_WRONG}
        </span>
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-[repeat(13,minmax(0,1fr))] gap-1 max-w-[26rem]">
        {ALPHABET.map((l) => {
          const used = guessed.has(l);
          const inWord = word.includes(l);
          return (
            <button
              key={l}
              type="button"
              onClick={() => guess(l)}
              disabled={used || over}
              className={[
                "font-mono uppercase text-[12px] py-1.5 border rule transition-colors",
                used
                  ? inWord
                    ? "bg-accent-wash text-accent border-accent/40"
                    : "bg-paper-deep/40 text-muted-foreground line-through"
                  : "bg-paper hover:bg-ink hover:text-paper",
              ].join(" ")}
              aria-label={`Letter ${l.toUpperCase()}`}
            >
              {l}
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-[28px] flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {revealed
            ? "You found the word."
            : lost
              ? `The word was ${word}.`
              : "Keep going."}
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
