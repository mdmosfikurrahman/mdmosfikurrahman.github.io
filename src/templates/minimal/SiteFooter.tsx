import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, GraduationCap, FileText, ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/content";

const CV_URL = "https://mdmosfikurrahman.github.io/resume/";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const icons = [
    { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
    { Icon: Github, href: profile.links.github, label: "GitHub" },
    { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn" },
    { Icon: GraduationCap, href: profile.links.scholar, label: "Scholar" },
    { Icon: FileText, href: profile.cvUrl, label: "CV" },
  ];

  return (
    <footer className="border-t rule-soft mt-12">
      <div className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 py-12 grid gap-10 md:grid-cols-12 items-start">
        <div className="md:col-span-6">
          <p className="font-display text-[18px] md:text-[20px] leading-[1.3] tracking-tight max-w-[34ch]"
             style={{ color: "hsl(var(--ink))" }}>
            Writing systems that feel quiet in production.
          </p>
          <ul className="mt-5 flex items-center gap-1.5">
            {icons.map(({ Icon, href, label }) => {
              const external = href.startsWith("http");
              return (
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
              );
            })}
          </ul>
        </div>

        <nav className="md:col-span-3 text-[14px]">
          <p className="mg-label mb-3">Pages</p>
          <ul className="space-y-1.5">
            <li><Link className="a" to="/">Home</Link></li>
            <li><Link className="a" to="/experience">Work</Link></li>
            <li><Link className="a" to="/publications">Writing</Link></li>
            <li><Link className="a" to="/about">About</Link></li>
            <li><Link className="a" to="/play">Play</Link></li>
            <li>
              <a className="a inline-flex items-center gap-1" href={CV_URL} target="_blank" rel="noreferrer">
                Curriculum Vitae <ArrowUpRight size={11} strokeWidth={1.8} />
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3 md:text-right">
          <button
            onClick={toTop}
            className="inline-flex items-center gap-2 px-3 py-2 text-[13px] transition-colors"
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
            aria-label="Scroll to top"
          >
            <ArrowUp size={13} strokeWidth={1.7} />
            <span>Back to top</span>
          </button>
        </div>
      </div>

      <div className="border-t rule-soft">
        <div className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 py-4 flex items-center justify-between text-[12.5px]"
             style={{ color: "hsl(var(--muted))" }}>
          <span>© {year} Md. Mosfikur Rahman</span>
          <span>Dhaka, Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
