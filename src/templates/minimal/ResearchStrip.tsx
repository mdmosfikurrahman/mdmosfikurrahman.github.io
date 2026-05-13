import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import { publications, doiUrl, formatAuthors, reviewerFor } from "@/lib/content";

export default function ResearchStrip() {
  const highlights = publications.filter((p) =>
    ["RAHMAN2021100037", "Rahman2020SmartSewer", "Islam2023CyberSecurity", "Johora2024CovidPrediction"].includes(p.key)
  );

  return (
    <section id="research" className="border-t rule-soft">
      <div className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-10 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <p className="sig">Research</p>
            <h2 className="mt-3 font-display text-[28px] md:text-[34px] leading-[1.15] tracking-[-0.02em]"
                style={{ color: "hsl(var(--ink))" }}>
              Ten papers, <br className="hidden md:block" />
              one award.
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed max-w-[26ch]"
               style={{ color: "hsl(var(--muted))" }}>
              ML, IoT, and information security. Each opens into a full research dossier.
            </p>
            <Link to="/publications" className="a-arrow mt-5 inline-flex items-center gap-1.5">
              Bibliography <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="col-span-12 md:col-span-8 min-w-0">
            <ol className="space-y-8">
              {highlights.map((p) => {
                const authors = formatAuthors(p.authors);
                return (
                  <li key={p.key}>
                    <div className="flex items-baseline gap-3 text-[12.5px]"
                         style={{ color: "hsl(var(--muted))" }}>
                      <span className="tabular-nums">{p.year}</span>
                      <span>·</span>
                      <span>{p.type}</span>
                      {p.award && (
                        <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px]"
                              style={{
                                background: "hsl(var(--accent-wash))",
                                color: "hsl(var(--accent-deep))",
                              }}
                              title={p.award}>
                          <Award className="w-3 h-3" aria-hidden />
                          Best paper
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 font-display text-[17px] md:text-[18px] leading-[1.35] tracking-tight text-pretty"
                        style={{ color: "hsl(var(--ink))" }}>
                      {p.doi ? (
                        <a className="a hover:text-[hsl(var(--accent))]"
                           href={doiUrl(p.doi)} target="_blank" rel="noreferrer">
                          {p.title}
                        </a>
                      ) : (
                        p.title
                      )}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] leading-[1.55]"
                       style={{ color: "hsl(var(--ink-soft))" }}>
                      {authors.map((a, i) => (
                        <span key={i}>
                          <span style={{
                            color: a.bold ? "hsl(var(--ink))" : undefined,
                            fontWeight: a.bold ? 500 : 400,
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

            <div className="mt-10 pt-6 border-t rule-soft">
              <p className="mg-label mb-3">Reviewer for</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[14px]"
                  style={{ color: "hsl(var(--ink-soft))" }}>
                {reviewerFor.map((r) => (
                  <li key={r}
                      className="before:content-['·'] before:mr-3 first:before:hidden"
                      style={{ ['--tw-text-opacity' as never]: 1 }}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
