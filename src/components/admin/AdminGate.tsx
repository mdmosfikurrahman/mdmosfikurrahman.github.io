import { useState, type FormEvent, type ReactNode } from "react";
import { AlertTriangle, Eye, EyeOff, Lock, ShieldCheck, TerminalSquare, User } from "lucide-react";
import { verifyCredentials, markUnlocked, DEFAULT_USERNAME } from "@/lib/adminAuth";
import { useAvatarUrl } from "@/lib/settings";

export default function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  const avatar = useAvatarUrl();
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
    <div className="sc-gate">
      <div className="sc-gate-inner">
        <div className="sc-gate-brand">
          <img src={avatar} alt="" className="sc-gate-avatar" />
          <p className="sc-eyebrow">Studio Console</p>
          <h1>Sign in</h1>
          <p className="sc-gate-sub">Manage analytics and site settings.</p>
        </div>

        <form onSubmit={submit} className="sc-card sc-gate-card">
          <Field id="admin-username" label="Username" Icon={User} error={!!err}>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!err}
              placeholder="root@admin"
              spellCheck={false}
            />
          </Field>

          <Field
            id="admin-password"
            label="Password"
            Icon={Lock}
            error={!!err}
            right={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="sc-field-btn"
              >
                {show ? <EyeOff size={15} strokeWidth={1.8} aria-hidden /> : <Eye size={15} strokeWidth={1.8} aria-hidden />}
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
              aria-invalid={!!err}
              placeholder="••••••••"
            />
          </Field>

          {err && (
            <p className="sc-error" role="alert">
              <AlertTriangle size={14} strokeWidth={2} aria-hidden /> {err}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="sc-btn sc-btn--primary sc-btn--block"
          >
            {submitting ? (
              <>
                <Spinner /> Verifying…
              </>
            ) : (
              <>
                <ShieldCheck size={16} strokeWidth={2} aria-hidden />
                Sign in
              </>
            )}
          </button>
        </form>

        <div className="sc-gate-foot">
          <span>
            <ShieldCheck size={13} strokeWidth={1.8} aria-hidden />
            SHA-256 · salted
          </span>
          <span aria-hidden>·</span>
          <span>
            <TerminalSquare size={13} strokeWidth={1.8} aria-hidden />
            <kbd className="sc-kbd">Alt</kbd>
            <kbd className="sc-kbd">T</kbd>
            terminal
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  Icon,
  children,
  right,
  error,
}: {
  id: string;
  label: string;
  Icon: typeof User;
  children: ReactNode;
  right?: ReactNode;
  error?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="sc-label">
        {label}
      </label>
      <div className="sc-field" data-invalid={error ? "true" : undefined}>
        <Icon size={16} strokeWidth={1.8} aria-hidden />
        {children}
        {right}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
      className="sc-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
