import { useLocation } from "react-router-dom";

export default function NotFound() {
  const loc = useLocation();
  return (
    <main>
      <section className="slide">
        <div className="kn-glow" aria-hidden />
        <span className="kn-ghost" aria-hidden>404</span>
        <div className="relative mx-auto w-full max-w-[1120px] px-6 sm:px-10 text-center">
          <p className="sig justify-center">No such slide</p>
          <h1 className="mt-8 font-display leading-[0.92] tracking-[-0.05em]
                         text-[clamp(3.5rem,13vw,9rem)]"
              style={{ color: "hsl(var(--ink))" }}>
            Slide <span className="kn-mark">not found.</span>
          </h1>
          <p className="mt-7 text-[clamp(1rem,1.5vw,1.3rem)]"
             style={{ color: "hsl(var(--ink-soft))" }}>
            Nothing at{" "}
            <code className="px-2 py-1 text-[0.85em] font-mono rounded-lg"
                  style={{ background: "hsl(var(--accent-wash))", color: "hsl(var(--accent-deep))" }}>
              {loc.pathname}
            </code>{" "}
            in this deck.
          </p>
          <div className="mt-10">
            <a href="/"
               className="inline-flex items-center gap-2 px-5 py-3 text-[15px] font-semibold rounded-full transition-transform hover:-translate-y-0.5"
               style={{ background: "hsl(var(--accent))", color: "hsl(var(--paper))" }}>
              Back to slide one →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
