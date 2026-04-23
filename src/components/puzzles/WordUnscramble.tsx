import { useMemo, useState } from "react";

const WORDS: { word: string; hint: string }[] = [
  { word: "schema", hint: "The shape a database gives to its data." },
  { word: "service", hint: "A bounded unit of backend work." },
  { word: "throughput", hint: "Requests completed per unit time." },
  { word: "research", hint: "What papers end up being about." },
  { word: "encryption", hint: "Turning plaintext into something only you can read." },
  { word: "architecture", hint: "What holds the software together when traffic arrives." },
  { word: "abstract", hint: "The first paragraph of a paper." },
  { word: "rigor", hint: "One-third of the trinity." },
  { word: "latency", hint: "The quiet enemy of a happy API." },
  { word: "schema", hint: "What migrations migrate." },
  { word: "kubernetes", hint: "The Greek word for the thing that reschedules your pods at 3 a.m." },
  { word: "graphql", hint: "A query language, often accused of being trendy." },
];

function shuffle(word: string) {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join("");
}

export default function WordUnscramble() {
  const { word, hint } = useMemo(
    () => WORDS[Math.floor(Math.random() * WORDS.length)],
    [],
  );
  const scrambled = useMemo(() => {
    let s = shuffle(word);
    while (s === word && word.length > 1) s = shuffle(word);
    return s;
  }, [word]);

  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const correct = guess.trim().toLowerCase() === word.toLowerCase();

  return (
    <div className="max-w-xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Scrambled
      </p>
      <p className="font-display text-4xl md:text-5xl tracking-[-0.01em] text-accent select-text">
        {scrambled}
      </p>
      <p className="mt-4 font-serif-body italic text-[15px] text-ink-soft">
        <span className="text-muted-foreground">Hint · </span>
        {hint}
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-6 flex flex-wrap gap-3"
      >
        <label className="sr-only" htmlFor="wu-input">Your answer</label>
        <input
          id="wu-input"
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Your answer"
          disabled={correct}
          className="flex-1 min-w-0 bg-transparent border-b rule py-2 text-[17px] font-serif-body focus:outline-none focus:border-accent disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => {
            setRevealed(true);
            setGuess(word);
          }}
          className="font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-2 text-muted-foreground hover:text-ink transition-colors"
        >
          Reveal
        </button>
      </form>

      <div className="mt-5 min-h-[28px] font-serif-body text-[15px]">
        {correct && !revealed && (
          <p className="text-accent">
            ✓ Typeset. The word was <strong>{word}</strong>.
          </p>
        )}
        {revealed && (
          <p className="text-muted-foreground">
            Revealed: <strong className="text-ink">{word}</strong>.
          </p>
        )}
        {!correct && !revealed && guess.length > 0 && (
          <p className="text-muted-foreground">Keep going.</p>
        )}
      </div>
    </div>
  );
}
