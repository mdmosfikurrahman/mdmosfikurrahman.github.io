// Present mode. The portfolio is always the regular, scrollable site; a
// presentation is something you start on demand (button, Studio console, the
// P key, or a /#present link) and leave with Esc. It is deliberately not a
// template, so it works on top of whichever template is live.

import { useSyncExternalStore } from "react";

export type DeckId = "research" | "engineering" | "seminar";

export const DECKS: { id: DeckId; name: string; blurb: string }[] = [
  { id: "research", name: "Research", blurb: "PhD / research interview. Every paper in depth." },
  { id: "engineering", name: "Engineering", blurb: "Technical interview. Systems first." },
  { id: "seminar", name: "Seminar", blurb: "Self-introduction. Balanced and concise." },
];

const KEY = "portfolio.deck";

type State = { open: boolean; deck: DeckId };

const isDeck = (v: unknown): v is DeckId => DECKS.some((d) => d.id === v);

function readDeck(): DeckId {
  try {
    const v = window.localStorage.getItem(KEY);
    if (isDeck(v)) return v;
  } catch { /* storage blocked */ }
  return "research";
}

let state: State = { open: false, deck: typeof window === "undefined" ? "research" : readDeck() };
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

export function setDeck(deck: DeckId) {
  try { window.localStorage.setItem(KEY, deck); } catch { /* ignore */ }
  set({ ...state, deck });
}

export function startPresentation(deck?: DeckId) {
  if (deck) setDeck(deck);
  set({ ...state, open: true });
  window.dispatchEvent(new CustomEvent("portfolio:present-start"));
}

export function endPresentation() {
  if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  set({ ...state, open: false });
}

export function usePresentation() {
  const snap = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
    () => state,
    () => state,
  );
  return snap;
}

// "#present" or "#present/engineering"
export function parsePresentHash(hash: string): { deck?: DeckId } | null {
  const m = /^#present(?:\/([a-z]+))?$/.exec(hash);
  if (!m) return null;
  return { deck: isDeck(m[1]) ? m[1] : undefined };
}
