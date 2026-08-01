// JSONBin remote-sync for the template selector.
// Reads/writes go through the unified `binStore` so the bin can also hold
// admin auth + analytics without writes wiping each other out.

import type { TemplateId } from "./template";
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
  template: TemplateId;
  cvUrl?: string;
  updatedAt?: string;
};

const VALID_TEMPLATES: ReadonlyArray<TemplateId> = [
  "folio", "broadsheet", "surveillance", "minimal",
  "animus", "inception", "heist", "chess", "tenet",
  "keynote", "keynote-tech", "keynote-talk",
];

// Visitors call this on app boot.
export async function fetchRemoteTemplate(): Promise<RemoteState | null> {
  const bin = await fetchBin();
  if (!bin) return null;
  const t = bin.template;
  if (typeof t === "string" && (VALID_TEMPLATES as readonly string[]).includes(t)) {
    return {
      template: t as TemplateId,
      cvUrl: typeof bin.cvUrl === "string" ? bin.cvUrl : undefined,
      updatedAt: bin.updatedAt,
    };
  }
  return null;
}

// The published CV link, independent of whether a valid template is set.
// Visitors apply this on boot so the link the admin set reaches everyone.
export async function fetchRemoteCvUrl(): Promise<string | null> {
  const bin = await fetchBin();
  if (!bin) return null;
  return typeof bin.cvUrl === "string" ? bin.cvUrl : null;
}

// Single-fetch boot helper: pulls template + cvUrl together so a visitor's
// boot only hits the network once. Either field may be absent.
export async function fetchRemoteState(): Promise<{ template?: TemplateId; cvUrl?: string } | null> {
  const bin = await fetchBin();
  if (!bin) return null;
  const t = bin.template;
  const template =
    typeof t === "string" && (VALID_TEMPLATES as readonly string[]).includes(t)
      ? (t as TemplateId)
      : undefined;
  const cvUrl = typeof bin.cvUrl === "string" ? bin.cvUrl : undefined;
  return { template, cvUrl };
}

export type PushResult =
  | { kind: "ok" }
  | { kind: "err"; reason: string };

// Admin pushes a new template choice — merges into existing bin payload.
export async function pushRemoteTemplate(
  template: TemplateId,
  masterKey?: string,
): Promise<PushResult> {
  if (!isBinConfigured()) {
    return { kind: "err", reason: "Remote sync is not configured (VITE_JSONBIN_ID missing)." };
  }
  const result = await patchBin(
    (current) => ({ ...current, template, updatedAt: new Date().toISOString() }),
    masterKey,
  );
  return result.kind === "ok" ? { kind: "ok" } : { kind: "err", reason: result.reason };
}

// Admin publishes the CV/résumé link — merges into existing bin payload so
// every visitor picks it up on their next boot.
export async function pushRemoteCvUrl(
  cvUrl: string,
  masterKey?: string,
): Promise<PushResult> {
  if (!isBinConfigured()) {
    return { kind: "err", reason: "Remote sync is not configured (VITE_JSONBIN_ID missing)." };
  }
  const result = await patchBin(
    (current) => ({ ...current, cvUrl, updatedAt: new Date().toISOString() }),
    masterKey,
  );
  return result.kind === "ok" ? { kind: "ok" } : { kind: "err", reason: result.reason };
}

export function isAvatarRemoteConfigured(): boolean {
  return isAvatarBinConfigured();
}

// Visitors call this on app boot to pick up an admin-published avatar.
export async function fetchRemoteAvatar(): Promise<string | null> {
  const bin = await fetchAvatarBin();
  if (!bin) return null;
  return typeof bin.avatarDataUrl === "string" ? bin.avatarDataUrl : null;
}

// Admin publishes a new avatar image (already resized/compressed to a data
// URI) — lives in its own bin, so this replaces that bin's whole payload
// rather than merging into the shared one.
export async function pushRemoteAvatar(
  avatarDataUrl: string,
  masterKey?: string,
): Promise<PushResult> {
  if (!isAvatarBinConfigured()) {
    return { kind: "err", reason: "Avatar remote sync is not configured (VITE_JSONBIN_AVATAR_ID missing)." };
  }
  const result = await writeAvatarBin(
    { avatarDataUrl, updatedAt: new Date().toISOString() },
    masterKey,
  );
  return result.kind === "ok" ? { kind: "ok" } : { kind: "err", reason: result.reason };
}
