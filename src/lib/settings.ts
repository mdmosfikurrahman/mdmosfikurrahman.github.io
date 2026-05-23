// Per-browser feature flags managed from the admin console. Persisted to
// localStorage so they survive reloads. Components subscribe via a tiny
// pub/sub so toggles take effect immediately, without a page refresh.

const STORAGE = "portfolio.settings.v1";

export type Settings = {
  chatbotEnabled: boolean;
};

const DEFAULTS: Settings = {
  chatbotEnabled: true,
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
