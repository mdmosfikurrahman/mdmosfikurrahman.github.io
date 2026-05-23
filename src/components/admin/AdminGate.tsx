import { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  TerminalSquare,
  User,
} from "lucide-react";
import { verifyCredentials, markUnlocked, DEFAULT_USERNAME } from "@/lib/adminAuth";

export default function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [focused, setFocused] = useState<"username" | "password" | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setErr(null);
    setSubmitting(true);
    const result = await verifyCredentials(username, password);
    setSubmitting(false);
    if (result.kind === "ok") {
      markUnlocked();
      onUnlock();
      return;
    }
    setErr(result.reason);
    setPassword("");
  };

  return (
    <div className="h-full relative grid place-items-center px-4 py-6 overflow-hidden">
      {/* Decorative grid + glow */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--a-ink) / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--a-ink) / 0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)",
        }}
      />
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 560,
          height: 380,
          background:
            "radial-gradient(closest-side, hsl(var(--a-accent) / 0.18) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="relative w-full max-w-[400px]">
        {/* Brand mark + heading */}
        <div className="flex flex-col items-center text-center mb-6">
          {/* Animated layered lock */}
          <span className="relative w-14 h-14 grid place-items-center mb-4">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--a-accent) / 0.22) 0%, hsl(var(--a-accent) / 0.04) 100%)",
                border: "1px solid hsl(var(--a-accent) / 0.22)",
              }}
            />
            <span
              aria-hidden
              className="absolute inset-[6px] rounded-full"
              style={{
                background: "hsl(var(--a-surface))",
                border: "1px solid hsl(var(--a-border))",
              }}
            />
            <span
              aria-hidden
              className="absolute -inset-1.5 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, hsl(var(--a-accent) / 0.22) 0%, transparent 70%)",
                animation: "a-gate-pulse 2.6s ease-in-out infinite",
              }}
            />
            <Lock
              size={20}
              strokeWidth={1.8}
              style={{ color: "hsl(var(--a-accent-deep))", position: "relative" }}
              aria-hidden
            />
          </span>

          <div
            className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-2"
            style={{ color: "hsl(var(--a-ink-muted))" }}
          >
            Studio Console · v1.0
          </div>
          <h1
            className="text-[22px] font-semibold tracking-[-0.025em] leading-tight"
            style={{ color: "hsl(var(--a-ink))" }}
          >
            Welcome back, admin.
          </h1>
          <p
            className="mt-1 text-[12.5px]"
            style={{ color: "hsl(var(--a-ink-muted))" }}
          >
            Sign in to manage templates, analytics, and settings.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={submit}
          className="a-card p-5 space-y-3.5"
          style={{
            boxShadow:
              "0 1px 2px hsl(222 22% 12% / 0.04), 0 18px 40px -16px hsl(var(--a-accent) / 0.18), 0 0 0 1px hsl(var(--a-border))",
          }}
        >
          <FormField
            id="admin-username"
            label="Username"
            Icon={User}
            focused={focused === "username"}
            error={!!err}
          >
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              aria-invalid={!!err}
              className="w-full bg-transparent outline-none text-[13.5px] py-1"
              style={{ color: "hsl(var(--a-ink))" }}
              placeholder="root@admin"
              spellCheck={false}
            />
          </FormField>

          <FormField
            id="admin-password"
            label="Password"
            Icon={Lock}
            focused={focused === "password"}
            error={!!err}
            right={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="p-1 rounded-md"
                style={{ color: "hsl(var(--a-ink-muted))" }}
              >
                {show ? (
                  <EyeOff size={14} strokeWidth={1.8} aria-hidden />
                ) : (
                  <Eye size={14} strokeWidth={1.8} aria-hidden />
                )}
              </button>
            }
          >
            <input
              id="admin-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              aria-invalid={!!err}
              className="w-full bg-transparent outline-none text-[13.5px] py-1"
              style={{ color: "hsl(var(--a-ink))" }}
              placeholder="••••••••"
            />
          </FormField>

          {err && (
            <p
              className="text-[12px] flex items-center gap-1.5 px-1"
              style={{ color: "hsl(var(--a-danger))" }}
            >
              <Lock size={11} strokeWidth={2.2} aria-hidden /> {err}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="a-btn a-btn-primary w-full py-2.5 text-[13.5px] mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: submitting
                ? "hsl(var(--a-accent-deep))"
                : "linear-gradient(180deg, hsl(var(--a-accent)) 0%, hsl(var(--a-accent-deep)) 100%)",
              boxShadow: submitting
                ? undefined
                : "0 4px 14px -4px hsl(var(--a-accent) / 0.4), inset 0 1px 0 hsl(255 100% 100% / 0.18)",
            }}
          >
            {submitting ? (
              <>
                <Spinner /> Verifying…
              </>
            ) : (
              <>
                <ShieldCheck size={13} strokeWidth={2.2} aria-hidden />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* Footer hints */}
        <div
          className="mt-4 flex items-center justify-center gap-3 text-[11px]"
          style={{ color: "hsl(var(--a-ink-muted))" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={11} strokeWidth={1.8} aria-hidden />
            SHA-256 · salted
          </span>
          <span style={{ color: "hsl(var(--a-border-strong))" }}>·</span>
          <span className="inline-flex items-center gap-1.5">
            <TerminalSquare size={11} strokeWidth={1.8} aria-hidden />
            <kbd className="a-code">Alt</kbd>
            <kbd className="a-code">T</kbd>
            terminal
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// pieces
// =============================================================================

function FormField({
  id,
  label,
  Icon,
  children,
  right,
  focused,
  error,
}: {
  id: string;
  label: string;
  Icon: typeof User;
  children: React.ReactNode;
  right?: React.ReactNode;
  focused?: boolean;
  error?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span
        className="a-label text-[10px] block mb-1.5"
        style={{
          color: focused
            ? "hsl(var(--a-accent-deep))"
            : "hsl(var(--a-ink-muted))",
        }}
      >
        {label}
      </span>
      <div
        className="flex items-center gap-2 px-3 rounded-[10px] transition-all duration-150"
        style={{
          background: "hsl(var(--a-bg))",
          border: error
            ? "1px solid hsl(var(--a-danger))"
            : focused
            ? "1px solid hsl(var(--a-accent))"
            : "1px solid hsl(var(--a-border))",
          boxShadow: error
            ? "0 0 0 3px hsl(var(--a-danger) / 0.12)"
            : focused
            ? "0 0 0 3px hsl(var(--a-accent) / 0.14)"
            : "none",
        }}
      >
        <Icon
          size={14}
          strokeWidth={1.8}
          aria-hidden
          style={{
            color: focused
              ? "hsl(var(--a-accent-deep))"
              : "hsl(var(--a-ink-muted))",
            flexShrink: 0,
          }}
        />
        <div className="flex-1 min-w-0">{children}</div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </label>
  );
}

function Spinner() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
      style={{ animation: "a-spin 0.85s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
