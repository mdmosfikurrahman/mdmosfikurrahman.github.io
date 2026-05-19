import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, GraduationCap, FileText, ArrowRight, type LucideIcon } from "lucide-react";
import { profile, preamble, figures } from "@/lib/content";

const avatar = "/profile-avatar.png";

type Channel = { Icon: LucideIcon; href: string; label: string; external?: boolean };

const channels: Channel[] = [
  { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
  { Icon: Github, href: profile.links.github, label: "GitHub", external: true },
  { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn", external: true },
  { Icon: GraduationCap, href: profile.links.scholar, label: "Scholar", external: true },
  { Icon: FileText, href: profile.cvUrl, label: "CV", external: true },
];

export default function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <section id="top" className="slide">
      <div className="kn-glow" aria-hidden />
      <span className="kn-ghost" aria-hidden>01</span>

      <div className="relative mx-auto w-full max-w-[1120px] px-6 sm:px-10 py-28">
        <div className="flex items-center justify-between">
          <p className="sig">Title</p>
          <span className="kn-step"><b>01</b> / 06</span>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-x-14 gap-y-12 items-center">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[14px] font-semibold tracking-tight"
               style={{ color: "hsl(var(--accent))" }}>
              {profile.role}
            </p>

            <h1 className="mt-5 font-display leading-[0.95] tracking-[-0.045em]
                           text-[clamp(3rem,9vw,6.5rem)]"
                style={{ color: "hsl(var(--ink))" }}>
              {first}{" "}
              <span className="kn-mark">{rest.join(" ")}</span>
            </h1>

            <p className="mt-8 max-w-[56ch] text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.55]"
               style={{ color: "hsl(var(--ink-soft))" }}>
              {preamble[0]}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/experience"
                    className="group inline-flex items-center gap-2 px-5 py-3 text-[15px] font-semibold rounded-full transition-all"
                    style={{ background: "hsl(var(--accent))", color: "hsl(var(--paper))" }}>
                Walk through the work
                <ArrowRight size={16} strokeWidth={2.2}
                            className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href={`mailto:${profile.email}`}
                 className="inline-flex items-center gap-2 px-5 py-3 text-[15px] font-semibold rounded-full transition-colors"
                 style={{ border: "1px solid hsl(var(--rule))", color: "hsl(var(--ink))" }}>
                Contact
              </a>
            </div>

            <ul className="mt-9 flex items-center gap-2 flex-wrap">
              {channels.map(({ Icon, href, label, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="kn-pill inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium transition-colors"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "hsl(var(--accent))";
                      e.currentTarget.style.color = "hsl(var(--accent))";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.color = "";
                    }}
                  >
                    <Icon size={14} strokeWidth={1.8} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <aside className="col-span-12 lg:col-span-4">
            <figure className="relative mx-auto lg:mx-0 w-[230px] lg:w-full max-w-[300px]">
              <div className="absolute -inset-3 rounded-[1.75rem] -z-0"
                   style={{ background: "radial-gradient(closest-side, hsl(var(--accent) / 0.18), transparent)" }} />
              <div className="relative overflow-hidden"
                   style={{ border: "1px solid hsl(var(--rule))", borderRadius: "1.5rem" }}>
                <img src={avatar} alt="Portrait of Md. Mosfikur Rahman"
                     className="w-full h-auto block" loading="eager" />
              </div>
              <figcaption className="mt-4 text-[13px] text-center lg:text-left"
                          style={{ color: "hsl(var(--muted))" }}>
                {profile.roleLong}
              </figcaption>
            </figure>
          </aside>
        </div>

        <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
            style={{ border: "1px solid hsl(var(--rule))" }}>
          {figures.map((f, i) => (
            <div key={f.k}
                 className={[
                   "px-6 py-7",
                   i !== 0 ? "border-l-0 md:border-l" : "",
                   i >= 2 ? "border-t md:border-t-0" : "",
                   i === 1 ? "border-l" : "",
                   i === 3 ? "border-l" : "",
                 ].join(" ")}
                 style={{ borderColor: "hsl(var(--rule))" }}>
              <dd className="font-display text-[clamp(2rem,3.6vw,3rem)] tracking-[-0.04em] tabular-nums"
                  style={{ color: "hsl(var(--ink))" }}>
                {f.v}
              </dd>
              <dt className="mt-1 text-[12.5px] font-semibold"
                  style={{ color: "hsl(var(--accent))" }}>
                {f.k}
              </dt>
              <p className="text-[12px]" style={{ color: "hsl(var(--muted))" }}>
                {f.note}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
