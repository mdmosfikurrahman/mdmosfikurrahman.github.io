import { roles } from "@/lib/content";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
      <div className="kn-glow" aria-hidden />
      <span className="kn-ghost" aria-hidden>02</span>

      <div className="relative mx-auto w-full max-w-[1120px] px-6 sm:px-10 py-28">
        <div className="flex items-center justify-between">
          <p className="sig">Right now</p>
          <span className="kn-step"><b>02</b> / 06</span>
        </div>

        <h2 className="mt-9 font-display leading-[1.0] tracking-[-0.04em]
                       text-[clamp(2.25rem,6vw,4.25rem)] max-w-[18ch]"
            style={{ color: "hsl(var(--ink))" }}>
          What I&apos;m <span className="kn-mark">building today.</span>
        </h2>

        <div className="mt-14 kn-card p-8 md:p-12">
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
            <div>
              <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.25rem)] tracking-[-0.03em]"
                  style={{ color: "hsl(var(--ink))" }}>
                <a className="a" href={r.companyUrl} target="_blank" rel="noreferrer">{r.company}</a>
              </h3>
              <p className="mt-2 text-[14.5px]" style={{ color: "hsl(var(--muted))" }}>
                {r.title} · {r.place}
              </p>
            </div>
            <span className="kn-pill px-3.5 py-1.5 text-[12.5px] font-medium tabular-nums">
              {fmt(r.from)} – {fmt(r.to)}
            </span>
          </div>

          <p className="mt-7 max-w-[68ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.6] text-pretty"
             style={{ color: "hsl(var(--ink-soft))" }}>
            {r.summary}
          </p>

          <ul className="mt-9 grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {r.bullets.map((b, i) => (
              <li key={i} className="flex gap-4 text-[15px] leading-[1.55]">
                <span className="font-mono text-[12px] pt-[3px] shrink-0 font-semibold tabular-nums"
                      style={{ color: "hsl(var(--accent))" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "hsl(var(--ink-soft))" }}>{b}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-9 pt-7 flex flex-wrap gap-2 border-t rule-soft">
            {r.stack.map((s) => (
              <li key={s} className="kn-pill px-3 py-1 text-[12.5px]">{s}</li>
            ))}
          </ul>
        </div>

        <Link to="/experience" className="a-arrow mt-9 inline-flex items-center gap-1.5">
          Full experience <ArrowRight size={15} strokeWidth={2.2} />
        </Link>
      </div>
    </section>
  );
}
