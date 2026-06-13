import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, GraduationCap, FileText, type LucideIcon } from "lucide-react";
import { profile, preamble, figures } from "@/lib/content";
import { useCvUrl } from "@/lib/settings";

const avatar = "/profile-avatar.png";

export default function Hero() {
  const cvUrl = useCvUrl();
  const channels: { Icon: LucideIcon; href: string; label: string; external?: boolean }[] = [
    { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
    { Icon: Github, href: profile.links.github, label: "GitHub", external: true },
    { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn", external: true },
    { Icon: GraduationCap, href: profile.links.scholar, label: "Scholar", external: true },
    { Icon: FileText, href: cvUrl, label: "CV", external: true },
  ];
  return (
    <section id="top" className="relative border-b rule">
      {/* Tournament bulletin strip */}
      <div className="border-b rule-soft">
        <div className="shell py-2 flex items-center justify-between gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.04em] flex-wrap"
             style={{ color: "hsl(var(--muted))" }}>
          <span><span style={{ color: "hsl(var(--accent))" }}>Round 1</span> · Board 1 · White to move</span>
          <span>FEN: rnbqkbnr/.../RNBQKBNR</span>
          <span>Elo · 1872</span>
        </div>
      </div>

      <div className="shell relative pt-12 md:pt-20 pb-16 squares-bg">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10 relative">
          <div className="col-span-12 md:col-span-8">
            <p className="sig">1.e4 · Opening · Dhaka</p>

            <h1 className="mt-4 font-display text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[1.05] tracking-[-0.015em]"
                style={{ color: "hsl(var(--ink))" }}>
              {profile.name}
            </h1>
            <p className="mt-3 font-display italic text-[20px] md:text-[22px]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              Engineer, researcher, architect — playing the long game.
            </p>

            <div className="mt-9 space-y-4 max-w-[62ch] text-[17px] leading-[1.65]"
                 style={{ color: "hsl(var(--ink-soft))" }}>
              <p>{preamble[0]}</p>
              <p>{preamble[1]}</p>
              <p>{preamble[2]}</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
              <Link to="/experience" className="a-arrow inline-flex items-baseline gap-1.5">
                <span className="font-mono text-[12px]" style={{ color: "hsl(var(--accent))" }}>Nf3</span>
                <span className="font-display">Middlegame</span><span aria-hidden>→</span>
              </Link>
              <Link to="/publications" className="a-arrow inline-flex items-baseline gap-1.5">
                <span className="font-mono text-[12px]" style={{ color: "hsl(var(--accent))" }}>Bg5</span>
                <span className="font-display">Analysis</span><span aria-hidden>→</span>
              </Link>
              <Link to="/about" className="a-arrow inline-flex items-baseline gap-1.5">
                <span className="font-mono text-[12px]" style={{ color: "hsl(var(--accent))" }}>Qd4</span>
                <span className="font-display">Player</span><span aria-hidden>→</span>
              </Link>
              <a href={`mailto:${profile.email}`} className="a-arrow inline-flex items-baseline gap-1.5">
                <span className="font-mono text-[12px]" style={{ color: "hsl(var(--accent))" }}>0-0</span>
                <span className="font-display">Correspond</span><span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4">
            <figure className="mx-auto md:mx-0 w-[220px] md:w-full max-w-[280px]">
              <div style={{ border: "1px solid hsl(var(--ink))" }}>
                <img src={avatar} alt={`Portrait of ${profile.name}`}
                     className="w-full h-auto block grayscale" loading="eager" />
              </div>
              <figcaption className="mt-3 font-mono text-[11.5px] leading-relaxed"
                          style={{ color: "hsl(var(--muted))" }}>
                <span style={{ color: "hsl(var(--accent))" }}>W:</span> Md. Mosfikur Rahman <br />
                <span style={{ color: "hsl(var(--accent))" }}>title:</span> backend architect
              </figcaption>
            </figure>

            <div className="mt-7 pt-5 border-t rule-soft">
              <p className="mg-label mb-3">Notation</p>
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

      {/* Stats — score-card style */}
      <div className="border-t rule bg-paper-deep/30">
        <div className="shell py-5 grid grid-cols-2 md:grid-cols-4">
          {figures.map((f, i) => (
            <div key={f.k}
                 className={`flex items-baseline gap-3 px-3 py-3 md:py-2 ${
                   i === 0 ? "" : "md:border-l rule-soft"
                 } ${i >= 2 ? "border-t rule-soft md:border-t-0" : ""} ${
                   i === 1 || i === 3 ? "border-l rule-soft" : ""
                 }`}>
              <span className="font-display text-[30px] leading-none tabular-nums"
                    style={{ color: "hsl(var(--ink))" }}>{f.v}</span>
              <span className="flex flex-col leading-tight min-w-0">
                <span className="font-mono text-[11px] truncate"
                      style={{ color: "hsl(var(--accent))" }}>{f.k}</span>
                <span className="font-display italic text-[13px] truncate"
                      style={{ color: "hsl(var(--muted))" }}>{f.note}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
