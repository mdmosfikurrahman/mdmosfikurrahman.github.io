import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, GraduationCap, FileText, ArrowUp } from "lucide-react";
import { profile } from "@/lib/content";

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
    <footer className="border-t rule-soft">
      <div className="mx-auto w-full max-w-[1080px] px-6 sm:px-8 md:px-10 py-10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-display text-[16px] tracking-tight" style={{ color: "hsl(var(--ink))" }}>
            {profile.name}
          </p>
          <p className="mt-1 text-[12.5px]" style={{ color: "hsl(var(--muted))" }}>
            {profile.role} · © {year}
          </p>
        </div>

        <ul className="flex items-center gap-2">
          {icons.map(({ Icon, href, label }) => {
            const external = href.startsWith("http");
            return (
              <li key={label}>
                <a href={href} target={external ? "_blank" : undefined}
                   rel={external ? "noreferrer" : undefined} aria-label={label} title={label}
                   className="w-9 h-9 grid place-items-center transition-colors"
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
                   }}>
                  <Icon size={15} strokeWidth={1.7} />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-6 text-[13px]">
          <Link className="a" to="/experience">Work</Link>
          <Link className="a" to="/publications">Writing</Link>
          <Link className="a" to="/guestbook">Guestbook</Link>
          <Link className="a" to="/ask">Ask</Link>
          <button onClick={toTop}
                  className="inline-flex items-center gap-2 px-3 py-2 text-[13px] transition-colors"
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
                  aria-label="Back to first slide">
            <ArrowUp size={13} strokeWidth={1.7} />
            <span>First slide</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
