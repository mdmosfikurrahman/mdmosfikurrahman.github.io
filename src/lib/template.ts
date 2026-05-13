// Template registry. Adding a new template:
//   1. drop a folder under src/templates/<id>/ with the variant components
//   2. register it here
//   3. extend the dispatchers in src/components/<X>.tsx / src/components/sections/<X>.tsx
//      to import from "@/templates/<id>/<X>"
// Switching is instant: the `html` element gets `template-<id>` and the CSS
// re-resolves tokens. Persisted in localStorage.

import { useCallback, useEffect, useState } from "react";
import { fetchRemoteTemplate, isRemoteConfigured } from "./templateRemote";

export type TemplateId = "broadsheet" | "surveillance";

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
];

const KEY = "portfolio.template";

export function readTemplate(): TemplateId {
  if (typeof window === "undefined") return "surveillance";
  const stored = window.localStorage.getItem(KEY);
  if (stored && TEMPLATES.some((t) => t.id === stored)) return stored as TemplateId;
  return "surveillance";
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
  root.classList.add(`template-${t}`);
}

// Module-level "remote fetched" guard so we only hit the network once per
// page load, no matter how many components mount useTemplate.
let remoteFetchPromise: Promise<void> | null = null;

function kickRemoteFetch() {
  if (remoteFetchPromise || !isRemoteConfigured()) return;
  remoteFetchPromise = fetchRemoteTemplate().then((remote) => {
    if (!remote) return;
    const local = readTemplate();
    if (remote.template !== local) {
      writeTemplate(remote.template); // dispatches portfolio:template-change
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
