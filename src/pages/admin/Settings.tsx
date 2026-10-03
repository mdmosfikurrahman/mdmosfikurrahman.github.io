import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertTriangle,
  Bot,
  Briefcase,
  Check,
  CloudUpload,
  Database,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  KeyRound,
  Plus,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { changePassword, ensureAuth } from "@/lib/adminAuth";
import { pageZoom } from "@/lib/zoom";
import {
  getBinId,
  getStoredMasterKey,
  hasEnvMasterKey,
  isAvatarBinConfigured,
  isBinConfigured,
} from "@/lib/binStore";
import { pushRemoteAvatar, pushRemoteCvUrl, pushRemoteHireLinks, pushRemoteHireMe } from "@/lib/remote";
import {
  getAvatarUrl,
  getChatbotEnabled,
  getCvUrl,
  getHireLinks,
  getHireMeEnabled,
  getStoredHireLinks,
  setAvatarUrl,
  setChatbotEnabled,
  setCvUrl,
  setHireLinks,
  setHireMeEnabled,
  subscribeSettings,
  type HireLink,
} from "@/lib/settings";
import { profile } from "@/lib/content";

type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "ok"; at: number }
  | { kind: "err"; reason: string };

const GROUPS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: "account", label: "Account", Icon: KeyRound },
  { id: "password", label: "Password", Icon: ShieldCheck },
  { id: "features", label: "Visitor features", Icon: Bot },
  { id: "cv", label: "CV link", Icon: FileText },
  { id: "avatar", label: "Profile picture", Icon: ImagePlus },
  { id: "freelance", label: "Freelance links", Icon: Briefcase },
  { id: "storage", label: "Publishing", Icon: Database },
];

export default function Settings() {
  // ---- Account ----
  const [username, setUsername] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string | undefined>(undefined);

  // ---- Change password form ----
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwStatus, setPwStatus] = useState<SaveStatus>({ kind: "idle" });
  const strength = useMemo(() => scoreStrength(next), [next]);
  const confirmMismatch = confirm.length > 0 && confirm !== next;

  // ---- Preferences ----
  const [chatbot, setChatbot] = useState<boolean>(() => getChatbotEnabled());

  // ---- Freelance section ----
  const [hireMe, setHireMe] = useState<boolean>(() => getHireMeEnabled());
  const [hireStatus, setHireStatus] = useState<SaveStatus>({ kind: "idle" });
  const [hireRows, setHireRows] = useState<HireLink[]>(() => getHireLinks());
  const [hireRowsDirty, setHireRowsDirty] = useState(false);
  const [hireRowsStatus, setHireRowsStatus] = useState<SaveStatus>({ kind: "idle" });

  // ---- CV link ----
  const [cvInput, setCvInput] = useState<string>(() => getCvUrl());

  useEffect(
    () =>
      subscribeSettings((s) => {
        setChatbot(s.chatbotEnabled);
        setHireMe(s.hireMeEnabled);
        // Don't stamp on half-typed rows: only re-sync the editor when the
        // admin has no unsaved edits (e.g. a published list arriving on boot).
        setHireRowsDirty((dirty) => {
          if (!dirty) setHireRows(getHireLinks());
          return dirty;
        });
        // Reflect an externally-applied CV link (e.g. one published on boot).
        setCvInput(getCvUrl());
        // Same for an externally-applied avatar.
        setAvatarPreview(getAvatarUrl());
      }),
    [],
  );
  const [cvStatus, setCvStatus] = useState<SaveStatus>({ kind: "idle" });
  const cvTrimmed = cvInput.trim();
  const cvValid = /^https?:\/\//i.test(cvTrimmed);
  const cvDirty = cvTrimmed !== getCvUrl();
  // When remote sync is on, allow (re)publishing any valid URL: the point is
  // to push to all visitors. Local-only mode has nothing to do if unchanged.
  const cvCanSave = cvValid && (cvDirty || isBinConfigured());

  const saveCvUrl = async () => {
    const next = cvInput.trim();
    if (!next) {
      setCvStatus({ kind: "err", reason: "CV link can't be empty." });
      return;
    }
    if (!/^https?:\/\//i.test(next)) {
      setCvStatus({ kind: "err", reason: "Must start with http:// or https://" });
      return;
    }
    setCvStatus({ kind: "saving" });
    // Apply locally first so the public site reflects it immediately.
    setCvUrl(next);
    setCvInput(getCvUrl());
    // Publish to all visitors when remote storage is configured.
    if (isBinConfigured()) {
      const res = await pushRemoteCvUrl(next, getStoredMasterKey() || undefined);
      if (res.kind === "err") {
        setCvStatus({ kind: "err", reason: res.reason });
        return;
      }
    }
    setCvStatus({ kind: "ok", at: Date.now() });
  };

  // ---- Freelance section handlers ----
  // The toggle applies locally at once (the public site reacts immediately),
  // then publishes so every visitor picks it up on their next boot.
  const toggleHireMe = async (v: boolean) => {
    setHireMeEnabled(v);
    if (!isBinConfigured()) {
      setHireStatus({ kind: "ok", at: Date.now() });
      return;
    }
    setHireStatus({ kind: "saving" });
    const res = await pushRemoteHireMe(v, getStoredMasterKey() || undefined);
    setHireStatus(res.kind === "ok" ? { kind: "ok", at: Date.now() } : { kind: "err", reason: res.reason });
  };

  const hireRowsValid = hireRows.every(
    (r) => r.label.trim().length === 0 || /^https?:\/\//i.test(r.url.trim()),
  );

  const saveHireLinks = async () => {
    const cleaned = hireRows
      .map((r) => ({ label: r.label.trim(), url: r.url.trim() }))
      .filter((r) => r.label.length > 0 && r.url.length > 0);
    const bad = cleaned.find((r) => !/^https?:\/\//i.test(r.url));
    if (bad) {
      setHireRowsStatus({ kind: "err", reason: `"${bad.label}": URL must start with http:// or https://` });
      return;
    }
    setHireRowsStatus({ kind: "saving" });
    setHireLinks(cleaned);
    setHireRowsDirty(false);
    setHireRows(getHireLinks());
    if (isBinConfigured()) {
      const res = await pushRemoteHireLinks(cleaned, getStoredMasterKey() || undefined);
      if (res.kind === "err") {
        setHireRowsStatus({ kind: "err", reason: res.reason });
        return;
      }
    }
    setHireRowsStatus({ kind: "ok", at: Date.now() });
  };

  const editHireRow = (i: number, patch: Partial<HireLink>) => {
    setHireRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    setHireRowsDirty(true);
    if (hireRowsStatus.kind !== "idle") setHireRowsStatus({ kind: "idle" });
  };

  const addHireRow = () => {
    setHireRows((rows) => (rows.length >= 8 ? rows : [...rows, { label: "", url: "" }]));
    setHireRowsDirty(true);
  };

  const removeHireRow = (i: number) => {
    setHireRows((rows) => rows.filter((_, idx) => idx !== i));
    setHireRowsDirty(true);
  };

  // ---- Avatar image ----
  const [avatarPreview, setAvatarPreview] = useState<string>(() => getAvatarUrl());
  const [avatarBytes, setAvatarBytes] = useState<number | null>(null);
  const [avatarStatus, setAvatarStatus] = useState<SaveStatus>({ kind: "idle" });
  const [avatarDragging, setAvatarDragging] = useState(false);
  const avatarFileInput = useRef<HTMLInputElement>(null);
  const avatarDirty = avatarPreview !== getAvatarUrl();
  const avatarCanSave = avatarDirty || isAvatarBinConfigured();

  const processAvatarFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAvatarStatus({ kind: "err", reason: "Please choose an image file." });
      return;
    }
    setAvatarStatus({ kind: "saving" });
    try {
      const dataUrl = await resizeAndCompress(file, 480, 0.82);
      const bytes = Math.round((dataUrl.length * 3) / 4);
      if (bytes > 90_000) {
        setAvatarStatus({
          kind: "err",
          reason: `Still ~${Math.round(bytes / 1024)}KB after compression. Try a simpler or smaller photo.`,
        });
        return;
      }
      setAvatarPreview(dataUrl);
      setAvatarBytes(bytes);
      setAvatarStatus({ kind: "idle" });
    } catch (err) {
      setAvatarStatus({ kind: "err", reason: err instanceof Error ? err.message : "Couldn't process that image." });
    }
  };

  const saveAvatar = async () => {
    setAvatarStatus({ kind: "saving" });
    setAvatarUrl(avatarPreview);
    if (isAvatarBinConfigured()) {
      const res = await pushRemoteAvatar(avatarPreview, getStoredMasterKey() || undefined);
      if (res.kind === "err") {
        setAvatarStatus({ kind: "err", reason: res.reason });
        return;
      }
    }
    setAvatarStatus({ kind: "ok", at: Date.now() });
  };

  const resetAvatar = () => {
    setAvatarUrl("");
    setAvatarPreview(getAvatarUrl());
    setAvatarBytes(null);
    setAvatarStatus({ kind: "idle" });
  };

  useEffect(() => {
    void (async () => {
      const auth = await ensureAuth();
      if (auth) {
        setUsername(auth.username);
        setUpdatedAt(auth.updatedAt);
      }
    })();
  }, []);

  const submitPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (pwStatus.kind === "saving") return;
    if (next !== confirm) {
      setPwStatus({ kind: "err", reason: "New passwords don't match." });
      return;
    }
    if (next.length < 8) {
      setPwStatus({ kind: "err", reason: "Must be at least 8 characters." });
      return;
    }
    setPwStatus({ kind: "saving" });
    const res = await changePassword(current, next);
    if (res.kind === "ok") {
      setPwStatus({ kind: "ok", at: Date.now() });
      setCurrent("");
      setNext("");
      setConfirm("");
      const auth = await ensureAuth();
      if (auth) setUpdatedAt(auth.updatedAt);
    } else {
      setPwStatus({ kind: "err", reason: res.reason });
    }
  };

  // ---- Section nav ----
  // The active link follows the scroll position of the console body. A click
  // holds its choice until the smooth scroll settles, so a section too short
  // to reach the top still shows as the one picked.
  const pageRef = useRef<HTMLDivElement>(null);
  const navHold = useRef(0);
  const [activeGroup, setActiveGroup] = useState<string>(GROUPS[0].id);
  useEffect(() => {
    const scroller = pageRef.current?.closest<HTMLElement>(".sc-content");
    if (!scroller) return;
    const update = () => {
      if (Date.now() < navHold.current) return;
      const line = scroller.getBoundingClientRect().top + 120 * pageZoom();
      let current = GROUPS[0].id;
      for (const g of GROUPS) {
        const el = document.getElementById(`sc-${g.id}`);
        if (el && el.getBoundingClientRect().top <= line) current = g.id;
      }
      if (scroller.scrollTop > 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
        current = GROUPS[GROUPS.length - 1].id;
      }
      setActiveGroup(current);
    };
    const release = () => {
      navHold.current = 0;
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    scroller.addEventListener("scrollend", release);
    return () => {
      scroller.removeEventListener("scroll", update);
      scroller.removeEventListener("scrollend", release);
    };
  }, []);
  const goTo = (id: string) => {
    navHold.current = Date.now() + 1200;
    setActiveGroup(id);
    document.getElementById(`sc-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const remote = isBinConfigured();
  const remoteAvatar = isAvatarBinConfigured();
  const publishVerb = remote ? "Publish" : "Save";

  return (
    <div ref={pageRef} className="sc-page">
      <div className="sc-settings">
        <nav className="sc-subnav" aria-label="Settings sections">
          {GROUPS.map(({ id, label, Icon }) => (
            <a
              key={id}
              href={`#sc-${id}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(id);
              }}
              aria-current={activeGroup === id ? "true" : undefined}
            >
              <Icon size={15} strokeWidth={1.8} aria-hidden />
              {label}
            </a>
          ))}
        </nav>

        <div className="sc-settings-body">
          <Section id="account" title="Account" description="The single admin user for this console.">
            <dl className="sc-dl">
              <dt>Username</dt>
              <dd>
                <code className="sc-code">{username || "Loading…"}</code>
              </dd>
              <dt>Last changed</dt>
              <dd className="sc-mono">{username ? fmtAbs(updatedAt) : "Loading…"}</dd>
              <dt>Hash</dt>
              <dd>SHA-256 · username-salted</dd>
            </dl>
          </Section>

          <Section
            id="password"
            title="Password"
            description="At least 8 characters. This is soft auth, so pick a long passphrase."
          >
            <form onSubmit={submitPassword} className="sc-form">
              <PasswordField
                id="cur-pw"
                label="Current password"
                autoComplete="current-password"
                value={current}
                onChange={setCurrent}
                placeholder="••••••••"
              />
              <div>
                <PasswordField
                  id="new-pw"
                  label="New password"
                  autoComplete="new-password"
                  value={next}
                  onChange={setNext}
                  placeholder="At least 8 characters"
                />
                {next.length > 0 && <StrengthMeter score={strength.score} label={strength.label} />}
              </div>
              <PasswordField
                id="conf-pw"
                label="Confirm new password"
                autoComplete="new-password"
                value={confirm}
                onChange={setConfirm}
                placeholder="Type the new password again"
                error={confirmMismatch ? "Doesn't match." : undefined}
              />

              <div className="sc-form-foot">
                <button
                  type="submit"
                  disabled={
                    pwStatus.kind === "saving" ||
                    !current ||
                    !next ||
                    !confirm ||
                    confirmMismatch ||
                    next.length < 8
                  }
                  className="sc-btn sc-btn--primary"
                >
                  {pwStatus.kind === "saving" ? "Saving…" : "Update password"}
                </button>
                {pwStatus.kind === "err" && (
                  <span className="sc-status sc-status--err">
                    <AlertTriangle size={13} strokeWidth={2.2} aria-hidden />
                    {pwStatus.reason}
                  </span>
                )}
                {pwStatus.kind === "ok" && (
                  <span className="sc-status sc-status--ok">
                    <Check size={13} strokeWidth={2.4} aria-hidden /> Password updated.
                  </span>
                )}
              </div>
            </form>
          </Section>

          <Section id="features" title="Visitor features" description="What the public site shows. Changes apply at once.">
            <div className="sc-stack">
              <ToggleRow
                id="toggle-chatbot"
                label="Show chatbot"
                description="The floating assistant on the public portfolio."
                checked={chatbot}
                onChange={(v) => setChatbotEnabled(v)}
              />
              <div>
                <ToggleRow
                  id="toggle-hire"
                  label="Show freelance section"
                  description={
                    remote
                      ? "The freelance line in Contact, the footer link and the /hire page. Never inside Present mode. Publishes to every visitor."
                      : "The freelance line in Contact, the footer link and the /hire page. Never inside Present mode. This browser only."
                  }
                  checked={hireMe}
                  onChange={(v) => void toggleHireMe(v)}
                />
                <Status
                  status={hireStatus}
                  ok={remote ? "Published to all visitors." : "Saved for this browser."}
                  saving="Publishing…"
                />
              </div>
            </div>
          </Section>

          <Section
            id="cv"
            title="CV link"
            description={
              <>
                Used by the header CV button, About, Contact, the footer, the chatbot, the presentation deck, and{" "}
                <code className="sc-code">/cv</code> · <code className="sc-code">/resume</code>.
                {remote ? " Saving publishes it to every visitor." : " Remote sync is off, so this applies to this browser only."}
              </>
            }
            aside={cvDirty && cvTrimmed.length > 0 ? <Unsaved /> : undefined}
          >
            <label htmlFor="cv-url" className="sc-label">
              CV URL
            </label>
            <div className="sc-inline">
              <input
                id="cv-url"
                type="url"
                inputMode="url"
                value={cvInput}
                onChange={(e) => {
                  setCvInput(e.target.value);
                  if (cvStatus.kind !== "idle") setCvStatus({ kind: "idle" });
                }}
                placeholder={profile.cvUrl}
                className="sc-input is-mono"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => void saveCvUrl()}
                disabled={cvStatus.kind === "saving" || !cvCanSave}
                className="sc-btn sc-btn--primary"
              >
                {remote ? <CloudUpload size={15} strokeWidth={1.9} aria-hidden /> : <Check size={15} strokeWidth={1.9} aria-hidden />}
                {cvStatus.kind === "saving" ? "Saving…" : publishVerb}
              </button>
            </div>
            <div className="mt-2">
              <Status status={cvStatus} ok={remote ? "Published to all visitors." : "Saved for this browser."} />
            </div>
          </Section>

          <Section
            id="avatar"
            title="Profile picture"
            description={`Used wherever the portrait shows: the header, hero, About page, footer, chatbot and presentation deck. Resized and compressed in your browser before saving. ${
              remoteAvatar ? "Publishing sends it to every visitor." : "Remote sync is off, so this applies to this browser only."
            }`}
            aside={avatarDirty ? <Unsaved /> : undefined}
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setAvatarDragging(true);
              }}
              onDragLeave={() => setAvatarDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setAvatarDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) void processAvatarFile(file);
              }}
              onClick={() => avatarFileInput.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  avatarFileInput.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Choose a profile picture"
              data-dragging={avatarDragging ? "true" : undefined}
              className="sc-drop"
            >
              <input
                ref={avatarFileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void processAvatarFile(file);
                  e.target.value = "";
                }}
              />
              <img src={avatarPreview} alt="Avatar preview" />
              <div className="min-w-0">
                <b>Drop an image here</b>
                <p>
                  or <u>browse files</u>. JPEG, PNG or WebP.
                </p>
                {avatarBytes != null && (
                  <span className="sc-badge sc-badge--ok">
                    <Check size={12} strokeWidth={2.4} aria-hidden />
                    Compressed to ~{Math.round(avatarBytes / 1024)}KB
                  </span>
                )}
              </div>
            </div>
            <div className="sc-row-actions">
              <button
                type="button"
                onClick={() => void saveAvatar()}
                disabled={avatarStatus.kind === "saving" || !avatarCanSave}
                className="sc-btn sc-btn--primary"
              >
                {remoteAvatar ? <CloudUpload size={15} strokeWidth={1.9} aria-hidden /> : <Check size={15} strokeWidth={1.9} aria-hidden />}
                {avatarStatus.kind === "saving" ? "Saving…" : remoteAvatar ? "Publish" : "Save"}
              </button>
              <button type="button" onClick={resetAvatar} className="sc-btn sc-btn--ghost">
                Reset to default
              </button>
            </div>
            <div className="mt-2">
              <Status status={avatarStatus} ok={remoteAvatar ? "Published to all visitors." : "Saved for this browser."} />
            </div>
          </Section>

          <Section
            id="freelance"
            title="Freelance links"
            description={`The gig links on the /hire page, one row per live gig or profile. Leave the list empty to fall back to the built-in defaults.${
              remote ? " Publishing sends the list to every visitor." : " Remote sync is off, so this applies to this browser only."
            }`}
            aside={
              hireRowsDirty ? (
                <Unsaved />
              ) : getStoredHireLinks().length > 0 ? (
                <span className="sc-badge sc-badge--ok">Custom list</span>
              ) : (
                <span className="sc-badge sc-badge--off">Built-in defaults</span>
              )
            }
          >
            <div className="sc-linkrows">
              {hireRows.length > 0 && (
                <div className="sc-linkrow sc-linkhead" aria-hidden>
                  <span>Label</span>
                  <span>URL</span>
                  <span />
                </div>
              )}
              {hireRows.map((row, i) => (
                <div key={i} className="sc-linkrow">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => editHireRow(i, { label: e.target.value })}
                    placeholder="Label"
                    aria-label={`Label for link ${i + 1}`}
                    className="sc-input"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <input
                    type="url"
                    inputMode="url"
                    value={row.url}
                    onChange={(e) => editHireRow(i, { url: e.target.value })}
                    placeholder="https://…"
                    aria-label={`URL for link ${i + 1}`}
                    className="sc-input is-mono"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={() => removeHireRow(i)}
                    aria-label={`Remove ${row.label || "row"}`}
                    title="Remove"
                    className="sc-iconbtn sc-iconbtn--danger"
                  >
                    <Trash2 size={15} strokeWidth={1.8} aria-hidden />
                  </button>
                </div>
              ))}
              {hireRows.length === 0 && <p className="sc-help">The list is empty. Saving it restores the built-in defaults.</p>}
            </div>

            <div className="sc-row-actions">
              <button
                type="button"
                onClick={addHireRow}
                disabled={hireRows.length >= 8}
                className="sc-btn sc-btn--outline"
              >
                <Plus size={15} strokeWidth={2} aria-hidden />
                Add link
              </button>
              <button
                type="button"
                onClick={() => void saveHireLinks()}
                disabled={hireRowsStatus.kind === "saving" || !hireRowsValid || (!hireRowsDirty && !remote)}
                className="sc-btn sc-btn--primary sc-push"
              >
                {remote ? <CloudUpload size={15} strokeWidth={1.9} aria-hidden /> : <Check size={15} strokeWidth={1.9} aria-hidden />}
                {hireRowsStatus.kind === "saving" ? "Saving…" : publishVerb}
              </button>
            </div>
            <div className="mt-2">
              <Status status={hireRowsStatus} ok={remote ? "Published to all visitors." : "Saved for this browser."} />
            </div>
          </Section>

          <Section
            id="storage"
            title="Publishing"
            description="Where published settings go. Read-only here; the bin and keys come from the build environment."
          >
            <dl className="sc-dl">
              <dt>Remote sync</dt>
              <dd>
                {remote ? <span className="sc-badge sc-badge--ok">Connected</span> : <span className="sc-badge sc-badge--off">Off</span>}
              </dd>
              {remote && (
                <>
                  <dt>Settings bin</dt>
                  <dd>
                    <code className="sc-code">…{getBinId().slice(-6)}</code>
                  </dd>
                </>
              )}
              <dt>Avatar storage</dt>
              <dd>
                {remoteAvatar ? (
                  <span className="sc-badge sc-badge--ok">Connected</span>
                ) : (
                  <span className="sc-badge sc-badge--off">Off</span>
                )}
              </dd>
              <dt>Master key</dt>
              <dd>
                {hasEnvMasterKey() ? (
                  <span className="sc-badge sc-badge--ok">From the build environment</span>
                ) : getStoredMasterKey() ? (
                  <span className="sc-badge sc-badge--ok">Stored in this browser</span>
                ) : (
                  <span className="sc-badge sc-badge--warn">Not set, publishing will fail</span>
                )}
              </dd>
            </dl>
          </Section>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// pieces
// =============================================================================

function Section({
  id,
  title,
  description,
  aside,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={`sc-${id}`} className="sc-section" aria-labelledby={`sc-${id}-title`}>
      <header className="sc-section-head">
        <div>
          <h2 id={`sc-${id}-title`}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {aside}
      </header>
      <div className="sc-card">{children}</div>
    </section>
  );
}

function Unsaved() {
  return <span className="sc-badge sc-badge--warn">Unsaved changes</span>;
}

function Status({ status, ok, saving }: { status: SaveStatus; ok: string; saving?: string }) {
  if (status.kind === "saving" && saving) {
    return <span className="sc-status sc-status--muted">{saving}</span>;
  }
  if (status.kind === "err") {
    return (
      <span className="sc-status sc-status--err" role="alert">
        <AlertTriangle size={13} strokeWidth={2.2} aria-hidden />
        {status.reason}
      </span>
    );
  }
  if (status.kind === "ok") {
    return (
      <span className="sc-status sc-status--ok">
        <Check size={13} strokeWidth={2.4} aria-hidden />
        {ok}
      </span>
    );
  }
  return null;
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="sc-toggle-row" htmlFor={id}>
      <span className="sc-toggle-copy">
        <b id={`${id}-label`}>{label}</b>
        <span id={`${id}-desc`}>{description}</span>
      </span>
      <span className="sc-switch">
        <input
          id={id}
          type="checkbox"
          role="switch"
          className="sc-switch-input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-desc`}
        />
        <span className="sc-switch-track" aria-hidden />
      </span>
    </label>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="sc-label">
        {label}
      </label>
      <div className="sc-field" data-invalid={error ? "true" : undefined}>
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide" : "Show"}
          className="sc-field-btn"
        >
          {show ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
        </button>
      </div>
      {error && <p className="sc-field-error">{error}</p>}
    </div>
  );
}

function StrengthMeter({ score, label }: { score: number; label: string }) {
  const segs = 4;
  const color =
    score <= 1 ? "hsl(var(--signal-crit))" :
    score === 2 ? "hsl(var(--signal-warn))" :
    score === 3 ? "hsl(var(--gold))" :
                  "hsl(var(--signal-pos))";
  return (
    <div className="sc-strength">
      <div className="sc-strength-bars">
        {Array.from({ length: segs }, (_, i) => (
          <span key={i} style={i < score ? { background: color } : undefined} />
        ))}
      </div>
      <div className="sc-strength-text">
        <span>Strength</span>
        <span style={{ color, fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  );
}

// =============================================================================
// helpers
// =============================================================================

// Resizes to fit within maxDim (either dimension) and re-encodes as WebP so a
// typical headshot lands in the tens-of-KB range instead of multi-MB.
function resizeAndCompress(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Couldn't decode that image."));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas isn't supported in this browser."));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/webp", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function fmtAbs(iso?: string): string {
  if (!iso) return "Not recorded";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return iso;
  return t.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: "None" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  s = Math.min(4, s);
  const label = s <= 1 ? "Weak" : s === 2 ? "Fair" : s === 3 ? "Good" : "Strong";
  return { score: s, label };
}
