import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu,
  Settings,
  TerminalSquare,
  X,
} from "lucide-react";
import { ensureAuth, markLocked } from "@/lib/adminAuth";

const NAV: { to: string; label: string; Icon: typeof LayoutDashboard }[] = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/admin/templates", label: "Templates", Icon: LayoutTemplate },
  { to: "/admin/settings", label: "Settings", Icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState<string>("admin");

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void (async () => {
      const auth = await ensureAuth();
      if (auth) setUsername(auth.username);
    })();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickAway = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [menuOpen]);

  const logout = () => {
    markLocked();
    navigate("/");
  };

  const activeLabel = NAV.find((n) => location.pathname.startsWith(n.to))?.label ?? "Console";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={[
          "md:w-[232px] md:min-h-screen md:flex md:flex-col md:sticky md:top-0",
          "shrink-0",
          sidebarOpen ? "fixed inset-0 z-40 flex flex-col" : "hidden md:flex",
        ].join(" ")}
        style={{
          background: "hsl(var(--a-surface))",
          borderRight: "1px solid hsl(var(--a-border))",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-[18px]"
          style={{ borderBottom: "1px solid hsl(var(--a-border))" }}
        >
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-md grid place-items-center"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--a-accent)) 0%, hsl(var(--a-accent-deep)) 100%)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </span>
            <div className="leading-tight">
              <div
                className="text-[13.5px] font-semibold tracking-tight"
                style={{ color: "hsl(var(--a-ink))" }}
              >
                Studio
              </div>
              <div
                className="text-[10.5px] tracking-[0.06em] uppercase"
                style={{ color: "hsl(var(--a-ink-muted))" }}
              >
                Console
              </div>
            </div>
          </Link>
          <button
            type="button"
            className="md:hidden p-1.5 rounded-md"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            style={{ color: "hsl(var(--a-ink-soft))" }}
          >
            <X size={18} strokeWidth={1.8} aria-hidden />
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={false}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] transition-colors",
                  isActive ? "font-semibold" : "",
                ].join(" ")
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: "hsl(var(--a-accent-wash))",
                      color: "hsl(var(--a-accent-deep))",
                    }
                  : { color: "hsl(var(--a-ink-soft))" }
              }
            >
              <Icon size={15} strokeWidth={1.8} aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer — terminal hint only; logout lives in top-bar menu */}
        <div
          className="px-4 py-3 mt-auto"
          style={{ borderTop: "1px solid hsl(var(--a-border))" }}
        >
          <div
            className="flex items-center gap-2 text-[11.5px]"
            style={{ color: "hsl(var(--a-ink-muted))" }}
          >
            <TerminalSquare size={13} strokeWidth={1.8} aria-hidden />
            <span>
              <kbd className="a-code">Alt</kbd> <kbd className="a-code">T</kbd> opens terminal
            </span>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar — sticky, always visible */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-[56px]"
          style={{
            background: "hsl(var(--a-surface) / 0.92)",
            borderBottom: "1px solid hsl(var(--a-border))",
            backdropFilter: "saturate(140%) blur(8px)",
          }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-md"
            aria-label="Open menu"
            style={{ color: "hsl(var(--a-ink))" }}
          >
            <Menu size={18} strokeWidth={1.8} aria-hidden />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-[11.5px] uppercase tracking-[0.08em]"
              style={{ color: "hsl(var(--a-ink-muted))" }}
            >
              Console
            </span>
            <span style={{ color: "hsl(var(--a-ink-faint))" }}>/</span>
            <span
              className="text-[13.5px] font-semibold tracking-tight truncate"
              style={{ color: "hsl(var(--a-ink))" }}
            >
              {activeLabel}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-[12.5px] px-2.5 py-1.5 rounded-md transition-colors"
              style={{ color: "hsl(var(--a-ink-soft))" }}
            >
              <ExternalLink size={12} strokeWidth={1.9} aria-hidden />
              View site
            </Link>

            {/* User menu */}
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors"
                style={{
                  border: "1px solid hsl(var(--a-border))",
                  background: menuOpen ? "hsl(var(--a-border) / 0.4)" : "hsl(var(--a-surface))",
                  color: "hsl(var(--a-ink))",
                }}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span
                  className="w-6 h-6 rounded-full grid place-items-center text-[10.5px] font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--a-accent)) 0%, hsl(var(--a-accent-deep)) 100%)",
                    color: "white",
                  }}
                  aria-hidden
                >
                  {initials}
                </span>
                <span className="hidden sm:inline text-[12.5px]" style={{ color: "hsl(var(--a-ink))" }}>
                  {username}
                </span>
                <ChevronDown size={13} strokeWidth={1.8} aria-hidden style={{ color: "hsl(var(--a-ink-soft))" }} />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-1.5 w-[220px] py-1 rounded-md"
                  style={{
                    background: "hsl(var(--a-surface))",
                    border: "1px solid hsl(var(--a-border))",
                    boxShadow:
                      "0 1px 2px rgba(0,0,0,0.04), 0 12px 28px hsl(222 22% 12% / 0.12)",
                  }}
                >
                  <div
                    className="px-3 py-2"
                    style={{ borderBottom: "1px solid hsl(var(--a-border))" }}
                  >
                    <div className="text-[10.5px] uppercase tracking-[0.08em]"
                         style={{ color: "hsl(var(--a-ink-muted))" }}>
                      Signed in as
                    </div>
                    <div className="text-[13px] font-medium mt-0.5"
                         style={{ color: "hsl(var(--a-ink))" }}>
                      {username}
                    </div>
                  </div>

                  <MenuItem
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/admin/settings");
                    }}
                    Icon={Settings}
                  >
                    Settings
                  </MenuItem>
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-2 text-[13px] transition-colors"
                    style={{ color: "hsl(var(--a-ink-soft))" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <ExternalLink size={13} strokeWidth={1.8} aria-hidden />
                    View public site
                  </Link>
                  <div style={{ borderTop: "1px solid hsl(var(--a-border))" }} />
                  <MenuItem onClick={logout} Icon={LogOut} danger>
                    Log out
                  </MenuItem>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  Icon,
  danger,
}: {
  children: ReactNode;
  onClick: () => void;
  Icon: typeof Settings;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left transition-colors"
      style={{
        color: danger ? "hsl(var(--a-danger))" : "hsl(var(--a-ink-soft))",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = danger
          ? "hsl(var(--a-danger) / 0.08)"
          : "hsl(var(--a-border) / 0.4)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "transparent";
      }}
    >
      <Icon size={13} strokeWidth={1.8} aria-hidden />
      {children}
    </button>
  );
}
