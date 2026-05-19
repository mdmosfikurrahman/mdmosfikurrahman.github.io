import { Link } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";
import { publications, doiUrl, formatAuthors, reviewerFor } from "@/lib/content";

export default function ResearchStrip() {
  const highlights = publications.filter((p) =>
    ["RAHMAN2021100037", "Rahman2020SmartSewer", "Islam2023CyberSecurity", "Johora2024CovidPrediction"].includes(p.key)
  );

  return (
    <section id="research" className="slide border-t rule-soft">
      <div className="kn-glow" aria-hidden />
      <span className="kn-ghost" aria-hidden>04</span>

      <div className="relative mx-auto w-full max-w-[1120px] px-6 sm:px-10 py-28">
        <div className="flex items-center justify-between">
          <p className="sig">Research</p>
          <span className="kn-step"><b>04</b> / 06</span>
        </div>

        <h2 className="mt-9 font-display leading-[1.0] tracking-[-0.04em]
                       text-[clamp(2.25rem,6vw,4.25rem)] max-w-[20ch]"
            style={{ color: "hsl(var(--ink))" }}>
          Ten papers, one <span className="kn-mark">IEEE best paper.</span>
        </h2>

        <ol className="mt-14 grid md:grid-cols-2 gap-6">
          {highlights.map((p) => {
            const authors = formatAuthors(p.authors);
            return (
              <li key={p.key} className="kn-card p-7">
                <div className="flex items-center gap-3 text-[12px]"
                     style={{ color: "hsl(var(--muted))" }}>
                  <span className="tabular-nums font-mono font-semibold">{p.year}</span>
                  <span className="opacity-50">·</span>
                  <span className="uppercase tracking-[0.14em]">{p.type}</span>
                  {p.award && (
                    <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full"
                          style={{ background: "hsl(var(--accent-wash))", color: "hsl(var(--accent-deep))" }}
                          title={p.award}>
                      <Award className="w-3 h-3" aria-hidden /> Best paper
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.3] tracking-[-0.02em] text-pretty"
                    style={{ color: "hsl(var(--ink))" }}>
                  {p.doi ? (
                    <a className="a" href={doiUrl(p.doi)} target="_blank" rel="noreferrer">{p.title}</a>
                  ) : p.title}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.55]"
                   style={{ color: "hsl(var(--ink-soft))" }}>
                  {authors.map((a, i) => (
                    <span key={i}>
                      <span style={{
                        color: a.bold ? "hsl(var(--accent))" : undefined,
                        fontWeight: a.bold ? 600 : 400,
                      }}>{a.name}</span>
                      {i < authors.length - 1 ? ", " : "."}
                    </span>
                  ))}{" "}
                  <span style={{ color: "hsl(var(--muted))" }}>{p.venue}</span>.
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 pt-7 border-t rule-soft flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <p className="mg-label">Reviewer for</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[14px]"
              style={{ color: "hsl(var(--ink-soft))" }}>
            {reviewerFor.map((r) => (
              <li key={r} className="before:content-['·'] before:mr-4 before:text-[hsl(var(--accent))] first:before:hidden">
                {r}
              </li>
            ))}
          </ul>
        </div>

        <Link to="/publications" className="a-arrow mt-8 inline-flex items-center gap-1.5">
          Full bibliography <ArrowRight size={15} strokeWidth={2.2} />
        </Link>
      </div>
    </section>
  );
}
