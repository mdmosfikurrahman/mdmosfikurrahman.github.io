import { useState } from "react";
import { Copy, Check, ArrowUpRight } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { profile } from "@/lib/content";
import { useCvUrl, useCvLabel } from "@/lib/settings";

type Channel = {
  label: string;
  prompt: string;          // polite generic phrase shown inline
  whisper: string;         // italic muted phrase below prompt
  actionLabel: string;     // call-to-action label inside popover
  value: string;           // the thing to copy (email/url)
  href: string;            // the link to open
  copyLabel: string;       // what "copy" copies
};

const channels: Channel[] = [
  {
    label: "Email",
    prompt: "Open a private message",
    whisper: "the fastest way",
    actionLabel: "Send",
    value: profile.email,
    href: `mailto:${profile.email}`,
    copyLabel: "Copy address",
  },
  {
    label: "GitHub",
    prompt: "Read the code I write",
    whisper: "repositories & side-projects",
    actionLabel: "Visit",
    value: profile.links.github,
    href: profile.links.github,
    copyLabel: "Copy link",
  },
  {
    label: "LinkedIn",
    prompt: "Reach me professionally",
    whisper: "network & long-form notes",
    actionLabel: "Visit",
    value: profile.links.linkedin,
    href: profile.links.linkedin,
    copyLabel: "Copy link",
  },
  {
    label: "Scholar",
    prompt: "Browse the publications",
    whisper: "research index & citations",
    actionLabel: "Visit",
    value: profile.links.scholar,
    href: profile.links.scholar,
    copyLabel: "Copy link",
  },
  {
    label: "ORCID",
    prompt: "Verify the research identity",
    whisper: "persistent author identifier",
    actionLabel: "Visit",
    value: profile.links.orcid,
    href: profile.links.orcid,
    copyLabel: "Copy link",
  },
  {
    label: "Curriculum Vitæ",
    prompt: "Read the full record",
    whisper: "experience, research, service",
    actionLabel: "Open",
    value: profile.cvUrl,
    href: profile.cvUrl,
    copyLabel: "Copy link",
  },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function ChannelCard({
  c,
  index,
}: {
  c: Channel;
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  const external = c.href.startsWith("http");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(c.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* no-op */
    }
  };

  return (
    <HoverCard openDelay={80} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          href={c.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className="relative grid grid-cols-[40px,1fr,auto] md:grid-cols-[52px,140px,1fr,auto] items-baseline gap-x-3 md:gap-x-6 py-4 md:py-5 group"
        >
          <span className="font-display text-xl md:text-2xl tabular-nums text-muted-foreground group-hover:text-accent transition-colors leading-none pt-[2px]">
            {ROMAN[index]}
          </span>
          <span className="hidden md:block font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground self-center">
            {c.label}
          </span>
          <span className="min-w-0">
            <span className="md:hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground block mb-1">
              {c.label}
            </span>
            <span className="block font-serif-body text-[1.05rem] md:text-[1.2rem] text-ink group-hover:text-accent transition-colors truncate">
              {c.prompt}
            </span>
            <span className="block font-serif-body italic text-[13px] text-muted-foreground mt-0.5">
              {c.whisper}
            </span>
          </span>
          <span
            aria-hidden
            className="font-display text-lg md:text-xl text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all self-center"
          >
            →
          </span>
        </a>
      </HoverCardTrigger>

      <HoverCardContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-[min(22rem,calc(100vw-2rem))] p-0 border rule bg-paper shadow-[0_24px_60px_-20px_hsl(var(--ink)/0.25)] rounded-none"
      >
        <div className="px-4 py-3 border-b rule-soft flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {c.label}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            Dispatch
          </span>
        </div>

        <div className="px-4 py-4">
          <p className="font-serif-body text-[15px] text-ink break-all leading-snug">
            {c.value.replace(/^https?:\/\//, "")}
          </p>
          <p className="mt-2 font-serif-body italic text-[12.5px] text-muted-foreground leading-snug">
            {c.whisper}.
          </p>
        </div>

        <div className="flex items-stretch border-t rule-soft">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onCopy();
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] border-r rule-soft hover:bg-paper-deep transition-colors"
          >
            {copied ? <Check size={13} strokeWidth={1.8} /> : <Copy size={13} strokeWidth={1.6} />}
            <span>{copied ? "Copied" : c.copyLabel}</span>
          </button>
          <a
            href={c.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper transition-colors"
          >
            <span>{c.actionLabel}</span>
            <ArrowUpRight size={13} strokeWidth={1.6} />
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function Correspondence() {
  const cvUrl = useCvUrl();
  const cvLabel = useCvLabel();
  const items = channels.map((c) =>
    c.label === "Curriculum Vitæ" ? { ...c, value: cvUrl, href: cvUrl, label: cvLabel } : c,
  );
  return (
    <section id="contact" className="relative">
      <div className="halftone absolute inset-0 opacity-40 pointer-events-none" aria-hidden />

      <div className="shell relative py-20 md:py-28">
        <div className="grid grid-cols-12 gap-y-10 md:gap-x-10">
          {/* Left: invitation */}
          <div className="col-span-12 md:col-span-5">
            <p className="sig">Correspond</p>
            <h2 className="font-display text-3xl md:text-[2.75rem] lg:text-[3.25rem] leading-[1.02] tracking-[-0.02em] mt-3 text-balance">
              If something here is useful,{" "}
              <span className="italic font-light text-muted-foreground">or you wish to build something together</span>
              {", "}
              <a
                className="text-accent no-underline hover:opacity-80 transition-opacity whitespace-nowrap"
                href={`mailto:${profile.email}`}
              >
                write to me
              </a>
              .
            </h2>

            <p className="mt-6 font-serif-body text-[1rem] md:text-[1.075rem] leading-[1.65] text-ink-soft max-w-[42ch]">
              I reply within forty-eight hours, usually sooner. Based in Dhaka{" "}
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                (GMT+6)
              </span>
              , and happy to discuss backend architecture, applied ML, or research collaboration.
            </p>

            <div className="mt-8 pt-5 border-t rule">
              <p className="mg-label mb-2">In person</p>
              <p className="font-serif-body text-[1rem] text-ink-soft">
                Modhumoti, Sector-18, Uttara <br />
                Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {/* Right: channel ledger */}
          <div className="col-span-12 md:col-span-7 md:pl-6 lg:pl-10 md:border-l rule-soft">
            <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground pb-3 border-b rule">
              <span>Channels</span>
              <span className="hidden sm:inline">Hover / tap for details</span>
              <span className="sm:hidden">Tap for details</span>
            </div>

            <ol>
              {items.map((c, i) => (
                <li key={c.label} className="border-b rule-soft last:border-b-0">
                  <ChannelCard c={c} index={i} />
                </li>
              ))}
            </ol>

            <div className="mt-8 flex items-end justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Yours, in production.
              </p>
              <p
                aria-hidden
                className="font-display italic text-2xl md:text-3xl leading-none text-accent select-none"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 90, "WONK" 1' }}
              >
                M.M.R.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
