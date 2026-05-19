// Keynote = a real presentation deck. This component (rendered globally by
// App, inside the Router) takes over the home route "/" with a full-screen,
// one-slide-at-a-time deck: animated transitions, arrow-key + on-screen
// button + swipe navigation, dots and a slide counter. On every other route
// it renders nothing, so sub-pages behave normally.
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sun, Moon, ExternalLink } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { profile } from "@/lib/content";
import { SLIDES } from "./slides";

const EASE = [0.22, 1, 0.36, 1] as const;

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 70 : -70 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -70 : 70 }),
};

export default function KeynoteDeck() {
  const loc = useLocation();
  const { theme, toggle } = useTheme();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const touchX = useRef<number | null>(null);
  const total = SLIDES.length;

  const go = useCallback((to: number, d: number) => {
    setState(([cur]) => {
      const next = Math.max(0, Math.min(total - 1, to));
      return next === cur ? [cur, d] : [next, d];
    });
  }, [total]);

  const next = useCallback(() => setState(([c]) => [Math.min(total - 1, c + 1), 1]), [total]);
  const prev = useCallback(() => setState(([c]) => [Math.max(0, c - 1), -1]), []);

  const onHome = loc.pathname === "/";

  useEffect(() => {
    if (!onHome) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
      else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
      else if (e.key === "Home") { e.preventDefault(); go(0, -1); }
      else if (e.key === "End") { e.preventDefault(); go(total - 1, 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onHome, next, prev, go, total]);

  // Lock background scroll while the deck owns the screen.
  useEffect(() => {
    if (!onHome) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [onHome]);

  if (!onHome) return null;

  const slide = SLIDES[index];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col"
         style={{ background: "hsl(var(--paper))", color: "hsl(var(--ink))" }}>
      {/* progress rail */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{ background: "hsl(var(--rule-soft))" }}>
        <div className="h-full transition-[width] duration-300"
             style={{ width: `${((index + 1) / total) * 100}%`, background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent-deep)))" }} />
      </div>

      {/* top bar */}
      <header className="shrink-0 h-14 px-5 sm:px-8 flex items-center justify-between border-b rule-soft">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-display text-[14px] tracking-[-0.02em] truncate" style={{ color: "hsl(var(--ink))" }}>
            {profile.name}
          </span>
          <span className="hidden sm:inline font-mono text-[9px] px-2 py-0.5 uppercase tracking-[0.18em] rounded-full shrink-0"
                style={{ border: "1px solid hsl(var(--rule))", color: "hsl(var(--muted))" }}>
            Interview Deck
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono text-[11px] tracking-[0.14em]" style={{ color: "hsl(var(--whisper))" }}>
            {slide.label}
          </span>
          <Link to="/about" title="Open full site"
                className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors hover:text-[hsl(var(--accent))]"
                style={{ color: "hsl(var(--muted))" }}>
            Full site <ExternalLink size={12} strokeWidth={2} />
          </Link>
          <button onClick={toggle} aria-label="Toggle theme"
                  className="w-8 h-8 grid place-items-center rounded-full transition-colors"
                  style={{ color: "hsl(var(--muted))" }}
                  title={theme === "dark" ? "Light" : "Dark"}>
            {theme === "dark" ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
          </button>
        </div>
      </header>

      {/* stage */}
      <main className="relative flex-1 min-h-0 overflow-hidden"
            onTouchStart={(e) => { touchX.current = e.changedTouches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current == null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (dx < -50) next(); else if (dx > 50) prev();
              touchX.current = null;
            }}>
        <div className="kn-glow" aria-hidden />
        <span className="kn-ghost" aria-hidden>{String(index + 1).padStart(2, "0")}</span>

        <AnimatePresence custom={dir} mode="wait" initial={false}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: EASE }}
            className="absolute inset-0 flex items-center justify-center px-5 sm:px-10 py-8 overflow-y-auto"
          >
            <div className="w-full max-w-[1120px] mx-auto">
              {slide.render()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* side arrows */}
        <button onClick={prev} disabled={index === 0} aria-label="Previous slide"
                className="hidden md:grid place-items-center absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full transition-all disabled:opacity-25 disabled:pointer-events-none hover:scale-105"
                style={{ background: "hsl(var(--paper-glass) / 0.7)", border: "1px solid hsl(var(--rule))", color: "hsl(var(--ink))", backdropFilter: "blur(4px)" }}>
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <button onClick={next} disabled={index === total - 1} aria-label="Next slide"
                className="hidden md:grid place-items-center absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full transition-all disabled:opacity-25 disabled:pointer-events-none hover:scale-105"
                style={{ background: "hsl(var(--paper-glass) / 0.7)", border: "1px solid hsl(var(--rule))", color: "hsl(var(--ink))", backdropFilter: "blur(4px)" }}>
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </main>

      {/* control bar */}
      <footer className="shrink-0 h-16 px-5 sm:px-8 flex items-center justify-between gap-4 border-t rule-soft">
        <button onClick={prev} disabled={index === 0}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors disabled:opacity-30 disabled:pointer-events-none"
                style={{ color: "hsl(var(--ink))" }}>
          <ChevronLeft size={16} strokeWidth={2.2} /> <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[55vw] px-2">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => go(i, i > index ? 1 : -1)} aria-label={`Go to ${s.label}`} title={s.label}
                    className="shrink-0 rounded-full transition-all"
                    style={{
                      width: i === index ? 22 : 7, height: 7,
                      background: i === index ? "hsl(var(--accent))" : "hsl(var(--rule))",
                    }} />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[12px] tabular-nums tracking-[0.1em]" style={{ color: "hsl(var(--whisper))" }}>
            <b style={{ color: "hsl(var(--ink))" }}>{String(index + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
          </span>
          <button onClick={next} disabled={index === total - 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all disabled:opacity-30 disabled:pointer-events-none hover:-translate-y-0.5"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--paper))" }}>
            <span className="hidden sm:inline">Next</span> <ChevronRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </footer>
    </div>
  );
}
