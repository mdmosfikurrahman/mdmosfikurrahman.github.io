import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertTriangle,
  Bot,
  Check,
  CloudUpload,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { changePassword, ensureAuth } from "@/lib/adminAuth";
import { getStoredMasterKey, isAvatarBinConfigured, isBinConfigured } from "@/lib/binStore";
import { pushRemoteAvatar, pushRemoteCvUrl } from "@/lib/templateRemote";
import {
  getAvatarUrl,
  getChatbotEnabled,
  getCvUrl,
  setAvatarUrl,
  setChatbotEnabled,
  setCvUrl,
  subscribeSettings,
} from "@/lib/settings";
import { profile } from "@/lib/content";

type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "ok"; at: number }
  | { kind: "err"; reason: string };

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

  // ---- CV link ----
  const [cvInput, setCvInput] = useState<string>(() => getCvUrl());

  useEffect(
    () =>
      subscribeSettings((s) => {
        setChatbot(s.chatbotEnabled);
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
  // When remote sync is on, allow (re)publishing any valid URL — the point is
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
          reason: `Still ~${Math.round(bytes / 1024)}KB after compression — try a simpler/smaller photo.`,
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

  return (
    <div className="h-full p-4 md:p-5 grid grid-cols-1 md:grid-cols-[1fr_1.05fr] gap-3 overflow-hidden">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-3 min-h-0 overflow-y-auto pr-1">
        {/* Account card */}
        <Card Icon={KeyRound} title="Admin account" hint="Single user">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[12.5px]">
            <Row label="Username">
              <span className="a-code">{username || "—"}</span>
            </Row>
            <Row label="Last changed">
              <span className="tabular-nums" style={{ color: "hsl(var(--a-ink))" }}>
                {fmtAbs(updatedAt)}
              </span>
            </Row>
            <Row label="Hash">
              <span style={{ color: "hsl(var(--a-ink))" }}>SHA-256 · username-salted</span>
            </Row>
          </dl>
        </Card>

        {/* Preferences */}
        <Card Icon={Bot} title="Preferences" hint="Visitor-facing toggles">
          <ToggleRow
            label="Show chatbot"
            description="The floating assistant on the public portfolio."
            checked={chatbot}
            onChange={(v) => setChatbotEnabled(v)}
          />

          <div
            className="mt-3.5 pt-3.5"
            style={{ borderTop: "1px solid hsl(var(--a-border))" }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <FileText size={12} strokeWidth={1.9} aria-hidden style={{ color: "hsl(var(--a-ink-soft))" }} />
              <span className="text-[13px] font-medium" style={{ color: "hsl(var(--a-ink))" }}>
                CV / résumé link
              </span>
            </div>
            <p className="mb-2 text-[11.5px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
              Used everywhere — hero, footer, contact, the chatbot, and{" "}
              <span className="a-code">/cv</span> · <span className="a-code">/resume</span>.
              {isBinConfigured()
                ? " Saving publishes it to every visitor."
                : " Remote sync is off, so this applies to this browser only."}
            </p>
            <div className="flex gap-1.5">
              <input
                type="url"
                inputMode="url"
                value={cvInput}
                onChange={(e) => {
                  setCvInput(e.target.value);
                  if (cvStatus.kind !== "idle") setCvStatus({ kind: "idle" });
                }}
                placeholder={profile.cvUrl}
                className="a-input flex-1 min-w-0 text-[12px] py-1.5"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => void saveCvUrl()}
                disabled={cvStatus.kind === "saving" || !cvCanSave}
                className="a-btn a-btn-primary py-1.5 px-2.5 text-[11.5px] shrink-0 inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBinConfigured() ? (
                  <CloudUpload size={12} strokeWidth={1.9} aria-hidden />
                ) : (
                  <Check size={12} strokeWidth={1.9} aria-hidden />
                )}
                {cvStatus.kind === "saving"
                  ? "Saving…"
                  : isBinConfigured()
                    ? "Publish"
                    : "Save"}
              </button>
            </div>
            <div className="mt-1.5 min-h-[15px] text-[11px]">
              {cvStatus.kind === "err" && (
                <span className="inline-flex items-center gap-1.5" style={{ color: "hsl(var(--a-danger))" }}>
                  <AlertTriangle size={11} strokeWidth={2.2} aria-hidden />
                  {cvStatus.reason}
                </span>
              )}
              {cvStatus.kind === "ok" && (
                <span className="inline-flex items-center gap-1.5" style={{ color: "hsl(var(--a-success))" }}>
                  <Check size={11} strokeWidth={2.4} aria-hidden />
                  {isBinConfigured() ? "Published to all visitors." : "Saved for this browser."}
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Profile picture */}
        <Card Icon={ImagePlus} title="Profile picture" hint="JPEG / PNG / WebP">
          <p className="mb-2 text-[11.5px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
            Used everywhere the avatar shows up — hero, keynote deck, and the About page.
            Resized and compressed in your browser before saving.{" "}
            {isAvatarBinConfigured()
              ? "Publishing sends it to every visitor."
              : "Remote sync is off, so this applies to this browser only."}
          </p>
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
            role="button"
            tabIndex={0}
            className="cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors flex flex-col items-center gap-3"
            style={{
              borderColor: avatarDragging ? "hsl(var(--a-accent))" : "hsl(var(--a-border))",
              background: avatarDragging ? "hsl(var(--a-accent-wash))" : "hsl(var(--a-bg))",
            }}
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
            <div className="relative">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: "2px solid hsl(var(--a-border-strong))", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              />
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full grid place-items-center"
                style={{ background: "hsl(var(--a-accent))", border: "2px solid hsl(var(--a-surface))" }}
                aria-hidden
              >
                <ImagePlus size={11} strokeWidth={2.2} style={{ color: "hsl(var(--a-bg))" }} />
              </span>
            </div>
            <div>
              <p className="text-[13.5px] font-medium" style={{ color: "hsl(var(--a-ink))" }}>
                Drop an image here
              </p>
              <p className="mt-0.5 text-[12px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
                or{" "}
                <span className="underline" style={{ color: "hsl(var(--a-accent-deep))" }}>
                  browse files
                </span>{" "}
                — JPEG, PNG, or WebP
              </p>
            </div>
            {avatarBytes != null && (
              <span
                className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full"
                style={{ background: "hsl(var(--a-accent-wash))", color: "hsl(var(--a-accent-deep))" }}
              >
                <Check size={10} strokeWidth={2.4} aria-hidden />
                Compressed to ~{Math.round(avatarBytes / 1024)}KB
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => void saveAvatar()}
              disabled={avatarStatus.kind === "saving" || !avatarCanSave}
              className="a-btn a-btn-primary py-1.5 px-2.5 text-[11.5px] shrink-0 inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAvatarBinConfigured() ? (
                <CloudUpload size={12} strokeWidth={1.9} aria-hidden />
              ) : (
                <Check size={12} strokeWidth={1.9} aria-hidden />
              )}
              {avatarStatus.kind === "saving"
                ? "Saving…"
                : isAvatarBinConfigured()
                  ? "Publish"
                  : "Save"}
            </button>
            <button
              type="button"
              onClick={resetAvatar}
              className="a-btn a-btn-ghost py-1.5 px-2 text-[11.5px] shrink-0"
            >
              Reset to default
            </button>
          </div>
          <div className="mt-1.5 min-h-[15px] text-[11px]">
            {avatarStatus.kind === "err" && (
              <span className="inline-flex items-center gap-1.5" style={{ color: "hsl(var(--a-danger))" }}>
                <AlertTriangle size={11} strokeWidth={2.2} aria-hidden />
                {avatarStatus.reason}
              </span>
            )}
            {avatarStatus.kind === "ok" && (
              <span className="inline-flex items-center gap-1.5" style={{ color: "hsl(var(--a-success))" }}>
                <Check size={11} strokeWidth={2.4} aria-hidden />
                {isAvatarBinConfigured() ? "Published to all visitors." : "Saved for this browser."}
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* RIGHT COLUMN — Change password form */}
      <Card Icon={ShieldCheck} title="Change password" hint="≥ 8 characters" flex>
        <form onSubmit={submitPassword} className="space-y-3 flex-1 flex flex-col min-h-0">
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
              placeholder="at least 8 characters"
            />
            {next.length > 0 && <StrengthMeter score={strength.score} label={strength.label} />}
          </div>
          <PasswordField
            id="conf-pw"
            label="Confirm new password"
            autoComplete="new-password"
            value={confirm}
            onChange={setConfirm}
            placeholder="re-type new password"
            error={confirmMismatch ? "Doesn't match." : undefined}
          />

          <div
            className="text-[11.5px] flex items-center gap-1.5 mt-auto min-h-[16px]"
            style={{ color: "hsl(var(--a-ink-muted))" }}
          >
            {pwStatus.kind === "err" && (
              <span className="inline-flex items-center gap-1.5" style={{ color: "hsl(var(--a-danger))" }}>
                <AlertTriangle size={12} strokeWidth={2.2} aria-hidden />
                {pwStatus.reason}
              </span>
            )}
            {pwStatus.kind === "ok" && (
              <span className="inline-flex items-center gap-1.5" style={{ color: "hsl(var(--a-success))" }}>
                <Check size={12} strokeWidth={2.4} aria-hidden /> Password updated.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 shrink-0"
               style={{ borderTop: "1px solid hsl(var(--a-border))" }}>
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
              className="a-btn a-btn-primary px-4 py-2 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pwStatus.kind === "saving" ? "Saving…" : "Update password"}
            </button>
            <span
              className="text-[11px] ml-auto inline-flex items-center gap-1"
              style={{ color: "hsl(var(--a-ink-muted))" }}
            >
              <AlertTriangle size={11} strokeWidth={1.9} aria-hidden />
              Soft auth — pick a long passphrase.
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
}

// =============================================================================
// pieces
// =============================================================================

function Card({
  Icon,
  title,
  hint,
  children,
  flex,
}: {
  Icon: typeof KeyRound;
  title: string;
  hint?: string;
  children: ReactNode;
  flex?: boolean;
}) {
  return (
    <section className={`a-card p-3.5 md:p-4 ${flex ? "flex flex-col min-h-0 flex-1" : ""}`}>
      <header className="flex items-center gap-2 mb-3">
        <span
          className="w-6 h-6 rounded-md grid place-items-center shrink-0"
          style={{ background: "hsl(var(--a-accent-wash))" }}
        >
          <Icon size={12} strokeWidth={1.8} style={{ color: "hsl(var(--a-accent-deep))" }} aria-hidden />
        </span>
        <span className="text-[13px] font-semibold tracking-tight"
              style={{ color: "hsl(var(--a-ink))" }}>
          {title}
        </span>
        {hint && (
          <span className="ml-auto text-[10.5px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
            {hint}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="a-label text-[10px] mt-1" style={{ alignSelf: "start" }}>
        {label}
      </dt>
      <dd className="min-w-0 truncate">{children}</dd>
    </>
  );
}


function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <div className="min-w-0">
        <div className="text-[13px] font-medium" style={{ color: "hsl(var(--a-ink))" }}>
          {label}
        </div>
        <p className="mt-0.5 text-[11.5px]" style={{ color: "hsl(var(--a-ink-muted))" }}>
          {description}
        </p>
      </div>
      <span
        className="relative w-10 h-[22px] rounded-full transition-colors shrink-0"
        style={{ background: checked ? "hsl(var(--a-accent))" : "hsl(var(--a-border))" }}
      >
        <span
          className="absolute top-[2px] w-[18px] h-[18px] rounded-full transition-all"
          style={{
            background: "white",
            left: checked ? "20px" : "2px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
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
      <label htmlFor={id} className="a-label text-[10px] block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`a-input pr-9 py-1.5 text-[12.5px] ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide" : "Show"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md"
          style={{ color: "hsl(var(--a-ink-muted))" }}
        >
          {show ? <EyeOff size={13} strokeWidth={1.8} /> : <Eye size={13} strokeWidth={1.8} />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-[11px]" style={{ color: "hsl(var(--a-danger))" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function StrengthMeter({ score, label }: { score: number; label: string }) {
  const segs = 4;
  const color =
    score <= 1 ? "hsl(var(--a-danger))" :
    score === 2 ? "hsl(var(--a-warn))" :
    score === 3 ? "hsl(45 92% 48%)" :
                  "hsl(var(--a-success))";
  return (
    <div className="mt-1.5">
      <div className="flex items-center gap-1">
        {Array.from({ length: segs }, (_, i) => (
          <span
            key={i}
            className="h-0.5 flex-1 rounded-full transition-colors"
            style={{ background: i < score ? color : "hsl(var(--a-border))" }}
          />
        ))}
      </div>
      <div
        className="mt-1 flex justify-between text-[10px]"
        style={{ color: "hsl(var(--a-ink-muted))" }}
      >
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
  if (!iso) return "—";
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
  if (!pw) return { score: 0, label: "—" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  s = Math.min(4, s);
  const label = s <= 1 ? "Weak" : s === 2 ? "Fair" : s === 3 ? "Good" : "Strong";
  return { score: s, label };
}
