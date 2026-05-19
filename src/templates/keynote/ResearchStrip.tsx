import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import { publications, doiUrl, formatAuthors, reviewerFor } from "@/lib/content";

export default function ResearchStrip() {
  const highlights = publications.filter((p) =>
    ["RAHMAN2021100037", "Rahman2020SmartSewer", "Islam2023CyberSecurity", "Johora2024CovidPrediction"].includes(p.key)
  );

  return (
    <section id="research" className="slide border-t rule-soft">
      <div className="slide-grid" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1080px] px-6 sm:px-8 md:px-10 py-24 md:py-28">
        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          <p className="sig">04 · Research</p>
          <Link to="/publications" className="a-arrow inline-flex items-center gap-1.5">
            Full bibliography <span aria-hidden>→</span>
          </Link>
        </div>

        <h2 className="mt-7 font-display leading-[1.02] tracking-[-0.035em]
                       text-[clamp(2rem,5.5vw,3.75rem)]"
            style={{ color: "hsl(var(--ink))" }}>
          Ten papers, one IEEE best paper.
        </h2>

        <ol className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-9">
          {highlights.map((p) => {
            const authors = formatAuthors(p.authors);
            return (
              <li key={p.key}>
                <div className="flex items-baseline gap-3 text-[12.5px]"
                     style={{ color: "hsl(var(--muted))" }}>
                  <span className="tabular-nums font-mono">{p.year}</span>
                  <span>·</span>
                  <span className="uppercase tracking-wide">{p.type}</span>
                  {p.award && (
                    <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 text-[11px]"
                          style={{
                            background: "hsl(var(--accent-wash))",
                            color: "hsl(var(--accent-deep))",
                            borderRadius: "999px",
                          }}
                          title={p.award}>
                      <Award className="w-3 h-3" aria-hidden />
                      Best paper
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-[clamp(1.05rem,1.7vw,1.3rem)] leading-[1.3] tracking-tight text-pretty"
                    style={{ color: "hsl(var(--ink))" }}>
                  {p.doi ? (
                    <a className="a" href={doiUrl(p.doi)} target="_blank" rel="noreferrer">
                      {p.title}
                    </a>
                  ) : p.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.55]"
                   style={{ color: "hsl(var(--ink-soft))" }}>
                  {authors.map((a, i) => (
                    <span key={i}>
                      <span style={{
                        color: a.bold ? "hsl(var(--accent))" : undefined,
                        fontWeight: a.bold ? 600 : 400,
                      }}>
                        {a.name}
                      </span>
                      {i < authors.length - 1 ? ", " : "."}
                    </span>
                  ))}{" "}
                  <span style={{ color: "hsl(var(--muted))" }}>{p.venue}</span>.
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 pt-7 border-t rule-soft">
          <p className="mg-label mb-3">Reviewer for</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[14.5px]"
              style={{ color: "hsl(var(--ink-soft))" }}>
            {reviewerFor.map((r) => (
              <li key={r} className="before:content-['·'] before:mr-4 before:text-[hsl(var(--accent))] first:before:hidden">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
