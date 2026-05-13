import { projects } from "@/lib/content";
import { Link } from "react-router-dom";

export default function SelectedWork() {
  return (
    <section id="work" className="border-t rule-soft">
      <div className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-10 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <p className="sig">Selected work</p>
            <h2 className="mt-3 font-display text-[28px] md:text-[34px] leading-[1.15] tracking-[-0.02em]"
                style={{ color: "hsl(var(--ink))" }}>
              A short list.
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed max-w-[24ch]"
               style={{ color: "hsl(var(--muted))" }}>
              Ordered by what I'd put on the cover of a report.
            </p>
            <Link to="/experience" className="a-arrow mt-5 inline-flex items-center gap-1.5">
              Full log <span aria-hidden>→</span>
            </Link>
          </div>

          <ol className="col-span-12 md:col-span-8 min-w-0 space-y-9">
            {projects.map((p) => (
              <li key={p.name} className="group">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3 className="font-display text-[20px] md:text-[22px] tracking-tight"
                      style={{ color: "hsl(var(--ink))" }}>
                    {p.href ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[hsl(var(--accent))] transition-colors"
                      >
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                    {p.flagship && (
                      <span className="ml-2.5 align-middle inline-block px-1.5 py-0.5 text-[10px] font-medium rounded"
                            style={{
                              background: "hsl(var(--accent-wash))",
                              color: "hsl(var(--accent-deep))",
                            }}>
                        Flagship
                      </span>
                    )}
                  </h3>
                  <span className="text-[13px] tabular-nums"
                        style={{ color: "hsl(var(--muted))" }}>
                    {p.year}
                  </span>
                </div>
                <p className="mt-1 text-[13px]" style={{ color: "hsl(var(--muted))" }}>
                  {p.at} · {p.role}
                </p>
                <p className="mt-3 text-[15px] leading-[1.65] text-pretty max-w-prose"
                   style={{ color: "hsl(var(--ink-soft))" }}>
                  {p.blurb}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li key={t}
                        className="px-2 py-0.5 text-[11.5px] rounded-full"
                        style={{
                          border: "1px solid hsl(var(--rule))",
                          color: "hsl(var(--ink-soft))",
                        }}>
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
