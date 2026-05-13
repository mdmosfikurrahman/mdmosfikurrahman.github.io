import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const nav = [
  { to: "/", label: "Index", n: "00" },
  { to: "/experience", label: "Levels", n: "01" },
  { to: "/publications", label: "Plans", n: "02" },
  { to: "/about", label: "Architect", n: "03" },
  { to: "/play", label: "Totem", n: "04" },
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
          {/* Penrose-stair icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.4" aria-hidden style={{ color: "hsl(var(--accent))" }}>
            <path d="M3 18 L3 13 L8 13 L8 8 L13 8 L13 3 L21 3 L21 11 L16 11 L16 16 L11 16 L11 21 L3 21 Z" />
          </svg>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Md. Mosfikur Rahman
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 font-mono text-[11.5px] tracking-[0.05em]">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              className={({ isActive }) =>
                ["transition-colors inline-flex items-baseline gap-1.5",
                 isActive ? "text-ink" : "text-muted-foreground hover:text-ink"].join(" ")
              }>
              {({ isActive }) => (
                <span className="inline-flex items-baseline gap-1.5">
                  <span style={{ color: isActive ? "hsl(var(--accent))" : undefined, opacity: 0.7 }}>{n.n}</span>
                  <span>{n.label}</span>
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

        <button className="md:hidden font-mono text-[11px] uppercase tracking-[0.16em]"
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
                  ["py-1 font-mono text-[13px] flex items-baseline gap-2",
                   isActive ? "text-ink" : "text-muted-foreground"].join(" ")}>
                {({ isActive }) => (<>
                  <span style={{ color: isActive ? "hsl(var(--accent))" : "hsl(var(--muted))" }}>{n.n}</span>
                  <span>{n.label}</span>
                </>)}
              </NavLink>
            ))}
            <button onClick={toggle} className="self-start font-mono text-[11px] text-muted-foreground">
              Switch to {theme === "dark" ? "light" : "dark"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
