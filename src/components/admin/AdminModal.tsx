import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Settings as SettingsIcon,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ensureAuth, isUnlocked, markLocked } from "@/lib/adminAuth";
import { useAvatarUrl } from "@/lib/settings";
import AdminGate from "./AdminGate";
import Dashboard from "@/pages/admin/Dashboard";
import Settings from "@/pages/admin/Settings";
import "./console.css";

export type AdminSection = "dashboard" | "settings";

const SECTIONS: {
  id: AdminSection;
  label: string;
  subtitle: string;
  Icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Overview", subtitle: "Visitor analytics, captured in the browser, bots excluded", Icon: LayoutDashboard },
  { id: "settings", label: "Settings", subtitle: "Account, visitor-facing switches and published content", Icon: SettingsIcon },
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
  // The top bar hosts page-level controls (the overview renders its refresh
  // controls into it), so the element is kept in state for the portal.
  const [actionsEl, setActionsEl] = useState<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const avatar = useAvatarUrl();

  // Reset to requested section every time the console opens
  useEffect(() => {
    if (open && initialSection) setSection(initialSection);
  }, [open, initialSection]);

  // Each section starts at the top
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [section]);

  // Re-check auth + fetch username whenever opened
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

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const logout = useCallback(() => {
    markLocked();
    setAuthed(false);
  }, []);

  const initials = username.slice(0, 2).toUpperCase();

  if (!open) return null;

  const meta = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];

  return (
    <div role="dialog" aria-modal="true" aria-label="Studio Console" className="sc-root print:hidden">
      {!authed ? (
        <div className="sc-gate-shell">
          <button type="button" aria-label="Close" onClick={onClose} className="sc-iconbtn sc-gate-close">
            <X size={18} strokeWidth={1.8} aria-hidden />
          </button>
          <AdminGate onUnlock={() => setAuthed(true)} />
        </div>
      ) : (
        <div className="sc-app">
          <aside className="sc-side" aria-label="Studio Console">
            <Link to="/" onClick={onClose} className="sc-brand">
              <img src={avatar} alt="" />
              <span>
                <b>Studio Console</b>
                <small>Portfolio admin</small>
              </span>
            </Link>

            <nav className="sc-nav" aria-label="Sections">
              <p className="sc-nav-label">Workspace</p>
              {SECTIONS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSection(id)}
                  aria-current={section === id ? "page" : undefined}
                  className="sc-navitem"
                >
                  <Icon size={16} strokeWidth={1.8} aria-hidden />
                  {label}
                </button>
              ))}
            </nav>

            <div className="sc-side-foot">
              <Link to="/" onClick={onClose} className="sc-sidelink">
                <ExternalLink size={14} strokeWidth={1.8} aria-hidden />
                View public site
              </Link>
              <p className="sc-hint">
                <TerminalIcon size={13} strokeWidth={1.8} aria-hidden />
                <kbd className="sc-kbd">Alt</kbd>
                <kbd className="sc-kbd">T</kbd>
                <span>terminal</span>
              </p>
              <UserMenu
                variant="side"
                username={username}
                initials={initials}
                onSettings={() => setSection("settings")}
                onViewSite={onClose}
                onLogout={logout}
              />
            </div>
          </aside>

          <div className="sc-main">
            <header className="sc-top">
              <img src={avatar} alt="" className="sc-top-avatar" />
              <div className="sc-top-title">
                <h1>{meta.label}</h1>
                <p>{meta.subtitle}</p>
              </div>
              <div ref={setActionsEl} className="sc-top-actions" />
              <UserMenu
                variant="top"
                username={username}
                initials={initials}
                onSettings={() => setSection("settings")}
                onViewSite={onClose}
                onLogout={logout}
              />
              <button type="button" aria-label="Close" title="Close (Esc)" onClick={onClose} className="sc-iconbtn">
                <X size={18} strokeWidth={1.8} aria-hidden />
              </button>
            </header>

            <nav className="sc-tabs" aria-label="Sections">
              {SECTIONS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSection(id)}
                  aria-current={section === id ? "page" : undefined}
                  className="sc-tab"
                >
                  <Icon size={15} strokeWidth={1.8} aria-hidden />
                  {label}
                </button>
              ))}
            </nav>

            <div ref={contentRef} className="sc-content">
              {section === "dashboard" ? <Dashboard actionsSlot={actionsEl} /> : <Settings />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserMenu({
  variant,
  username,
  initials,
  onSettings,
  onViewSite,
  onLogout,
}: {
  variant: "side" | "top";
  username: string;
  initials: string;
  onSettings: () => void;
  onViewSite: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Click-away closes the menu
  useEffect(() => {
    if (!open) return;
    const onClickAway = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [open]);

  const side = variant === "side";

  return (
    <div ref={ref} className={side ? "sc-user" : "sc-top-user"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={side ? "sc-userbtn" : "sc-top-userbtn"}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={side ? undefined : `Account menu for ${username}`}
      >
        <span className="sc-initials" aria-hidden>
          {initials}
        </span>
        {side && (
          <>
            <span className="sc-user-text">
              <small>Signed in as</small>
              <b>{username}</b>
            </span>
            {open ? <ChevronDown size={15} strokeWidth={1.8} aria-hidden /> : <ChevronUp size={15} strokeWidth={1.8} aria-hidden />}
          </>
        )}
      </button>
      {open && (
        <div role="menu" className={side ? "sc-menu" : "sc-menu sc-menu--down"}>
          {!side && (
            <div className="sc-menu-head">
              <small>Signed in as</small>
              <b>{username}</b>
            </div>
          )}
          <MenuItem
            Icon={SettingsIcon}
            onClick={() => {
              onSettings();
              setOpen(false);
            }}
          >
            Settings
          </MenuItem>
          <Link
            to="/"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onViewSite();
            }}
            className="sc-menuitem"
          >
            <ExternalLink size={14} strokeWidth={1.8} aria-hidden />
            View public site
          </Link>
          <div className="sc-menu-sep" />
          <MenuItem
            Icon={LogOut}
            danger
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            Log out
          </MenuItem>
        </div>
      )}
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
  Icon: typeof SettingsIcon;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      className={danger ? "sc-menuitem sc-menuitem--danger" : "sc-menuitem"}
    >
      <Icon size={14} strokeWidth={1.8} aria-hidden />
      {children}
    </button>
  );
}
