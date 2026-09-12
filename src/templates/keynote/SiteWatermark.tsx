// Keynote = a real presentation deck. This component (rendered globally by
// App, inside the Router) takes over the home route "/" with a full-screen,
// one-slide-at-a-time deck: animated transitions, arrow-key + on-screen
// button + swipe navigation, dots and a slide counter. On every other route
// it renders nothing, so sub-pages behave normally.
import { useCallback, useEffect, useRef, useState, type WheelEvent } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, Sun, Moon, ExternalLink } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTemplate } from "@/lib/template";
import { profile } from "@/lib/content";
import { deckFor } from "./slides";

const EASE = [0.22, 1, 0.36, 1] as const;

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 70 : -70 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -70 : 70 }),
};

export default function KeynoteDeck() {
  const loc = useLocation();
  const { theme, toggle } = useTheme();
  const { template } = useTemplate();
  const DECK = deckFor(template);
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const touchX = useRef<number | null>(null);
  const total = DECK.length;

  // Switching decks (e.g. remote sync) can leave the index out of range.
  useEffect(() => {
    setState(([cur]) => (cur >= total ? [0, -1] : [cur, 0]));
  }, [total]);

  const go = useCallback((to: number, d: number) => {
    setState(([cur]) => {
      const next = Math.max(0, Math.min(total - 1, to));
      return next === cur ? [cur, d] : [next, d];
    });
  }, [total]);

  const next = useCallback(() => setState(([c]) => [Math.min(total - 1, c + 1), 1]), [total]);
  const prev = useCallback(() => setState(([c]) => [Math.max(0, c - 1), -1]), []);

  // The scrolling element of the current slide. Tall slides (paper dossiers,
  // publication lists) have to scroll internally before the deck advances,
  // or their bottom is unreachable on a laptop screen.
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  // A slide counts as scrollable the moment it overflows at all. The previous
  // 120px threshold meant a slide overflowing by less than that could never be
  // scrolled: the wheel advanced instead and the tail was simply unreadable.
  const scrollInfo = useCallback(() => {
    const el = stageRef.current;
    if (!el) return null;
    const oy = getComputedStyle(el).overflowY;
    if (oy !== "auto" && oy !== "scroll") return null;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 8) return null;
    return { el, max, atTop: el.scrollTop <= 2, atBottom: el.scrollTop >= max - 2 };
  }, []);

  // Wheel / trackpad: scroll the slide first, advance only at its edge.
  // One gesture = one slide (cooldown lock prevents skipping several).
  const wheelLock = useRef(false);
  const onWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    const down = e.deltaY > 0;
    const s = scrollInfo();
    if (s && ((down && !s.atBottom) || (!down && !s.atTop))) return;
    if (Math.abs(e.deltaY) < 4 || wheelLock.current) return;
    wheelLock.current = true;
    window.setTimeout(() => { wheelLock.current = false; }, 650);
    if (down) next(); else prev();
  }, [next, prev, scrollInfo]);

  const onHome = loc.pathname === "/";

  useEffect(() => {
    if (!onHome) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      // Left/right always move the deck, which is what a presenter's clicker
      // sends. Up/down/page/space read a tall slide first and only move the
      // deck once it is at its edge, so a long slide is never skipped unread.
      if (e.key === "ArrowRight") { e.preventDefault(); next(); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); return; }
      const fwd = ["ArrowDown", "PageDown", " "].includes(e.key);
      const back = ["ArrowUp", "PageUp"].includes(e.key);
      if (fwd || back) {
        e.preventDefault();
        const s = scrollInfo();
        if (s && ((fwd && !s.atBottom) || (back && !s.atTop))) {
          const step = s.el.clientHeight * 0.82;
          s.el.scrollBy({ top: fwd ? step : -step, behavior: "smooth" });
          return;
        }
        if (fwd) next(); else prev();
        return;
      }
      if (e.key === "Home") { e.preventDefault(); go(0, -1); }
      else if (e.key === "End") { e.preventDefault(); go(total - 1, 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onHome, next, prev, go, total, scrollInfo]);

  // Does the current slide overflow? AnimatePresence runs mode="wait", so the
  // incoming slide only mounts once the outgoing one has finished exiting:
  // measuring on an index change would read the old element. The measurement
  // is therefore driven by the slide's own onAnimationComplete, plus resize.
  // Shown only while there is still something below the fold, so the hint
  // disappears once the presenter has read to the end of the slide.
  const measure = useCallback(() => {
    const el = stageRef.current;
    if (!el) { setOverflowing(false); return; }
    const max = el.scrollHeight - el.clientHeight;
    setOverflowing(max > 8 && el.scrollTop < max - 8);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [onHome, measure]);

  // Hide the hint the moment the slide changes; onAnimationComplete restores
  // it if the new slide is also tall.
  useEffect(() => { setOverflowing(false); }, [index]);

  // Lock background scroll while the deck owns the screen.
  useEffect(() => {
    if (!onHome) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [onHome]);

  if (!onHome) return null;

  const slide = DECK[index];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden"
         style={{ background: "hsl(var(--paper))", color: "hsl(var(--ink))" }}>
      {/* progress rail */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{ background: "hsl(var(--rule-soft))" }}>
        <div className="h-full transition-[width] duration-300"
             style={{ width: `${((index + 1) / total) * 100}%`, background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent-deep)))" }} />
      </div>

      {/* top bar */}
      <header className="shrink-0 h-14 px-4 sm:px-8 flex items-center justify-between gap-3 border-b rule-soft">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={() => go(0, -1)}
                  className="font-display text-[14px] tracking-[-0.02em] truncate transition-colors hover:text-[hsl(var(--accent))]"
                  style={{ color: "hsl(var(--ink))" }}
                  title="Back to the first slide">
            {profile.name}
          </button>
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

        {/* Consistent in-slide page number — same place & format on every slide */}
        <div className="absolute top-4 right-5 sm:right-8 z-20 kn-step pointer-events-none select-none">
          <b>{String(index + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
        </div>

        <AnimatePresence custom={dir} mode="wait" initial={false}>
          <motion.div
            key={index}
            ref={stageRef}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: EASE }}
            onAnimationComplete={measure}
            onWheel={onWheel}
            onScroll={measure}
            // Every slide scrolls, the cover included. On a 700px-high laptop
            // the cover overflows by ~470px, and with overflow-hidden that
            // content was simply unreachable.
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
          >
            {/* `m-auto` centres the slide when it fits and collapses to zero
                when it does not. `items-center` would centre the overflow too,
                putting the top of a tall slide above the scroll origin where
                it can never be reached. */}
            <div className="min-h-full flex px-4 sm:px-8 lg:px-12 py-5 sm:py-7">
              <div className="w-full max-w-[1400px] m-auto kn-fit">
                {slide.render()}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tall slides say so, otherwise a presenter cannot tell the slide
            continues below the fold. */}
        {overflowing && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none
                          flex items-center gap-1.5 px-2.5 py-1 rounded-full kn-step"
               style={{ background: "hsl(var(--paper-glass) / 0.72)", border: "1px solid hsl(var(--rule))",
                        backdropFilter: "blur(4px)" }}>
            <ChevronDown size={13} strokeWidth={2.2} className="kn-nudge" />
            <span>scroll</span>
          </div>
        )}

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
      <footer className="shrink-0 h-14 sm:h-16 px-4 sm:px-8 flex items-center justify-between gap-3 border-t rule-soft">
        <button onClick={prev} disabled={index === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold transition-colors disabled:opacity-30 disabled:pointer-events-none"
                style={{ color: "hsl(var(--ink))", border: "1px solid hsl(var(--rule))" }}>
          <ChevronLeft size={16} strokeWidth={2.2} /> <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="kn-dots hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-[46vw] px-2 py-1">
          {DECK.map((s, i) => (
            <span key={i} className="relative shrink-0 group grid place-items-center h-4">
              <span aria-hidden
                    className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                               whitespace-nowrap rounded-md px-2 py-1 text-[10.5px] font-medium
                               opacity-0 translate-y-1 transition-all duration-150
                               group-hover:opacity-100 group-hover:translate-y-0"
                    style={{
                      background: "hsl(var(--paper-glass))",
                      border: "1px solid hsl(var(--rule))",
                      color: "hsl(var(--ink))",
                      boxShadow: "0 8px 24px -12px hsl(var(--ink) / 0.4)",
                    }}>
                <b className="font-mono mr-1.5" style={{ color: "hsl(var(--accent))" }}>
                  {String(i + 1).padStart(2, "0")}
                </b>
                {s.label}
              </span>
              <button onClick={() => go(i, i > index ? 1 : -1)} aria-label={`Go to ${s.label}`} title={s.label}
                      className="rounded-full transition-all"
                      style={{
                        width: i === index ? 22 : 7, height: 7,
                        background: i === index ? "hsl(var(--accent))" : "hsl(var(--rule))",
                      }} />
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] tabular-nums tracking-[0.1em] text-right tnum"
                style={{ color: "hsl(var(--whisper))", minWidth: "5.5ch", fontFeatureSettings: '"tnum" 1' }}>
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
