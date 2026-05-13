import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { localTzLabel } from "@/lib/clock";

const nav = [
  { to: "/", label: "Index",        code: "00" },
  { to: "/experience", label: "Field Log",   code: "01" },
  { to: "/publications", label: "Archive",   code: "02" },
  { to: "/about", label: "Dossier",          code: "03" },
  { to: "/play", label: "Sandbox",           code: "04" },
];

export default function SiteHeader() {
  const { theme, toggle } = useTheme();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const tzLabel = localTzLabel(now);

  const faction = theme === "dark" ? "MACHINE" : "SAMARITAN";
  const factionOther = theme === "dark" ? "SAMARITAN" : "MACHINE";

  return (
    <header
      className={[
        "sticky top-0 z-40 backdrop-blur-md transition-colors",
        scrolled ? "bg-paper/85 border-b rule" : "bg-paper/65 border-b border-transparent",
      ].join(" ")}
    >
      {/* Top HUD strip — coords, clock, faction */}
      <div className="border-b rule-soft">
        <div className="shell flex items-center justify-between gap-x-4 gap-y-1 py-1.5 flex-wrap">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--muted))" }}>
            <span className="blink-dot pos" />
            <span style={{ color: "hsl(var(--accent))" }}>LIVE</span>
            <span className="opacity-50 hidden sm:inline">//</span>
            <span className="hidden sm:inline">23.8103°N 90.4125°E · DHAKA</span>
          </span>

          <span className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--ink))" }}>
            {hh}:{mm}:<span style={{ color: "hsl(var(--accent))" }}>{ss}</span>
            <span className="opacity-50 ml-2">{tzLabel}</span>
          </span>

          <span className="hidden md:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--muted))" }}>
            <span className="opacity-50">//</span>
            <span>OPERATOR</span>
            <span style={{ color: "hsl(var(--accent))" }}>{faction}</span>
          </span>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="shell flex items-center justify-between h-14">
        <Link
          to="/"
          onClick={() => {
            if (loc.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="group flex items-center gap-3"
          aria-label="Md. Mosfikur Rahman, home"
        >
          <span
            aria-hidden
            className="relative inline-flex items-center justify-center w-7 h-7"
          >
            <span className="absolute inset-0 border-2"
                  style={{ borderColor: "hsl(var(--accent))",
                           clipPath: "polygon(0 0, 30% 0, 30% 2px, 2px 2px, 2px 30%, 0 30%, 0 70%, 2px 70%, 2px calc(100% - 2px), 30% calc(100% - 2px), 30% 100%, 0 100%, 0 100%, 70% 100%, 70% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 70%, 100% 70%, 100% 30%, calc(100% - 2px) 30%, calc(100% - 2px) 2px, 70% 2px, 70% 0)" }} />
            <span className="block w-1.5 h-1.5"
                  style={{ background: "hsl(var(--accent))" }} />
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] leading-none group-hover:text-[hsl(var(--accent))] transition-colors">
            MD. MOSFIKUR RAHMAN
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                [
                  "group relative font-mono text-[11px] uppercase tracking-[0.2em] transition-colors py-2",
                  isActive ? "text-[hsl(var(--ink))]" : "text-[hsl(var(--muted))] hover:text-[hsl(var(--ink))]",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <span className="relative inline-flex items-baseline gap-1.5">
                  <span className="opacity-60" style={{ color: isActive ? "hsl(var(--accent))" : undefined }}>
                    {n.code}
                  </span>
                  <span>{n.label}</span>
                  {isActive && (
                    <>
                      <span
                        aria-hidden
                        className="absolute -left-2 -top-1 w-1.5 h-1.5 border-l border-t"
                        style={{ borderColor: "hsl(var(--accent))" }}
                      />
                      <span
                        aria-hidden
                        className="absolute -right-2 -bottom-1 w-1.5 h-1.5 border-r border-b"
                        style={{ borderColor: "hsl(var(--accent))" }}
                      />
                    </>
                  )}
                </span>
              )}
            </NavLink>
          ))}

          <button
            onClick={toggle}
            aria-label={`Switch faction to ${factionOther}`}
            title={`Switch to ${factionOther}`}
            className="ml-2 inline-flex items-center gap-2 px-2.5 py-1 border rule hover:border-[hsl(var(--accent))] transition-colors"
          >
            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em]"
                  style={{ color: "hsl(var(--muted))" }}>
              FACTION
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "hsl(var(--accent))" }}>
              {faction}
            </span>
            <span aria-hidden className="text-[9px] opacity-60">↔</span>
          </button>
        </nav>

        <button
          className="md:hidden font-mono text-[11px] uppercase tracking-[0.22em] inline-flex items-center gap-2"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="blink-dot" />
          {open ? "CLOSE" : "ACCESS"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t rule bg-paper">
          <div className="shell py-4 flex flex-col gap-2.5">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  [
                    "py-1 font-mono text-[12px] uppercase tracking-[0.2em] flex items-baseline gap-2",
                    isActive ? "text-[hsl(var(--ink))]" : "text-[hsl(var(--muted))]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span style={{ color: isActive ? "hsl(var(--accent))" : "hsl(var(--muted))" }}>
                      {n.code}
                    </span>
                    <span>{n.label}</span>
                  </>
                )}
              </NavLink>
            ))}
            <button
              onClick={toggle}
              className="self-start mt-2 inline-flex items-center gap-2 px-2.5 py-1 border rule"
            >
              <span className="font-mono text-[9.5px] uppercase tracking-[0.22em]"
                    style={{ color: "hsl(var(--muted))" }}>
                FACTION
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: "hsl(var(--accent))" }}>
                {faction}
              </span>
              <span aria-hidden className="text-[9px] opacity-60">↔</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
