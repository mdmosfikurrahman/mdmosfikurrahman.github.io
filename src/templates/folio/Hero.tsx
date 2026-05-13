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
    <section id="top" className="relative">
      <div className="mx-auto w-full max-w-[960px] px-5 sm:px-6 md:px-8 pt-16 md:pt-20 pb-12">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          <div className="col-span-12 md:col-span-8">
            <p className="text-[13px] font-medium" style={{ color: "hsl(var(--accent))" }}>
              {profile.role}
            </p>

            <h1 className="mt-3 font-display text-[clamp(2.25rem,5.4vw,3.5rem)] leading-[1.08] tracking-[-0.025em]"
                style={{ color: "hsl(var(--ink))" }}>
              {profile.name}
            </h1>

            <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              {profile.tagline}
            </p>

            <div className="mt-8 space-y-4 max-w-[64ch] text-[15.5px] leading-[1.7]"
                 style={{ color: "hsl(var(--ink-soft))" }}>
              <p>{preamble[1]}</p>
              <p>{preamble[2]}</p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
              <Link to="/experience" className="a-arrow inline-flex items-center gap-1.5">
                Experience <span aria-hidden>→</span>
              </Link>
              <Link to="/publications" className="a-arrow inline-flex items-center gap-1.5">
                Publications <span aria-hidden>→</span>
              </Link>
              <Link to="/about" className="a-arrow inline-flex items-center gap-1.5">
                About <span aria-hidden>→</span>
              </Link>
              <a href={`mailto:${profile.email}`} className="a-arrow inline-flex items-center gap-1.5">
                Email <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4">
            <figure className="mx-auto md:mx-0 w-[220px] md:w-full max-w-[240px]">
              <div className="overflow-hidden"
                   style={{ border: "1px solid hsl(var(--rule))", borderRadius: "8px" }}>
                <img src={avatar} alt={`Portrait of ${profile.name}`}
                     className="w-full h-auto block" loading="eager" />
              </div>
              <figcaption className="mt-3 text-[13px]" style={{ color: "hsl(var(--muted))" }}>
                {profile.name} <br />
                {profile.roleLong}
              </figcaption>
            </figure>

            <div className="mt-7">
              <p className="mg-label mb-2.5">Get in touch</p>
              <ul className="flex items-center gap-1.5 flex-wrap">
                {channels.map(({ Icon, href, label, external }) => (
                  <li key={label}>
                    <a href={href} target={external ? "_blank" : undefined}
                       rel={external ? "noreferrer" : undefined}
                       aria-label={label} title={label}
                       className="w-9 h-9 grid place-items-center transition-colors"
                       style={{
                         border: "1px solid hsl(var(--rule))",
                         borderRadius: "6px",
                         color: "hsl(var(--ink-soft))",
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.borderColor = "hsl(var(--accent))";
                         e.currentTarget.style.color = "hsl(var(--accent))";
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.borderColor = "hsl(var(--rule))";
                         e.currentTarget.style.color = "hsl(var(--ink-soft))";
                       }}>
                      <Icon size={15} strokeWidth={1.7} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Stats — quiet row */}
        <div className="mt-14 md:mt-16 pt-8 border-t rule-soft grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-7">
          {figures.map((f) => (
            <div key={f.k}>
              <div className="text-[26px] md:text-[30px] font-semibold tracking-tight tabular-nums"
                   style={{ color: "hsl(var(--ink))" }}>
                {f.v}
              </div>
              <div className="mt-0.5 text-[13px] font-medium"
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
