import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, GraduationCap, FileText, type LucideIcon } from "lucide-react";
import { profile, preamble, figures } from "@/lib/content";
import { useCvUrl, useCvLabel } from "@/lib/settings";
import { localIsoLocal, localTzLabel } from "@/lib/clock";

const avatar = "/profile-avatar.png";

type Channel = {
  Icon: LucideIcon;
  href: string;
  label: string;
  external?: boolean;
};

export default function Hero() {
  const cvUrl = useCvUrl();
  const cvLabel = useCvLabel();
  const channels: Channel[] = [
    { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
    { Icon: Github, href: profile.links.github, label: "GitHub", external: true },
    { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn", external: true },
    { Icon: GraduationCap, href: profile.links.scholar, label: "Google Scholar", external: true },
    { Icon: FileText, href: cvUrl, label: cvLabel, external: true },
  ];
  const now = new Date();
  const today = `${localIsoLocal(now)} ${localTzLabel(now)}`;
  const serial = "0xA17F-7321-DHK";

  return (
    <section id="top" className="relative overflow-hidden border-b rule">
      {/* Surveillance metadata strip */}
      <div className="border-b rule-soft">
        <div className="shell py-2 flex items-center justify-between gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] flex-wrap"
             style={{ color: "hsl(var(--muted))" }}>
          <span className="flex items-center gap-2">
            <span className="blink-dot pos" />
            <span style={{ color: "hsl(var(--accent))" }}>FEED 14221</span>
            <span className="opacity-50">//</span>
            <span>CHANNEL A</span>
          </span>
          <span className="hidden sm:inline">SERIAL {serial}</span>
          <span className="truncate" style={{ color: "hsl(var(--ink))" }}>{today}</span>
        </div>
      </div>

      <div className="halftone absolute inset-0 opacity-100 pointer-events-none" aria-hidden />

      <div className="shell relative pt-10 md:pt-16 pb-12 md:pb-16">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {/* Left column */}
          <div className="col-span-12 md:col-span-8">
            {/* CLASSIFICATION row */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="pill solid">SUBJECT IDENTIFIED</span>
              <span className="pill">ASSET</span>
              <span className="pill muted">NON-THREAT</span>
            </div>

            <h1 className="font-display leading-[1.04] tracking-[-0.025em] text-[clamp(1.9rem,5.2vw,3.75rem)] text-balance">
              <span className="block text-[hsl(var(--ink))] text-glow">
                MD. MOSFIKUR
              </span>
              <span className="block text-[hsl(var(--ink))] text-glow">
                RAHMAN<span className="caret" />
              </span>
              <span className="mt-2 block font-mono text-[12px] md:text-[13px] tracking-[0.22em] uppercase font-normal"
                    style={{ color: "hsl(var(--muted))" }}>
                <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
                ENGINEER · BY CRAFT // RESEARCHER · BY RIGOR //{" "}
                <span style={{ color: "hsl(var(--accent))" }}>ARCHITECT · BY DESIGN</span>
              </span>
            </h1>

            {/* Surveillance facts grid */}
            <dl className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 max-w-2xl font-mono text-[10px] uppercase tracking-[0.18em]">
              <div>
                <dt style={{ color: "hsl(var(--accent))" }}>STATUS</dt>
                <dd className="mt-0.5" style={{ color: "hsl(var(--ink))" }}>ONLINE</dd>
              </div>
              <div>
                <dt style={{ color: "hsl(var(--accent))" }}>ORIGIN</dt>
                <dd className="mt-0.5" style={{ color: "hsl(var(--ink))" }}>DHAKA, BD</dd>
              </div>
              <div>
                <dt style={{ color: "hsl(var(--accent))" }}>COORDS</dt>
                <dd className="mt-0.5" style={{ color: "hsl(var(--ink))" }}>23.81°N 90.41°E</dd>
              </div>
              <div>
                <dt style={{ color: "hsl(var(--accent))" }}>ASSET ID</dt>
                <dd className="mt-0.5" style={{ color: "hsl(var(--ink))" }}>{serial}</dd>
              </div>
            </dl>

            <div className="mt-9 max-w-[62ch] text-[14px] md:text-[14.5px] leading-[1.7] space-y-4"
                 style={{ color: "hsl(var(--ink-soft))" }}>
              <p className="text-pretty">
                <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
                {preamble[0]}
              </p>
              <p className="text-pretty">
                <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
                {preamble[1]}
              </p>
              <p className="text-pretty">
                <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
                {preamble[2]}
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link to="/experience" className="a-arrow">
                <span style={{ color: "hsl(var(--accent))" }}>[01]</span> Field Log <span className="arw">→</span>
              </Link>
              <Link to="/publications" className="a-arrow">
                <span style={{ color: "hsl(var(--accent))" }}>[02]</span> Archive <span className="arw">→</span>
              </Link>
              <Link to="/about" className="a-arrow">
                <span style={{ color: "hsl(var(--accent))" }}>[03]</span> Dossier <span className="arw">→</span>
              </Link>
              <a className="a-arrow" href={`mailto:${profile.email}`}>
                <span style={{ color: "hsl(var(--accent))" }}>[04]</span> Open Channel <span className="arw">→</span>
              </a>
            </div>
          </div>

          {/* Right column: tracked portrait + channels */}
          <aside className="col-span-12 md:col-span-4 flex flex-col">
            <figure className="relative mx-auto md:mx-0 w-[220px] md:w-full max-w-[280px]">
              {/* Tracking bracket corners — Machine-style */}
              <CornerBracket className="absolute -top-2.5 -left-2.5" pos="tl" />
              <CornerBracket className="absolute -top-2.5 -right-2.5" pos="tr" />
              <CornerBracket className="absolute -bottom-2.5 -left-2.5" pos="bl" />
              <CornerBracket className="absolute -bottom-2.5 -right-2.5" pos="br" />

              <div className="relative overflow-hidden border rule bg-paper-deep">
                <img
                  src={avatar}
                  alt="Surveillance still of Md. Mosfikur Rahman"
                  className="w-full h-auto block"
                  style={{
                    filter:
                      "grayscale(0.2) contrast(1.05) brightness(0.95) saturate(0.85)",
                  }}
                  loading="eager"
                />
                {/* Scanline overlay on portrait */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, hsl(var(--ink) / 0.18) 0 1px, transparent 1px 3px)",
                    mixBlendMode: "multiply",
                  }}
                  aria-hidden
                />
                {/* HUD overlays on portrait */}
                <span className="absolute top-2 left-2 font-mono text-[8.5px] uppercase tracking-[0.22em] px-1.5 py-0.5"
                      style={{
                        background: "hsl(var(--accent))",
                        color: "hsl(var(--paper))",
                      }}>
                  ASSET 0x01
                </span>
                <span className="absolute top-2 right-2 font-mono text-[8.5px] uppercase tracking-[0.22em] flex items-center gap-1"
                      style={{ color: "hsl(var(--paper))" }}>
                  <span className="blink-dot pos" />
                  REC
                </span>
                <span className="absolute bottom-2 left-2 font-mono text-[8.5px] uppercase tracking-[0.2em]"
                      style={{ color: "hsl(var(--paper))" }}>
                  CAM 04 · UTTARA
                </span>
                <span className="absolute bottom-2 right-2 font-mono text-[8.5px] uppercase tracking-[0.2em]"
                      style={{ color: "hsl(var(--paper))" }}>
                  ZOOM 1.0×
                </span>
              </div>
              <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] leading-relaxed"
                          style={{ color: "hsl(var(--muted))" }}>
                <span style={{ color: "hsl(var(--accent))" }}>NAME </span>{profile.name} <br />
                <span style={{ color: "hsl(var(--accent))" }}>ROLE </span>{profile.role}
              </figcaption>
            </figure>

            <div className="mt-8 pt-5 border-t rule-soft">
              <p className="mg-label mb-3">[ CHANNELS ]</p>
              <ul className="flex items-center gap-2 flex-wrap">
                {channels.map(({ Icon, href, label, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      aria-label={label}
                      title={label}
                      className="w-10 h-10 grid place-items-center border rule hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
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

      {/* Stats ribbon */}
      <div className="border-t rule bg-paper-deep/50">
        <div className="shell py-4 md:py-5 grid grid-cols-2 md:grid-cols-4">
          {figures.map((f, i) => {
            const mobileBorders = [
              "",
              "border-l rule-soft",
              "border-t rule-soft",
              "border-l border-t rule-soft",
            ][i];
            const desktopBorders =
              i === 0 ? "md:border-l-0 md:border-t-0" : "md:border-l rule-soft md:border-t-0";
            return (
              <div
                key={f.k}
                className={[
                  "flex items-baseline gap-3 px-3 sm:px-4 py-3 md:py-2",
                  mobileBorders,
                  desktopBorders,
                ].join(" ")}
              >
                <span className="font-mono text-2xl sm:text-3xl md:text-[2rem] leading-none tabular-nums whitespace-nowrap font-bold"
                      style={{ color: "hsl(var(--ink))" }}>
                  {f.v}
                </span>
                <span className="flex flex-col leading-tight min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] truncate"
                        style={{ color: "hsl(var(--accent))" }}>
                    {f.k}
                  </span>
                  <span className="font-mono text-[10.5px] sm:text-[11px] truncate"
                        style={{ color: "hsl(var(--muted))" }}>
                    {f.note}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CornerBracket({ className = "", pos }: { className?: string; pos: "tl" | "tr" | "bl" | "br" }) {
  const sides =
    pos === "tl" ? "border-l-2 border-t-2"
    : pos === "tr" ? "border-r-2 border-t-2"
    : pos === "bl" ? "border-l-2 border-b-2"
    : "border-r-2 border-b-2";
  return (
    <span
      aria-hidden
      className={`block w-4 h-4 z-10 ${sides} ${className}`}
      style={{ borderColor: "hsl(var(--accent))" }}
    />
  );
}
