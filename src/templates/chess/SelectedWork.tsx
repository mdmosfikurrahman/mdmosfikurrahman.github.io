import { projects } from "@/lib/content";
import { Link } from "react-router-dom";

// Algebraic-notation-flavored "moves" per row
const MOVES = ["1.d4", "2.c4", "3.Nc3", "4.e3", "5.Bd3", "6.Nf3"];

export default function SelectedWork() {
  return (
    <section id="work" className="border-b rule-soft">
      <div className="shell py-16 md:py-20">
        <div className="mg">
          <div>
            <p className="sig">Nf3 · Selected Games</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-[-0.015em]"
                style={{ color: "hsl(var(--ink))" }}>
              Selected games.
            </h2>
            <p className="mt-4 font-display italic text-[15px] leading-relaxed max-w-[24ch]"
               style={{ color: "hsl(var(--muted))" }}>
              The annotated ones.
            </p>
            <Link to="/experience"
                  className="a-arrow text-sm mt-5 inline-flex items-center gap-1.5">
              Full tournament <span aria-hidden>→</span>
            </Link>
          </div>

          <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
            {projects.map((p, i) => (
              <li key={p.name}
                  className="group grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-x-4 md:gap-x-8 gap-y-2 py-6 items-baseline">
                <span className="font-mono text-[12px] pt-[3px]"
                      style={{ color: "hsl(var(--accent))" }}>
                  {MOVES[i] ?? `${i + 1}.??`}
                </span>
                <div className="min-w-0">
                  <p className="md:hidden font-mono text-[11.5px] mb-1"
                     style={{ color: "hsl(var(--muted))" }}>{p.year}</p>
                  <h3 className="font-display text-xl md:text-2xl leading-tight tracking-[-0.01em] flex items-baseline flex-wrap gap-x-3 gap-y-1">
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noreferrer"
                         className="transition-colors group-hover:text-[hsl(var(--accent))]">{p.name}</a>
                    ) : (
                      <span className="transition-colors group-hover:text-[hsl(var(--accent))]">{p.name}</span>
                    )}
                    {p.flagship && (
                      <span className="font-mono text-[10.5px] px-1.5 py-0.5 leading-none translate-y-[-2px]"
                            style={{
                              border: "1px solid hsl(var(--accent))",
                              color: "hsl(var(--accent))",
                            }}>
                        ♔ Featured
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 font-display italic text-[14.5px]"
                     style={{ color: "hsl(var(--muted))" }}>
                    {p.at} · {p.role}
                  </p>
                  <p className="mt-3 text-[16px] leading-[1.6] text-pretty max-w-prose"
                     style={{ color: "hsl(var(--ink-soft))" }}>{p.blurb}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px]"
                      style={{ color: "hsl(var(--muted))" }}>
                    {p.tags.map((t) => (
                      <li key={t} className="before:content-['·'] before:mr-3 first:before:hidden">{t}</li>
                    ))}
                  </ul>
                </div>
                <span className="hidden md:inline font-mono text-[11.5px] pt-[3px]"
                      style={{ color: "hsl(var(--muted))" }}>{p.year}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
