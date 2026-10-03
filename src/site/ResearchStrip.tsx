import { Link } from "react-router-dom";
import { Award, FileText } from "lucide-react";
import { publications, doiUrl, stats, researchThemes, researchNext } from "@/lib/content";
import { useLens } from "@/lib/lens";
import { FoHead, FoSection } from "./parts";
import { capitalise, spell } from "./format";

const HIGHLIGHTS = ["RAHMAN2021100037", "Rahman2020SmartSewer", "Islam2023CyberSecurity", "Johora2024CovidPrediction"];

export default function ResearchStrip({ alt }: { alt?: boolean }) {
  const lens = useLens();
  const awards = publications.filter((p) => p.award).length;
  const highlights = publications.filter((p) => HIGHLIGHTS.includes(p.key)).sort((a, b) => b.year - a.year);

  return (
    <FoSection id="research" alt={alt}>
      <FoHead
        eyebrow="Research"
        title={`${capitalise(spell(stats.publications))} papers, ${awards === 1 ? "one award" : `${spell(awards)} awards`}`}
        lede={`Applied ML, IoT and information security. ${stats.citations} citations, ${spell(stats.firstAuthor)} papers as first author, and ${stats.reviewsCompleted} manuscripts reviewed for ${stats.reviewer} journals and conferences.`}
        action={{ to: "/publications", label: "All publications" }}
      />

      <div className="fo-grid-3">
        {researchThemes.map((t) => (
          <article key={t.title} className="fo-card">
            <p className="fo-meta">{t.papers.length} {t.papers.length === 1 ? "paper" : "papers"}</p>
            <h3 className="fo-h4 mt-2">{t.title}</h3>
            <p className="fo-small mt-2">{t.summary}</p>
          </article>
        ))}
      </div>

      <ol className="fo-rows mt-10">
        {highlights.map((p) => {
          const first = (p.tags || []).includes("first-author");
          const href = doiUrl(p.doi);
          return (
            <li key={p.key} className="fo-row fo-row--dated">
              <span className="fo-meta">{p.year}</span>
              <div className="min-w-0">
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="fo-row-title text-pretty">
                    {p.title}
                  </a>
                ) : (
                  <p className="fo-row-title text-pretty">{p.title}</p>
                )}
                <p className="fo-small fo-muted mt-1 italic">{p.venue}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
                {p.award && (
                  <span className="fo-badge fo-badge--award" title={p.award}>
                    <Award size={12} strokeWidth={2} aria-hidden /> Best paper
                  </span>
                )}
                {first && <span className="fo-badge fo-badge--neutral">First author</span>}
                {p.pdf && (
                  <a href={p.pdf} target="_blank" rel="noreferrer" className="fo-badge fo-badge--neutral hover:text-[hsl(var(--accent))]" title="Read the PDF">
                    <FileText size={12} strokeWidth={1.9} aria-hidden /> PDF
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {lens === "academia" && (
        <p className="fo-lead mt-10 max-w-[56ch]">
          {researchNext} <Link to="/about" className="fo-inline !font-sans !text-[15px] !not-italic">Read the full story</Link>
        </p>
      )}
    </FoSection>
  );
}
