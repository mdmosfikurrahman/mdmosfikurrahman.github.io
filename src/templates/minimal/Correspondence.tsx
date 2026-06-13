import { Copy, Check, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { profile } from "@/lib/content";
import { useCvUrl } from "@/lib/settings";

type Channel = {
  label: string;
  whisper: string;
  value: string;
  href: string;
  copyLabel: string;
};

const channels: Channel[] = [
  {
    label: "Email",
    whisper: "The fastest way to reach me.",
    value: profile.email,
    href: `mailto:${profile.email}`,
    copyLabel: "Copy email",
  },
  {
    label: "GitHub",
    whisper: "Code and side projects.",
    value: profile.links.github.replace(/^https?:\/\//, ""),
    href: profile.links.github,
    copyLabel: "Copy link",
  },
  {
    label: "LinkedIn",
    whisper: "Network and long-form notes.",
    value: profile.links.linkedin.replace(/^https?:\/\//, ""),
    href: profile.links.linkedin,
    copyLabel: "Copy link",
  },
  {
    label: "Scholar",
    whisper: "Research index and citations.",
    value: profile.links.scholar.replace(/^https?:\/\//, ""),
    href: profile.links.scholar,
    copyLabel: "Copy link",
  },
  {
    label: "CV",
    whisper: "The full record.",
    value: profile.cvUrl.replace(/^https?:\/\//, ""),
    href: profile.cvUrl,
    copyLabel: "Copy link",
  },
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
    <li className="grid grid-cols-[80px,1fr,auto] md:grid-cols-[100px,1fr,auto,auto] items-center gap-4 py-5 border-b rule-soft last:border-b-0">
      <span className="text-[13px] font-medium" style={{ color: "hsl(var(--ink))" }}>
        {c.label}
      </span>
      <div className="min-w-0">
        <a
          href={c.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="block truncate text-[15px] hover:text-[hsl(var(--accent))] transition-colors"
          style={{ color: "hsl(var(--ink-soft))" }}
        >
          {c.value}
        </a>
        <p className="hidden md:block mt-0.5 text-[12.5px]"
           style={{ color: "hsl(var(--muted))" }}>
          {c.whisper}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-1.5 text-[12.5px] transition-colors"
        style={{ color: "hsl(var(--muted))" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--ink))")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--muted))")}
        aria-label={c.copyLabel}
      >
        {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.6} />}
        <span className="hidden md:inline">{copied ? "Copied" : "Copy"}</span>
      </button>
      <a
        href={c.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="inline-flex items-center gap-1.5 text-[12.5px] transition-colors"
        style={{ color: "hsl(var(--accent))" }}
      >
        <span className="hidden md:inline">Open</span>
        <ArrowUpRight size={13} strokeWidth={1.8} />
      </a>
    </li>
  );
}

export default function Correspondence() {
  const cvUrl = useCvUrl();
  const items = channels.map((c) =>
    c.label === "CV"
      ? { ...c, value: cvUrl.replace(/^https?:\/\//, ""), href: cvUrl }
      : c,
  );
  return (
    <section id="contact" className="border-t rule-soft">
      <div className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <p className="sig">Get in touch</p>
            <h2 className="mt-3 font-display text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.025em]"
                style={{ color: "hsl(var(--ink))" }}>
              If something here is useful,{" "}
              <a className="hover:opacity-80 transition-opacity"
                 style={{ color: "hsl(var(--accent))" }}
                 href={`mailto:${profile.email}`}>
                write to me.
              </a>
            </h2>
            <p className="mt-5 text-[15.5px] leading-[1.65] max-w-[42ch]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              I reply within forty-eight hours, usually sooner. Based in Dhaka
              (GMT+6). Happy to discuss backend architecture, applied ML, or
              research collaboration.
            </p>

            <div className="mt-8 pt-5 border-t rule-soft">
              <p className="mg-label mb-2">In person</p>
              <p className="text-[15px]" style={{ color: "hsl(var(--ink-soft))" }}>
                Modhumoti, Sector-18, Uttara <br />
                Dhaka, Bangladesh
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 min-w-0">
            <p className="mg-label mb-3">Channels</p>
            <ul>
              {items.map((c) => <Row key={c.label} c={c} />)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
