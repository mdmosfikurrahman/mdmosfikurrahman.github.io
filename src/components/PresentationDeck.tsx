// Present mode: a full-screen, one-slide-at-a-time deck laid over the regular
// site. It mounts only while a presentation is running (see lib/presentation),
// so the portfolio underneath keeps its normal scrolling behaviour. Arrow keys,
// on-screen buttons and swipe navigate; Esc, or the Exit button, returns to the
// site exactly where the visitor was.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sun, Moon, X, Maximize, Minimize } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { DECKS, endPresentation, setDeck, usePresentation } from "@/lib/presentation";
import { profile } from "@/lib/content";
import { useAvatarUrl } from "@/lib/settings";
import { deckFor } from "@/presentation/slides";

const EASE = [0.22, 1, 0.36, 1] as const;

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 70 : -70 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -70 : 70 }),
};

// Scales a slide down until it fits the stage, so nothing is ever below the
// fold. Slides that already fit are left at 100% and centred. `zoom` shrinks
// the layout box too, so text reflows into the wider line and gets shorter;
// that is why the fit is solved iteratively instead of with one ratio.
// Below MIN_FIT text stops being readable, so a slide that still does not fit
// scrolls inside the stage instead. Phones and short landscape windows would
// need a scale no one can read, so there the floor is nearly full size.
const MIN_FIT = 0.7;
const COMPACT = "(max-width: 639px), (max-height: 520px)";
const COMPACT_MIN_FIT = 0.92;

function FitSlide({ children, scroller }: { children: ReactNode; scroller?: (el: HTMLDivElement | null) => void }) {
  const outer = useRef<HTMLDivElement | null>(null);
  const inner = useRef<HTMLDivElement>(null);
  const setOuter = useCallback((el: HTMLDivElement | null) => {
    outer.current = el;
    scroller?.(el);
  }, [scroller]);
  // Fades the bottom edge while a scrolling slide has more below.
  const markMore = useCallback(() => {
    const o = outer.current;
    if (o) o.dataset.more = String(o.scrollTop + o.clientHeight < o.scrollHeight - 2);
  }, []);

  const fit = useCallback(() => {
    const o = outer.current, el = inner.current;
    if (!o || !el) return;
    const cs = getComputedStyle(o);
    // Client sizes and paddings are layout pixels, getBoundingClientRect is screen
    // pixels; they differ once the page itself is zoomed on a wide screen.
    const unit = o.clientHeight ? o.getBoundingClientRect().height / o.clientHeight : 1;
    const avail = (o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) * unit;
    const floor = window.matchMedia(COMPACT).matches ? COMPACT_MIN_FIT : MIN_FIT;
    let z = 1;
    for (let i = 0; i < 8; i++) {
      el.style.zoom = String(z);
      const h = el.getBoundingClientRect().height;
      if (h <= avail + 1 || z <= floor) break;
      z = Math.max(floor, z * (avail / h) * 0.985);
    }
    markMore();
  }, [markMore]);

  useLayoutEffect(() => {
    fit();
    // Images and web fonts settle a moment after mount.
    const t1 = window.setTimeout(fit, 250);
    const t2 = window.setTimeout(fit, 900);
    const ro = new ResizeObserver(fit);
    if (outer.current) ro.observe(outer.current);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); ro.disconnect(); };
  }, [fit]);

  return (
    <div ref={setOuter} onScroll={markMore} className="kn-fit h-full flex overflow-y-auto overscroll-contain [scrollbar-width:thin] px-4 sm:px-8 lg:px-12 py-5 sm:py-7 [@media(max-height:760px)]:py-4">
      <div ref={inner} className="w-full max-w-[1400px] m-auto">{children}</div>
    </div>
  );
}

export default function PresentationDeck() {
  const { open, deck } = usePresentation();
  if (!open) return null;
  return <Deck key={deck} deckId={deck} />;
}

function Deck({ deckId }: { deckId: (typeof DECKS)[number]["id"] }) {
  const { theme, toggle } = useTheme();
  const avatar = useAvatarUrl();
  const DECK = deckFor(deckId);
  const [fullscreen, setFullscreen] = useState(false);
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);
  const setScroller = useCallback((el: HTMLDivElement | null) => {
    scroller.current = el;
  }, []);
  // A slide taller than the stage (phones) is read to its edge before the deck moves.
  const canScroll = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return false;
    return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2;
  }, []);
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

  // Slides are scaled to fit the screen (see FitSlide), so wheel / trackpad /
  // Down / Space mean "next slide". A slide that scrolls (phones) is read to its
  // edge first. One gesture = one slide (a cooldown stops it skipping several).
  const wheelLock = useRef(false);
  const onWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) < 4 || canScroll(e.deltaY > 0 ? 1 : -1) || wheelLock.current) return;
    wheelLock.current = true;
    window.setTimeout(() => { wheelLock.current = false; }, 650);
    if (e.deltaY > 0) next(); else prev();
  }, [next, prev, canScroll]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.key === "Escape") {
        // The first Esc leaves browser fullscreen on its own; only a second
        // one (or Esc outside fullscreen) ends the presentation.
        if (!document.fullscreenElement) endPresentation();
        return;
      }
      if (e.key === "f" || e.key === "F") { e.preventDefault(); toggleFullscreen(); return; }
      // Left/right always move the deck, which is what a presenter's clicker
      // sends. Up/down/page/space read a tall slide first and only move the
      // deck once it is at its edge, so a long slide is never skipped unread.
      if (e.key === "ArrowRight") { e.preventDefault(); next(); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); return; }
      const fwd = ["ArrowDown", "PageDown", " "].includes(e.key);
      const back = ["ArrowUp", "PageUp"].includes(e.key);
      if (fwd || back) {
        e.preventDefault();
        const el = scroller.current;
        if (el && canScroll(fwd ? 1 : -1)) el.scrollBy({ top: (fwd ? 1 : -1) * el.clientHeight * 0.8, behavior: "smooth" });
        else if (fwd) next(); else prev();
        return;
      }
      if (e.key === "Home") { e.preventDefault(); go(0, -1); }
      else if (e.key === "End") { e.preventDefault(); go(total - 1, 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, total, toggleFullscreen, canScroll]);

  // Lock background scroll while the deck owns the screen.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  const slide = DECK[index];

  return (
    <div role="dialog" aria-modal="true" aria-label="Presentation"
         className={`template-keynote ${theme === "dark" ? "dark" : ""} fixed inset-0 z-[80] flex flex-col overflow-hidden`}
         style={{
           background: "hsl(var(--paper))", color: "hsl(var(--ink))",
           fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
           letterSpacing: "-0.012em",
         }}>
      {/* progress rail */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{ background: "hsl(var(--rule-soft))" }}>
        <div className="h-full transition-[width] duration-300"
             style={{ width: `${((index + 1) / total) * 100}%`, background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent-deep)))" }} />
      </div>

      {/* top bar */}
      <header className="shrink-0 h-14 px-4 sm:px-8 flex items-center justify-between gap-3 border-b rule-soft">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={() => go(0, -1)}
                  className="inline-flex min-w-0 items-center gap-2.5 font-display text-[14px] tracking-[-0.02em] transition-colors hover:text-[hsl(var(--accent))]"
                  style={{ color: "hsl(var(--ink))" }}
                  title="Back to the first slide">
            <img src={avatar} alt="" className="w-7 h-7 shrink-0 rounded-full object-cover"
                 style={{ objectPosition: "center 22%", boxShadow: "0 0 0 2px hsl(var(--paper)), 0 0 0 3.5px hsl(var(--accent))" }} />
            <span className="hidden sm:block truncate">{profile.name}</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono text-[11px] tracking-[0.14em]" style={{ color: "hsl(var(--whisper))" }}>
            {slide.label}
          </span>
          <select value={deckId} onChange={(e) => setDeck(e.target.value as typeof deckId)}
                  aria-label="Deck"
                  title={DECKS.find((d) => d.id === deckId)?.blurb}
                  className="text-[12px] font-medium rounded-full px-2.5 py-1 bg-transparent cursor-pointer"
                  style={{ color: "hsl(var(--ink-soft))", border: "1px solid hsl(var(--rule))" }}>
            {DECKS.map((d) => <option key={d.id} value={d.id}>{d.name} deck</option>)}
          </select>
          <button onClick={toggle} aria-label="Toggle theme"
                  className="w-8 h-8 grid place-items-center rounded-full transition-colors"
                  style={{ color: "hsl(var(--muted))" }}
                  title={theme === "dark" ? "Light" : "Dark"}>
            {theme === "dark" ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
          </button>
          <button onClick={toggleFullscreen} aria-label="Toggle fullscreen"
                  className="hidden sm:grid w-8 h-8 place-items-center rounded-full transition-colors"
                  style={{ color: "hsl(var(--muted))" }}
                  title="Fullscreen (F)">
            {fullscreen ? <Minimize size={15} strokeWidth={1.8} /> : <Maximize size={15} strokeWidth={1.8} />}
          </button>
          <button onClick={endPresentation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
                  style={{ color: "hsl(var(--ink))", border: "1px solid hsl(var(--rule))" }}
                  title="Exit presentation (Esc)">
            <X size={13} strokeWidth={2.2} /> Exit
          </button>
        </div>
      </header>

      {/* stage */}
      <main className="relative flex-1 min-h-0 overflow-hidden"
            onTouchStart={(e) => { touchX.current = e.changedTouches[0].clientX; touchY.current = e.changedTouches[0].clientY; }}
            onTouchEnd={(e) => {
              if (touchX.current == null || touchY.current == null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              const dy = e.changedTouches[0].clientY - touchY.current;
              touchX.current = null;
              touchY.current = null;
              if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
              if (dx < 0) next(); else prev();
            }}>
        <div className="kn-glow" aria-hidden />
        <span className="kn-ghost" aria-hidden>{String(index + 1).padStart(2, "0")}</span>

        {/* Consistent in-slide page number: same place and format on every slide */}
        <div className="absolute top-4 right-5 sm:right-8 z-20 kn-step pointer-events-none select-none">
          <b>{String(index + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
        </div>

        <AnimatePresence custom={dir} mode="wait" initial={false}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: EASE }}
            onWheel={onWheel}
            className="absolute inset-0 overflow-hidden"
          >
            <FitSlide scroller={setScroller}>{slide.render()}</FitSlide>
          </motion.div>
        </AnimatePresence>

        {/* side arrows */}
        <button onClick={prev} disabled={index === 0} aria-label="Previous slide"
                className="kn-side-arrow hidden md:grid place-items-center absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full transition-all disabled:opacity-25 disabled:pointer-events-none hover:scale-105"
                style={{ background: "hsl(var(--paper-glass) / 0.7)", border: "1px solid hsl(var(--rule))", color: "hsl(var(--ink))", backdropFilter: "blur(4px)" }}>
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <button onClick={next} disabled={index === total - 1} aria-label="Next slide"
                className="kn-side-arrow hidden md:grid place-items-center absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full transition-all disabled:opacity-25 disabled:pointer-events-none hover:scale-105"
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
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-ink))" }}>
            <span className="hidden sm:inline">Next</span> <ChevronRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </footer>
    </div>
  );
}
