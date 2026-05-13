import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

// Each nav has a "mirror" reading too — palindrome flavor.
const nav = [
  { to: "/", label: "Now", mirror: "woN" },
  { to: "/experience", label: "Work", mirror: "kroW" },
  { to: "/publications", label: "Papers", mirror: "srepaP" },
  { to: "/about", label: "Subject", mirror: "tcejbuS" },
  { to: "/play", label: "Reverse", mirror: "esreveR" },
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
          {/* Two opposing chevrons */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 12 L9 6 L9 18 Z" fill="hsl(var(--accent))" />
            <path d="M21 12 L15 18 L15 6 Z" fill="hsl(var(--signal-crit))" />
          </svg>
          <span className="font-display text-[15px] font-semibold tracking-[-0.01em]">
            Md. Mosfikur Rahman
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[12.5px] font-mono uppercase tracking-[0.14em]">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              className={({ isActive }) =>
                ["transition-colors relative",
                 isActive ? "text-ink" : "text-muted-foreground hover:text-ink"].join(" ")
              }>
              {({ isActive }) => (
                <span className="relative inline-flex items-baseline gap-1.5">
                  {isActive && (
                    <span aria-hidden className="opacity-50 text-[10px]"
                          style={{ color: "hsl(var(--signal-crit))" }}>{n.mirror}</span>
                  )}
                  <span>{n.label}</span>
                  {isActive && (
                    <>
                      <span aria-hidden className="absolute -bottom-1 left-0 w-1/2 h-px"
                            style={{ background: "hsl(var(--accent))" }} />
                      <span aria-hidden className="absolute -top-1 right-0 w-1/2 h-px"
                            style={{ background: "hsl(var(--signal-crit))" }} />
                    </>
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
                  ["py-1 font-mono text-[13px] uppercase tracking-[0.14em]",
                   isActive ? "text-ink" : "text-muted-foreground"].join(" ")}>
                {n.label}
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
