import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const SESSION_KEY = "poi.booted";

type Line = { text: string; delay: number; tag?: "ok" | "warn" | "crit" };

function machineLines(now: Date): Line[] {
  const t = now.toUTCString().replace("GMT", "UTC");
  return [
    { text: "> initialising kernel ...................... OK", delay: 110, tag: "ok" },
    { text: "> mounting /surveillance ................... OK", delay: 90, tag: "ok" },
    { text: "> opening 14,221 active feeds .............. OK", delay: 130, tag: "ok" },
    { text: `> sync ${t}`, delay: 140 },
    { text: "> ADMIN: H. FINCH    auth verified", delay: 160, tag: "ok" },
    { text: "> ASSET: J. REESE    online", delay: 80, tag: "ok" },
    { text: "> resolving target .........................", delay: 280, tag: "warn" },
    { text: "> SUBJECT IDENTIFIED", delay: 220, tag: "ok" },
    { text: "  NAME ............ MD. MOSFIKUR RAHMAN", delay: 60 },
    { text: "  ROLE ............ ENGINEER II / BACKEND", delay: 60 },
    { text: "  ORIGIN .......... DHAKA, 23.81°N  90.41°E", delay: 60 },
    { text: "  CLASSIFICATION .. ASSET (NON-THREAT)", delay: 60 },
    { text: "> ADMIN ACCESS GRANTED", delay: 240, tag: "ok" },
  ];
}

function samaritanLines(now: Date): Line[] {
  const t = now.toUTCString().replace("GMT", "UTC");
  return [
    { text: "[NORTHERN LIGHTS] handshake ............... ACK", delay: 100, tag: "ok" },
    { text: "[NL] node 0xA17F online", delay: 80, tag: "ok" },
    { text: "[NL] enumerating subjects ................. 7.4B", delay: 130 },
    { text: `[NL] sync ${t}`, delay: 140 },
    { text: "[NL] cross-referencing dataset ............ OK", delay: 160, tag: "ok" },
    { text: "[NL] SUBJECT MATCH                         RELEVANT", delay: 220, tag: "ok" },
    { text: "    designation .... MD. MOSFIKUR RAHMAN", delay: 60 },
    { text: "    function ....... SYSTEMS ENGINEER", delay: 60 },
    { text: "    locale ......... 23.81N 90.41E / DHAKA", delay: 60 },
    { text: "    threat ......... NEGLIGIBLE", delay: 60 },
    { text: "[NL] dossier unlocked", delay: 200, tag: "ok" },
  ];
}

export default function BootSequence() {
  const { theme } = useTheme();
  const [show, setShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  });
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  const lines = theme === "dark" ? machineLines(new Date()) : samaritanLines(new Date());

  useEffect(() => {
    if (!show) return;
    if (step >= lines.length) {
      const t = setTimeout(() => setFade(true), 450);
      const t2 = setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setShow(false);
      }, 1100);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
    const t = setTimeout(() => setStep((s) => s + 1), lines[step].delay);
    return () => clearTimeout(t);
  }, [show, step, lines]);

  useEffect(() => {
    if (!show) return;
    if (step >= lines.length) {
      setProgress(100);
      return;
    }
    setProgress(Math.round(((step + 1) / lines.length) * 100));
  }, [step, show, lines.length]);

  if (!show) return null;

  const factionLabel = theme === "dark" ? "THE MACHINE" : "SAMARITAN";
  const factionVer = theme === "dark" ? "v3.7.2" : "v.∞";
  const bracketColor = "hsl(var(--accent))";

  return (
    <div
      role="dialog"
      aria-label="System boot"
      className={[
        "site-splash fixed inset-0 z-[9999] grid place-items-center",
        "bg-[hsl(var(--paper))] text-[hsl(var(--ink))]",
        "transition-opacity duration-500",
        fade ? "opacity-0" : "opacity-100",
      ].join(" ")}
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, hsl(var(--ink) / var(--scan-opacity)) 0 1px, transparent 1px 3px)",
      }}
    >
      <div className="relative w-[min(640px,92vw)] font-mono text-[12px] leading-[1.6]">
        {/* Corner brackets */}
        <span className="absolute -top-3 -left-3 w-5 h-5 border-l-2 border-t-2"
              style={{ borderColor: bracketColor }} aria-hidden />
        <span className="absolute -top-3 -right-3 w-5 h-5 border-r-2 border-t-2"
              style={{ borderColor: bracketColor }} aria-hidden />
        <span className="absolute -bottom-3 -left-3 w-5 h-5 border-l-2 border-b-2"
              style={{ borderColor: bracketColor }} aria-hidden />
        <span className="absolute -bottom-3 -right-3 w-5 h-5 border-r-2 border-b-2"
              style={{ borderColor: bracketColor }} aria-hidden />

        <div className="border border-current/20 p-5 md:p-7 bg-[hsl(var(--paper-glass))]/80 backdrop-blur-[1px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] tracking-[0.28em] uppercase" style={{ color: bracketColor }}>
              <span className="blink-dot mr-2 align-middle" />
              {factionLabel}  //  {factionVer}
            </span>
            <span className="text-[10px] tracking-[0.22em] uppercase opacity-60">
              boot {String(progress).padStart(3, " ")}%
            </span>
          </div>

          <pre className="whitespace-pre-wrap break-words text-[11.5px] md:text-[12.5px]">
{lines.slice(0, step).map((l, i) => {
  const color =
    l.tag === "ok" ? "hsl(var(--signal-pos))" :
    l.tag === "warn" ? "hsl(var(--signal-warn))" :
    l.tag === "crit" ? "hsl(var(--signal-crit))" :
    undefined;
  return (
    <span key={i} style={{ color }} className="block">
      {l.text}
    </span>
  );
})}
{step < lines.length && (
  <span className="block opacity-90">
    {lines[step]?.text}<span className="caret" />
  </span>
)}
          </pre>

          <div className="mt-5 h-px w-full" style={{ background: "hsl(var(--rule))" }} />
          <div className="mt-3 flex items-center justify-between text-[10px] tracking-[0.22em] uppercase opacity-70">
            <span>press any key to skip</span>
            <span>{new Date().toUTCString().slice(17, 25)} UTC</span>
          </div>
        </div>
      </div>

      <SkipKeyHandler onSkip={() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setFade(true);
        setTimeout(() => setShow(false), 280);
      }} />
    </div>
  );
}

function SkipKeyHandler({ onSkip }: { onSkip: () => void }) {
  useEffect(() => {
    const handler = () => onSkip();
    window.addEventListener("keydown", handler, { once: true });
    window.addEventListener("click", handler, { once: true });
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);
    };
  }, [onSkip]);
  return null;
}
