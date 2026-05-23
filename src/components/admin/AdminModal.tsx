import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Settings as SettingsIcon,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ensureAuth, isUnlocked, markLocked } from "@/lib/adminAuth";
import AdminGate from "./AdminGate";
import Dashboard from "@/pages/admin/Dashboard";
import AdminTemplates from "@/pages/AdminTemplates";
import Settings from "@/pages/admin/Settings";

export type AdminSection = "dashboard" | "templates" | "settings";

const TABS: { id: AdminSection; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "templates", label: "Templates", Icon: LayoutTemplate },
  { id: "settings",  label: "Settings",  Icon: SettingsIcon },
];

export default function AdminModal({
  open,
  initialSection,
  onClose,
}: {
  open: boolean;
  initialSection?: AdminSection;
  onClose: () => void;
}) {
  const [section, setSection] = useState<AdminSection>(initialSection ?? "dashboard");
  const [authed, setAuthed] = useState<boolean>(() => isUnlocked());
  const [username, setUsername] = useState<string>("admin");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Reset to requested section every time the modal opens
  useEffect(() => {
    if (open && initialSection) setSection(initialSection);
  }, [open, initialSection]);

  // Re-check auth + fetch username whenever opened or authed flips
  useEffect(() => {
    if (!open) return;
    setAuthed(isUnlocked());
    void (async () => {
      const a = await ensureAuth();
      if (a) setUsername(a.username);
    })();
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc closes; ⌘/Ctrl+K toggles user menu (small touch)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Click-away for the user menu
  useEffect(() => {
    if (!menuOpen) return;
    const onClickAway = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [menuOpen]);

  const logout = useCallback(() => {
    markLocked();
    setAuthed(false);
    setMenuOpen(false);
  }, []);

  const initials = username.slice(0, 2).toUpperCase();

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Studio Console"
      className="fixed inset-0 z-[80] flex items-stretch md:items-center justify-center print:hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          background: "hsl(222 22% 6% / 0.55)",
          backdropFilter: "blur(4px)",
          animation: "admin-fade 180ms ease-out both",
        }}
        onClick={onClose}
      />

      {/* Modal frame — uses .admin-shell to inherit the studio palette */}
      <div
        className="relative w-full md:w-[960px] md:max-w-[92vw] md:h-[620px] md:max-h-[85vh] h-[100dvh] md:rounded-[14px] overflow-hidden flex flex-col admin-shell"
        style={{
          boxShadow:
            "0 30px 80px -16px hsl(222 22% 12% / 0.55), 0 0 0 1px hsl(var(--a-border))",
          animation: "admin-pop 220ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        {/* Header — always above the content stack so the user menu never gets clipped */}
        <header
          className="flex items-center gap-3 px-4 md:px-5 h-[54px] shrink-0 relative z-30"
          style={{
            background: "hsl(var(--a-surface) / 0.96)",
            borderBottom: "1px solid hsl(var(--a-border))",
            backdropFilter: "saturate(140%) blur(8px)",
          }}
        >
          {/* Logo */}
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5 shrink-0">
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
            <div className="leading-tight hidden sm:block">
              <div
                className="text-[13.5px] font-semibold tracking-tight"
                style={{ color: "hsl(var(--a-ink))" }}
              >
                Studio Console
              </div>
              <div
                className="text-[10.5px] tracking-[0.06em] uppercase"
                style={{ color: "hsl(var(--a-ink-muted))" }}
              >
                v1.0
              </div>
            </div>
          </Link>

          {/* Tabs */}
          {authed && (
            <nav
              role="tablist"
              className="hidden sm:flex items-center gap-0.5 mx-3 p-0.5 rounded-[10px]"
              style={{
                background: "hsl(var(--a-border) / 0.4)",
                border: "1px solid hsl(var(--a-border))",
              }}
            >
              {TABS.map(({ id, label, Icon }) => {
                const active = section === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSection(id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all"
                    style={{
                      background: active ? "hsl(var(--a-surface))" : "transparent",
                      color: active ? "hsl(var(--a-ink))" : "hsl(var(--a-ink-soft))",
                      boxShadow: active ? "0 1px 2px hsl(222 22% 12% / 0.08)" : undefined,
                    }}
                  >
                    <Icon size={13} strokeWidth={1.9} aria-hidden />
                    {label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right-side controls */}
          <div className="ml-auto flex items-center gap-2">
            <span
              className="hidden lg:inline-flex items-center gap-1.5 text-[11px]"
              style={{ color: "hsl(var(--a-ink-muted))" }}
            >
              <TerminalIcon size={11} strokeWidth={1.8} aria-hidden />
              <kbd className="a-code">Alt</kbd> <kbd className="a-code">T</kbd>
              <span>terminal</span>
            </span>

            {authed && (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors"
                  style={{
                    border: "1px solid hsl(var(--a-border))",
                    background: menuOpen
                      ? "hsl(var(--a-border) / 0.4)"
                      : "hsl(var(--a-surface))",
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
                  <span
                    className="hidden md:inline text-[12.5px]"
                    style={{ color: "hsl(var(--a-ink))" }}
                  >
                    {username}
                  </span>
                  <ChevronDown
                    size={13}
                    strokeWidth={1.8}
                    aria-hidden
                    style={{ color: "hsl(var(--a-ink-soft))" }}
                  />
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-1.5 w-[220px] py-1 rounded-md z-50"
                    style={{
                      background: "hsl(var(--a-surface))",
                      border: "1px solid hsl(var(--a-border))",
                      boxShadow:
                        "0 1px 2px rgba(0,0,0,0.04), 0 12px 28px hsl(222 22% 12% / 0.18)",
                    }}
                  >
                    <div
                      className="px-3 py-2"
                      style={{ borderBottom: "1px solid hsl(var(--a-border))" }}
                    >
                      <div
                        className="text-[10.5px] uppercase tracking-[0.08em]"
                        style={{ color: "hsl(var(--a-ink-muted))" }}
                      >
                        Signed in as
                      </div>
                      <div
                        className="text-[13px] font-medium mt-0.5"
                        style={{ color: "hsl(var(--a-ink))" }}
                      >
                        {username}
                      </div>
                    </div>
                    <MenuItem
                      onClick={() => {
                        setSection("settings");
                        setMenuOpen(false);
                      }}
                      Icon={SettingsIcon}
                    >
                      Settings
                    </MenuItem>
                    <Link
                      to="/"
                      onClick={() => {
                        setMenuOpen(false);
                        onClose();
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-[13px] transition-colors"
                      style={{ color: "hsl(var(--a-ink-soft))" }}
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
            )}

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: "hsl(var(--a-ink))" }}
            >
              <X size={16} strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        </header>

        {/* Mobile tab bar */}
        {authed && (
          <nav
            role="tablist"
            className="sm:hidden flex items-center gap-0.5 px-3 py-2 overflow-x-auto"
            style={{
              background: "hsl(var(--a-surface))",
              borderBottom: "1px solid hsl(var(--a-border))",
            }}
          >
            {TABS.map(({ id, label, Icon }) => {
              const active = section === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSection(id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12.5px] font-medium whitespace-nowrap"
                  style={{
                    background: active ? "hsl(var(--a-accent-wash))" : "transparent",
                    color: active ? "hsl(var(--a-accent-deep))" : "hsl(var(--a-ink-soft))",
                  }}
                >
                  <Icon size={13} strokeWidth={1.9} aria-hidden />
                  {label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Content area — fills available space, internal panes scroll only
            when their own content (e.g. visit list) overflows. */}
        <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
          {!authed ? (
            <AdminGate onUnlock={() => setAuthed(true)} />
          ) : section === "dashboard" ? (
            <Dashboard />
          ) : section === "templates" ? (
            <AdminTemplates />
          ) : (
            <Settings />
          )}
        </div>
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
  children: React.ReactNode;
  onClick: () => void;
  Icon: typeof SettingsIcon;
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
