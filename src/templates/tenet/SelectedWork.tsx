import { projects } from "@/lib/content";
import { Link } from "react-router-dom";

export default function SelectedWork() {
  return (
    <section id="work" className="border-b rule-soft">
      <div className="shell py-16 md:py-20">
        <div className="mg">
          <div>
            <p className="sig">Inverted · 02</p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl tracking-[-0.025em]"
                style={{ color: "hsl(var(--ink))" }}>
              Selected · detceleS
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed max-w-[24ch]"
               style={{ color: "hsl(var(--muted))" }}>
              The same list read in either direction.
            </p>
            <Link to="/experience"
                  className="a-arrow text-sm mt-5 inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.12em]">
              Full record <span aria-hidden>→</span>
            </Link>
          </div>

          <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
            {projects.map((p, i) => {
              const dir = i % 2 === 0 ? "→" : "←";
              const color = i % 2 === 0 ? "hsl(var(--accent))" : "hsl(var(--signal-crit))";
              return (
                <li key={p.name}
                    className="group grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-x-4 md:gap-x-8 gap-y-2 py-6 items-baseline">
                  <span className="font-mono text-[12px] pt-[3px] tabular-nums"
                        style={{ color }}>
                    {dir} {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="md:hidden font-mono text-[11px] uppercase tracking-[0.16em] mb-1"
                       style={{ color: "hsl(var(--muted))" }}>{p.year}</p>
                    <h3 className="font-display text-xl md:text-2xl leading-tight tracking-[-0.02em] flex items-baseline flex-wrap gap-x-3 gap-y-1">
                      {p.href ? (
                        <a href={p.href} target="_blank" rel="noreferrer"
                           className="transition-colors group-hover:text-[hsl(var(--accent))]">{p.name}</a>
                      ) : (
                        <span className="transition-colors group-hover:text-[hsl(var(--accent))]">{p.name}</span>
                      )}
                      {p.flagship && (
                        <span className="font-mono text-[10.5px] px-1.5 py-0.5 leading-none translate-y-[-2px]"
                              style={{ border: "1px solid hsl(var(--accent))", color: "hsl(var(--accent))" }}>
                          ◐ Flagship ◑
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 font-mono text-[11.5px] uppercase tracking-[0.18em]"
                       style={{ color: "hsl(var(--muted))" }}>
                      {p.at} · {p.role}
                    </p>
                    <p className="mt-3 text-[15px] leading-[1.65] text-pretty max-w-prose"
                       style={{ color: "hsl(var(--ink-soft))" }}>{p.blurb}</p>
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] font-mono"
                        style={{ color: "hsl(var(--muted))" }}>
                      {p.tags.map((t) => (
                        <li key={t} className="before:content-['·'] before:mr-3 first:before:hidden">{t}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="hidden md:inline font-mono text-[11px] uppercase tracking-[0.18em] pt-[3px]"
                        style={{ color: "hsl(var(--muted))" }}>{p.year}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
