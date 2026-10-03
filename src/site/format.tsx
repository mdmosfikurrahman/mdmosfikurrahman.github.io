import type { ReactNode } from "react";

// Wraps the first occurrence of `phrase` in <em>, which the title styles set
// in the italic serif. Falls back to the plain string.
export function emphasise(text: string, phrase: string): ReactNode {
  const i = text.indexOf(phrase);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <em>{phrase}</em>
      {text.slice(i + phrase.length)}
    </>
  );
}

function parseMonth(iso: string): Date {
  if (iso === "present") return new Date();
  const [y, m] = iso.split("-");
  return new Date(Number(y), Number(m) - 1, 1);
}

export function fmtMonth(iso: string): string {
  if (iso === "present") return "Present";
  return parseMonth(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function fmtRange(from: string, to: string): string {
  return `${fmtMonth(from)} – ${fmtMonth(to)}`;
}

// Month-granular length, e.g. "1 yr 4 mos".
export function duration(from: string, to: string): string {
  const a = parseMonth(from);
  const b = parseMonth(to);
  // Inclusive of both end months, the way a CV or LinkedIn counts it.
  const months = Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr${y > 1 ? "s" : ""}` : "", m ? `${m} mo${m > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ");
}

export function fmtDay(iso: string, withYear = true): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
export function spell(n: number): string {
  return words[n] ?? String(n);
}
export function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
