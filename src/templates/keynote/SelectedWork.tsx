import { projects } from "@/lib/content";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function SelectedWork() {
  return (
    <section id="work" className="slide border-t rule-soft">
      <div className="kn-glow" aria-hidden />
      <span className="kn-ghost" aria-hidden>03</span>

      <div className="relative mx-auto w-full max-w-[1120px] px-6 sm:px-10 py-28">
        <div className="flex items-center justify-between">
          <p className="sig">Selected work</p>
          <span className="kn-step"><b>03</b> / 06</span>
        </div>

        <h2 className="mt-9 font-display leading-[1.0] tracking-[-0.04em]
                       text-[clamp(2.25rem,6vw,4.25rem)] max-w-[20ch]"
            style={{ color: "hsl(var(--ink))" }}>
          Systems I&apos;d put <span className="kn-mark">on the cover.</span>
        </h2>

        <ol className="mt-14 grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => {
            const Card = (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] font-bold tabular-nums"
                        style={{ color: "hsl(var(--accent))" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.flagship && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full"
                            style={{ background: "hsl(var(--accent-wash))", color: "hsl(var(--accent-deep))" }}>
                        Flagship
                      </span>
                    )}
                    <span className="text-[12.5px] tabular-nums" style={{ color: "hsl(var(--muted))" }}>
                      {p.year}
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 font-display text-[clamp(1.3rem,2.2vw,1.8rem)] tracking-[-0.03em] flex items-start gap-2"
                    style={{ color: "hsl(var(--ink))" }}>
                  {p.name}
                  {p.href && (
                    <ArrowUpRight size={18} strokeWidth={2}
                                  className="mt-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"
                                  style={{ color: "hsl(var(--accent))" }} />
                  )}
                </h3>
                <p className="mt-1.5 text-[13px]" style={{ color: "hsl(var(--muted))" }}>
                  {p.at} · {p.role}
                </p>
                <p className="mt-4 text-[15px] leading-[1.6] text-pretty"
                   style={{ color: "hsl(var(--ink-soft))" }}>
                  {p.blurb}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li key={t} className="kn-pill px-2.5 py-0.5 text-[11.5px]">{t}</li>
                  ))}
                </ul>
              </>
            );
            return (
              <li key={p.name} className="kn-card group p-7 flex flex-col">
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noreferrer" className="flex flex-col h-full">
                    {Card}
                  </a>
                ) : Card}
              </li>
            );
          })}
        </ol>

        <Link to="/experience" className="a-arrow mt-10 inline-flex items-center gap-1.5">
          Full work log <ArrowRight size={15} strokeWidth={2.2} />
        </Link>
      </div>
    </section>
  );
}
