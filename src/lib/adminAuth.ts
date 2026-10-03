// Admin auth: username + sha256(passwordSalt) stored in JSONBin.
// Salt is the username itself: `sha256(`${username}:${password}`)`. This is
// soft auth (the master key is in the bundle), but it keeps casual visitors
// out and lets the owner change the password without a redeploy.

import { fetchBin, isBinConfigured, patchBin, sha256, type AdminAuth, type WriteResult } from "./binStore";

export const DEFAULT_USERNAME = "root@admin";
export const DEFAULT_PASSWORD = "EpDe#F16!";
export const UNLOCK_STORAGE = "portfolio.admin.unlocked.v2";

export async function deriveHash(username: string, password: string): Promise<string> {
  return sha256(`${username.trim()}:${password}`);
}

async function defaultAuth(): Promise<AdminAuth> {
  return {
    username: DEFAULT_USERNAME,
    passwordHash: await deriveHash(DEFAULT_USERNAME, DEFAULT_PASSWORD),
    updatedAt: new Date().toISOString(),
  };
}

// Returns the auth record in the bin, seeding the default only into a bin that
// was read and has none. A failed read returns null: seeding then would reset
// the real password to the default.
export async function ensureAuth(): Promise<AdminAuth | null> {
  const bin = await fetchBin();
  if (!bin) return isBinConfigured() ? null : defaultAuth();
  if (bin.auth?.username && bin.auth.passwordHash) {
    return bin.auth;
  }
  const seeded = await defaultAuth();
  const res = await patchBin((current) => (current.auth?.passwordHash ? current : { ...current, auth: seeded }));
  if (res.kind !== "ok") console.warn("[admin] Could not seed auth to JSONBin:", res.reason);
  return seeded;
}

export type VerifyResult =
  | { kind: "ok" }
  | { kind: "err"; reason: string };

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<VerifyResult> {
  const auth = await ensureAuth();
  if (!auth) return { kind: "err", reason: "Could not reach the login store. Try again in a moment." };
  if (username.trim().toLowerCase() !== auth.username.trim().toLowerCase()) {
    return { kind: "err", reason: "Invalid credentials." };
  }
  const hash = await deriveHash(auth.username, password);
  if (hash !== auth.passwordHash) {
    return { kind: "err", reason: "Invalid credentials." };
  }
  return { kind: "ok" };
}

export type ChangePasswordResult = WriteResult;

export async function changePassword(
  currentPassword: string,
  nextPassword: string,
): Promise<ChangePasswordResult> {
  const bin = await fetchBin();
  if (!bin) return { kind: "err", reason: "Could not read the login record. Try again in a moment." };
  const auth = bin.auth;
  if (!auth) return { kind: "err", reason: "No auth record found." };
  const currentHash = await deriveHash(auth.username, currentPassword);
  if (currentHash !== auth.passwordHash) {
    return { kind: "err", reason: "Current password is incorrect." };
  }
  if (nextPassword.length < 8) {
    return { kind: "err", reason: "New password must be at least 8 characters." };
  }
  const nextHash = await deriveHash(auth.username, nextPassword);
  return patchBin((current) => ({
    ...current,
    auth: {
      username: auth.username,
      passwordHash: nextHash,
      updatedAt: new Date().toISOString(),
    },
  }));
}

// Local unlock flag (per-browser, after successful login).
export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(UNLOCK_STORAGE) === "1";
}

export function markUnlocked() {
  window.localStorage.setItem(UNLOCK_STORAGE, "1");
}

export function markLocked() {
  window.localStorage.removeItem(UNLOCK_STORAGE);
}
