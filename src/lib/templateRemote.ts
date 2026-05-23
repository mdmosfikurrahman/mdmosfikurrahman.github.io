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
    return { template: t as TemplateId, updatedAt: bin.updatedAt };
  }
  return null;
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
