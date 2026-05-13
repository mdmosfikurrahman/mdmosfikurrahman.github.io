import { skillGroups } from "@/lib/content";

export default function SkillsMatrix() {
  return (
    <section id="skills" className="border-b rule-soft">
      <div className="shell py-16 md:py-24">
        <div className="mg">
          <div>
            <p className="sig">RECORD 04 / TOOLCHAIN</p>
            <h2 className="font-display text-2xl md:text-3xl mt-2 tracking-tight uppercase">
              Toolchain index
            </h2>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] max-w-[14rem] leading-relaxed"
               style={{ color: "hsl(var(--muted))" }}>
              <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
              what the asset reaches for first, grouped by layer.
            </p>
          </div>

          <dl className="min-w-0 divide-y rule-soft border-y rule-soft">
            {skillGroups.map((g, gi) => (
              <div
                key={g.label}
                className="grid grid-cols-1 md:grid-cols-[200px,1fr] lg:grid-cols-[220px,1fr] gap-x-6 gap-y-2 py-4 md:py-5"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.22em] pt-[3px] flex items-center gap-2">
                  <span style={{ color: "hsl(var(--accent))" }}>
                    [{String(gi + 1).padStart(2, "0")}]
                  </span>
                  <span style={{ color: "hsl(var(--ink))" }}>{g.label}</span>
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <span key={it} className="pill muted">{it}</span>
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
