import { skillGroups } from "@/lib/content";

export default function SkillsMatrix() {
  return (
    <section id="skills" className="border-t rule-soft">
      <div className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-10 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <p className="sig">Tooling</p>
            <h2 className="mt-3 font-display text-[28px] md:text-[34px] leading-[1.15] tracking-[-0.02em]"
                style={{ color: "hsl(var(--ink))" }}>
              What I reach for.
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed max-w-[24ch]"
               style={{ color: "hsl(var(--muted))" }}>
              Grouped by layer.
            </p>
          </div>

          <dl className="col-span-12 md:col-span-8 min-w-0">
            {skillGroups.map((g, i) => (
              <div key={g.label}
                   className={[
                     "grid grid-cols-1 md:grid-cols-[140px,1fr] gap-x-6 gap-y-2 py-5",
                     i === 0 ? "" : "border-t rule-soft",
                   ].join(" ")}>
                <dt className="text-[13.5px] font-medium" style={{ color: "hsl(var(--ink))" }}>
                  {g.label}
                </dt>
                <dd className="flex flex-wrap gap-x-3 gap-y-1.5 text-[14.5px]"
                    style={{ color: "hsl(var(--ink-soft))" }}>
                  {g.items.map((it) => (
                    <span key={it}
                          className="before:content-['·'] before:mr-3 before:opacity-50 first:before:hidden">
                      {it}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
