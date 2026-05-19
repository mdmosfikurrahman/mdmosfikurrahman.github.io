import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, GraduationCap, FileText, type LucideIcon } from "lucide-react";
import { profile, preamble, figures } from "@/lib/content";

const avatar = "/profile-avatar.png";

type Channel = { Icon: LucideIcon; href: string; label: string; external?: boolean };

const channels: Channel[] = [
  { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
  { Icon: Github, href: profile.links.github, label: "GitHub", external: true },
  { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn", external: true },
  { Icon: GraduationCap, href: profile.links.scholar, label: "Google Scholar", external: true },
  { Icon: FileText, href: profile.cvUrl, label: "Curriculum Vitae", external: true },
];

export default function Hero() {
  return (
    <section id="top" className="slide">
      <div className="slide-grid" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1080px] px-6 sm:px-8 md:px-10 py-24 md:py-28">
        <div className="flex items-center justify-between">
          <p className="sig">01 · Title</p>
          <p className="mg-label hidden sm:block">Interview Deck — scroll for next slide</p>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-x-12 gap-y-12 items-center">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[14px] font-semibold tracking-tight"
               style={{ color: "hsl(var(--accent))" }}>
              {profile.role}
            </p>

            <h1 className="mt-4 font-display leading-[0.98] tracking-[-0.04em]
                           text-[clamp(2.75rem,8.5vw,6rem)]"
                style={{ color: "hsl(var(--ink))" }}>
              {profile.name}
            </h1>

            <p className="mt-7 max-w-[58ch] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.55]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              {preamble[0]}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px]">
              <Link to="/experience" className="a-arrow inline-flex items-center gap-1.5">
                Walk through the work <span aria-hidden>→</span>
              </Link>
              <a className="a-arrow inline-flex items-center gap-1.5" href={`mailto:${profile.email}`}>
                Contact <span aria-hidden>→</span>
              </a>
            </div>

            <ul className="mt-9 flex items-center gap-2 flex-wrap">
              {channels.map(({ Icon, href, label, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    aria-label={label}
                    title={label}
                    className="w-10 h-10 grid place-items-center transition-colors"
                    style={{
                      border: "1px solid hsl(var(--rule))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--ink-soft))",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "hsl(var(--accent))";
                      e.currentTarget.style.color = "hsl(var(--accent))";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "hsl(var(--rule))";
                      e.currentTarget.style.color = "hsl(var(--ink-soft))";
                    }}
                  >
                    <Icon size={16} strokeWidth={1.7} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <aside className="col-span-12 lg:col-span-4">
            <figure className="mx-auto lg:mx-0 w-[220px] lg:w-full max-w-[280px]">
              <div className="overflow-hidden"
                   style={{ border: "1px solid hsl(var(--rule))", borderRadius: "calc(var(--radius) * 1.5)" }}>
                <img src={avatar} alt="Portrait of Md. Mosfikur Rahman"
                     className="w-full h-auto block" loading="eager" />
              </div>
              <figcaption className="mt-3 text-[13px] text-center lg:text-left"
                          style={{ color: "hsl(var(--muted))" }}>
                {profile.roleLong}
              </figcaption>
            </figure>
          </aside>
        </div>

        <div className="mt-14 pt-9 border-t rule-soft grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
          {figures.map((f) => (
            <div key={f.k}>
              <div className="font-display text-[clamp(1.9rem,3.4vw,2.75rem)] tracking-tight tabular-nums"
                   style={{ color: "hsl(var(--ink))" }}>
                {f.v}
              </div>
              <div className="mt-1 text-[13px] font-semibold"
                   style={{ color: "hsl(var(--accent))" }}>
                {f.k}
              </div>
              <div className="text-[12.5px]" style={{ color: "hsl(var(--muted))" }}>
                {f.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
