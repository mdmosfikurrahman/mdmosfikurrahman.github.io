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
      <div className="border-b rule-soft">
        <div className="shell py-2 flex items-center justify-between gap-x-4 gap-y-1 text-[10.5px] font-display font-bold uppercase tracking-[0.22em] flex-wrap"
             style={{ color: "hsl(var(--ink))" }}>
          <span><span style={{ color: "hsl(var(--accent))" }}>●</span> Operation 01 · In Motion</span>
          <span className="font-script text-[14px] tracking-normal"
                style={{ color: "hsl(var(--accent))" }}>
            Bella Ciao
          </span>
          <span>Crew · 1 · Dhaka</span>
        </div>
      </div>

      <div className="shell relative pt-12 md:pt-20 pb-16">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          <div className="col-span-12 md:col-span-8">
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.28em]"
               style={{ color: "hsl(var(--accent))" }}>
              ● The Plan
            </p>

            <h1 className="mt-3 font-display text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[0.98] tracking-[-0.035em]"
                style={{ color: "hsl(var(--ink))" }}>
              Backend, executed <br className="hidden md:block" />
              <span style={{ color: "hsl(var(--accent))" }}>like clockwork.</span>
            </h1>

            <p className="mt-5 text-[17px] md:text-[18px] leading-[1.5] max-w-[54ch]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              Architect of the room. Plans the heist, draws the maps,
              keeps the timer running.
            </p>

            <div className="mt-9 space-y-4 max-w-[60ch] text-[15.5px] leading-[1.7]"
                 style={{ color: "hsl(var(--ink-soft))" }}>
              <p>{preamble[1]}</p>
              <p>{preamble[2]}</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[14px]">
              <Link to="/experience"
                    className="a-arrow inline-flex items-center gap-1.5 font-display uppercase tracking-[0.08em] font-semibold">
                <span style={{ color: "hsl(var(--accent))" }}>02 ·</span> Operations <span aria-hidden>→</span>
              </Link>
              <Link to="/publications"
                    className="a-arrow inline-flex items-center gap-1.5 font-display uppercase tracking-[0.08em] font-semibold">
                <span style={{ color: "hsl(var(--accent))" }}>03 ·</span> Files <span aria-hidden>→</span>
              </Link>
              <Link to="/about"
                    className="a-arrow inline-flex items-center gap-1.5 font-display uppercase tracking-[0.08em] font-semibold">
                <span style={{ color: "hsl(var(--accent))" }}>04 ·</span> Crew <span aria-hidden>→</span>
              </Link>
              <a href={`mailto:${profile.email}`}
                 className="a-arrow inline-flex items-center gap-1.5 font-display uppercase tracking-[0.08em] font-semibold">
                <span style={{ color: "hsl(var(--accent))" }}>·</span> Recruit <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4">
            <figure className="mx-auto md:mx-0 w-[220px] md:w-full max-w-[280px] relative">
              {/* Pin */}
              <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full grid place-items-center"
                    style={{ background: "hsl(var(--accent))" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--paper))" }} />
              </span>
              <div className="rotate-[-2deg]" style={{
                border: "1px solid hsl(var(--ink) / 0.85)",
                background: "hsl(var(--paper-glass))",
                padding: "8px",
                boxShadow: "0 10px 30px -10px hsl(var(--ink) / 0.25)",
              }}>
                <img src={avatar} alt={`Portrait of ${profile.name}`}
                     className="w-full h-auto block" loading="eager"
                     style={{ filter: "grayscale(0.6) contrast(1.05)" }} />
                <figcaption className="mt-2 font-script text-[16px] text-center leading-tight"
                            style={{ color: "hsl(var(--accent))" }}>
                  The Architect
                </figcaption>
              </div>
            </figure>

            <div className="mt-7 pt-5 border-t rule-soft">
              <p className="mg-label mb-3">● Open lines</p>
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

      <div className="border-t rule bg-paper-deep/40">
        <div className="shell py-5 grid grid-cols-2 md:grid-cols-4">
          {figures.map((f, i) => (
            <div key={f.k}
                 className={`flex items-baseline gap-3 px-3 py-3 md:py-2 ${
                   i === 0 ? "" : "md:border-l rule-soft"
                 } ${i >= 2 ? "border-t rule-soft md:border-t-0" : ""} ${
                   i === 1 || i === 3 ? "border-l rule-soft" : ""
                 }`}>
              <span className="font-display text-[28px] leading-none tabular-nums font-bold"
                    style={{ color: "hsl(var(--accent))" }}>{f.v}</span>
              <span className="flex flex-col leading-tight min-w-0">
                <span className="font-display text-[10px] uppercase tracking-[0.22em] truncate font-bold"
                      style={{ color: "hsl(var(--ink))" }}>{f.k}</span>
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
