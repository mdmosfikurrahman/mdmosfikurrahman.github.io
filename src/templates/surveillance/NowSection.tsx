import { roles } from "@/lib/content";
import { Link } from "react-router-dom";

function fmt(iso: string) {
  if (iso === "present") return "present";
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function NowSection() {
  return (
    <section id="now" className="border-b rule-soft">
      <div className="shell py-16 md:py-24">
        <div className="mg">
          <div>
            <p className="sig">RECORD 01 / CURRENT POSITION</p>
            <h2 className="font-display text-2xl md:text-3xl mt-2 tracking-tight uppercase">
              Active assignment
            </h2>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] max-w-[14rem] leading-relaxed"
               style={{ color: "hsl(var(--muted))" }}>
              <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
              live trace of where time and attention actually go.
            </p>
            <Link to="/experience" className="a-arrow text-sm mt-5 inline-block">
              [ FIELD LOG ] <span className="arw">→</span>
            </Link>
          </div>

          <div className="min-w-0">
            {roles.slice(0, 1).map((r) => (
              <article key={r.company} className="max-w-prose">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b rule pb-2">
                  <h3 className="font-display text-xl md:text-2xl tracking-tight uppercase">
                    <a className="a" href={r.companyUrl} target="_blank" rel="noreferrer">
                      {r.company}
                    </a>
                  </h3>
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] whitespace-nowrap flex items-center gap-2"
                        style={{ color: "hsl(var(--muted))" }}>
                    <span className="blink-dot pos" />
                    <span style={{ color: "hsl(var(--accent))" }}>ACTIVE</span>
                    <span>·</span>
                    <span>{fmt(r.from)} – {fmt(r.to)}</span>
                  </span>
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em]"
                   style={{ color: "hsl(var(--muted))" }}>
                  <span style={{ color: "hsl(var(--accent))" }}>POST </span>
                  {r.title} · {r.place}
                </p>

                <p className="mt-5 text-[14px] leading-[1.7] text-pretty"
                   style={{ color: "hsl(var(--ink-soft))" }}>
                  <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>{r.summary}
                </p>

                <ul className="mt-6 space-y-2.5 text-[14px] leading-relaxed">
                  {r.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-[11px] pt-[5px] w-7 shrink-0"
                            style={{ color: "hsl(var(--accent))" }}>
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <span style={{ color: "hsl(var(--ink-soft))" }}>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t rule-soft">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2"
                     style={{ color: "hsl(var(--accent))" }}>
                    STACK / TOOLCHAIN
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {r.stack.map((s) => (
                      <li key={s} className="pill muted">{s}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
