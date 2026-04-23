import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, GraduationCap, FileText } from "lucide-react";
import { profile, preamble, figures } from "@/lib/content";

const avatar = "/profile-avatar.png";

type Channel = {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  href: string;
  label: string;
  external?: boolean;
};

const channels: Channel[] = [
  { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
  { Icon: Github, href: profile.links.github, label: "GitHub", external: true },
  { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn", external: true },
  { Icon: GraduationCap, href: profile.links.scholar, label: "Google Scholar", external: true },
  { Icon: FileText, href: profile.cvUrl, label: "Curriculum Vitae", external: true },
];

export default function Hero() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section id="top" className="relative overflow-hidden border-b rule">
      {/* Masthead */}
      <div className="border-b rule-soft">
        <div className="shell py-3 flex items-center justify-between gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="truncate">{today}</span>
          <span className="hidden sm:inline truncate">Dhaka · Bangladesh</span>
          <span className="truncate">Writing since 2017</span>
        </div>
      </div>

      <div className="halftone-faint absolute inset-0 opacity-50 pointer-events-none" aria-hidden />

      <div className="shell relative pt-10 md:pt-16 pb-12 md:pb-16">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {/* Left column */}
          <div className="col-span-12 md:col-span-8">
            <div className="mb-5 flex items-center gap-3" aria-hidden>
              <span className="inline-block w-10 h-px bg-accent" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            </div>

            <h1 className="font-display leading-[1.02] tracking-[-0.03em] text-[clamp(2rem,5.8vw,4.25rem)] text-balance">
              Engineer <span className="italic font-light text-muted-foreground">by craft.</span>
              <br />
              Researcher <span className="italic font-light text-muted-foreground">by rigor.</span>
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-accent">Architect</span>
                <svg
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-1.5 w-full h-[12px] text-accent/70"
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9 C 60 2, 120 13, 180 6 S 290 3, 298 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              <span className="italic font-light text-muted-foreground">by design.</span>
            </h1>

            <div className="mt-9 max-w-[58ch] font-serif-body text-[1.05rem] md:text-[1.125rem] leading-[1.65] text-ink-soft space-y-4">
              <p className="text-pretty">
                <span className="float-left font-display text-[4rem] leading-[0.82] pr-3 pt-[6px] pb-1 text-accent">
                  I
                </span>
                {preamble[0].slice(2)}
              </p>
              <p className="text-pretty">{preamble[1]}</p>
              <p className="text-pretty">{preamble[2]}</p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <Link to="/experience" className="a-arrow">
                Experience <span className="arw">→</span>
              </Link>
              <Link to="/publications" className="a-arrow">
                Publications <span className="arw">→</span>
              </Link>
              <Link to="/about" className="a-arrow">
                About <span className="arw">→</span>
              </Link>
              <a className="a-arrow" href={`mailto:${profile.email}`}>
                Write <span className="arw">→</span>
              </a>
            </div>
          </div>

          {/* Right column: portrait + channels */}
          <aside className="col-span-12 md:col-span-4 flex flex-col">
            <figure className="relative mx-auto md:mx-0 w-[220px] md:w-full max-w-[280px]">
              <div className="absolute -inset-2 border rule rotate-[-3deg] bg-paper-deep/50" aria-hidden />
              <div className="relative overflow-hidden border rule bg-paper-deep shadow-[0_1px_0_hsl(var(--ink)/0.04),0_12px_28px_-18px_hsl(var(--ink)/0.35)]">
                <img
                  src={avatar}
                  alt="Portrait of Md. Mosfikur Rahman"
                  className="w-full h-auto block"
                  style={{
                    filter:
                      "sepia(0.38) saturate(0.82) contrast(0.92) brightness(0.98) hue-rotate(-4deg)",
                  }}
                  loading="eager"
                />
                <span
                  className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(110,70,40,0.12) 0%, rgba(110,70,40,0) 45%, rgba(30,20,10,0.18) 100%)",
                  }}
                  aria-hidden
                />
                <span className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-ink/25 to-transparent pointer-events-none" aria-hidden />
                <span className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-[0.22em] text-paper bg-ink/80 px-1.5 py-0.5">
                  Fig. 01
                </span>
              </div>
              <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-relaxed">
                {profile.name} <br />
                {profile.role}
              </figcaption>
            </figure>

            <div className="mt-8 pt-5 border-t rule-soft">
              <p className="mg-label mb-3">Channels</p>
              <ul className="flex items-center gap-2 flex-wrap">
                {channels.map(({ Icon, href, label, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      aria-label={label}
                      title={label}
                      className="w-10 h-10 grid place-items-center border rule hover:bg-ink hover:text-paper transition-colors"
                    >
                      <Icon size={16} strokeWidth={1.6} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Figure ribbon */}
      <div className="border-t rule bg-paper-deep/50">
        <div className="shell py-4 md:py-5 grid grid-cols-2 md:grid-cols-4">
          {figures.map((f, i) => {
            const mobileBorders = [
              "",
              "border-l rule-soft",
              "border-t rule-soft",
              "border-l border-t rule-soft",
            ][i];
            const desktopBorders = i === 0 ? "md:border-l-0 md:border-t-0" : "md:border-l rule-soft md:border-t-0";
            return (
              <div
                key={f.k}
                className={[
                  "flex items-baseline gap-3 px-3 sm:px-4 py-3 md:py-2",
                  mobileBorders,
                  desktopBorders,
                ].join(" ")}
              >
                <span className="font-display text-2xl sm:text-3xl md:text-[2.25rem] leading-none tabular-nums whitespace-nowrap">
                  {f.v}
                </span>
                <span className="flex flex-col leading-tight min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">
                    {f.k}
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-ink-soft truncate">{f.note}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
