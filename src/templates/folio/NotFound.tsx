import { Fragment, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

const messages: string[] = [
  "We can't find anything at {path}.",
  "{path} is not a known route on this site.",
  "The page you're looking for isn't here.",
  "{path} either moved or never existed.",
];

function renderWithPath(message: string, path: string): ReactNode[] {
  const parts = message.split("{path}");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <code className="px-1.5 py-0.5 text-[13px] rounded"
              style={{
                background: "hsl(var(--paper-deep))",
                color: "hsl(var(--accent))",
                border: "1px solid hsl(var(--rule))",
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
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
      <section className="mx-auto w-full max-w-[960px] px-5 sm:px-6 md:px-8 py-24 md:py-32">
        <p className="text-[13px] font-medium" style={{ color: "hsl(var(--accent))" }}>
          Error 404
        </p>
        <h1 className="mt-3 font-display text-[44px] md:text-[60px] leading-[1.05] tracking-[-0.025em]"
            style={{ color: "hsl(var(--ink))" }}>
          Page not found.
        </h1>
        <p className="mt-5 max-w-prose text-[16px] leading-[1.6]"
           style={{ color: "hsl(var(--ink-soft))" }}>
          {renderWithPath(message, loc.pathname)}
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          <a className="a-arrow inline-flex items-center gap-1.5" href="/">
            Back to home <span aria-hidden>→</span>
          </a>
          <a className="a-arrow inline-flex items-center gap-1.5" href="/experience">
            See my work <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
