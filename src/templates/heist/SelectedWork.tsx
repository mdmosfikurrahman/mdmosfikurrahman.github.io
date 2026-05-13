import { projects } from "@/lib/content";
import { Link } from "react-router-dom";

const CODES = ["RAKUTEN", "BOND", "ECHIBA", "DENKA", "TRA-FOO", "CRSA"];

export default function SelectedWork() {
  return (
    <section id="work" className="border-b rule-soft">
      <div className="shell py-16 md:py-20">
        <div className="mg">
          <div>
            <p className="sig">Operations 02</p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl tracking-[-0.025em]"
                style={{ color: "hsl(var(--ink))" }}>
              Selected jobs.
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed max-w-[24ch]"
               style={{ color: "hsl(var(--muted))" }}>
              The plans pinned on the board.
            </p>
            <Link to="/experience"
                  className="a-arrow text-sm mt-5 inline-flex items-center gap-1.5 font-display uppercase tracking-[0.08em] font-semibold">
              Full board <span aria-hidden>→</span>
            </Link>
          </div>

          <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
            {projects.map((p, i) => (
              <li key={p.name}
                  className="group grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-x-4 md:gap-x-8 gap-y-2 py-6 items-baseline">
                <span className="font-display text-[11px] uppercase tracking-[0.18em] pt-[3px] font-bold"
                      style={{ color: "hsl(var(--accent))" }}>
                  OP {String(i + 1).padStart(2, "0")} <br />
                  <span className="font-script text-[15px] tracking-normal leading-none">
                    "{CODES[i] ?? "JOB"}"
                  </span>
                </span>
                <div className="min-w-0">
                  <p className="md:hidden font-display text-[11px] uppercase tracking-[0.18em] font-bold mb-1"
                     style={{ color: "hsl(var(--muted))" }}>{p.year}</p>
                  <h3 className="font-display text-xl md:text-2xl leading-tight tracking-[-0.025em] flex items-baseline flex-wrap gap-x-3 gap-y-1 font-bold">
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noreferrer"
                         className="transition-colors group-hover:text-[hsl(var(--accent))]">{p.name}</a>
                    ) : (
                      <span className="transition-colors group-hover:text-[hsl(var(--accent))]">{p.name}</span>
                    )}
                    {p.flagship && (
                      <span className="font-display text-[9.5px] uppercase tracking-[0.22em] px-1.5 py-0.5 leading-none font-bold"
                            style={{
                              background: "hsl(var(--accent))",
                              color: "hsl(var(--paper))",
                            }}>
                        IN MOTION
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 font-display text-[11.5px] uppercase tracking-[0.18em] font-semibold"
                     style={{ color: "hsl(var(--muted))" }}>
                    {p.at} · {p.role}
                  </p>
                  <p className="mt-3 text-[15px] leading-[1.65] text-pretty max-w-prose"
                     style={{ color: "hsl(var(--ink-soft))" }}>{p.blurb}</p>
                  <div className="mt-3 yarn max-w-[6rem]" aria-hidden />
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li key={t} className="px-2 py-0.5 text-[11.5px] font-mono"
                          style={{
                            background: "hsl(var(--paper-glass))",
                            border: "1px solid hsl(var(--rule))",
                            color: "hsl(var(--ink-soft))",
                            transform: i % 2 === 0 ? "rotate(-0.6deg)" : "rotate(0.6deg)",
                          }}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="hidden md:inline font-display text-[11px] uppercase tracking-[0.18em] pt-[3px] font-bold"
                      style={{ color: "hsl(var(--muted))" }}>{p.year}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
