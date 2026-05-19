import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTemplate, type TemplateId } from "@/lib/template";
import {
  fetchRemoteTemplate,
  pushRemoteTemplate,
  isRemoteConfigured,
  getBinId,
  getStoredMasterKey,
  setStoredMasterKey,
  hasEnvMasterKey,
  type RemoteState,
} from "@/lib/templateRemote";

// Lightweight passcode gate. Not real auth — just keeps the casual visitor
// away from the template console.
const ADMIN_PASS = "EpDe#F16!";
const UNLOCK_KEY = "portfolio.admin.unlocked";

function isUnlocked() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(UNLOCK_KEY) === "1";
}

export default function AdminTemplates() {
  const [unlocked, setUnlocked] = useState<boolean>(() => isUnlocked());
  return (
    <main className="admin-shell">
      {unlocked ? <Picker /> : <Gate onUnlock={() => setUnlocked(true)} />}
    </main>
  );
}

// ----------------------------------------------------------------------------
// Gate
// ----------------------------------------------------------------------------
function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (val === ADMIN_PASS) {
      window.localStorage.setItem(UNLOCK_KEY, "1");
      onUnlock();
    } else {
      setErr(true);
      setVal("");
      setTimeout(() => setErr(false), 1500);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-5 py-16">
      <div className="w-full max-w-[460px]">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <span className="w-9 h-9 rounded-full grid place-items-center"
                style={{ background: "hsl(var(--a-accent-wash))" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="hsl(var(--a-accent-deep))" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </span>
          <span className="text-[14px] font-semibold tracking-tight"
                style={{ color: "hsl(var(--a-ink))" }}>
            Studio Console
          </span>
        </div>

        <div className="a-card p-7 md:p-9">
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] leading-[1.1]"
              style={{ color: "hsl(var(--a-ink))" }}>
            Welcome back.
          </h1>
          <p className="mt-2 text-[14.5px] leading-[1.55]"
             style={{ color: "hsl(var(--a-ink-soft))" }}>
            This area lets you change how the portfolio looks for every visitor.
            Enter your passphrase to continue.
          </p>

          <form onSubmit={submit} className="mt-7">
            <label className="a-label block mb-2">Passphrase</label>
            <input
              type="password"
              autoFocus
              value={val}
              onChange={(e) => setVal(e.target.value)}
              aria-invalid={err}
              className={`a-input ${err ? "is-invalid" : ""}`}
              placeholder="••••••••"
            />
            {err && (
              <p className="mt-2 text-[13px]"
                 style={{ color: "hsl(var(--a-danger))" }}>
                That doesn't match. Try again.
              </p>
            )}

            <button type="submit" className="a-btn a-btn-primary w-full mt-5 py-3 text-[14px]">
              Continue
            </button>
          </form>

          <div className="mt-6 pt-5 border-t flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[12.5px]"
               style={{ borderColor: "hsl(var(--a-border))", color: "hsl(var(--a-ink-muted))" }}>
            <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
              Tip · press <kbd className="a-code">Shift</kbd> <kbd className="a-code">T</kbd> <kbd className="a-code">T</kbd> anywhere
            </span>
            <Link to="/" className="hover:underline whitespace-nowrap"
                  style={{ color: "hsl(var(--a-ink-soft))" }}>
              ← Back to site
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px]"
           style={{ color: "hsl(var(--a-ink-muted))" }}>
          Private area · for the site owner only.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Picker
// ----------------------------------------------------------------------------

type PushStatus =
  | { kind: "idle" }
  | { kind: "pushing"; target: TemplateId }
  | { kind: "ok"; target: TemplateId; at: number }
  | { kind: "err"; reason: string };

function Picker() {
  const { template, setTemplate, templates } = useTemplate();
  const [masterKey, setMasterKey] = useState<string>(() => getStoredMasterKey());
  const [showKey, setShowKey] = useState(false);
  const [remote, setRemote] = useState<RemoteState | null>(null);
  const [remoteLoading, setRemoteLoading] = useState<boolean>(false);
  const [pushStatus, setPushStatus] = useState<PushStatus>({ kind: "idle" });

  const refreshRemote = async () => {
    if (!isRemoteConfigured()) return;
    setRemoteLoading(true);
    const r = await fetchRemoteTemplate();
    setRemote(r);
    setRemoteLoading(false);
  };

  useEffect(() => {
    void refreshRemote();
  }, []);

  const logout = () => {
    window.localStorage.removeItem(UNLOCK_KEY);
    window.location.reload();
  };

  const onPick = async (t: TemplateId) => {
    setTemplate(t);
    setPushStatus({ kind: "idle" });
    if (!isRemoteConfigured()) return;
    setPushStatus({ kind: "pushing", target: t });
    const res = await pushRemoteTemplate(t, masterKey);
    if (res.kind === "err") {
      setPushStatus({ kind: "err", reason: res.reason });
      return;
    }
    setPushStatus({ kind: "ok", target: t, at: Date.now() });
    void refreshRemote();
  };

  const saveMasterKey = (next: string) => {
    setMasterKey(next);
    setStoredMasterKey(next);
  };

  const activeMeta = templates.find((t) => t.id === template);

  return (
    <div className="px-5 sm:px-8 md:px-12 py-8 md:py-12">
      <div className="mx-auto w-full max-w-[1080px]">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full grid place-items-center"
                  style={{ background: "hsl(var(--a-accent-wash))" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="hsl(var(--a-accent-deep))" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="text-[14px] font-semibold tracking-tight"
                 style={{ color: "hsl(var(--a-ink))" }}>
                Studio Console
              </p>
              <p className="text-[11.5px]"
                 style={{ color: "hsl(var(--a-ink-muted))" }}>
                Template Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <Link to="/" className="a-btn a-btn-ghost text-[13px] sm:text-[14px]">
              View site
            </Link>
            <button onClick={logout} className="a-btn a-btn-danger text-[13px] sm:text-[14px]">
              Log out
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10 md:mt-14">
          <p className="a-label">Templates</p>
          <h1 className="mt-2 text-[28px] sm:text-[36px] md:text-[56px] font-semibold tracking-[-0.025em] leading-[1.08] md:leading-[1.05] text-balance"
              style={{ color: "hsl(var(--a-ink))" }}>
            Pick the skin for your portfolio.
          </h1>
          <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.6]"
             style={{ color: "hsl(var(--a-ink-soft))" }}>
            Your choice is saved to a shared JSONBin record, so every visitor on
            their next page load will see the same skin. Add more by dropping a
            folder under <code className="a-code">src/templates/&lt;id&gt;/</code>{" "}
            and registering it in <code className="a-code">src/lib/template.ts</code>.
          </p>

          {activeMeta && (
            <div className="mt-6 inline-flex items-center gap-2.5">
              <span className="a-chip a-chip-accent">
                <span className="a-dot" /> Active locally
              </span>
              <span className="text-[14px] font-medium"
                    style={{ color: "hsl(var(--a-ink))" }}>
                {activeMeta.name}
              </span>
            </div>
          )}
        </section>

        {/* Templates grid */}
        <ol className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              meta={t}
              active={t.id === template}
              pushing={pushStatus.kind === "pushing" && pushStatus.target === t.id}
              justPushed={pushStatus.kind === "ok" && pushStatus.target === t.id}
              onSelect={() => onPick(t.id)}
            />
          ))}
        </ol>

        {/* Remote sync */}
        <RemoteSyncPanel
          remote={remote}
          remoteLoading={remoteLoading}
          masterKey={masterKey}
          onMasterKeyChange={saveMasterKey}
          showKey={showKey}
          onToggleShowKey={() => setShowKey((s) => !s)}
          onRefresh={() => void refreshRemote()}
          pushStatus={pushStatus}
          templates={templates}
          currentLocal={template}
        />

        {/* Footer hint */}
        <p className="mt-10 mb-2 text-[12.5px]"
           style={{ color: "hsl(var(--a-ink-muted))" }}>
          Shortcut · press <kbd className="a-code">Shift</kbd>{" "}
          <kbd className="a-code">T</kbd> <kbd className="a-code">T</kbd> from any
          page to return here.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Template card
// ----------------------------------------------------------------------------
function TemplateCard({
  meta,
  active,
  onSelect,
  pushing,
  justPushed,
}: {
  meta: ReturnType<typeof useTemplate>["templates"][number];
  active: boolean;
  onSelect: () => void;
  pushing: boolean;
  justPushed: boolean;
}) {
  return (
    <li className="list-none">
      <button
        onClick={onSelect}
        disabled={pushing}
        className="group w-full text-left a-card transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait"
        style={{
          borderColor: active ? "hsl(var(--a-accent))" : undefined,
          boxShadow: active
            ? "0 1px 2px hsl(248 78% 60% / 0.10), 0 12px 36px hsl(248 78% 60% / 0.12)"
            : undefined,
        }}
      >
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[18px] md:text-[19px] font-semibold tracking-tight"
                  style={{ color: "hsl(var(--a-ink))" }}>
                {meta.name}
              </h3>
              <p className="mt-0.5 text-[12.5px]"
                 style={{ color: "hsl(var(--a-ink-muted))" }}>
                {meta.tagline}
              </p>
            </div>

            {active && !pushing && !justPushed && (
              <span className="a-chip a-chip-accent">Active</span>
            )}
            {pushing && (
              <span className="a-chip a-chip-warn">
                <Spinner />
                Pushing
              </span>
            )}
            {justPushed && (
              <span className="a-chip a-chip-success">
                <Check />
                Pushed
              </span>
            )}
          </div>

          <Preview id={meta.id} />

          <p className="mt-4 text-[13.5px] leading-[1.55]"
             style={{ color: "hsl(var(--a-ink-soft))" }}>
            {meta.description}
          </p>

          <div className="mt-4 pt-4 flex items-center justify-between text-[12px] border-t"
               style={{ borderColor: "hsl(var(--a-border))", color: "hsl(var(--a-ink-muted))" }}>
            <span>{meta.era}</span>
            <span>{meta.family}</span>
          </div>
        </div>
      </button>
    </li>
  );
}

// ----------------------------------------------------------------------------
// Remote sync panel
// ----------------------------------------------------------------------------
function RemoteSyncPanel({
  remote,
  remoteLoading,
  masterKey,
  onMasterKeyChange,
  showKey,
  onToggleShowKey,
  onRefresh,
  pushStatus,
  templates,
  currentLocal,
}: {
  remote: RemoteState | null;
  remoteLoading: boolean;
  masterKey: string;
  onMasterKeyChange: (v: string) => void;
  showKey: boolean;
  onToggleShowKey: () => void;
  onRefresh: () => void;
  pushStatus: PushStatus;
  templates: ReturnType<typeof useTemplate>["templates"];
  currentLocal: TemplateId;
}) {
  const configured = isRemoteConfigured();
  const bin = getBinId();
  const inSync = remote?.template === currentLocal;

  return (
    <section className="mt-10 a-card p-5 md:p-7">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-semibold tracking-tight"
              style={{ color: "hsl(var(--a-ink))" }}>
            Remote sync
          </h2>
          {configured ? (
            <span className="a-chip a-chip-success">
              <span className="a-dot" /> Connected
            </span>
          ) : (
            <span className="a-chip a-chip-danger">
              <span className="a-dot" /> Disabled
            </span>
          )}
        </div>
        <button onClick={onRefresh} className="a-btn a-btn-ghost">
          {remoteLoading ? (
            <>
              <Spinner /> Pulling…
            </>
          ) : (
            <>
              <RefreshIcon /> Refresh
            </>
          )}
        </button>
      </div>

      <dl className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
        <StatField label="Bin ID">
          {bin ? (
            <span className="a-code break-all">{bin}</span>
          ) : (
            <span style={{ color: "hsl(var(--a-danger))" }}>not set</span>
          )}
        </StatField>

        <StatField label="Remote template">
          {remote ? (
            <>
              <span className="text-[14px] font-medium"
                    style={{ color: "hsl(var(--a-ink))" }}>
                {templates.find((t) => t.id === remote.template)?.name ?? remote.template}
              </span>
              {remote.updatedAt && (
                <span className="block mt-0.5 text-[12px]"
                      style={{ color: "hsl(var(--a-ink-muted))" }}>
                  Updated {fmtRel(remote.updatedAt)}
                </span>
              )}
            </>
          ) : (
            <span style={{ color: "hsl(var(--a-ink-muted))" }}>—</span>
          )}
        </StatField>

        <StatField label="Status">
          {!configured ? (
            <span className="a-chip a-chip-danger">Offline</span>
          ) : !remote ? (
            <span className="a-chip a-chip-neutral">No remote state</span>
          ) : inSync ? (
            <span className="a-chip a-chip-success">In sync</span>
          ) : (
            <span className="a-chip a-chip-warn">Drift</span>
          )}
        </StatField>
      </dl>

      {/* Master key */}
      <div className="mt-7 pt-6 border-t" style={{ borderColor: "hsl(var(--a-border))" }}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2.5">
          <label className="a-label">Master key — write access</label>
          {hasEnvMasterKey() && (
            <span className="a-chip a-chip-success">
              <Check /> Loaded from .env
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-stretch gap-2">
          <input
            type={showKey ? "text" : "password"}
            value={masterKey}
            onChange={(e) => onMasterKeyChange(e.target.value)}
            placeholder={hasEnvMasterKey() ? "•••• (using .env value)" : "$2a$10$…"}
            className="a-input min-w-0 flex-1"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex items-stretch gap-2">
            <button type="button" onClick={onToggleShowKey} className="a-btn a-btn-ghost flex-1 sm:flex-none">
              {showKey ? "Hide" : "Show"}
            </button>
            <button type="button" onClick={() => onMasterKeyChange("")} className="a-btn a-btn-danger flex-1 sm:flex-none">
              Clear
            </button>
          </div>
        </div>
        <p className="mt-2 text-[12.5px] leading-[1.5]"
           style={{ color: "hsl(var(--a-ink-muted))" }}>
          Stored only in this browser's localStorage. If <code className="a-code">.env</code> provides one, that value
          wins and this field becomes a per-device override.
        </p>
      </div>

      {/* Push feedback */}
      {pushStatus.kind !== "idle" && (
        <div className="mt-5 px-4 py-3 rounded-[10px] text-[13px] flex items-center gap-2.5"
             style={{
               background:
                 pushStatus.kind === "ok" ? "hsl(var(--a-success) / 0.08)" :
                 pushStatus.kind === "err" ? "hsl(var(--a-danger) / 0.08)" :
                 "hsl(var(--a-warn) / 0.08)",
               color:
                 pushStatus.kind === "ok" ? "hsl(var(--a-success))" :
                 pushStatus.kind === "err" ? "hsl(var(--a-danger))" :
                 "hsl(var(--a-warn))",
             }}>
          {pushStatus.kind === "pushing" && (
            <>
              <Spinner />
              <span>Pushing {templates.find((t) => t.id === pushStatus.target)?.name}…</span>
            </>
          )}
          {pushStatus.kind === "ok" && (
            <>
              <Check />
              <span>
                <strong className="font-semibold">{templates.find((t) => t.id === pushStatus.target)?.name}</strong>{" "}
                pushed to remote. All next-load visitors will see it.
              </span>
            </>
          )}
          {pushStatus.kind === "err" && (
            <>
              <AlertIcon />
              <span>Push failed: {pushStatus.reason}</span>
            </>
          )}
        </div>
      )}
    </section>
  );
}

function StatField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="a-label mb-1.5">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Template preview swatches — keyed by id, no narrowing chain.
// Each preview intentionally LOOKS like the target template so you can
// compare at a glance from the admin's neutral palette.
// ----------------------------------------------------------------------------

const PreviewFolio = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{ height: 132, background: "#ffffff", border: "1px solid #e4e4e7" }}>
    <span className="absolute top-3 left-4 text-[11px] font-medium"
          style={{ color: "#2543b0", fontFamily: "Inter, sans-serif" }}>
      Backend architect · Dhaka
    </span>
    <div className="absolute left-4 right-4 top-9"
         style={{
           fontFamily: "Inter, sans-serif",
           fontSize: 21, fontWeight: 600, lineHeight: 1.08,
           color: "#14181f", letterSpacing: "-0.025em",
         }}>
      Md. Mosfikur Rahman
    </div>
    <span className="absolute bottom-3 left-4 right-4 h-px" style={{ background: "#e4e4e7" }} />
    <span className="absolute bottom-3 left-4 text-[11px]"
          style={{ color: "#6b7280", fontFamily: "Inter, sans-serif" }}>
      Experience · Publications · About
    </span>
  </div>
);

const PreviewAnimus = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{ height: 132, background: "#0b1b2c", border: "1px solid #173249" }}>
    <span className="absolute top-3 left-4 text-[9.5px] uppercase tracking-[0.32em]"
          style={{ color: "#22d3ee", fontFamily: "Cinzel, serif", fontWeight: 600 }}>
      ✦ Memory Block 0001
    </span>
    <div className="absolute left-4 right-4 top-9 uppercase"
         style={{ fontFamily: "Cinzel, serif", fontSize: 17, fontWeight: 600, letterSpacing: "0.02em", color: "#a5e9f5" }}>
      MD. MOSFIKUR RAHMAN
    </div>
    <span className="absolute top-3 right-3 w-3 h-3" style={{ border: "1px solid #22d3ee", borderRight: 0, borderBottom: 0 }} />
    <span className="absolute bottom-3 left-3 w-3 h-3" style={{ border: "1px solid #22d3ee", borderLeft: 0, borderTop: 0 }} />
    <span className="absolute bottom-3 right-4 text-[9.5px] uppercase tracking-[0.22em]"
          style={{ color: "#5fa3b8", fontFamily: "Cinzel, serif" }}>
      ✦ Sync 100%
    </span>
  </div>
);

const PreviewInception = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{
         height: 132,
         background: "#f6f0e6",
         backgroundImage: "linear-gradient(rgba(20,30,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,30,60,0.05) 1px, transparent 1px)",
         backgroundSize: "12px 12px, 12px 12px",
         border: "1px solid #d8d2c4",
       }}>
    <span className="absolute top-3 left-4 text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "#2563eb", fontFamily: "JetBrains Mono, monospace" }}>
      ▾ Level 01 · Surface
    </span>
    <div className="absolute left-4 right-4 top-9"
         style={{ fontFamily: "Inter, sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", color: "#14233c" }}>
      We build the levels.
    </div>
    <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "#2563eb", fontFamily: "JetBrains Mono, monospace" }}>
      plate 01 / 04 · scale 1:1
    </span>
  </div>
);

const PreviewHeist = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{ height: 132, background: "#f4ebdd", border: "1px solid #cdc3b1" }}>
    <span aria-hidden className="absolute hidden md:block"
          style={{ top: "30%", left: "-10%", right: "-10%", height: 2, background: "#c01a1a", transform: "rotate(-8deg)", opacity: 0.4 }} />
    <span className="absolute top-3 left-4 text-[10.5px] uppercase tracking-[0.28em]"
          style={{ color: "#c01a1a", fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
      ● Operation 01
    </span>
    <div className="absolute left-4 right-4 top-9 uppercase"
         style={{ fontFamily: "Inter, sans-serif", fontSize: 19, fontWeight: 800, letterSpacing: "-0.035em", color: "#0a0a0a" }}>
      BACKEND, <span style={{ color: "#c01a1a" }}>EXECUTED.</span>
    </div>
    <span className="absolute bottom-3 right-4"
          style={{ fontFamily: "Caveat, cursive", color: "#c01a1a", fontSize: 18, fontWeight: 600 }}>
      Bella Ciao
    </span>
  </div>
);

const PreviewChess = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{
         height: 132,
         background: "#faf6e9",
         backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
         backgroundSize: "28px 28px",
         border: "1px solid #d8d0b6",
       }}>
    <span className="absolute top-3 left-4 text-[12px]"
          style={{ color: "#a47e1a", fontFamily: "JetBrains Mono, monospace" }}>
      ♔ 1.e4 · Opening
    </span>
    <div className="absolute left-4 right-4 top-9"
         style={{ fontFamily: "Crimson Pro, Georgia, serif", fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", color: "#0a0a0a" }}>
      Md. Mosfikur Rahman
    </div>
    <span className="absolute bottom-3 left-4"
          style={{ fontFamily: "Crimson Pro, serif", fontStyle: "italic", fontSize: 13, color: "#6b6b6b" }}>
      playing the long game.
    </span>
  </div>
);

const PreviewTenet = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{ height: 132, background: "#eef1f7", border: "1px solid #cdd2dc" }}>
    <span className="absolute top-3 left-4 text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "#1d6cb0", fontFamily: "JetBrains Mono, monospace" }}>
      ◐ Forward · 2026
    </span>
    <span className="absolute top-3 right-4 text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "#c63a13", fontFamily: "JetBrains Mono, monospace" }}>
      6202 · Reversed ◑
    </span>
    <div className="absolute left-4 right-4 top-9"
         style={{ fontFamily: "Inter, sans-serif", fontSize: 19, fontWeight: 600, letterSpacing: "-0.03em" }}>
      <span style={{ color: "#1d6cb0" }}>Designed</span>{" "}
      <span style={{ color: "#0a0a0a" }}>forward.</span><br />
      <span style={{ color: "#c63a13" }}>Reviewed</span>{" "}
      <span style={{ color: "#0a0a0a" }}>backward.</span>
    </div>
  </div>
);

const PreviewMinimal = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{ height: 132, background: "#fafaf9", border: "1px solid #e4e4e7" }}>
    <span className="absolute top-3 left-4 text-[11px] font-medium"
          style={{ color: "#0e7490", fontFamily: "Inter, system-ui, sans-serif" }}>
      Backend architect · Dhaka
    </span>
    <div className="absolute left-4 right-4 top-9"
         style={{
           fontFamily: "Inter, system-ui, sans-serif",
           fontSize: 22, fontWeight: 600, lineHeight: 1.05,
           color: "#0c0d10", letterSpacing: "-0.03em",
         }}>
      Hi, I'm Mosfikur.
    </div>
    <span className="absolute bottom-3 left-4 right-4 h-px" style={{ background: "#e4e4e7" }} />
    <span className="absolute bottom-3 left-4 text-[11px]"
          style={{ color: "#71717a", fontFamily: "Inter, system-ui, sans-serif" }}>
      Work · Writing · About
    </span>
  </div>
);

const PreviewBroadsheet = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{
         height: 132,
         background: "linear-gradient(180deg, hsl(40 22% 96%) 0%, hsl(40 18% 93%) 100%)",
         border: "1px solid hsl(40 14% 86%)",
       }}>
    <span className="absolute top-3 left-4 text-[9px] uppercase tracking-[0.22em]"
          style={{ color: "hsl(220 6% 42%)", fontFamily: "JetBrains Mono, monospace" }}>
      13 May 2026 · No. I
    </span>
    <div className="absolute left-4 right-4 top-10"
         style={{
           fontFamily: "Fraunces, serif",
           fontSize: 24, lineHeight: 1.04,
           color: "hsl(220 14% 10%)", letterSpacing: "-0.025em",
         }}>
      Engineer <em style={{ color: "hsl(220 6% 42%)", fontWeight: 300 }}>by craft.</em>
    </div>
    <span className="absolute bottom-3 left-4 right-4 h-px"
          style={{ background: "hsl(40 12% 80%)" }} />
    <span className="absolute bottom-3 left-4 text-[9px] uppercase tracking-[0.22em]"
          style={{ color: "hsl(16 62% 42%)", fontFamily: "JetBrains Mono, monospace" }}>
      ── SELECTED WORK
    </span>
  </div>
);

const PreviewSurveillance = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{
         height: 132,
         background: "hsl(24 18% 5%)",
         backgroundImage:
           "repeating-linear-gradient(0deg, hsl(38 92% 64% / 0.07) 0 1px, transparent 1px 3px)",
         border: "1px solid hsl(24 14% 12%)",
       }}>
    <span className="absolute top-3 left-4 text-[9px] uppercase tracking-[0.22em] flex items-center gap-1.5"
          style={{ color: "hsl(0 85% 60%)", fontFamily: "JetBrains Mono, monospace" }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "hsl(145 80% 55%)" }} />
      LIVE · FEED 14221
    </span>
    <div className="absolute left-4 right-4 top-10"
         style={{
           fontFamily: "IBM Plex Mono, monospace",
           fontSize: 17, fontWeight: 600, lineHeight: 1.12,
           color: "hsl(38 92% 64%)", letterSpacing: "-0.01em",
         }}>
      <span style={{ color: "hsl(0 85% 60%)" }}>&gt; </span>MD. MOSFIKUR RAHMAN
    </div>
    <span className="absolute top-3 right-3 w-3 h-3"
          style={{ borderTop: "2px solid hsl(0 85% 60%)", borderRight: "2px solid hsl(0 85% 60%)" }} />
    <span className="absolute bottom-3 left-3 w-3 h-3"
          style={{ borderBottom: "2px solid hsl(0 85% 60%)", borderLeft: "2px solid hsl(0 85% 60%)" }} />
    <span className="absolute bottom-3 right-4 text-[9px] uppercase tracking-[0.22em]"
          style={{ color: "hsl(38 30% 60%)", fontFamily: "JetBrains Mono, monospace" }}>
      OPERATOR <span style={{ color: "hsl(0 85% 60%)" }}>MACHINE</span>
    </span>
  </div>
);

const PreviewKeynote = (
  <div className="mt-4 rounded-[10px] overflow-hidden relative"
       style={{ height: 132, background: "#ffffff", border: "1px solid #d9dce6" }}>
    <span className="absolute top-3 left-4 text-[9px] uppercase tracking-[0.2em] flex items-center gap-2"
          style={{ color: "#4338ca", fontFamily: "JetBrains Mono, monospace" }}>
      <span className="inline-block w-5 h-[2px]" style={{ background: "#4338ca" }} />
      01 · Title
    </span>
    <span className="absolute top-3 right-4 text-[8px] uppercase tracking-[0.2em]"
          style={{ color: "#9aa0b0", fontFamily: "JetBrains Mono, monospace" }}>
      Interview Deck
    </span>
    <div className="absolute left-4 right-4 top-10"
         style={{
           fontFamily: "Inter, system-ui, sans-serif",
           fontSize: 26, fontWeight: 700, lineHeight: 0.98,
           color: "#0d1024", letterSpacing: "-0.04em",
         }}>
      Md. Mosfikur Rahman
    </div>
    <span className="absolute bottom-3 left-4 text-[10px]"
          style={{ color: "#5b6070", fontFamily: "Inter, sans-serif" }}>
      Backend architect · scroll = next slide
    </span>
  </div>
);

const PREVIEWS: Record<TemplateId, ReactNode> = {
  folio:        PreviewFolio,
  broadsheet:   PreviewBroadsheet,
  surveillance: PreviewSurveillance,
  minimal:      PreviewMinimal,
  animus:       PreviewAnimus,
  inception:    PreviewInception,
  heist:        PreviewHeist,
  chess:        PreviewChess,
  tenet:        PreviewTenet,
  keynote:      PreviewKeynote,
  "keynote-tech": PreviewKeynote,
  "keynote-talk": PreviewKeynote,
};

function Preview({ id }: { id: TemplateId }) {
  return <>{PREVIEWS[id] ?? PreviewFolio}</>;
}

// ----------------------------------------------------------------------------
// Tiny inline icons
// ----------------------------------------------------------------------------
function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
      <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden
         style={{ animation: "a-spin 0.85s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes a-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function fmtRel(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return iso;
  const diff = Date.now() - t;
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
