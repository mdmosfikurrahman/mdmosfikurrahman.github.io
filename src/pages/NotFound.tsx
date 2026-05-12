import { Fragment, useMemo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

const savage404Messages: string[] = [
  "Nothing answers to {path} — and after seeing it, nothing volunteers either.",
  "The router considered {path}, then chose silence.",
  "{path} is not a route. It is a hypothesis the server has declined to entertain.",
  "Bold of you to type {path} and expect prose.",
  "If {path} were a pull request, it would have been closed without comment.",
  "Somewhere, an autocomplete weeps for {path}.",
  "I checked the sitemap, the source, and the spirit of the thing — {path} is absent on all three counts.",
  "{path} returned a 404 the moment I read it; the HTTP layer was a formality.",
  "Routing matched {path} against every pattern and reported a unanimous no.",
  "{path} is the kind of URL one types when one has stopped reading.",
  "The handler for {path} lives in a parallel repo, in a parallel universe.",
  "{path} would have been a fine name for a feature, had anyone shipped it.",
  "Two paths diverged in this codebase; {path} wasn't either of them.",
  "{path} resolves to exactly the page it deserves: this one.",
  "Curiosity is admirable; {path} is not.",
  "{path} is reserved for a future I have no plans to build.",
  "The cache cannot help you — {path} was never warm to begin with.",
  "{path} parses as valid English, just not as a route on this site.",
];

function renderWithPath(message: string, path: string): ReactNode[] {
  const parts = message.split("{path}");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <code className="font-mono text-[13px] px-1.5 py-0.5 border rule bg-paper-deep">
          {path}
        </code>
      )}
    </Fragment>
  ));
}

export default function NotFound() {
  const loc = useLocation();
  const message = useMemo(
    () =>
      savage404Messages[
        Math.floor(Math.random() * savage404Messages.length)
      ],
    [],
  );

  return (
    <main>
      <section className="shell py-24 md:py-36">
        <p className="sig">Errata · 404</p>
        <h1 className="mt-2 font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.03em]">
          Not in the archive.
        </h1>
        <p className="mt-5 max-w-prose font-serif-body text-[1.075rem] leading-[1.6] text-ink-soft">
          {renderWithPath(message, loc.pathname)}
        </p>
        <div className="mt-8">
          <a className="a-arrow" href="/">
            Return <span className="arw">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
