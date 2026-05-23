// Admin auth — username + sha256(passwordSalt) stored in JSONBin.
// Salt is the username itself: `sha256(`${username}:${password}`)`. This is
// soft auth (the master key is in the bundle), but it keeps casual visitors
// out and lets the owner change the password without a redeploy.

import { fetchBin, patchBin, sha256, type AdminAuth, type WriteResult } from "./binStore";

export const DEFAULT_USERNAME = "root@admin";
export const DEFAULT_PASSWORD = "EpDe#F16!";
export const UNLOCK_STORAGE = "portfolio.admin.unlocked.v2";

export async function deriveHash(username: string, password: string): Promise<string> {
  return sha256(`${username.trim()}:${password}`);
}

// Returns the auth record in the bin, seeding the default if absent.
// Seeding only succeeds if a master key is available.
export async function ensureAuth(): Promise<AdminAuth | null> {
  const bin = await fetchBin();
  if (bin?.auth?.username && bin.auth.passwordHash) {
    return bin.auth;
  }
  // Seed default credentials on first run.
  const passwordHash = await deriveHash(DEFAULT_USERNAME, DEFAULT_PASSWORD);
  const seeded: AdminAuth = {
    username: DEFAULT_USERNAME,
    passwordHash,
    updatedAt: new Date().toISOString(),
  };
  const res = await patchBin((current) => ({ ...current, auth: seeded }));
  if (res.kind === "ok") return seeded;
  // If seeding failed (no master key), still return the seeded values for
  // local verification — but warn callers via console.
  console.warn("[admin] Could not seed auth to JSONBin:", res.reason);
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
  if (!auth) return { kind: "err", reason: "Auth not configured." };
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
  const auth = bin?.auth;
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
