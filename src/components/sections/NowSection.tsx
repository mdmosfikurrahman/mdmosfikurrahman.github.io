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
            <p className="sig">Now</p>
            <h2 className="font-display text-2xl md:text-3xl mt-1 tracking-tight">
              What I'm working on
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-[13rem] leading-relaxed">
              Where time and attention actually go, right now.
            </p>
            <Link to="/experience" className="a-arrow text-sm mt-5 inline-block">
              Full experience <span className="arw">→</span>
            </Link>
          </div>

          <div className="min-w-0">
            {roles.slice(0, 1).map((r) => (
              <article key={r.company} className="max-w-prose">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b rule pb-2">
                  <h3 className="font-display text-xl md:text-2xl tracking-tight">
                    <a className="a" href={r.companyUrl} target="_blank" rel="noreferrer">
                      {r.company}
                    </a>
                  </h3>
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap">
                    {fmt(r.from)} – {fmt(r.to)}
                  </span>
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {r.title} · {r.place}
                </p>

                <p className="mt-5 font-serif-body text-[1.075rem] leading-[1.6] text-ink-soft text-pretty">
                  {r.summary}
                </p>

                <ul className="mt-6 space-y-2.5 text-[15px] leading-relaxed">
                  {r.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground pt-[5px] w-6 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-ink-soft">{b}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono uppercase tracking-[0.12em] text-muted-foreground">
                  {r.stack.map((s) => (
                    <li key={s} className="before:content-['·'] before:mr-3 first:before:hidden">
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
