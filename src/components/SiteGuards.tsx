import { useEffect } from "react";

// Anti-copy / anti-inspect / anti-screenshot hardening.
//
// Security theater, mostly: a determined user can disable JS, use
// View-Source via the browser menu bar, use curl, fetch() the HTML directly,
// or point a phone camera at the monitor. This component raises friction for
// casual attempts only — PrintScreen and hardware screen capture cannot be
// blocked from a webpage.

const BLUR_CLASS = "guards-blur";

export default function SiteGuards() {
  useEffect(() => {
    let devtoolsOpen = false;
    let tabHidden = false;

    const applyBlur = () => {
      if (devtoolsOpen || tabHidden) {
        document.body.classList.add(BLUR_CLASS);
      } else {
        document.body.classList.remove(BLUR_CLASS);
      }
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const upper = key.length === 1 ? key.toUpperCase() : key;
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // F12 — DevTools
      if (key === "F12") {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + Shift + (I / J / C / K) — DevTools panels
      if (ctrlOrMeta && shift && ["I", "J", "C", "K"].includes(upper)) {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + (U) — View Source
      // Ctrl/Cmd + (S) — Save Page
      // Ctrl/Cmd + (P) — Print
      // Ctrl/Cmd + (A) — Select All
      // Ctrl/Cmd + (C / X) — Copy / Cut
      if (ctrlOrMeta && ["U", "S", "P", "A", "C", "X"].includes(upper)) {
        e.preventDefault();
        return;
      }

      // PrintScreen — best-effort clipboard clobber (browsers may block without
      // permission; OS usually overwrites with the bitmap after our call).
      if (key === "PrintScreen" || key === "F13") {
        navigator.clipboard?.writeText("").catch(() => {});
        // Flash blur for a moment as additional friction
        document.body.classList.add(BLUR_CLASS);
        window.setTimeout(applyBlur, 1500);
      }
    };

    const onCopy = (e: ClipboardEvent) => e.preventDefault();
    const onCut = (e: ClipboardEvent) => e.preventDefault();
    const onDragStart = (e: DragEvent) => e.preventDefault();
    const onSelectStart = (e: Event) => {
      // Allow form inputs to still work
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };

    // DevTools detector — window-chrome size delta. Docked devtools shrink
    // the inner viewport; undocked devtools can't be detected reliably.
    const detectDevtools = () => {
      const threshold = 160;
      const widthDelta = Math.abs(window.outerWidth - window.innerWidth);
      const heightDelta = Math.abs(window.outerHeight - window.innerHeight);
      const open = widthDelta > threshold || heightDelta > threshold;
      if (open !== devtoolsOpen) {
        devtoolsOpen = open;
        applyBlur();
      }
    };
    const devtoolsInterval = window.setInterval(detectDevtools, 500);
    detectDevtools();

    // Tab visibility only — blur when the tab is truly hidden (switched away
    // or minimised). Window-focus changes (cursor leaving, URL-bar click,
    // extension icon click) intentionally do NOT trigger blur — too noisy.
    const onVisibilityChange = () => {
      tabHidden = document.hidden;
      applyBlur();
    };

    // A second devtools-detection channel: `debugger` statement triggers a
    // real pause only when devtools are open. We time its execution — if it
    // takes noticeably long, devtools are open.
    const debuggerInterval = window.setInterval(() => {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const delta = performance.now() - start;
      if (delta > 100) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          applyBlur();
        }
      }
    }, 1500);

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(devtoolsInterval);
      window.clearInterval(debuggerInterval);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.body.classList.remove(BLUR_CLASS);
    };
  }, []);

  return null;
}
