import { skillGroups } from "@/lib/content";

export default function SkillsMatrix() {
  return (
    <section id="skills" className="slide border-t rule-soft">
      <div className="kn-glow" aria-hidden />
      <span className="kn-ghost" aria-hidden>05</span>

      <div className="relative mx-auto w-full max-w-[1120px] px-6 sm:px-10 py-28">
        <div className="flex items-center justify-between">
          <p className="sig">Toolbox</p>
          <span className="kn-step"><b>05</b> / 06</span>
        </div>

        <h2 className="mt-9 font-display leading-[1.0] tracking-[-0.04em]
                       text-[clamp(2.25rem,6vw,4.25rem)] max-w-[16ch]"
            style={{ color: "hsl(var(--ink))" }}>
          What I <span className="kn-mark">reach for.</span>
        </h2>

        <dl className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((g) => (
            <div key={g.label} className="kn-card p-7">
              <dt className="flex items-center gap-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: "hsl(var(--accent))" }}>
                <span className="inline-block w-2 h-2 rounded-full"
                      style={{ background: "hsl(var(--accent))" }} />
                {g.label}
              </dt>
              <dd className="mt-4 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span key={it} className="kn-pill px-2.5 py-1 text-[13px]">{it}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
