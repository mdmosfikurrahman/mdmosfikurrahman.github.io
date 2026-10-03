import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parsePresentHash, startPresentation, usePresentation } from "@/lib/presentation";
import { deckForLens, getLens } from "@/lib/lens";

// Starts Present mode from the keyboard (P) or a /#present link (optionally
// /#present/research, /#present/engineering or /#present/seminar). The visible
// button lives in the site header. Without a named deck, the visitor's lens
// picks one: research for academia, engineering for industry, seminar for both.
export default function PresentLauncher() {
  const { open } = usePresentation();
  const { hash, pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const parsed = parsePresentHash(hash);
    if (!parsed) return;
    startPresentation(parsed.deck ?? deckForLens(getLens()));
    navigate(pathname + search, { replace: true });
  }, [hash, pathname, search, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "p" && e.key !== "P") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (open) return;
      startPresentation(deckForLens(getLens()));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return null;
}
