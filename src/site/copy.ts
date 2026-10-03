import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    __siteCopy?: boolean;
  }
}

// The site cancels copy events (SiteGuards and the inline guard in
// index.html). The Clipboard API raises no copy event, so it is used first;
// the execCommand fallback, needed on plain-http origins, raises the
// `__siteCopy` flag for its single call so the guards let it through.
async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the fallback */
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  window.__siteCopy = true;
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  window.__siteCopy = false;
  document.body.removeChild(ta);
  return ok;
}

// `what` names the thing in the confirmation, e.g. "Email address".
export function useCopy(text: string, what: string) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    const ok = await writeClipboard(text);
    if (!ok) {
      toast.error(`Could not copy the ${what.toLowerCase()}`);
      return;
    }
    setCopied(true);
    toast.success(`${what} copied`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }, [text, what]);

  return { copied, copy };
}
