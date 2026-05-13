import { Fragment, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

const messages: string[] = [
  "The Animus cannot locate {path} in this memory thread.",
  "{path} is desynchronized. The memory has fragmented.",
  "No record of {path} in the Brotherhood's archives.",
  "{path} lies outside the synchronized window.",
];

function renderWithPath(message: string, path: string): ReactNode[] {
  const parts = message.split("{path}");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <code className="px-1.5 py-0.5 text-[13px]"
              style={{
                border: "1px solid hsl(var(--accent))",
                color: "hsl(var(--accent))",
                fontFamily: "JetBrains Mono, monospace",
              }}>
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
        <p className="font-display text-[10px] uppercase tracking-[0.36em]"
           style={{ color: "hsl(var(--signal-crit))" }}>
          ✦ Desynchronization · Error 404
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-6xl uppercase tracking-[0.02em] leading-[1.05]"
            style={{ color: "hsl(var(--ink))" }}>
          Memory not found.
        </h1>
        <p className="mt-6 max-w-prose text-[16px] leading-[1.6]"
           style={{ color: "hsl(var(--ink-soft))" }}>
          {renderWithPath(message, loc.pathname)}
        </p>
        <div className="mt-8">
          <a href="/" className="a-arrow font-display tracking-[0.12em] uppercase inline-flex items-center gap-1.5">
            <span style={{ color: "hsl(var(--accent))" }}>I ·</span> Return to Sync <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
