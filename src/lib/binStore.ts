// Unified JSONBin payload — every concern (template, auth, analytics) lives
// in a single bin. Reads return the whole object; writes go through `patchBin`
// which read-modify-writes so concurrent concerns don't wipe each other out.

import type { TemplateId } from "./template";

export type VisitEntry = {
  ts: string;            // ISO timestamp
  sessionId?: string;    // groups page views from the same browser session
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  org?: string;
  os: string;
  browser: string;
  device: string;        // Desktop / Mobile / Tablet
  ua: string;
  path: string;
  referrer?: string;
};

export type AdminAuth = {
  username: string;
  passwordHash: string;  // sha256 hex of `${username}:${password}`
  updatedAt?: string;
};

// --- Guestbook -----------------------------------------------------------
export type GuestbookStatus = "pending" | "approved" | "rejected";
export type GuestbookEntry = {
  id: string;                 // ULID-ish: ts-base36 + random suffix
  name: string;
  message: string;
  ts: string;                 // ISO submission time
  status: GuestbookStatus;
  ipHash?: string;            // for moderation context
  country?: string;
  device?: string;
  moderatedAt?: string;
};

// --- Q&A inbox -----------------------------------------------------------
export type QuestionStatus = "pending" | "answered" | "published" | "rejected";
export type QuestionEntry = {
  id: string;
  question: string;
  askedAt: string;
  status: QuestionStatus;
  answer?: string;
  answeredAt?: string;
  ipHash?: string;
  country?: string;
  device?: string;
};

export type BinPayload = {
  template?: TemplateId;
  cvUrl?: string;
  updatedAt?: string;
  auth?: AdminAuth;
  visits?: VisitEntry[];
  guestbook?: GuestbookEntry[];
  questions?: QuestionEntry[];
};

const BIN_ID = (import.meta.env.VITE_JSONBIN_ID as string | undefined) ?? "";
const ACCESS_KEY = (import.meta.env.VITE_JSONBIN_ACCESS_KEY as string | undefined) ?? "";
const ENV_MASTER_KEY = (import.meta.env.VITE_JSONBIN_MASTER_KEY as string | undefined) ?? "";
const MASTER_KEY_STORAGE = "portfolio.admin.jsonbin.masterKey";

// Dedicated bin for the avatar image. Kept separate from the main bin (which
// already holds template/cvUrl/auth/visits/guestbook/questions and is
// deliberately capped to stay under the JSONBin free-tier size) so a photo
// data-URI never risks crowding out that budget.
const AVATAR_BIN_ID = (import.meta.env.VITE_JSONBIN_AVATAR_ID as string | undefined) ?? "";

const API_BASE = "https://api.jsonbin.io/v3/b";

export const VISITS_CAP = 500;          // keep bin under JSONBin free-tier size
export const GUESTBOOK_CAP = 500;
export const QUESTIONS_CAP = 700;

export function isBinConfigured(): boolean {
  return BIN_ID.length > 0;
}

export function getBinId(): string {
  return BIN_ID;
}

export function getStoredMasterKey(): string {
  if (typeof window === "undefined") return ENV_MASTER_KEY;
  return ENV_MASTER_KEY || (window.localStorage.getItem(MASTER_KEY_STORAGE) ?? "");
}

export function hasEnvMasterKey(): boolean {
  return ENV_MASTER_KEY.length > 0;
}

export function setStoredMasterKey(key: string) {
  if (typeof window === "undefined") return;
  if (key.trim() === "") window.localStorage.removeItem(MASTER_KEY_STORAGE);
  else window.localStorage.setItem(MASTER_KEY_STORAGE, key.trim());
}

export type WriteResult = { kind: "ok" } | { kind: "err"; reason: string };

// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------

export async function fetchBin(): Promise<BinPayload | null> {
  if (!isBinConfigured()) return null;
  try {
    const headers: Record<string, string> = { "X-Bin-Meta": "false" };
    if (ACCESS_KEY) headers["X-Access-Key"] = ACCESS_KEY;
    const res = await fetch(`${API_BASE}/${BIN_ID}/latest`, {
      headers,
      cache: "no-cache",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const record = (json?.record ?? json) as BinPayload;
    return record;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// WRITE — replaces the entire bin payload
// ---------------------------------------------------------------------------

export async function writeBin(payload: BinPayload, masterKey?: string): Promise<WriteResult> {
  if (!isBinConfigured()) {
    return { kind: "err", reason: "Remote storage not configured (VITE_JSONBIN_ID missing)." };
  }
  const key = (masterKey ?? getStoredMasterKey()).trim();
  if (!key) return { kind: "err", reason: "Master key required." };
  try {
    const res = await fetch(`${API_BASE}/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": key,
        "X-Bin-Versioning": "false",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await safeText(res);
      return { kind: "err", reason: `JSONBin ${res.status}: ${text}` };
    }
    return { kind: "ok" };
  } catch (err) {
    return { kind: "err", reason: err instanceof Error ? err.message : "Network error" };
  }
}

// ---------------------------------------------------------------------------
// PATCH — read-modify-write, preserving sibling fields
// ---------------------------------------------------------------------------

export async function patchBin(
  mutate: (current: BinPayload) => BinPayload,
  masterKey?: string,
): Promise<WriteResult> {
  const current = (await fetchBin()) ?? {};
  const next = mutate(current);
  return writeBin(next, masterKey);
}

// ---------------------------------------------------------------------------
// AVATAR BIN — separate bin, same account credentials
// ---------------------------------------------------------------------------

export type AvatarBinPayload = {
  avatarDataUrl?: string;
  updatedAt?: string;
};

export function isAvatarBinConfigured(): boolean {
  return AVATAR_BIN_ID.length > 0;
}

export async function fetchAvatarBin(): Promise<AvatarBinPayload | null> {
  if (!isAvatarBinConfigured()) return null;
  try {
    const headers: Record<string, string> = { "X-Bin-Meta": "false" };
    if (ACCESS_KEY) headers["X-Access-Key"] = ACCESS_KEY;
    const res = await fetch(`${API_BASE}/${AVATAR_BIN_ID}/latest`, {
      headers,
      cache: "no-cache",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.record ?? json) as AvatarBinPayload;
  } catch {
    return null;
  }
}

export async function writeAvatarBin(
  payload: AvatarBinPayload,
  masterKey?: string,
): Promise<WriteResult> {
  if (!isAvatarBinConfigured()) {
    return { kind: "err", reason: "Avatar remote storage not configured (VITE_JSONBIN_AVATAR_ID missing)." };
  }
  const key = (masterKey ?? getStoredMasterKey()).trim();
  if (!key) return { kind: "err", reason: "Master key required." };
  try {
    const res = await fetch(`${API_BASE}/${AVATAR_BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": key,
        "X-Bin-Versioning": "false",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await safeText(res);
      return { kind: "err", reason: `JSONBin ${res.status}: ${text}` };
    }
    return { kind: "ok" };
  } catch (err) {
    return { kind: "err", reason: err instanceof Error ? err.message : "Network error" };
  }
}

// ---------------------------------------------------------------------------
// crypto — SHA-256 hex
// ---------------------------------------------------------------------------

export async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------------------------------------------------------------------------
// internals
// ---------------------------------------------------------------------------

async function safeText(res: Response): Promise<string> {
  try {
    const t = await res.text();
    return t.slice(0, 200);
  } catch {
    return "(no body)";
  }
}
