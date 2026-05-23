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
    { Icon: FileText, href: profile.cvUrl, label: "Curriculum Vitae" },
  ];

  return (
    <footer className="border-t rule mt-24">
      <div className="shell py-12 grid gap-10 md:grid-cols-12 items-start">
        <div className="md:col-span-6">
          <p className="font-display text-2xl md:text-3xl leading-[1.1] tracking-tight text-balance">
            Writing systems that feel quiet in production.
          </p>
          <ul className="mt-6 flex items-center gap-2">
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
                    className="w-10 h-10 grid place-items-center border rule hover:bg-ink hover:text-paper transition-colors"
                  >
                    <Icon size={16} strokeWidth={1.6} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <nav className="md:col-span-3 text-sm">
          <p className="mg-label mb-3">Pages</p>
          <ul className="space-y-1.5">
            <li><Link className="a" to="/">Index</Link></li>
            <li><Link className="a" to="/experience">Experience</Link></li>
            <li><Link className="a" to="/publications">Publications</Link></li>
            <li><Link className="a" to="/about">About</Link></li>
            <li><Link className="a" to="/play">Play</Link></li>
            <li><Link className="a" to="/guestbook">Guestbook</Link></li>
            <li><Link className="a" to="/ask">Ask</Link></li>
            <li>
              <a className="a inline-flex items-center gap-1" href={CV_URL} target="_blank" rel="noreferrer">
                Curriculum Vitae <ArrowUpRight size={12} strokeWidth={1.6} />
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3 text-sm md:text-right">
          <button
            onClick={toTop}
            className="inline-flex items-center gap-2 border rule px-3 py-2 hover:bg-ink hover:text-paper transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp size={14} strokeWidth={1.6} />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Top</span>
          </button>
        </div>
      </div>

      <div className="border-t rule-soft">
        <div className="shell py-4 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
          <span>© {year} Md. Mosfikur Rahman</span>
          <span>Dhaka · Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
