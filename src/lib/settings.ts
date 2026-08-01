// Per-browser feature flags managed from the admin console. Persisted to
// localStorage so they survive reloads. Components subscribe via a tiny
// pub/sub so toggles take effect immediately, without a page refresh.

import { useEffect, useState } from "react";
import { profile } from "./content";

const STORAGE = "portfolio.settings.v1";

export type Settings = {
  chatbotEnabled: boolean;
  // Empty string means "use the built-in default" (profile.cvUrl). A non-empty
  // value overrides the CV/résumé link everywhere on the site. The admin can
  // publish this to all visitors via the JSONBin remote (see templateRemote).
  cvUrl: string;
};

const DEFAULTS: Settings = {
  chatbotEnabled: true,
  cvUrl: "",
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
