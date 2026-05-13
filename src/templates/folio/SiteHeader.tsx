import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { profile } from "@/lib/content";

const nav = [
  { to: "/", label: "Home" },
  { to: "/experience", label: "Experience" },
  { to: "/publications", label: "Publications" },
  { to: "/about", label: "About" },
  { to: "/play", label: "Play" },
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
      scrolled ? "bg-paper/90 border-b rule" : "bg-paper/70 border-b border-transparent"].join(" ")}>
      <div className="mx-auto w-full max-w-[960px] px-5 sm:px-6 md:px-8 flex items-center justify-between h-16">
        <Link to="/"
          onClick={() => { if (loc.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="text-[15px] font-semibold tracking-tight hover:text-[hsl(var(--accent))] transition-colors"
          aria-label={`${profile.name}, home`}>
          {profile.name}
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[14px]">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              className={({ isActive }) =>
                ["transition-colors",
                 isActive ? "text-ink font-medium" : "text-muted-foreground hover:text-ink"].join(" ")}>
              {n.label}
            </NavLink>
          ))}
          <button onClick={toggle} aria-label="Toggle theme"
                  className="ml-2 w-8 h-8 grid place-items-center text-muted-foreground hover:text-ink transition-colors">
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

        <button className="md:hidden text-[13px] font-medium"
                onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t rule-soft bg-paper">
          <div className="mx-auto w-full max-w-[960px] px-5 sm:px-6 md:px-8 py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"}
                className={({ isActive }) =>
                  ["py-1 text-[15px]",
                   isActive ? "text-ink font-medium" : "text-muted-foreground"].join(" ")}>
                {n.label}
              </NavLink>
            ))}
            <button onClick={toggle} className="self-start mt-2 text-[13px] text-muted-foreground">
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
