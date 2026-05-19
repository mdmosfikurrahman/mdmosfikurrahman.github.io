// JSONBin remote-sync for the template selector.
//
// Cross-device flow:
//   - Visitors  : GET https://api.jsonbin.io/v3/b/<BIN_ID>/latest
//                 (works for public bins, or private bins with X-Access-Key)
//   - Admin push: PUT https://api.jsonbin.io/v3/b/<BIN_ID>
//                 (needs X-Master-Key)
//
// Setup
// -----
//   1. Create a JSONBin bin with body `{"template":"surveillance"}`.
//      Private is fine — see step 2.
//   2. In JSONBin → API Keys, create an ACCESS KEY with Read permission on
//      this bin. This key is designed to be embedded in client code; it can
//      only read, not write.
//   3. Set env vars in `.env` at the repo root:
//        VITE_JSONBIN_ID=<your bin id>
//        VITE_JSONBIN_ACCESS_KEY=<your read-only access key>
//      (Leave the Access Key empty if the bin is public.)
//   4. Open /admin/templates, paste your MASTER KEY once. It is stored in
//      this browser's localStorage and never goes into the bundle.
//
// If VITE_JSONBIN_ID is unset, remote sync is disabled and the app falls
// back to per-device localStorage (the original behavior).

import type { TemplateId } from "./template";

const BIN_ID = (import.meta.env.VITE_JSONBIN_ID as string | undefined) ?? "";
const ACCESS_KEY = (import.meta.env.VITE_JSONBIN_ACCESS_KEY as string | undefined) ?? "";
const ENV_MASTER_KEY = (import.meta.env.VITE_JSONBIN_MASTER_KEY as string | undefined) ?? "";
const MASTER_KEY_STORAGE = "portfolio.admin.jsonbin.masterKey";

const API_BASE = "https://api.jsonbin.io/v3/b";

export function isRemoteConfigured(): boolean {
  return BIN_ID.length > 0;
}

export function getBinId(): string {
  return BIN_ID;
}

export function getStoredMasterKey(): string {
  if (typeof window === "undefined") return ENV_MASTER_KEY;
  // Env value wins (no per-device setup), localStorage is the fallback.
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

export type RemoteState = {
  template: TemplateId;
  updatedAt?: string;
};

// Visitors call this on app boot.
export async function fetchRemoteTemplate(): Promise<RemoteState | null> {
  if (!isRemoteConfigured()) return null;
  try {
    const headers: Record<string, string> = { "X-Bin-Meta": "false" };
    if (ACCESS_KEY) headers["X-Access-Key"] = ACCESS_KEY;
    const res = await fetch(`${API_BASE}/${BIN_ID}/latest`, {
      headers,
      cache: "no-cache",
    });
    if (!res.ok) return null;
    const json = await res.json();
    // JSONBin v3 returns { record: <yourPayload>, metadata: {...} }
    const record = (json?.record ?? json) as { template?: string; updatedAt?: string };
    const t = record?.template;
    const valid: ReadonlyArray<TemplateId> = [
      "folio", "broadsheet", "surveillance", "minimal",
      "animus", "inception", "heist", "chess", "tenet", "keynote",
    ];
    if (typeof t === "string" && (valid as readonly string[]).includes(t)) {
      return { template: t as TemplateId, updatedAt: record.updatedAt };
    }
    return null;
  } catch {
    return null;
  }
}

export type PushResult =
  | { kind: "ok" }
  | { kind: "err"; reason: string };

// Admin pushes a new template choice.
export async function pushRemoteTemplate(
  template: TemplateId,
  masterKey?: string,
): Promise<PushResult> {
  if (!isRemoteConfigured()) {
    return { kind: "err", reason: "Remote sync is not configured (VITE_JSONBIN_ID missing)." };
  }
  const key = (masterKey ?? getStoredMasterKey()).trim();
  if (!key) {
    return { kind: "err", reason: "Master Key required to push." };
  }
  try {
    const res = await fetch(`${API_BASE}/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": key,
        "X-Bin-Versioning": "false",
      },
      body: JSON.stringify({ template, updatedAt: new Date().toISOString() }),
    });
    if (!res.ok) {
      const text = await safeText(res);
      return { kind: "err", reason: `JSONBin responded ${res.status}: ${text}` };
    }
    return { kind: "ok" };
  } catch (err) {
    return { kind: "err", reason: err instanceof Error ? err.message : "Network error" };
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    const t = await res.text();
    return t.slice(0, 200);
  } catch {
    return "(no body)";
  }
}
