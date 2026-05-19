import { roles } from "@/lib/content";
import { Link } from "react-router-dom";

function fmt(iso: string) {
  if (iso === "present") return "Present";
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function NowSection() {
  const r = roles[0];
  return (
    <section id="now" className="slide border-t rule-soft">
      <div className="slide-grid" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1080px] px-6 sm:px-8 md:px-10 py-24 md:py-28">
        <p className="sig">02 · Right now</p>

        <h2 className="mt-7 font-display leading-[1.02] tracking-[-0.035em]
                       text-[clamp(2rem,5.5vw,3.75rem)]"
            style={{ color: "hsl(var(--ink))" }}>
          What I&apos;m building today.
        </h2>

        <div className="mt-12 grid grid-cols-12 gap-x-12 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <p className="text-[15px] leading-relaxed" style={{ color: "hsl(var(--muted))" }}>
              The current role, and where attention actually goes.
            </p>
            <Link to="/experience" className="a-arrow mt-5 inline-flex items-center gap-1.5">
              Full experience <span aria-hidden>→</span>
            </Link>
          </div>

          <article className="col-span-12 md:col-span-8 min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-4 border-b rule-soft">
              <h3 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] tracking-tight"
                  style={{ color: "hsl(var(--ink))" }}>
                <a className="a" href={r.companyUrl} target="_blank" rel="noreferrer">{r.company}</a>
              </h3>
              <span className="text-[14px] tabular-nums" style={{ color: "hsl(var(--muted))" }}>
                {fmt(r.from)} – {fmt(r.to)}
              </span>
            </div>
            <p className="mt-3 text-[14px]" style={{ color: "hsl(var(--muted))" }}>
              {r.title} · {r.place}
            </p>

            <p className="mt-6 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.6] text-pretty"
               style={{ color: "hsl(var(--ink-soft))" }}>
              {r.summary}
            </p>

            <ul className="mt-7 space-y-3.5 text-[15.5px] leading-[1.55]">
              {r.bullets.map((b, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-[13px] pt-[3px] w-7 shrink-0 tabular-nums font-mono"
                        style={{ color: "hsl(var(--accent))" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ color: "hsl(var(--ink-soft))" }}>{b}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-8 flex flex-wrap gap-2">
              {r.stack.map((s) => (
                <li key={s} className="px-2.5 py-1 text-[12.5px]"
                    style={{
                      border: "1px solid hsl(var(--rule))",
                      borderRadius: "999px",
                      color: "hsl(var(--ink-soft))",
                    }}>
                  {s}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
