import { skillGroups } from "@/lib/content";

export default function SkillsMatrix() {
  return (
    <section id="skills" className="border-b rule-soft">
      <div className="shell py-16 md:py-24">
        <div className="mg">
          <div>
            <p className="sig">Tooling</p>
            <h2 className="font-display text-2xl md:text-3xl mt-1 tracking-tight">
              Tooling index
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-[13rem] leading-relaxed">
              The things I reach for first, grouped by layer.
            </p>
          </div>

          <dl className="min-w-0 divide-y rule-soft border-y rule-soft">
            {skillGroups.map((g) => (
              <div
                key={g.label}
                className="grid grid-cols-1 md:grid-cols-[160px,1fr] lg:grid-cols-[180px,1fr] gap-x-6 gap-y-1.5 py-4 md:py-5"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground pt-[3px]">
                  {g.label}
                </dt>
                <dd className="flex flex-wrap gap-x-4 md:gap-x-5 gap-y-1.5 text-[14px] md:text-[15px] text-ink-soft">
                  {g.items.map((it, i) => (
                    <span
                      key={it}
                      className="before:content-['·'] before:mr-4 before:text-muted-foreground first:before:hidden"
                    >
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
