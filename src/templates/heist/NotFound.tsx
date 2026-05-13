import { Fragment, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

const messages: string[] = [
  "{path} is not on the plan.",
  "The Professor never drew {path}.",
  "We blew through {path}. Nothing inside.",
  "{path} was a decoy. Keep moving.",
];

function renderWithPath(message: string, path: string): ReactNode[] {
  const parts = message.split("{path}");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <code className="px-1.5 py-0.5 text-[13px] font-mono"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--paper))" }}>
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
        <p className="font-display text-[11px] uppercase tracking-[0.28em] font-bold"
           style={{ color: "hsl(var(--signal-crit))" }}>
          ● Off the plan · 404
        </p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[0.98] tracking-[-0.035em] font-bold"
            style={{ color: "hsl(var(--ink))" }}>
          Wrong door.
        </h1>
        <p className="mt-6 max-w-prose text-[16px] leading-[1.6]"
           style={{ color: "hsl(var(--ink-soft))" }}>
          {renderWithPath(message, loc.pathname)}
        </p>
        <p className="mt-4 font-script text-[20px]" style={{ color: "hsl(var(--accent))" }}>
          Bella Ciao.
        </p>
        <div className="mt-8">
          <a href="/"
             className="a-arrow inline-flex items-center gap-1.5 font-display uppercase tracking-[0.08em] font-semibold">
            <span style={{ color: "hsl(var(--accent))" }}>01 ·</span> Back to the plan <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
