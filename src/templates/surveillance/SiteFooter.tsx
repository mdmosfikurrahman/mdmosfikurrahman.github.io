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
    <footer className="border-t rule mt-24 relative">
      {/* Status strip */}
      <div className="border-b rule-soft">
        <div className="shell py-2 flex items-center justify-between gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] flex-wrap"
             style={{ color: "hsl(var(--muted))" }}>
          <span className="flex items-center gap-2">
            <span className="blink-dot pos" />
            <span style={{ color: "hsl(var(--accent))" }}>UPLINK STABLE</span>
            <span className="opacity-50 hidden sm:inline">//</span>
            <span className="hidden sm:inline">42.0 KB/s</span>
          </span>
          <span style={{ color: "hsl(var(--accent))" }}>// END OF FEED</span>
          <span className="hidden md:inline">CHECKSUM 0xA17F·B821·19E2</span>
        </div>
      </div>

      <div className="shell py-12 grid gap-10 md:grid-cols-12 items-start">
        <div className="md:col-span-6">
          <p className="font-display text-xl md:text-2xl leading-[1.2] tracking-tight text-balance uppercase"
             style={{ color: "hsl(var(--ink))" }}>
            <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
            WRITING SYSTEMS THAT FEEL QUIET<br />
            IN PRODUCTION<span className="caret" />
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
                    className="w-10 h-10 grid place-items-center border rule hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
                  >
                    <Icon size={16} strokeWidth={1.6} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <nav className="md:col-span-3 text-sm">
          <p className="mg-label mb-3">[ INDEX ]</p>
          <ul className="space-y-1.5 font-mono text-[12px] uppercase tracking-[0.16em]">
            <li><Link className="a" to="/">00 · Index</Link></li>
            <li><Link className="a" to="/experience">01 · Field Log</Link></li>
            <li><Link className="a" to="/publications">02 · Archive</Link></li>
            <li><Link className="a" to="/about">03 · Dossier</Link></li>
            <li><Link className="a" to="/play">04 · Sandbox</Link></li>
            <li>
              <a className="a inline-flex items-center gap-1" href={CV_URL} target="_blank" rel="noreferrer">
                05 · Curriculum Vitae <ArrowUpRight size={12} strokeWidth={1.6} />
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3 text-sm md:text-right space-y-3">
          <button
            onClick={toTop}
            className="inline-flex items-center gap-2 border rule px-3 py-2 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp size={14} strokeWidth={1.6} />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em]">RETURN TO TOP</span>
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] md:text-right"
             style={{ color: "hsl(var(--muted))" }}>
            <span style={{ color: "hsl(var(--accent))" }}>GPS </span>
            23.81°N · 90.41°E
          </p>
        </div>
      </div>

      <div className="border-t rule-soft">
        <div className="shell py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]"
             style={{ color: "hsl(var(--muted))" }}>
          <span>© {year} · MD. MOSFIKUR RAHMAN</span>
          <span style={{ color: "hsl(var(--accent))" }}>DHAKA / BANGLADESH</span>
        </div>
      </div>
    </footer>
  );
}
