import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#research", label: "Research" },
  // { href: "#publications", label: "Publications" },
  { href: "#journey", label: "Journey" },
  { href: "#achievements", label: "Awards" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // toggle theme
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
      <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              scrolled
                  ? "bg-background/95 backdrop-blur-sm border-b border-border"
                  : "bg-background border-b border-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <a href="#" className="font-display font-bold text-base text-foreground">
            M.M. Rahman
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
                <a
                    key={l.href}
                    href={l.href}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
            ))}

            {/* 🌙 Toggle Button */}
            <button
                onClick={() => setDark(!dark)}
                className="p-1.5 rounded border border-border hover:bg-secondary transition"
                aria-label="Toggle theme"
            >
              {dark ? (
                  <Sun className="w-4 h-4 text-accent" />
              ) : (
                  <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Dark toggle (mobile) */}
            <button
                onClick={() => setDark(!dark)}
                className="p-1.5 rounded border border-border"
            >
              {dark ? (
                  <Sun className="w-4 h-4 text-accent" />
              ) : (
                  <Moon className="w-4 h-4" />
              )}
            </button>

            <button
                className="text-foreground"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
            <div className="md:hidden bg-background border-b border-border px-6 py-4 space-y-3">
              {links.map((l) => (
                  <a
                      key={l.href}
                      href={l.href}
                      className="block text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </a>
              ))}
            </div>
        )}
      </nav>
  );
};

export default Navbar;