// Per-browser feature flags managed from the admin console. Persisted to
// localStorage so they survive reloads. Components subscribe via a tiny
// pub/sub so toggles take effect immediately, without a page refresh.

import { useEffect, useState } from "react";
import { freelance, profile } from "./content";
import { fetchAvatarBin, isAvatarBinConfigured } from "./binStore";

const STORAGE = "portfolio.settings.v1";

export type HireLink = {
  label: string;
  url: string;
};

export type Settings = {
  chatbotEnabled: boolean;
  // Shows the freelance "Hire" section on the industry templates. Off hides it
  // everywhere at once, which is the point: availability changes far more often
  // than the site does, and this needs no deploy.
  hireMeEnabled: boolean;
  // Label → URL pairs shown as the buttons in that section: one per live gig,
  // profile, or anything else worth linking. An empty array means "use the
  // built-in defaults" (freelance.gigs in content.ts), exactly like cvUrl.
  hireLinks: HireLink[];
  // Empty string means "use the built-in default" (profile.cvUrl). A non-empty
  // value overrides the CV/résumé link everywhere on the site. The admin can
  // publish this to all visitors via the JSONBin remote (see templateRemote).
  cvUrl: string;
  // Empty string means "use the built-in default" (profile.avatarUrl). A
  // non-empty value is a data: URI (resized/compressed client-side) or a
  // regular image URL, overriding the avatar everywhere on the site.
  avatarUrl: string;
};

const DEFAULTS: Settings = {
  chatbotEnabled: true,
  hireMeEnabled: true,
  hireLinks: [],
  cvUrl: "",
  avatarUrl: "",
};

type Listener = (s: Settings) => void;
const listeners = new Set<Listener>();

function read(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function write(s: Settings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE, JSON.stringify(s));
  } catch {
    /* quota */
  }
}

export function getSettings(): Settings {
  return read();
}

export function updateSettings(patch: Partial<Settings>): Settings {
  const next: Settings = { ...read(), ...patch };
  write(next);
  for (const l of listeners) l(next);
  return next;
}

export function subscribeSettings(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Convenience accessors
export const getChatbotEnabled = (): boolean => read().chatbotEnabled;
export const setChatbotEnabled = (v: boolean) => updateSettings({ chatbotEnabled: v });

export const getHireMeEnabled = (): boolean => read().hireMeEnabled;
export const setHireMeEnabled = (v: boolean) => updateSettings({ hireMeEnabled: v });

// Live, render-time reader — mirrors useCvUrl(), so a published or locally
// flipped toggle shows/hides the section without a refresh.
export function useHireMeEnabled(): boolean {
  const [on, setOn] = useState<boolean>(() => getHireMeEnabled());
  useEffect(() => subscribeSettings((s) => setOn(s.hireMeEnabled)), []);
  return on;
}

// --- Hire section links ----------------------------------------------------
// Same override-or-default shape as the CV link: an empty stored array falls
// back to the built-in gig list, so the site still says something sensible if
// the admin has never touched it.
function sanitiseHireLinks(list: unknown): HireLink[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((r) => ({
      label: typeof (r as HireLink)?.label === "string" ? (r as HireLink).label.trim() : "",
      url: typeof (r as HireLink)?.url === "string" ? (r as HireLink).url.trim() : "",
    }))
    .filter((r) => r.label.length > 0 && r.url.length > 0)
    .slice(0, 8);
}

export function getHireLinks(): HireLink[] {
  const override = sanitiseHireLinks(read().hireLinks);
  return override.length > 0 ? override : freelance.gigs.map((g) => ({ ...g }));
}

export function setHireLinks(list: HireLink[]) {
  updateSettings({ hireLinks: sanitiseHireLinks(list) });
}

// The stored override on its own — the admin editor needs to know whether it
// is showing saved rows or the built-in defaults.
export function getStoredHireLinks(): HireLink[] {
  return sanitiseHireLinks(read().hireLinks);
}

export function useHireLinks(): HireLink[] {
  const [links, setLinks] = useState<HireLink[]>(() => getHireLinks());
  useEffect(() => subscribeSettings(() => setLinks(getHireLinks())), []);
  return links;
}

// --- CV / résumé link -----------------------------------------------------
// Resolves the override down to the built-in default so callers never have to.
export function getCvUrl(): string {
  const override = read().cvUrl.trim();
  return override.length > 0 ? override : profile.cvUrl;
}

// Stores "" when the value matches (or is emptied back to) the built-in
// default, so the override only sticks when it actually differs.
export function setCvUrl(v: string) {
  const trimmed = v.trim();
  updateSettings({ cvUrl: trimmed === profile.cvUrl ? "" : trimmed });
}

// Live, render-time reader. Components use this so a published / locally-set
// CV link updates the whole site without a refresh — mirrors useTemplate().
export function useCvUrl(): string {
  const [url, setUrl] = useState<string>(() => getCvUrl());
  useEffect(() => subscribeSettings(() => setUrl(getCvUrl())), []);
  return url;
}

// Button/link text mirrors the linked document: "Resume" when the URL points
// at the resume, "CV" otherwise (e.g. the longer academic curriculum vitae).
export function cvLabelFor(url: string): string {
  return /resume/i.test(url) ? "Resume" : "CV";
}

export function useCvLabel(): string {
  return cvLabelFor(useCvUrl());
}

// --- Avatar image ----------------------------------------------------------
export function getAvatarUrl(): string {
  const override = read().avatarUrl.trim();
  return override.length > 0 ? override : profile.avatarUrl;
}

export function setAvatarUrl(v: string) {
  const trimmed = v.trim();
  updateSettings({ avatarUrl: trimmed === profile.avatarUrl ? "" : trimmed });
}

// Module-level guard so the avatar bin is fetched at most once per page load,
// no matter how many components call useAvatarUrl().
let avatarRemoteFetchPromise: Promise<void> | null = null;

function kickAvatarRemoteFetch() {
  if (avatarRemoteFetchPromise || !isAvatarBinConfigured()) return;
  avatarRemoteFetchPromise = fetchAvatarBin()
    .then((bin) => {
      if (bin?.avatarDataUrl && bin.avatarDataUrl !== getAvatarUrl()) {
        setAvatarUrl(bin.avatarDataUrl);
      }
    })
    .catch(() => { /* swallow — local state stays authoritative */ });
}

export function useAvatarUrl(): string {
  const [url, setUrl] = useState<string>(() => getAvatarUrl());
  useEffect(() => {
    kickAvatarRemoteFetch();
    return subscribeSettings(() => setUrl(getAvatarUrl()));
  }, []);
  return url;
}
