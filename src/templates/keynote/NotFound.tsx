import { useLocation } from "react-router-dom";

export default function NotFound() {
  const loc = useLocation();
  return (
    <main>
      <section className="slide">
        <div className="slide-grid" aria-hidden />
        <div className="relative mx-auto w-full max-w-[1080px] px-6 sm:px-8 md:px-10 text-center">
          <p className="sig justify-center">404 · No such slide</p>
          <h1 className="mt-7 font-display leading-[0.95] tracking-[-0.045em]
                         text-[clamp(3rem,12vw,8rem)]"
              style={{ color: "hsl(var(--ink))" }}>
            Slide not found.
          </h1>
          <p className="mt-6 text-[clamp(1rem,1.5vw,1.25rem)]"
             style={{ color: "hsl(var(--ink-soft))" }}>
            There&apos;s nothing at{" "}
            <code className="px-2 py-1 text-[0.9em] font-mono"
                  style={{
                    background: "hsl(var(--accent-wash))",
                    color: "hsl(var(--accent-deep))",
                    borderRadius: "var(--radius)",
                  }}>
              {loc.pathname}
            </code>{" "}
            in this deck.
          </p>
          <div className="mt-9">
            <a className="a-arrow inline-flex items-center gap-1.5" href="/">
              Back to slide one <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
