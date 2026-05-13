import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import { publications, doiUrl, formatAuthors, reviewerFor } from "@/lib/content";

export default function ResearchStrip() {
  const highlights = publications.filter((p) =>
    ["RAHMAN2021100037", "Rahman2020SmartSewer", "Islam2023CyberSecurity", "Johora2024CovidPrediction"].includes(p.key)
  );

  return (
    <section id="research" className="border-b rule-soft bg-paper-deep/40">
      <div className="shell py-16 md:py-24">
        <div className="mg">
          <div>
            <p className="sig">Research &amp; Service</p>
            <h2 className="font-display text-2xl md:text-3xl mt-1 tracking-tight">
              Research &amp; service
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-[13rem] leading-relaxed">
              Ten peer-reviewed papers across ML, IoT, and information security, including one IEEE Best Paper. Each opens into a research dossier with abstract, methodology, findings, and impact.
            </p>
            <Link to="/publications" className="a-arrow text-sm mt-5 inline-block">
              Open bibliography <span className="arw">→</span>
            </Link>
          </div>

          <div className="min-w-0">
            <ol className="space-y-7">
              {highlights.map((p) => {
                const authors = formatAuthors(p.authors);
                return (
                  <li key={p.key} className="group">
                    <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      <span>{p.year}</span>
                      <span className="h-px flex-1 bg-rule-soft translate-y-[-2px]" />
                      {p.award && (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 border rule-soft bg-[hsl(var(--accent-wash))]"
                          style={{ color: "hsl(var(--accent-deep))" }}
                          title={p.award}
                        >
                          <Award className="w-3 h-3" aria-hidden />
                          Best paper
                        </span>
                      )}
                      <span>{p.type}</span>
                    </div>
                    <h3 className="mt-2 font-serif-body text-[1.075rem] md:text-[1.15rem] leading-snug text-ink text-pretty">
                      {p.doi ? (
                        <a
                          className="a"
                          href={doiUrl(p.doi)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {p.title}
                        </a>
                      ) : (
                        p.title
                      )}
                    </h3>
                    <p className="mt-1 text-[13px] text-ink-soft">
                      {authors.map((a, i) => (
                        <span key={i}>
                          <span className={a.bold ? "font-semibold text-ink" : ""}>
                            {a.name}
                          </span>
                          {i < authors.length - 1 ? ", " : "."}
                        </span>
                      ))}{" "}
                      <span className="italic text-muted-foreground">{p.venue}</span>.
                    </p>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 pt-6 border-t rule-soft">
              <p className="mg-label mb-3">Reviewer for</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-ink-soft">
                {reviewerFor.map((r) => (
                  <li
                    key={r}
                    className="before:content-['·'] before:mr-3 before:text-muted-foreground first:before:hidden"
                  >
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
