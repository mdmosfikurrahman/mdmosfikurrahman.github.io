import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, GraduationCap, FileText, type LucideIcon } from "lucide-react";
import { profile, preamble, figures } from "@/lib/content";
import { useCvUrl, useCvLabel, useAvatarUrl } from "@/lib/settings";

type Channel = {
  Icon: LucideIcon;
  href: string;
  label: string;
  external?: boolean;
};

export default function Hero() {
  const cvUrl = useCvUrl();
  const cvLabel = useCvLabel();
  const avatar = useAvatarUrl();
  const channels: Channel[] = [
    { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
    { Icon: Github, href: profile.links.github, label: "GitHub", external: true },
    { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn", external: true },
    { Icon: GraduationCap, href: profile.links.scholar, label: "Google Scholar", external: true },
    { Icon: FileText, href: cvUrl, label: cvLabel, external: true },
  ];
  return (
    <section id="top" className="relative">
      <div className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          {/* Left column */}
          <div className="col-span-12 md:col-span-8">
            <p className="text-[13px] font-medium" style={{ color: "hsl(var(--accent))" }}>
              Backend architect · Dhaka
            </p>

            <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] tracking-[-0.03em]"
                style={{ color: "hsl(var(--ink))" }}>
              Hi, I'm {profile.shortName}.
            </h1>

            <p className="mt-5 max-w-[58ch] text-[17px] md:text-[18px] leading-[1.65]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              I design the quiet half of software — services, schemas, and workflows
              that hold a product together once traffic shows up.
            </p>

            <div className="mt-8 space-y-5 max-w-[60ch] text-[15.5px] leading-[1.7]"
                 style={{ color: "hsl(var(--ink-soft))" }}>
              <p>{preamble[1]}</p>
              <p>{preamble[2]}</p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
              <Link to="/experience" className="a-arrow inline-flex items-center gap-1.5">
                Work <span aria-hidden>→</span>
              </Link>
              <Link to="/publications" className="a-arrow inline-flex items-center gap-1.5">
                Writing <span aria-hidden>→</span>
              </Link>
              <Link to="/about" className="a-arrow inline-flex items-center gap-1.5">
                About <span aria-hidden>→</span>
              </Link>
              <a className="a-arrow inline-flex items-center gap-1.5" href={`mailto:${profile.email}`}>
                Email <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* Right column */}
          <aside className="col-span-12 md:col-span-4">
            <figure className="mx-auto md:mx-0 w-[200px] md:w-full max-w-[240px]">
              <div
                className="overflow-hidden"
                style={{
                  border: "1px solid hsl(var(--rule))",
                  borderRadius: "12px",
                }}
              >
                <img
                  src={avatar}
                  alt="Portrait of Md. Mosfikur Rahman"
                  className="w-full h-auto block"
                  loading="eager"
                />
              </div>
              <figcaption className="mt-3 text-[13px]"
                          style={{ color: "hsl(var(--muted))" }}>
                Md. Mosfikur Rahman <br />
                Team Lead · Akij iBOS
              </figcaption>
            </figure>

            <ul className="mt-7 flex items-center gap-1.5 flex-wrap">
              {channels.map(({ Icon, href, label, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    aria-label={label}
                    title={label}
                    className="w-9 h-9 grid place-items-center transition-colors"
                    style={{
                      border: "1px solid hsl(var(--rule))",
                      borderRadius: "8px",
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
                    <Icon size={15} strokeWidth={1.7} />
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Stats */}
        <div className="mt-16 md:mt-20 pt-10 border-t rule-soft grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {figures.map((f) => (
            <div key={f.k}>
              <div className="text-[28px] md:text-[32px] font-semibold tracking-tight tabular-nums"
                   style={{ color: "hsl(var(--ink))" }}>
                {f.v}
              </div>
              <div className="mt-1 text-[13px] font-medium"
                   style={{ color: "hsl(var(--accent))" }}>
                {f.k}
              </div>
              <div className="text-[12.5px]"
                   style={{ color: "hsl(var(--muted))" }}>
                {f.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
