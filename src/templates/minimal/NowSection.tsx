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
    <section id="now" className="border-t rule-soft">
      <div className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-10 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <p className="sig">Now</p>
            <h2 className="mt-3 font-display text-[28px] md:text-[34px] leading-[1.15] tracking-[-0.02em]"
                style={{ color: "hsl(var(--ink))" }}>
              What I'm <br className="hidden md:block" />
              working on.
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed max-w-[24ch]"
               style={{ color: "hsl(var(--muted))" }}>
              Where time and attention actually go, right now.
            </p>
            <Link to="/experience" className="a-arrow mt-5 inline-flex items-center gap-1.5">
              Full experience <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="col-span-12 md:col-span-8 min-w-0">
            {roles.slice(0, 1).map((r) => (
              <article key={r.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-3 border-b rule-soft">
                  <h3 className="font-display text-[20px] tracking-tight"
                      style={{ color: "hsl(var(--ink))" }}>
                    <a className="a" href={r.companyUrl} target="_blank" rel="noreferrer">
                      {r.company}
                    </a>
                  </h3>
                  <span className="text-[13px]" style={{ color: "hsl(var(--muted))" }}>
                    {fmt(r.from)} – {fmt(r.to)}
                  </span>
                </div>
                <p className="mt-2 text-[13.5px]" style={{ color: "hsl(var(--muted))" }}>
                  {r.title} · {r.place}
                </p>

                <p className="mt-5 text-[15.5px] leading-[1.7] text-pretty"
                   style={{ color: "hsl(var(--ink-soft))" }}>
                  {r.summary}
                </p>

                <ul className="mt-6 space-y-3 text-[15px] leading-[1.6]">
                  {r.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-[13px] pt-[3px] w-6 shrink-0 tabular-nums"
                            style={{ color: "hsl(var(--muted))" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ color: "hsl(var(--ink-soft))" }}>{b}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-7 flex flex-wrap gap-1.5">
                  {r.stack.map((s) => (
                    <li key={s}
                        className="px-2 py-1 text-[12px] rounded-full"
                        style={{
                          border: "1px solid hsl(var(--rule))",
                          color: "hsl(var(--ink-soft))",
                        }}>
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
