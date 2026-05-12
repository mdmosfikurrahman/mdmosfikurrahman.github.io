import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WordUnscramble from "@/components/puzzles/WordUnscramble";
import TicTacToe from "@/components/puzzles/TicTacToe";
import GuessNumber from "@/components/puzzles/GuessNumber";
import LightsOut from "@/components/puzzles/LightsOut";
import MemoryMatch from "@/components/puzzles/MemoryMatch";
import SlidingPuzzle from "@/components/puzzles/SlidingPuzzle";
import Hangman from "@/components/puzzles/Hangman";
import SimonSays from "@/components/puzzles/SimonSays";

type Puzzle = {
  key: string;
  name: string;
  note: string;
  Component: () => JSX.Element;
};

const PUZZLES: Puzzle[] = [
  {
    key: "wordscramble",
    name: "Word Scramble",
    note: "Unscramble a word from the craft, with a small hint.",
    Component: WordUnscramble,
  },
  {
    key: "tictactoe",
    name: "Tic-Tac-Toe",
    note: "Three in a row, against a machine that does not cheat but will not let you either.",
    Component: TicTacToe,
  },
  {
    key: "guessnumber",
    name: "Find the Number",
    note: "One to one hundred. Fewer tries is better.",
    Component: GuessNumber,
  },
  {
    key: "lightsout",
    name: "Lights Out",
    note: "Click a tile to flip it and its neighbours. Turn every light off.",
    Component: LightsOut,
  },
  {
    key: "memorymatch",
    name: "Memory Match",
    note: "Flip two cards. Match the glyphs. Clear the table.",
    Component: MemoryMatch,
  },
  {
    key: "sliding",
    name: "Sliding Tiles",
    note: "The fifteen puzzle. Slide tiles into order, one to fifteen.",
    Component: SlidingPuzzle,
  },
  {
    key: "hangman",
    name: "Hangman",
    note: "Guess the word, one letter at a time. Six wrong guesses and the gallows.",
    Component: Hangman,
  },
  {
    key: "simon",
    name: "Simon Says",
    note: "Watch the sequence and repeat it. Each round adds one step.",
    Component: SimonSays,
  },
];

function pickRandomIndex(exclude?: number): number {
  if (PUZZLES.length <= 1) return 0;
  let i = Math.floor(Math.random() * PUZZLES.length);
  if (exclude !== undefined) {
    while (i === exclude) i = Math.floor(Math.random() * PUZZLES.length);
  }
  return i;
}

export default function Special() {
  const [index, setIndex] = useState<number>(() => pickRandomIndex());
  const [nonce, setNonce] = useState(0);
  const puzzle = useMemo(() => PUZZLES[index], [index]);
  const { Component } = puzzle;

  const cycle = () => {
    setIndex(pickRandomIndex(index));
    setNonce((n) => n + 1);
  };

  const restart = () => setNonce((n) => n + 1);

  return (
    <>
      <SiteHeader />
      <main>
        <header className="border-b rule-soft">
          <div className="shell py-14 md:py-20">
            <p className="sig">The Back Pages</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-[-0.03em] mt-2 text-balance">
              Amusements.
            </h1>
            <p className="mt-5 max-w-prose font-serif-body text-[1.075rem] leading-[1.6] text-ink-soft">
              A short puzzle, different on every reload. For when you need a minute
              before the résumé speaks again. Eight in rotation: word scramble,
              tic-tac-toe, a number between one and a hundred, lights out, memory
              match, sliding tiles, hangman, and simon says.
            </p>
          </div>
        </header>

        <section>
          <div className="shell py-14 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b rule pb-4 mb-10">
              <div className="min-w-0">
                <p className="mg-label">Today's puzzle</p>
                <h2 className="font-display text-2xl md:text-3xl mt-1 tracking-tight">
                  {puzzle.name}
                </h2>
                <p className="mt-1 font-serif-body text-[15px] text-ink-soft max-w-prose">
                  {puzzle.note}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={restart}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-2 text-muted-foreground hover:text-ink transition-colors"
                >
                  Restart
                </button>
                <button
                  type="button"
                  onClick={cycle}
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-2 border rule hover:bg-ink hover:text-paper transition-colors"
                >
                  <Shuffle size={13} strokeWidth={1.6} aria-hidden />
                  <span>Different puzzle</span>
                </button>
              </div>
            </div>

            {/* key forces remount on cycle / restart so game state resets. */}
            <Component key={`${puzzle.key}-${nonce}`} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
