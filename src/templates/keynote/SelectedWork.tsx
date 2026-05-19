import { projects } from "@/lib/content";
import { Link } from "react-router-dom";

export default function SelectedWork() {
  return (
    <section id="work" className="slide border-t rule-soft">
      <div className="slide-grid" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1080px] px-6 sm:px-8 md:px-10 py-24 md:py-28">
        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          <p className="sig">03 · Selected work</p>
          <Link to="/experience" className="a-arrow inline-flex items-center gap-1.5">
            Full log <span aria-hidden>→</span>
          </Link>
        </div>

        <h2 className="mt-7 font-display leading-[1.02] tracking-[-0.035em]
                       text-[clamp(2rem,5.5vw,3.75rem)]"
            style={{ color: "hsl(var(--ink))" }}>
          Systems I&apos;d put on the cover.
        </h2>

        <ol className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-10">
          {projects.map((p, i) => (
            <li key={p.name} className="group flex flex-col">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] tabular-nums"
                      style={{ color: "hsl(var(--accent))" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] tabular-nums ml-auto"
                      style={{ color: "hsl(var(--muted))" }}>
                  {p.year}
                </span>
              </div>
              <h3 className="mt-2 font-display text-[clamp(1.25rem,2.2vw,1.7rem)] tracking-tight"
                  style={{ color: "hsl(var(--ink))" }}>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noreferrer"
                     className="hover:text-[hsl(var(--accent))] transition-colors">
                    {p.name}
                  </a>
                ) : p.name}
                {p.flagship && (
                  <span className="ml-2.5 align-middle inline-block px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          background: "hsl(var(--accent-wash))",
                          color: "hsl(var(--accent-deep))",
                          borderRadius: "999px",
                        }}>
                    Flagship
                  </span>
                )}
              </h3>
              <p className="mt-1 text-[13px]" style={{ color: "hsl(var(--muted))" }}>
                {p.at} · {p.role}
              </p>
              <p className="mt-3 text-[15px] leading-[1.6] text-pretty"
                 style={{ color: "hsl(var(--ink-soft))" }}>
                {p.blurb}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li key={t} className="px-2.5 py-0.5 text-[11.5px]"
                      style={{
                        border: "1px solid hsl(var(--rule))",
                        borderRadius: "999px",
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
    </section>
  );
}
