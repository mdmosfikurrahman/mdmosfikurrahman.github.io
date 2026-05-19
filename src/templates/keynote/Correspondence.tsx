import { Copy, Check, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { profile } from "@/lib/content";

type Channel = { label: string; value: string; href: string };

const channels: Channel[] = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "GitHub", value: profile.links.github.replace(/^https?:\/\//, ""), href: profile.links.github },
  { label: "LinkedIn", value: profile.links.linkedin.replace(/^https?:\/\//, ""), href: profile.links.linkedin },
  { label: "Scholar", value: profile.links.scholar.replace(/^https?:\/\//, ""), href: profile.links.scholar },
  { label: "CV", value: profile.cvUrl.replace(/^https?:\/\//, ""), href: profile.cvUrl },
];

function Row({ c }: { c: Channel }) {
  const [copied, setCopied] = useState(false);
  const external = c.href.startsWith("http");
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(c.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* no-op */ }
  };
  return (
    <li className="flex items-center gap-4 py-3.5 border-b rule-soft last:border-b-0">
      <span className="w-20 shrink-0 font-mono text-[11.5px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "hsl(var(--accent))" }}>
        {c.label}
      </span>
      <a href={c.href} target={external ? "_blank" : undefined}
         rel={external ? "noreferrer" : undefined}
         className="flex-1 min-w-0 truncate text-[15px] hover:text-[hsl(var(--accent))] transition-colors"
         style={{ color: "hsl(var(--ink-soft))" }}>
        {c.value}
      </a>
      <button type="button" onClick={onCopy}
              className="shrink-0 inline-flex items-center gap-1.5 text-[12.5px] transition-colors"
              style={{ color: "hsl(var(--muted))" }}
              aria-label={`Copy ${c.label}`}>
        {copied ? <Check size={13} strokeWidth={2.4} /> : <Copy size={13} strokeWidth={1.7} />}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
      </button>
      <a href={c.href} target={external ? "_blank" : undefined}
         rel={external ? "noreferrer" : undefined}
         className="shrink-0 inline-flex items-center gap-1 text-[12.5px] font-semibold"
         style={{ color: "hsl(var(--accent))" }}>
        <span className="hidden sm:inline">Open</span>
        <ArrowUpRight size={13} strokeWidth={2} />
      </a>
    </li>
  );
}

export default function Correspondence() {
  return (
    <section id="contact" className="slide border-t rule-soft">
      <div className="kn-glow" aria-hidden />
      <span className="kn-ghost" aria-hidden>06</span>

      <div className="relative mx-auto w-full max-w-[1120px] px-6 sm:px-10 py-28">
        <div className="flex items-center justify-between">
          <p className="sig">Let&apos;s talk</p>
          <span className="kn-step"><b>06</b> / 06</span>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-x-14 gap-y-12 items-end">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-display leading-[0.98] tracking-[-0.045em]
                           text-[clamp(2.5rem,7vw,5rem)]"
                style={{ color: "hsl(var(--ink))" }}>
              If this fits what you need,{" "}
              <a className="kn-mark hover:opacity-80 transition-opacity"
                 href={`mailto:${profile.email}`}>
                write to me.
              </a>
            </h2>
            <p className="mt-7 text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.6] max-w-[46ch]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              I reply within forty-eight hours, usually sooner. Based in Dhaka
              (GMT+6). Open to backend architecture, applied ML, and research
              collaboration.
            </p>
            <p className="mt-7 text-[14px]" style={{ color: "hsl(var(--muted))" }}>
              {profile.location} · {profile.phone}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-5 min-w-0 kn-card p-7">
            <p className="mg-label mb-2">Channels</p>
            <ul>{channels.map((c) => <Row key={c.label} c={c} />)}</ul>
          </div>
        </div>

        <p className="mt-16 font-mono text-[11.5px] tracking-[0.24em] uppercase text-center"
           style={{ color: "hsl(var(--whisper))" }}>
          — end of deck · thank you —
        </p>
      </div>
    </section>
  );
}
