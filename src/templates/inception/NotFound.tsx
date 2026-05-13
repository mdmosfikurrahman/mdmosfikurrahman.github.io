import { Fragment, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

const messages: string[] = [
  "No blueprint on file for {path}.",
  "{path} is not on this level. Check a lower dream.",
  "The plan for {path} was never drafted.",
  "{path} folds back to nothing.",
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
        <p className="font-mono text-[11px] uppercase tracking-[0.22em]"
           style={{ color: "hsl(var(--signal-crit))" }}>
          ▾ Plate not filed · 404
        </p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.03em]"
            style={{ color: "hsl(var(--ink))" }}>
          Off the blueprint.
        </h1>
        <p className="mt-6 max-w-prose text-[16px] leading-[1.6]"
           style={{ color: "hsl(var(--ink-soft))" }}>
          {renderWithPath(message, loc.pathname)}
        </p>
        <div className="mt-8">
          <a href="/" className="a-arrow font-mono inline-flex items-center gap-1.5">
            <span style={{ color: "hsl(var(--accent))" }}>00 ·</span> Back to level zero <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
