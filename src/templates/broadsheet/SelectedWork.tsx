import { projects } from "@/lib/content";
import { Link } from "react-router-dom";

export default function SelectedWork() {
  return (
    <section id="work" className="border-b rule-soft">
      <div className="shell py-16 md:py-24">
        <div className="mg">
          <div>
            <p className="sig">Selected Work</p>
            <h2 className="font-display text-2xl md:text-3xl mt-1 tracking-tight">
              Selected work
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-[13rem] leading-relaxed">
              A short list, ordered by what I would put on the cover of a report.
            </p>
            <Link to="/experience" className="a-arrow text-sm mt-5 inline-block">
              Full log <span className="arw">→</span>
            </Link>
          </div>

          <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
            {projects.map((p, i) => (
              <li
                key={p.name}
                className="group grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-x-4 md:gap-x-8 gap-y-2 py-6 md:py-7 items-baseline"
              >
                <span className="font-mono text-[11px] text-muted-foreground pt-[3px]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 md:order-none">
                  <p className="md:hidden font-mono text-[11px] text-muted-foreground mb-1">
                    {p.year}
                  </p>
                  <h3 className="font-display text-xl md:text-2xl leading-tight tracking-tight flex items-baseline flex-wrap gap-x-3 gap-y-1">
                    {p.href ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors group-hover:text-accent"
                      >
                        {p.name}
                      </a>
                    ) : (
                      <span className="transition-colors group-hover:text-accent">
                        {p.name}
                      </span>
                    )}
                    {p.flagship && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent border border-accent/50 px-1.5 py-0.5 leading-none translate-y-[-2px]">
                        Flagship
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {p.at} · {p.role}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft text-pretty max-w-prose">
                    {p.blurb}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono text-muted-foreground">
                    {p.tags.map((t) => (
                      <li key={t} className="before:content-['·'] before:mr-2 first:before:hidden">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <span className="hidden md:inline font-mono text-[11px] text-muted-foreground pt-[3px] whitespace-nowrap">
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
