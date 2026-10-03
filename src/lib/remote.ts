// JSONBin remote sync for the settings the admin publishes to every visitor:
// the CV link, the freelance switch and its links, and the avatar. Reads and
// writes go through `binStore`, which keeps every concern in one bin.

import type { HireLink } from "./settings";
import { getCvUrl, setCvUrl, getHireMeEnabled, setHireMeEnabled, setHireLinks } from "./settings";
import {
  fetchBin,
  patchBin,
  isBinConfigured,
  getBinId as getBinIdFromStore,
  getStoredMasterKey as getStoredMasterKeyFromStore,
  setStoredMasterKey as setStoredMasterKeyFromStore,
  hasEnvMasterKey as hasEnvMasterKeyFromStore,
  fetchAvatarBin,
  writeAvatarBin,
  isAvatarBinConfigured,
} from "./binStore";

export function isRemoteConfigured(): boolean {
  return isBinConfigured();
}

export function getBinId(): string {
  return getBinIdFromStore();
}

export function getStoredMasterKey(): string {
  return getStoredMasterKeyFromStore();
}

export function hasEnvMasterKey(): boolean {
  return hasEnvMasterKeyFromStore();
}

export function setStoredMasterKey(key: string) {
  setStoredMasterKeyFromStore(key);
}

export type RemoteState = {
  cvUrl?: string;
  hireMe?: boolean;
  hireLinks?: HireLink[];
  updatedAt?: string;
};

// One fetch returns everything a visitor needs; any field may be absent.
export async function fetchRemoteState(): Promise<RemoteState | null> {
  const bin = await fetchBin();
  if (!bin) return null;
  return {
    cvUrl: typeof bin.cvUrl === "string" ? bin.cvUrl : undefined,
    hireMe: typeof bin.hireMe === "boolean" ? bin.hireMe : undefined,
    hireLinks: Array.isArray(bin.hireLinks) ? (bin.hireLinks as HireLink[]) : undefined,
    updatedAt: typeof bin.updatedAt === "string" ? bin.updatedAt : undefined,
  };
}

// Visitors apply the published state once per page load. Each setter notifies
// its subscribers, so every link on the page updates without a refresh.
let syncPromise: Promise<void> | null = null;

export function syncRemoteSettings(): Promise<void> {
  if (syncPromise || !isRemoteConfigured()) return syncPromise ?? Promise.resolve();
  syncPromise = fetchRemoteState()
    .then((remote) => {
      if (!remote) return;
      if (typeof remote.cvUrl === "string" && remote.cvUrl !== getCvUrl()) setCvUrl(remote.cvUrl);
      // Absent means the admin never published one, so the local default stands.
      if (typeof remote.hireMe === "boolean" && remote.hireMe !== getHireMeEnabled()) setHireMeEnabled(remote.hireMe);
      if (Array.isArray(remote.hireLinks)) setHireLinks(remote.hireLinks);
    })
    .catch(() => {
      /* local state stays authoritative */
    });
  return syncPromise;
}

export type PushResult = { kind: "ok" } | { kind: "err"; reason: string };

const NOT_CONFIGURED: PushResult = { kind: "err", reason: "Remote sync is not configured (VITE_JSONBIN_ID missing)." };

async function patch(fields: Record<string, unknown>, masterKey?: string): Promise<PushResult> {
  if (!isBinConfigured()) return NOT_CONFIGURED;
  const result = await patchBin((current) => ({ ...current, ...fields, updatedAt: new Date().toISOString() }), masterKey);
  return result.kind === "ok" ? { kind: "ok" } : { kind: "err", reason: result.reason };
}

// Admin publishes the CV/résumé link to every visitor.
export function pushRemoteCvUrl(cvUrl: string, masterKey?: string): Promise<PushResult> {
  return patch({ cvUrl }, masterKey);
}

// Admin publishes the freelance-availability toggle; no rebuild, no deploy.
export function pushRemoteHireMe(hireMe: boolean, masterKey?: string): Promise<PushResult> {
  return patch({ hireMe }, masterKey);
}

// Admin publishes the Hire section's link rows (label → URL).
export function pushRemoteHireLinks(hireLinks: HireLink[], masterKey?: string): Promise<PushResult> {
  return patch({ hireLinks }, masterKey);
}

export function isAvatarRemoteConfigured(): boolean {
  return isAvatarBinConfigured();
}

export async function fetchRemoteAvatar(): Promise<string | null> {
  const bin = await fetchAvatarBin();
  if (!bin) return null;
  return typeof bin.avatarDataUrl === "string" ? bin.avatarDataUrl : null;
}

// The avatar lives in its own bin, so this replaces that bin's payload rather
// than merging into the shared one.
export async function pushRemoteAvatar(avatarDataUrl: string, masterKey?: string): Promise<PushResult> {
  if (!isAvatarBinConfigured()) {
    return { kind: "err", reason: "Avatar remote sync is not configured (VITE_JSONBIN_AVATAR_ID missing)." };
  }
  const result = await writeAvatarBin({ avatarDataUrl, updatedAt: new Date().toISOString() }, masterKey);
  return result.kind === "ok" ? { kind: "ok" } : { kind: "err", reason: result.reason };
}
