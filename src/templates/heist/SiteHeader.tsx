import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const nav = [
  { to: "/", label: "Plan", n: "01" },
  { to: "/experience", label: "Operations", n: "02" },
  { to: "/publications", label: "Files", n: "03" },
  { to: "/about", label: "Crew", n: "04" },
  { to: "/play", label: "Bella Ciao", n: "05" },
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
      <div className="shell flex items-center justify-between h-14">
        <Link to="/"
          onClick={() => { if (loc.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-2.5" aria-label="Md. Mosfikur Rahman, home">
          {/* Dalí-mask abstract */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"
               aria-hidden style={{ color: "hsl(var(--accent))" }}>
            <path d="M12 2c-3 0-5 2-5 5v3H4v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8h-3V7c0-3-2-5-5-5zm-3 8h6V7a3 3 0 0 0-6 0v3z" opacity="0.85" />
          </svg>
          <span className="font-display text-[15px] font-bold tracking-[-0.02em]">
            Md. Mosfikur Rahman
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[12.5px] font-display font-semibold uppercase tracking-[0.06em]">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              className={({ isActive }) =>
                ["transition-colors inline-flex items-baseline gap-1.5 relative",
                 isActive ? "text-ink" : "text-muted-foreground hover:text-ink"].join(" ")
              }>
              {({ isActive }) => (
                <span className="relative inline-flex items-baseline gap-1.5">
                  <span className="font-mono text-[10px]"
                        style={{ color: isActive ? "hsl(var(--accent))" : undefined, opacity: 0.6 }}>{n.n}</span>
                  <span>{n.label}</span>
                  {isActive && (
                    <span aria-hidden className="absolute -bottom-1.5 left-0 right-0 h-[2px]"
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

        <button className="md:hidden font-display text-[11px] uppercase tracking-[0.18em] font-bold"
                onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t rule bg-paper">
          <div className="shell py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"}
                className={({ isActive }) =>
                  ["py-1 font-display text-[14px] uppercase tracking-[0.08em] font-semibold flex items-baseline gap-2",
                   isActive ? "text-ink" : "text-muted-foreground"].join(" ")}>
                {({ isActive }) => (<>
                  <span className="font-mono text-[10px]"
                        style={{ color: isActive ? "hsl(var(--accent))" : "hsl(var(--muted))" }}>{n.n}</span>
                  <span>{n.label}</span>
                </>)}
              </NavLink>
            ))}
            <button onClick={toggle} className="self-start font-display text-[11px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
              Switch to {theme === "dark" ? "light" : "dark"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
