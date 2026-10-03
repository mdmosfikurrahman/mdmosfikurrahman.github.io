import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileDown, Menu, Moon, Presentation, Sun, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { profile } from "@/lib/content";
import { useAvatarUrl, useCvDownload } from "@/lib/settings";
import { startPresentation } from "@/lib/presentation";
import { deckForLens, useLens } from "@/lib/lens";
import { FOLIO_NAV } from "./nav";

// "Md. " is dropped on the narrowest phones so the name never truncates.
const HONORIFIC = /^\S+\.\s/.exec(profile.name)?.[0] ?? "";

export default function SiteHeader() {
  const { theme, toggle } = useTheme();
  const avatar = useAvatarUrl();
  const cv = useCvDownload();
  const lens = useLens();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className="fo-header" data-scrolled={scrolled || open ? "true" : "false"}>
      <div className="fo-wrap fo-header-inner">
        <Link
          to="/"
          className="fo-brand"
          aria-label={`${profile.name}, home`}
          onClick={() => {
            if (loc.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img src={avatar} alt="" />
          <span className="truncate">
            <span className="fo-brand-pre">{HONORIFIC}</span>
            {profile.name.slice(HONORIFIC.length)}
          </span>
        </Link>

        <nav className="fo-nav" aria-label="Primary">
          {FOLIO_NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="fo-navlink">
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="fo-header-tools">
          <button
            type="button"
            onClick={() => startPresentation(deckForLens(lens))}
            className="fo-iconbtn fo-iconbtn--bare fo-hide-sm"
            aria-label="Start presentation"
            title="Start presentation (P)"
          >
            <Presentation size={17} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={toggle}
            className="fo-iconbtn fo-iconbtn--bare"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
          </button>
          <a
            href={cv.href}
            target="_blank"
            rel="noreferrer"
            download={cv.download || undefined}
            className="fo-iconbtn fo-iconbtn--bare"
            aria-label={cv.title}
            title={cv.title}
          >
            <FileDown size={17} strokeWidth={1.8} />
          </a>
          <button
            type="button"
            className="fo-iconbtn fo-menubtn"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="fo-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={17} strokeWidth={1.9} /> : <Menu size={17} strokeWidth={1.9} />}
          </button>
        </div>
      </div>

      <span className="fo-progress" aria-hidden style={{ transform: `scaleX(${progress})` }} />

      {open && (
        <div id="fo-mobile-menu" className="fo-mobile">
          <nav className="fo-wrap pb-5" aria-label="Mobile">
            {[{ to: "/", label: "Home" }, ...FOLIO_NAV].map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"} className="fo-mlink">
                {n.label}
                <span aria-hidden className="fo-muted">→</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
