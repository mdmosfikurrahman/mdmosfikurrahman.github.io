import { skillGroups } from "@/lib/content";

export default function SkillsMatrix() {
  return (
    <section id="skills" className="slide border-t rule-soft">
      <div className="slide-grid" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1080px] px-6 sm:px-8 md:px-10 py-24 md:py-28">
        <p className="sig">05 · Toolbox</p>

        <h2 className="mt-7 font-display leading-[1.02] tracking-[-0.035em]
                       text-[clamp(2rem,5.5vw,3.75rem)]"
            style={{ color: "hsl(var(--ink))" }}>
          What I reach for.
        </h2>

        <dl className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9">
          {skillGroups.map((g) => (
            <div key={g.label} className="border-t-2 pt-4"
                 style={{ borderColor: "hsl(var(--accent))" }}>
              <dt className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "hsl(var(--accent))" }}>
                {g.label}
              </dt>
              <dd className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[15.5px] leading-[1.5]"
                  style={{ color: "hsl(var(--ink-soft))" }}>
                {g.items.map((it) => (
                  <span key={it}
                        className="before:content-['/'] before:mr-3 before:opacity-40 first:before:hidden">
                    {it}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
