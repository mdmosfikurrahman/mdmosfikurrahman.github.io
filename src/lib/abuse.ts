// Shared anti-abuse helpers for public-write features (guestbook, Q&A).
// Both share the same trust model: the JSONBin master key is embedded in the
// bundle, so any visitor can write. We do best-effort throttling — not
// security, but enough to keep accidental floods + casual bots out.
//
// Layers:
//   1. Honeypot fields (form inputs hidden with CSS — bots fill them, humans
//      don't). Submissions fail silently on honeypot match.
//   2. Session-level dedupe (localStorage keyed). Cheap, defeats double-click.
//   3. IP-hash throttle (recorded in the bin alongside the entry). Reads back
//      recent submissions for that IP-hash and rejects if within the window.

import { sha256 } from "./binStore";

const IP_SALT = "travilo-portfolio:2026";  // static — only here to avoid raw IPs in storage

// ---------------------------------------------------------------------------
// IP hashing (uses the geo cache so we don't double-call the IP provider)
// ---------------------------------------------------------------------------

const GEO_CACHE_KEY = "portfolio.analytics.geoCache";

type CachedGeo = {
  at: number;
  data: { ip?: string; country_name?: string; country_code?: string };
};

function readCachedIp(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as CachedGeo;
    return c.data?.ip ?? null;
  } catch {
    return null;
  }
}

export function readCachedGeo(): { ip?: string; country?: string } {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return {};
    const c = JSON.parse(raw) as CachedGeo;
    return { ip: c.data?.ip, country: c.data?.country_name };
  } catch {
    return {};
  }
}

// Best-effort ip-hash. Returns null if we couldn't determine the IP — callers
// should still allow the submission in that case (the session-dedupe layer
// still provides a soft guard).
export async function hashCurrentIp(): Promise<string | null> {
  const ip = readCachedIp();
  if (!ip) return null;
  return sha256(`${IP_SALT}:${ip}`);
}

// ---------------------------------------------------------------------------
// Session dedupe (localStorage-backed)
// ---------------------------------------------------------------------------

// Generic predicate: "has this session already done X?". Caller picks the key
// shape (e.g. `guestbook:submitted`, `question:asked`).
export function hasDoneInSession(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(`abuse.session.${key}`) === "1";
  } catch {
    return false;
  }
}

export function markDoneInSession(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`abuse.session.${key}`, "1");
  } catch {
    /* quota — fine */
  }
}

export function unmarkDoneInSession(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(`abuse.session.${key}`);
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Honeypot (used by both guestbook + Q&A forms)
// ---------------------------------------------------------------------------

// Inputs named "website" / "url" trip casual bots that auto-fill every field.
// Real submissions leave it blank. Return true if a submission should be
// silently dropped.
export function tripsHoneypot(value: string | undefined | null): boolean {
  return !!(value && value.trim().length > 0);
}

// ---------------------------------------------------------------------------
// IP-hash recency throttle
// ---------------------------------------------------------------------------

// Given a list of past entries and the current ip-hash, returns true if
// `windowMs` has not yet elapsed since this ip-hash's last submission.
export function recentlySubmitted(
  entries: { ipHash?: string; ts?: string; askedAt?: string }[],
  ipHash: string | null,
  windowMs: number,
): boolean {
  if (!ipHash) return false;
  const cutoff = Date.now() - windowMs;
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i];
    if (e.ipHash !== ipHash) continue;
    const t = e.ts ?? e.askedAt;
    if (!t) continue;
    if (new Date(t).getTime() >= cutoff) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// ID generation (sortable-ish, no external deps)
// ---------------------------------------------------------------------------

export function newId(): string {
  return `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}`;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SUBMISSION_THROTTLE_MS = 60 * 60 * 1000;  // 1 hour per IP-hash
