import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { profile } from "@/lib/content";

const nav = [
  { to: "/", label: "Home" },
  { to: "/experience", label: "Work" },
  { to: "/publications", label: "Writing" },
  { to: "/about", label: "About" },
];

export default function SiteHeader() {
  const { theme, toggle } = useTheme();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-paper/75 border-b rule-soft">
      <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-10 flex items-center justify-between h-14">
        <Link
          to="/"
          onClick={() => { if (loc.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-3 group"
          aria-label="Md. Mosfikur Rahman, home"
        >
          <span className="font-display text-[15px] tracking-[-0.02em] group-hover:text-accent transition-colors">
            {profile.name}
          </span>
          <span className="hidden sm:inline font-mono text-[9.5px] px-2 py-0.5 uppercase tracking-[0.18em] rounded-full"
                style={{ border: "1px solid hsl(var(--rule))", color: "hsl(var(--muted))" }}>
            Deck
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13.5px]">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                ["relative transition-colors", isActive ? "text-ink" : "text-muted-foreground hover:text-ink"].join(" ")
              }
            >
              {({ isActive }) => (
                <span className="relative">
                  {n.label}
                  {isActive && (
                    <span aria-hidden className="absolute -bottom-[6px] left-0 right-0 h-[2px] rounded-full"
                          style={{ background: "hsl(var(--accent))" }} />
                  )}
                </span>
              )}
            </NavLink>
          ))}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-1 w-8 h-8 grid place-items-center text-muted-foreground hover:text-ink transition-colors"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </nav>

        <button className="md:hidden text-[13px] font-medium" onClick={() => setOpen((o) => !o)}
                aria-expanded={open} aria-label="Toggle menu">
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t rule-soft bg-paper">
          <div className="mx-auto w-full max-w-[1120px] px-6 py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"}
                       className={({ isActive }) =>
                         ["py-1 text-[15px]", isActive ? "text-ink" : "text-muted-foreground"].join(" ")}>
                {n.label}
              </NavLink>
            ))}
            <button onClick={toggle} className="self-start text-[12px] text-muted-foreground mt-2">
              Switch to {theme === "dark" ? "light" : "dark"}
            </button>
          </div>
        </div>
      )}

      <div className="kn-progress" aria-hidden>
        <i style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
