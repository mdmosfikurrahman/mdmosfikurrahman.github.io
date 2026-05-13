import { Fragment, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

const messages: string[] = [
  "Nothing at {path}.",
  "The router considered {path} and chose silence.",
  "{path} isn't a route on this site.",
  "Closer inspection confirms: {path} doesn't exist here.",
  "I checked the sitemap. {path} isn't on it.",
  "{path} parses as valid English, just not as a route.",
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
  const message = useMemo(
    () => messages[Math.floor(Math.random() * messages.length)],
    [],
  );

  return (
    <main>
      <section className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 py-24 md:py-36">
        <p className="text-[13px] font-medium" style={{ color: "hsl(var(--accent))" }}>
          404
        </p>
        <h1 className="mt-3 font-display text-[44px] md:text-[64px] leading-[1.05] tracking-[-0.03em]"
            style={{ color: "hsl(var(--ink))" }}>
          Page not found.
        </h1>
        <p className="mt-5 max-w-prose text-[16px] leading-[1.6]"
           style={{ color: "hsl(var(--ink-soft))" }}>
          {renderWithPath(message, loc.pathname)}
        </p>
        <div className="mt-8">
          <a className="a-arrow inline-flex items-center gap-1.5" href="/">
            Back to home <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
