import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "showing" | "awaiting" | "over";

const PADS = [
  { id: 0, label: "I" },
  { id: 1, label: "II" },
  { id: 2, label: "III" },
  { id: 3, label: "IV" },
];

const FLASH_MS = 360;
const GAP_MS = 180;

export default function SimonSays() {
  const [seq, setSeq] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState<number | null>(null);
  const [userIdx, setUserIdx] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (phase !== "showing") return;
    clearTimers();
    let t = 400;
    seq.forEach((pad) => {
      timers.current.push(window.setTimeout(() => setLit(pad), t));
      t += FLASH_MS;
      timers.current.push(window.setTimeout(() => setLit(null), t));
      t += GAP_MS;
    });
    timers.current.push(
      window.setTimeout(() => {
        setPhase("awaiting");
        setUserIdx(0);
      }, t),
    );
  }, [phase, seq]);

  const start = () => {
    clearTimers();
    setSeq([Math.floor(Math.random() * 4)]);
    setUserIdx(0);
    setLit(null);
    setPhase("showing");
  };

  const press = (pad: number) => {
    if (phase !== "awaiting") return;
    setLit(pad);
    timers.current.push(window.setTimeout(() => setLit(null), 200));

    if (pad !== seq[userIdx]) {
      setPhase("over");
      return;
    }
    const next = userIdx + 1;
    if (next < seq.length) {
      setUserIdx(next);
      return;
    }
    timers.current.push(
      window.setTimeout(() => {
        setSeq((s) => [...s, Math.floor(Math.random() * 4)]);
        setUserIdx(0);
        setPhase("showing");
      }, 500),
    );
  };

  const reset = () => {
    clearTimers();
    setSeq([]);
    setUserIdx(0);
    setLit(null);
    setPhase("idle");
  };

  const round = Math.max(1, seq.length);
  const status =
    phase === "idle"
      ? "Press start to begin."
      : phase === "showing"
        ? `Round ${seq.length} — watch.`
        : phase === "awaiting"
          ? `Round ${seq.length} — your turn.`
          : `Lost at round ${round}.`;

  return (
    <div className="max-w-[22rem]">
      <p className="font-serif-body text-[15px] text-ink-soft mb-4">
        Watch the sequence, then repeat it. Each round adds one step.
      </p>

      <div className="grid grid-cols-2 gap-1.5 aspect-square">
        {PADS.map((p) => {
          const isLit = lit === p.id;
          const interactive = phase === "awaiting";
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => press(p.id)}
              disabled={!interactive}
              className={[
                "grid place-items-center border rule font-display text-3xl md:text-4xl transition-all duration-150",
                isLit
                  ? "bg-accent text-paper border-accent scale-[0.98]"
                  : "bg-paper-deep/40 text-ink-soft",
                interactive ? "hover:bg-paper-deep/70 cursor-pointer" : "cursor-default",
              ].join(" ")}
              aria-label={`Pad ${p.label}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {status}
        </p>
        <div className="flex items-center gap-3">
          {(phase === "idle" || phase === "over") && (
            <button
              type="button"
              onClick={start}
              className="font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-2 border rule hover:bg-ink hover:text-paper transition-colors"
            >
              {phase === "over" ? "Try again" : "Start"}
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent hover:underline"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
