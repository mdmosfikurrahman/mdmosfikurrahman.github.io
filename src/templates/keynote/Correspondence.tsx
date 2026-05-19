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
    <li className="grid grid-cols-[88px,1fr,auto,auto] items-center gap-4 py-4 border-b rule-soft last:border-b-0">
      <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "hsl(var(--accent))" }}>
        {c.label}
      </span>
      <a href={c.href} target={external ? "_blank" : undefined}
         rel={external ? "noreferrer" : undefined}
         className="block truncate text-[15.5px] hover:text-[hsl(var(--accent))] transition-colors"
         style={{ color: "hsl(var(--ink-soft))" }}>
        {c.value}
      </a>
      <button type="button" onClick={onCopy}
              className="inline-flex items-center gap-1.5 text-[12.5px] transition-colors"
              style={{ color: "hsl(var(--muted))" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--ink))")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--muted))")}
              aria-label={`Copy ${c.label}`}>
        {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.6} />}
        <span className="hidden md:inline">{copied ? "Copied" : "Copy"}</span>
      </button>
      <a href={c.href} target={external ? "_blank" : undefined}
         rel={external ? "noreferrer" : undefined}
         className="inline-flex items-center gap-1.5 text-[12.5px]"
         style={{ color: "hsl(var(--accent))" }}>
        <span className="hidden md:inline">Open</span>
        <ArrowUpRight size={13} strokeWidth={1.8} />
      </a>
    </li>
  );
}

export default function Correspondence() {
  return (
    <section id="contact" className="slide border-t rule-soft">
      <div className="slide-grid" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1080px] px-6 sm:px-8 md:px-10 py-24 md:py-28">
        <p className="sig">06 · Let&apos;s talk</p>

        <div className="mt-7 grid grid-cols-12 gap-x-12 gap-y-12 items-end">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-display leading-[1.0] tracking-[-0.04em]
                           text-[clamp(2.25rem,6.5vw,4.75rem)]"
                style={{ color: "hsl(var(--ink))" }}>
              If this fits what you need,{" "}
              <a className="hover:opacity-80 transition-opacity"
                 style={{ color: "hsl(var(--accent))" }}
                 href={`mailto:${profile.email}`}>
                write to me.
              </a>
            </h2>
            <p className="mt-6 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.6] max-w-[46ch]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              I reply within forty-eight hours, usually sooner. Based in Dhaka
              (GMT+6). Open to backend architecture, applied ML, and research
              collaboration.
            </p>
            <p className="mt-7 text-[14.5px]" style={{ color: "hsl(var(--muted))" }}>
              {profile.location} · {profile.phone}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-5 min-w-0">
            <p className="mg-label mb-3">Channels</p>
            <ul>{channels.map((c) => <Row key={c.label} c={c} />)}</ul>
          </div>
        </div>

        <p className="mt-16 font-mono text-[12px] tracking-[0.16em] uppercase text-center"
           style={{ color: "hsl(var(--whisper))" }}>
          — end of deck · thank you —
        </p>
      </div>
    </section>
  );
}
