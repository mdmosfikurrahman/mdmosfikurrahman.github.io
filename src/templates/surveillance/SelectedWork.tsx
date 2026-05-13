import { projects } from "@/lib/content";
import { Link } from "react-router-dom";

export default function SelectedWork() {
  return (
    <section id="work" className="border-b rule-soft">
      <div className="shell py-16 md:py-24">
        <div className="mg">
          <div>
            <p className="sig">RECORD 02 / OPERATIONS</p>
            <h2 className="font-display text-2xl md:text-3xl mt-2 tracking-tight uppercase">
              Selected work
            </h2>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] max-w-[14rem] leading-relaxed"
               style={{ color: "hsl(var(--muted))" }}>
              <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
              short list, ordered by what would land on the cover of a brief.
            </p>
            <Link to="/experience" className="a-arrow text-sm mt-5 inline-block">
              [ FULL LOG ] <span className="arw">→</span>
            </Link>
          </div>

          <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
            {projects.map((p, i) => (
              <li
                key={p.name}
                className="group grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-x-4 md:gap-x-8 gap-y-2 py-6 md:py-7 items-baseline"
              >
                <span className="font-mono text-[11px] pt-[3px]"
                      style={{ color: "hsl(var(--accent))" }}>
                  [{String(i + 1).padStart(2, "0")}]
                </span>

                <div className="min-w-0 md:order-none">
                  <p className="md:hidden font-mono text-[11px] mb-1"
                     style={{ color: "hsl(var(--muted))" }}>
                    {p.year}
                  </p>
                  <h3 className="font-display text-xl md:text-2xl leading-tight tracking-tight flex items-baseline flex-wrap gap-x-3 gap-y-1 uppercase">
                    {p.href ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors group-hover:text-[hsl(var(--accent))]"
                      >
                        {p.name}
                      </a>
                    ) : (
                      <span className="transition-colors group-hover:text-[hsl(var(--accent))]">
                        {p.name}
                      </span>
                    )}
                    {p.flagship && (
                      <span className="pill solid translate-y-[-2px]">FLAGSHIP</span>
                    )}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em]"
                     style={{ color: "hsl(var(--muted))" }}>
                    <span style={{ color: "hsl(var(--accent))" }}>SITE </span>
                    {p.at} · {p.role}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-pretty max-w-prose"
                     style={{ color: "hsl(var(--ink-soft))" }}>
                    <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>{p.blurb}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li key={t} className="pill muted">{t}</li>
                    ))}
                  </ul>
                </div>

                <span className="hidden md:inline font-mono text-[11px] pt-[3px] whitespace-nowrap"
                      style={{ color: "hsl(var(--muted))" }}>
                  {p.year}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
