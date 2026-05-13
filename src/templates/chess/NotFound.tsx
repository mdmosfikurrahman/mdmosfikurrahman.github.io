import { Fragment, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

const messages: string[] = [
  "Illegal move: {path}.",
  "{path} is not in the opening book.",
  "The arbiter has no record of {path}.",
  "{path} would lose material immediately.",
];

function renderWithPath(message: string, path: string): ReactNode[] {
  const parts = message.split("{path}");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <code className="px-1.5 py-0.5 text-[13px] font-mono"
              style={{ border: "1px solid hsl(var(--accent))", color: "hsl(var(--accent))" }}>
          {path}
        </code>
      )}
    </Fragment>
  ));
}

export default function NotFound() {
  const loc = useLocation();
  const message = useMemo(() => messages[Math.floor(Math.random() * messages.length)], []);
  return (
    <main>
      <section className="shell py-24 md:py-32">
        <p className="font-mono text-[12px]"
           style={{ color: "hsl(var(--signal-crit))" }}>
          ♚ 1–0 · Resigned · 404
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.02em]"
            style={{ color: "hsl(var(--ink))" }}>
          Illegal position.
        </h1>
        <p className="mt-6 max-w-prose text-[17px] leading-[1.55]"
           style={{ color: "hsl(var(--ink-soft))" }}>
          {renderWithPath(message, loc.pathname)}
        </p>
        <div className="mt-8">
          <a href="/" className="a-arrow inline-flex items-baseline gap-1.5">
            <span className="font-mono" style={{ color: "hsl(var(--accent))" }}>1.e4</span>
            <span className="font-display">Reset the board</span>
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
