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
            <p className="sig">RECORD 03 / INTELLIGENCE</p>
            <h2 className="font-display text-2xl md:text-3xl mt-2 tracking-tight uppercase">
              Research &amp; service
            </h2>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] max-w-[16rem] leading-relaxed"
               style={{ color: "hsl(var(--muted))" }}>
              <span style={{ color: "hsl(var(--accent))" }}>&gt; </span>
              ten peer-reviewed papers · one IEEE best paper. each opens into a full intelligence dossier.
            </p>
            <Link to="/publications" className="a-arrow text-sm mt-5 inline-block">
              [ ARCHIVE ] <span className="arw">→</span>
            </Link>
          </div>

          <div className="min-w-0">
            <ol className="space-y-7">
              {highlights.map((p) => {
                const authors = formatAuthors(p.authors);
                return (
                  <li key={p.key} className="group">
                    <div className="flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.18em]"
                         style={{ color: "hsl(var(--muted))" }}>
                      <span style={{ color: "hsl(var(--accent))" }}>{p.year}</span>
                      <span className="h-px flex-1 translate-y-[-2px]"
                            style={{ background: "hsl(var(--rule))" }} />
                      {p.award && (
                        <span className="pill solid inline-flex items-center gap-1" title={p.award}>
                          <Award className="w-3 h-3" aria-hidden />
                          IEEE BEST
                        </span>
                      )}
                      <span className="pill muted">{p.type}</span>
                    </div>
                    <h3 className="mt-2 font-display text-[1rem] md:text-[1.075rem] leading-snug text-pretty"
                        style={{ color: "hsl(var(--ink))" }}>
                      {p.doi ? (
                        <a
                          className="a hover:text-[hsl(var(--accent))]"
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
                    <p className="mt-1.5 font-mono text-[11.5px] leading-relaxed"
                       style={{ color: "hsl(var(--ink-soft))" }}>
                      {authors.map((a, i) => (
                        <span key={i}>
                          <span style={{ color: a.bold ? "hsl(var(--accent))" : undefined, fontWeight: a.bold ? 600 : 400 }}>
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
              <p className="mg-label mb-3">[ PEER REVIEW DUTY ]</p>
              <ul className="flex flex-wrap gap-1.5">
                {reviewerFor.map((r) => (
                  <li key={r} className="pill muted">{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
