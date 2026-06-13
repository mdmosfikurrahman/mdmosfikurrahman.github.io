// Template registry. Adding a new template:
//   1. drop a folder under src/templates/<id>/ with the variant components
//   2. register it here
//   3. extend the dispatchers in src/components/<X>.tsx / src/components/sections/<X>.tsx
//      to import from "@/templates/<id>/<X>"
// Switching is instant: the `html` element gets `template-<id>` and the CSS
// re-resolves tokens. Persisted in localStorage.

import { useCallback, useEffect, useState } from "react";
import { fetchRemoteState, isRemoteConfigured } from "./templateRemote";
import { getCvUrl, setCvUrl } from "./settings";

export type TemplateId =
  | "folio"
  | "broadsheet"
  | "surveillance"
  | "minimal"
  | "animus"
  | "inception"
  | "heist"
  | "chess"
  | "tenet"
  | "keynote"
  | "keynote-tech"
  | "keynote-talk";

export type TemplateMeta = {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  // Cosmetic markers used in the admin picker, not in render output.
  era: string;
  family: string;
};

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "folio",
    name: "Folio",
    tagline: "clean · professional · no theatre",
    description:
      "The default. Neutral grays, single slate-indigo accent, Inter sans-serif, hairline borders, traditional resume-style layout. Reads as the work of a senior engineer who has nothing to prove with decoration.",
    era: "MMXXVI / 00",
    family: "default · professional",
  },
  {
    id: "broadsheet",
    name: "Broadsheet",
    tagline: "newspaper · serif · ivory paper",
    description:
      "The original. Fraunces serif display, warm paper, oxblood accent. A printed-quarterly aesthetic with marginalia and a halftone backdrop.",
    era: "MMXXV / I",
    family: "editorial · print",
  },
  {
    id: "surveillance",
    name: "Person of Interest",
    tagline: "the machine · samaritan · surveillance OS",
    description:
      "Reframes the portfolio as a dual-faction surveillance UI. Boot sequence, scanlines, tracking brackets, live HUD; dark mode = the Machine (amber), light mode = Samaritan (clinical).",
    era: "MMXXVI / II",
    family: "terminal · HUD",
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "whitespace · inter · one calm accent",
    description:
      "Stripped to essentials. Heavy whitespace, Inter throughout, hairline borders, a single deep-cyan accent used sparingly. No watermark, no boot, no glitch — just type, space, and the work itself.",
    era: "MMXXVI / III",
    family: "modern · editorial",
  },
  {
    id: "animus",
    name: "Animus Codex",
    tagline: "assassin's creed · brotherhood codex",
    description:
      "Memories of an engineer, replayed through the Animus. Cyan scan-grid HUD over parchment dossiers, Cinzel for headings, Roman-numeral memory IDs, and a soft DNA-helix watermark.",
    era: "MMXXVI / IV",
    family: "codex · animus",
  },
  {
    id: "inception",
    name: "Inception Blueprint",
    tagline: "drafting paper · cold blue ink · level 01",
    description:
      "Architectural drafting plates. Cream paper, cold-blue ink hairlines, Penrose-stair ornaments, nested 'LEVEL n' framing. Plays into 'backend architect' literally.",
    era: "MMXXVI / V",
    family: "blueprint · architect",
  },
  {
    id: "heist",
    name: "The Heist Plan",
    tagline: "money heist · whiteboard · operation in motion",
    description:
      "Cork-board planning surface. Bold black + Dalí crimson + cream, sticky-note tags, hand-written annotations, every project framed as 'OPERATION · IN MOTION'.",
    era: "MMXXVI / VI",
    family: "heist · operation",
  },
  {
    id: "chess",
    name: "Endgame",
    tagline: "8×8 grid · serif · algebraic notation",
    description:
      "Tournament-bulletin gravity. 8×8 grid underlay, Crimson Pro serif, muted gold accent, algebraic-notation section labels (e4 · About, Nf3 · Work). Calm, deliberate, FIDE-press serious.",
    era: "MMXXVI / VII",
    family: "endgame · grandmaster",
  },
  {
    id: "tenet",
    name: "Tenet",
    tagline: "inversion · palindrome · time both ways",
    description:
      "Cool blue ↔ warm red palindrome palette. Time-stamps shown both forward and reversed, mirrored section labels, occasional inverted ornaments. Restrained — not a gimmick.",
    era: "MMXXVI / VIII",
    family: "inversion · time",
  },
  {
    id: "keynote",
    name: "Keynote — Research",
    tagline: "deck · PhD / research interview · papers in depth",
    description:
      "Presentation deck tuned for a PhD or research interview. Research is the spine: every peer-reviewed paper gets its own dossier, ordered first-author-then-impact, with peer-review and recognition. Engineering and credentials follow.",
    era: "MMXXVI / IX",
    family: "deck · research",
  },
  {
    id: "keynote-tech",
    name: "Keynote — Engineering",
    tagline: "deck · technical interview · systems first",
    description:
      "Presentation deck tuned for a technical interview. Engineering leads: current architecture, selected systems, and tooling up front; research is kept to the two strongest papers. Tight and outcome-driven.",
    era: "MMXXVI / X",
    family: "deck · engineering",
  },
  {
    id: "keynote-talk",
    name: "Keynote — Seminar",
    tagline: "deck · self-presentation / seminar · balanced",
    description:
      "Presentation deck tuned for a seminar or self-introduction. A balanced, concise arc — current impact, trajectory, a focused set of papers, engineering, and well-roundedness — built to introduce yourself end to end in minutes.",
    era: "MMXXVI / XI",
    family: "deck · seminar",
  },
];

const KEY = "portfolio.template";

export function readTemplate(): TemplateId {
  if (typeof window === "undefined") return "folio";
  const stored = window.localStorage.getItem(KEY);
  if (stored && TEMPLATES.some((t) => t.id === stored)) return stored as TemplateId;
  return "folio";
}

export function writeTemplate(t: TemplateId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, t);
  applyTemplateClass(t);
  window.dispatchEvent(new CustomEvent("portfolio:template-change", { detail: t }));
}

export function applyTemplateClass(t: TemplateId) {
  const root = document.documentElement;
  TEMPLATES.forEach((tpl) => root.classList.remove(`template-${tpl.id}`));
  // The keynote-* variants share one visual system — keep the base
  // `template-keynote` class on so all keynote CSS applies; the specific
  // `template-<id>` only drives which deck order is shown (in JS).
  root.classList.remove("template-keynote");
  root.classList.add(`template-${t}`);
  if (t === "keynote-tech" || t === "keynote-talk") {
    root.classList.add("template-keynote");
  }
}

// Module-level "remote fetched" guard so we only hit the network once per
// page load, no matter how many components mount useTemplate.
let remoteFetchPromise: Promise<void> | null = null;

function kickRemoteFetch() {
  if (remoteFetchPromise || !isRemoteConfigured()) return;
  remoteFetchPromise = fetchRemoteState().then((remote) => {
    if (!remote) return;
    if (remote.template) {
      const local = readTemplate();
      if (remote.template !== local) {
        writeTemplate(remote.template); // dispatches portfolio:template-change
      }
    }
    // Apply the published CV link. setCvUrl notifies subscribers (useCvUrl),
    // so every link on the page updates without a refresh.
    if (typeof remote.cvUrl === "string" && remote.cvUrl !== getCvUrl()) {
      setCvUrl(remote.cvUrl);
    }
  }).catch(() => { /* swallow — local state stays authoritative */ });
}

export function useTemplate() {
  const [template, setTemplateState] = useState<TemplateId>(() => readTemplate());

  useEffect(() => {
    applyTemplateClass(template);
  }, [template]);

  useEffect(() => {
    kickRemoteFetch();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const next = (e as CustomEvent<TemplateId>).detail;
      if (next && next !== template) setTemplateState(next);
    };
    window.addEventListener("portfolio:template-change", handler);
    return () => window.removeEventListener("portfolio:template-change", handler);
  }, [template]);

  const setTemplate = useCallback((t: TemplateId) => {
    setTemplateState(t);
    writeTemplate(t);
  }, []);

  return { template, setTemplate, templates: TEMPLATES };
}
