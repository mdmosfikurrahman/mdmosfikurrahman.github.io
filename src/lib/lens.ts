// One site, three ways in. The plain link is balanced: engineering and
// research carry equal weight. A shared link can lead with one side:
//   ?for=research  academia  research, education and peer review first
//   ?for=industry  industry  shipped systems first
//   ?for=both      balanced  back to the default
// The choice is remembered per visitor and also picks the presentation deck.

import { useSyncExternalStore } from "react";
import type { DeckId } from "./presentation";

export type Lens = "balanced" | "industry" | "academia";

const KEY = "portfolio.lens";
const listeners = new Set<() => void>();

function isLens(v: unknown): v is Lens {
  return v === "balanced" || v === "industry" || v === "academia";
}

function readStored(): Lens {
  try {
    const v = window.localStorage.getItem(KEY);
    if (isLens(v)) return v;
  } catch {
    /* storage blocked */
  }
  return "balanced";
}

let lens: Lens = typeof window === "undefined" ? "balanced" : readStored();

export function getLens(): Lens {
  return lens;
}

export function setLens(next: Lens) {
  if (next === lens) return;
  lens = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    /* storage blocked */
  }
  listeners.forEach((l) => l());
}

export function useLens(): Lens {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => lens,
    () => "balanced" as Lens,
  );
}

export function lensFromParam(value: string | null): Lens | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v === "research" || v === "academia" || v === "academic" || v === "phd") return "academia";
  if (v === "industry" || v === "engineering" || v === "work") return "industry";
  if (v === "both" || v === "all" || v === "balanced") return "balanced";
  return null;
}

// Each way in has its deck: the seminar deck is the balanced self-introduction.
export function deckForLens(l: Lens): DeckId {
  if (l === "academia") return "research";
  if (l === "industry") return "engineering";
  return "seminar";
}
