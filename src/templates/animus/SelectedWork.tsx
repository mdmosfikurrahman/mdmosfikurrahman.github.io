import { projects } from "@/lib/content";
import { Link } from "react-router-dom";

const NUMERALS = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];

export default function SelectedWork() {
  return (
    <section id="work" className="border-b rule-soft">
      <div className="shell py-16 md:py-20">
        <div className="mg">
          <div>
            <p className="sig">Memory II · Operations</p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl uppercase tracking-[0.02em]"
                style={{ color: "hsl(var(--ink))" }}>
              Brotherhood archives.
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed max-w-[24ch]"
               style={{ color: "hsl(var(--muted))" }}>
              Memories worth replaying first.
            </p>
            <Link to="/experience" className="a-arrow text-sm mt-5 inline-flex items-center gap-1.5 font-display tracking-[0.12em] uppercase">
              Full Codex <span aria-hidden>→</span>
            </Link>
          </div>

          <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
            {projects.map((p, i) => (
              <li key={p.name}
                  className="group grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-x-4 md:gap-x-8 gap-y-2 py-6 items-baseline">
                <span className="font-display text-[14px] pt-[2px] tracking-[0.12em]"
                      style={{ color: "hsl(var(--accent))" }}>
                  {NUMERALS[i] ?? String(i + 1)}
                </span>
                <div className="min-w-0">
                  <p className="md:hidden font-display text-[11px] uppercase tracking-[0.22em] mb-1"
                     style={{ color: "hsl(var(--muted))" }}>{p.year}</p>
                  <h3 className="font-display text-xl md:text-2xl leading-tight uppercase tracking-[0.015em] flex items-baseline flex-wrap gap-x-3">
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noreferrer"
                         className="transition-colors group-hover:text-[hsl(var(--accent))]">
                        {p.name}
                      </a>
                    ) : (
                      <span className="transition-colors group-hover:text-[hsl(var(--accent))]">{p.name}</span>
                    )}
                    {p.flagship && (
                      <span className="font-display text-[9px] uppercase tracking-[0.24em] px-1.5 py-0.5 leading-none"
                            style={{
                              border: "1px solid hsl(var(--accent))",
                              color: "hsl(var(--accent))",
                            }}>
                        ✦ Flagship
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 font-display text-[11px] uppercase tracking-[0.22em]"
                     style={{ color: "hsl(var(--muted))" }}>
                    <span style={{ color: "hsl(var(--accent))" }}>SITE · </span>
                    {p.at} · {p.role}
                  </p>
                  <p className="mt-3 text-[15px] leading-[1.65] text-pretty max-w-prose"
                     style={{ color: "hsl(var(--ink-soft))" }}>{p.blurb}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li key={t} className="px-2 py-0.5 text-[11px] font-display uppercase tracking-[0.18em]"
                          style={{ border: "1px solid hsl(var(--rule))", color: "hsl(var(--ink-soft))" }}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="hidden md:inline font-display text-[11px] uppercase tracking-[0.22em] pt-[3px]"
                      style={{ color: "hsl(var(--muted))" }}>{p.year}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
