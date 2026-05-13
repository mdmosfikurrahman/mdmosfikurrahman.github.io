import { roles } from "@/lib/content";
import { Link } from "react-router-dom";

function fmt(iso: string) {
  if (iso === "present") return "Present";
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function NowSection() {
  return (
    <section id="now" className="border-b rule-soft">
      <div className="shell py-16 md:py-20">
        <div className="mg">
          <div>
            <p className="sig">Memory I · Present</p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl uppercase tracking-[0.02em]"
                style={{ color: "hsl(var(--ink))" }}>
              Active sync.
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed max-w-[24ch]"
               style={{ color: "hsl(var(--muted))" }}>
              The memory currently being replayed.
            </p>
            <Link to="/experience" className="a-arrow text-sm mt-5 inline-flex items-center gap-1.5 font-display tracking-[0.12em] uppercase">
              Memory Block II <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="min-w-0">
            {roles.slice(0, 1).map((r) => (
              <article key={r.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-2 border-b rule">
                  <h3 className="font-display text-xl md:text-2xl uppercase tracking-[0.02em]">
                    <a className="a" href={r.companyUrl} target="_blank" rel="noreferrer">
                      {r.company}
                    </a>
                  </h3>
                  <span className="font-display text-[11px] uppercase tracking-[0.22em]"
                        style={{ color: "hsl(var(--muted))" }}>
                    {fmt(r.from)} – {fmt(r.to)}
                  </span>
                </div>
                <p className="mt-3 font-display text-[11px] uppercase tracking-[0.22em]"
                   style={{ color: "hsl(var(--muted))" }}>
                  <span style={{ color: "hsl(var(--accent))" }}>POST · </span>
                  {r.title} · {r.place}
                </p>
                <p className="mt-5 text-[15.5px] leading-[1.65] text-pretty"
                   style={{ color: "hsl(var(--ink-soft))" }}>{r.summary}</p>

                <ul className="mt-6 space-y-2.5 text-[15px] leading-[1.6]">
                  {r.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-display text-[11px] pt-[3px] w-6 shrink-0"
                            style={{ color: "hsl(var(--accent))" }}>
                        {["I","II","III","IV","V","VI"][i] ?? String(i + 1)}
                      </span>
                      <span style={{ color: "hsl(var(--ink-soft))" }}>{b}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {r.stack.map((s) => (
                    <li key={s} className="px-2 py-0.5 text-[11px] font-display uppercase tracking-[0.18em]"
                        style={{ border: "1px solid hsl(var(--rule))", color: "hsl(var(--ink-soft))" }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
