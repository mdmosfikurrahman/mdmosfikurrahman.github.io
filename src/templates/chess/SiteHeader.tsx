import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const nav = [
  { to: "/",            label: "Opening",     m: "1.e4"  },
  { to: "/experience",  label: "Middlegame", m: "Nf3" },
  { to: "/publications", label: "Analysis",  m: "Bg5" },
  { to: "/about",       label: "Player",     m: "Qd4" },
  { to: "/play",        label: "Puzzles",    m: "O-O" },
];

export default function SiteHeader() {
  const { theme, toggle } = useTheme();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={["sticky top-0 z-40 backdrop-blur-md transition-colors",
      scrolled ? "bg-paper/85 border-b rule" : "bg-paper/65 border-b border-transparent"].join(" ")}>
      <div className="shell flex items-center justify-between h-16">
        <Link to="/"
          onClick={() => { if (loc.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-2.5" aria-label="Md. Mosfikur Rahman, home">
          <span aria-hidden className="font-display text-[22px] leading-none"
                style={{ color: "hsl(var(--accent))" }}>♚</span>
          <span className="font-display text-[19px]">Md. Mosfikur Rahman</span>
        </Link>

        <nav className="hidden md:flex items-baseline gap-6 text-[14px]">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              className={({ isActive }) =>
                ["relative transition-colors inline-flex items-baseline gap-2",
                 isActive ? "text-ink" : "text-muted-foreground hover:text-ink"].join(" ")
              }>
              {({ isActive }) => (
                <span className="relative inline-flex items-baseline gap-2">
                  <span className="font-mono text-[11.5px]"
                        style={{ color: isActive ? "hsl(var(--accent))" : "hsl(var(--muted))" }}>
                    {n.m}
                  </span>
                  <span className="font-display">{n.label}</span>
                  {isActive && (
                    <span aria-hidden className="absolute -bottom-1 left-0 right-0 h-px"
                          style={{ background: "hsl(var(--accent))" }} />
                  )}
                </span>
              )}
            </NavLink>
          ))}
          <button onClick={toggle} aria-label="Toggle theme"
                  className="ml-2 w-7 h-7 grid place-items-center text-muted-foreground hover:text-ink transition-colors">
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </nav>

        <button className="md:hidden font-mono text-[12px]"
                onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
          {open ? "Resign" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t rule bg-paper">
          <div className="shell py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"}
                className={({ isActive }) =>
                  ["py-1 text-[15px] flex items-baseline gap-3",
                   isActive ? "text-ink" : "text-muted-foreground"].join(" ")}>
                {({ isActive }) => (<>
                  <span className="font-mono text-[12px]"
                        style={{ color: isActive ? "hsl(var(--accent))" : "hsl(var(--muted))" }}>{n.m}</span>
                  <span className="font-display">{n.label}</span>
                </>)}
              </NavLink>
            ))}
            <button onClick={toggle} className="self-start font-mono text-[12px] text-muted-foreground">
              Switch to {theme === "dark" ? "light" : "dark"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
