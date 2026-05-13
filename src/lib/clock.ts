// Visitor-local clock helpers. Everything on the portfolio displays time
// in the user's own timezone — never fixed UTC.

// Short label for the current timezone, e.g. "GMT+6" / "GMT-5:30" / "UTC".
// Used in HUD strips and dossier metadata.
export function localTzLabel(d: Date = new Date()): string {
  const offsetMin = -d.getTimezoneOffset();
  if (offsetMin === 0) return "UTC";
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `GMT${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
}

// "YYYY-MM-DD HH:MM:SS" in the visitor's local timezone.
export function localIsoLocal(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear() + "-" +
    pad(d.getMonth() + 1) + "-" +
    pad(d.getDate()) + " " +
    pad(d.getHours()) + ":" +
    pad(d.getMinutes()) + ":" +
    pad(d.getSeconds())
  );
}

// "HH:MM:SS" — clock face only, local time.
export function localHms(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}

// Detected IANA timezone (e.g. "Asia/Dhaka"). Falls back to the GMT offset
// if Intl APIs are unavailable.
export function localTzName(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) return tz;
  } catch (_) { /* no-op */ }
  return localTzLabel();
}
