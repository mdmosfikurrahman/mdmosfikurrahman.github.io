import { Fragment, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

const messages: string[] = [
  "{path} was not inverted in time.",
  "Going both ways leads nowhere at {path}.",
  "{path} folds onto nothing.",
  "Tomorrow, {path} was already missing.",
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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em]"
           style={{ color: "hsl(var(--signal-crit))" }}>
          ◑ Inversion failed · 404
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.03em]"
            style={{ color: "hsl(var(--ink))" }}>
          <span style={{ color: "hsl(var(--accent))" }}>The path</span>{" "}
          <span style={{ color: "hsl(var(--signal-crit))" }}>htap ehT</span>
        </h1>
        <p className="mt-6 max-w-prose text-[16px] leading-[1.6]"
           style={{ color: "hsl(var(--ink-soft))" }}>
          {renderWithPath(message, loc.pathname)}
        </p>
        <div className="mt-8">
          <a href="/" className="a-arrow font-mono uppercase tracking-[0.12em] inline-flex items-center gap-1.5">
            <span style={{ color: "hsl(var(--accent))" }}>→</span> Forward to index <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
