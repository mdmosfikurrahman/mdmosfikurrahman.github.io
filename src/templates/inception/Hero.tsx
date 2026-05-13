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
      {/* Blueprint header strip with ticked rule */}
      <div className="border-b rule-soft">
        <div className="shell py-2 flex items-center justify-between gap-x-4 gap-y-1 font-mono text-[10.5px] tracking-[0.18em] uppercase flex-wrap"
             style={{ color: "hsl(var(--muted))" }}>
          <span><span style={{ color: "hsl(var(--accent))" }}>plate</span> 01 / 04</span>
          <span>scale 1:1 · sheet a</span>
          <span><span style={{ color: "hsl(var(--accent))" }}>arch</span> M. Rahman</span>
        </div>
      </div>

      <div className="shell relative pt-12 md:pt-20 pb-16">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          <div className="col-span-12 md:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em]"
               style={{ color: "hsl(var(--accent))" }}>
              ▾ Level 01 · Surface · Dhaka
            </p>

            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.02] tracking-[-0.03em]"
                style={{ color: "hsl(var(--ink))" }}>
              We build the levels.
            </h1>
            <p className="mt-4 text-[18px] md:text-[19px] leading-[1.5] max-w-[52ch]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              Backend services, schemas, and workflows — designed level-by-level,
              so the system holds together when the dream gets heavy.
            </p>

            <div className="mt-10 space-y-4 max-w-[60ch] text-[15.5px] leading-[1.7]"
                 style={{ color: "hsl(var(--ink-soft))" }}>
              <p>{preamble[1]}</p>
              <p>{preamble[2]}</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[13px]">
              <Link to="/experience" className="a-arrow inline-flex items-center gap-1.5">
                <span style={{ color: "hsl(var(--accent))" }}>01 ·</span> Levels <span aria-hidden>→</span>
              </Link>
              <Link to="/publications" className="a-arrow inline-flex items-center gap-1.5">
                <span style={{ color: "hsl(var(--accent))" }}>02 ·</span> Plans <span aria-hidden>→</span>
              </Link>
              <Link to="/about" className="a-arrow inline-flex items-center gap-1.5">
                <span style={{ color: "hsl(var(--accent))" }}>03 ·</span> Architect <span aria-hidden>→</span>
              </Link>
              <a href={`mailto:${profile.email}`} className="a-arrow inline-flex items-center gap-1.5">
                <span style={{ color: "hsl(var(--accent))" }}>·</span> Contact <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4">
            <figure className="mx-auto md:mx-0 w-[220px] md:w-full max-w-[280px] relative">
              {/* Drafting markers */}
              <span aria-hidden className="absolute -top-3 -left-3 font-mono text-[10px]"
                    style={{ color: "hsl(var(--accent))" }}>+</span>
              <span aria-hidden className="absolute -top-3 -right-3 font-mono text-[10px]"
                    style={{ color: "hsl(var(--accent))" }}>+</span>
              <span aria-hidden className="absolute -bottom-3 -left-3 font-mono text-[10px]"
                    style={{ color: "hsl(var(--accent))" }}>+</span>
              <span aria-hidden className="absolute -bottom-3 -right-3 font-mono text-[10px]"
                    style={{ color: "hsl(var(--accent))" }}>+</span>
              <div style={{ border: "1px solid hsl(var(--accent))" }}>
                <img src={avatar} alt={`Portrait of ${profile.name}`}
                     className="w-full h-auto block" loading="eager"
                     style={{ filter: "saturate(0.7) contrast(0.95)" }} />
              </div>
              <figcaption className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.2em] leading-relaxed"
                          style={{ color: "hsl(var(--muted))" }}>
                <span style={{ color: "hsl(var(--accent))" }}>fig.</span> 01 · M. M. Rahman <br />
                <span style={{ color: "hsl(var(--accent))" }}>note:</span> backend architect
              </figcaption>
            </figure>

            <div className="mt-7 pt-5 border-t rule-soft">
              <p className="mg-label mb-3">▾ Channels</p>
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

      {/* Stats with dashed rule */}
      <div className="border-t rule bg-paper-deep/40">
        <div className="shell py-5 grid grid-cols-2 md:grid-cols-4">
          {figures.map((f, i) => (
            <div key={f.k}
                 className={`flex items-baseline gap-3 px-3 py-3 md:py-2 ${
                   i === 0 ? "" : "md:border-l rule-soft"
                 } ${i >= 2 ? "border-t rule-soft md:border-t-0" : ""} ${
                   i === 1 || i === 3 ? "border-l rule-soft" : ""
                 }`}>
              <span className="font-display text-[28px] leading-none tabular-nums"
                    style={{ color: "hsl(var(--ink))" }}>{f.v}</span>
              <span className="flex flex-col leading-tight min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] truncate"
                      style={{ color: "hsl(var(--accent))" }}>{f.k}</span>
                <span className="text-[11.5px] truncate"
                      style={{ color: "hsl(var(--muted))" }}>{f.note}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
