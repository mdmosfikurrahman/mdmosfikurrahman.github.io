import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, GraduationCap, FileText, type LucideIcon } from "lucide-react";
import { profile, preamble, figures } from "@/lib/content";

const avatar = "/profile-avatar.png";

const channels: { Icon: LucideIcon; href: string; label: string; external?: boolean }[] = [
  { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
  { Icon: Github, href: profile.links.github, label: "GitHub", external: true },
  { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn", external: true },
  { Icon: GraduationCap, href: profile.links.scholar, label: "Scholar", external: true },
  { Icon: FileText, href: profile.cvUrl, label: "CV", external: true },
];

export default function Hero() {
  return (
    <section id="top" className="relative border-b rule">
      {/* Animus scan strip */}
      <div className="border-b rule-soft">
        <div className="shell py-2 flex items-center justify-between gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.24em] flex-wrap"
             style={{ color: "hsl(var(--muted))" }}>
          <span style={{ color: "hsl(var(--accent))" }}>ANIMUS · v3.7</span>
          <span>SUBJECT: MMR-1997</span>
          <span>SYNC 100%</span>
        </div>
      </div>

      <div className="shell relative pt-12 md:pt-20 pb-16">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-8">
            <p className="font-display text-[10px] tracking-[0.36em] uppercase"
               style={{ color: "hsl(var(--accent))" }}>
              ✦ Memory Block 0001 · Sync Restored
            </p>

            <h1 className="mt-4 font-display text-[clamp(2.25rem,5.4vw,4rem)] leading-[1.04] tracking-[0.02em] uppercase"
                style={{ color: "hsl(var(--ink))" }}>
              {profile.name}
            </h1>

            <p className="mt-3 font-display text-[12px] md:text-[13px] tracking-[0.32em] uppercase"
               style={{ color: "hsl(var(--muted))" }}>
              Engineer · Researcher · Architect
            </p>

            <div className="mt-9 max-w-[60ch] text-[15.5px] md:text-[16px] leading-[1.65] space-y-4"
                 style={{ color: "hsl(var(--ink-soft))" }}>
              <p>{preamble[0]}</p>
              <p>{preamble[1]}</p>
              <p>{preamble[2]}</p>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[14.5px]">
              <Link to="/experience" className="a-arrow font-display tracking-[0.12em] uppercase">
                <span style={{ color: "hsl(var(--accent))" }}>II ·</span> Memories <span aria-hidden>→</span>
              </Link>
              <Link to="/publications" className="a-arrow font-display tracking-[0.12em] uppercase">
                <span style={{ color: "hsl(var(--accent))" }}>III ·</span> Codex <span aria-hidden>→</span>
              </Link>
              <Link to="/about" className="a-arrow font-display tracking-[0.12em] uppercase">
                <span style={{ color: "hsl(var(--accent))" }}>IV ·</span> Subject <span aria-hidden>→</span>
              </Link>
              <a href={`mailto:${profile.email}`} className="a-arrow font-display tracking-[0.12em] uppercase">
                <span style={{ color: "hsl(var(--accent))" }}>·</span> Contact <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4 flex flex-col">
            <figure className="mx-auto md:mx-0 w-[220px] md:w-full max-w-[280px]">
              {/* Animus frame */}
              <div className="relative" style={{
                padding: "6px",
                border: "1px solid hsl(var(--accent) / 0.5)",
                background: "hsl(var(--paper-deep))",
              }}>
                <div className="absolute -top-1 -left-1 w-3 h-3 border-l border-t"
                     style={{ borderColor: "hsl(var(--accent))" }} aria-hidden />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-r border-t"
                     style={{ borderColor: "hsl(var(--accent))" }} aria-hidden />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l border-b"
                     style={{ borderColor: "hsl(var(--accent))" }} aria-hidden />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b"
                     style={{ borderColor: "hsl(var(--accent))" }} aria-hidden />
                <img src={avatar} alt={`Portrait of ${profile.name}`}
                     className="w-full h-auto block" loading="eager"
                     style={{ filter: "saturate(0.85) contrast(1.05)" }} />
              </div>
              <figcaption className="mt-4 font-display text-[10px] uppercase tracking-[0.24em] leading-relaxed"
                          style={{ color: "hsl(var(--muted))" }}>
                <span style={{ color: "hsl(var(--accent))" }}>✦</span> Ancestor: MMR-1997 <br />
                <span style={{ color: "hsl(var(--accent))" }}>✦</span> Class: Engineer II
              </figcaption>
            </figure>

            <div className="mt-7 pt-5 border-t rule-soft">
              <p className="mg-label mb-3">Hidden Glyphs</p>
              <ul className="flex items-center gap-2 flex-wrap">
                {channels.map(({ Icon, href, label, external }) => (
                  <li key={label}>
                    <a href={href} target={external ? "_blank" : undefined}
                       rel={external ? "noreferrer" : undefined}
                       aria-label={label} title={label}
                       className="w-10 h-10 grid place-items-center transition-colors"
                       style={{ border: "1px solid hsl(var(--rule))" }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.borderColor = "hsl(var(--accent))";
                         e.currentTarget.style.color = "hsl(var(--accent))";
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.borderColor = "hsl(var(--rule))";
                         e.currentTarget.style.color = "";
                       }}>
                      <Icon size={15} strokeWidth={1.6} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t rule bg-paper-deep/40">
        <div className="shell py-5 grid grid-cols-2 md:grid-cols-4">
          {figures.map((f, i) => {
            const cell = [
              i === 0 ? "" : "border-l rule-soft md:border-l",
              i >= 2 ? "border-t rule-soft md:border-t-0" : "",
              i === 2 ? "md:border-l" : "",
            ].join(" ");
            return (
              <div key={f.k} className={`flex items-baseline gap-3 px-3 py-3 md:py-2 ${cell}`}>
                <span className="font-display text-[26px] md:text-[28px] leading-none tabular-nums"
                      style={{ color: "hsl(var(--ink))" }}>
                  {f.v}
                </span>
                <span className="flex flex-col leading-tight min-w-0">
                  <span className="font-display text-[10px] uppercase tracking-[0.22em] truncate"
                        style={{ color: "hsl(var(--accent))" }}>
                    {f.k}
                  </span>
                  <span className="text-[11.5px] truncate"
                        style={{ color: "hsl(var(--muted))" }}>{f.note}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
