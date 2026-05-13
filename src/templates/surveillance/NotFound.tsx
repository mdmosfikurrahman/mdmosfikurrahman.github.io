import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
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
        <code className="font-mono text-[12px] px-1.5 py-0.5 border rule"
              style={{ color: "hsl(var(--accent))", background: "hsl(var(--accent) / 0.06)" }}>
          {path}
        </code>
      )}
    </Fragment>
  ));
}

export default function NotFound() {
  const loc = useLocation();
  const message = useMemo(
    () => savage404Messages[Math.floor(Math.random() * savage404Messages.length)],
    [],
  );

  // Hex serial code that ticks gently for atmosphere
  const [serial, setSerial] = useState(genSerial());
  useEffect(() => {
    const id = setInterval(() => setSerial(genSerial()), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <main>
      <section className="shell py-20 md:py-32 relative">
        {/* HUD strip */}
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] flex items-center gap-3 flex-wrap"
             style={{ color: "hsl(var(--muted))" }}>
          <span className="blink-dot crit" />
          <span style={{ color: "hsl(var(--signal-crit))" }}>SUBJECT NOT FOUND</span>
          <span className="opacity-50">//</span>
          <span>CLASSIFICATION : IRRELEVANT</span>
          <span className="opacity-50">//</span>
          <span>SCAN {serial}</span>
        </div>

        <p className="sig mt-6" style={{ color: "hsl(var(--signal-crit))" }}>
          ERROR 404 · NO MATCH IN INDEX
        </p>

        <h1 className="mt-3 font-display text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.02em] uppercase">
          <span className="glitch" data-text="NOT IN THE ARCHIVE.">
            NOT IN THE ARCHIVE.
          </span>
        </h1>

        <p className="mt-7 max-w-prose text-[15px] md:text-[16px] leading-[1.65]"
           style={{ color: "hsl(var(--ink-soft))" }}>
          <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
          {renderWithPath(message, loc.pathname)}
        </p>

        <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3">
          <a className="a-arrow" href="/">
            <span style={{ color: "hsl(var(--accent))" }}>[ RETURN TO INDEX ]</span>
            <span className="arw">→</span>
          </a>
          <a className="a-arrow" href="/about">
            <span style={{ color: "hsl(var(--accent))" }}>[ OPEN DOSSIER ]</span>
            <span className="arw">→</span>
          </a>
        </div>

        {/* Console echo */}
        <pre className="mt-12 max-w-[64ch] font-mono text-[11.5px] leading-[1.7] border rule p-4"
             style={{ color: "hsl(var(--muted))", background: "hsl(var(--paper-glass) / 0.5)" }}>
          <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
          GET {loc.pathname} HTTP/1.1{"\n"}
          <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
          status .................. 404 NOT FOUND{"\n"}
          <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
          handler ................. /dev/null{"\n"}
          <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
          sitemap_match ........... no{"\n"}
          <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
          retry_recommended ....... no<span className="caret" />
        </pre>
      </section>
    </main>
  );
}

function genSerial() {
  const chars = "0123456789ABCDEF";
  let s = "0x";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * 16)];
  return s;
}
