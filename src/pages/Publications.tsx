import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ChevronDown, ExternalLink, FileText, Search } from "lucide-react";
import { publications, doiUrl, formatAuthors, reviewerFor, stats, type Publication } from "@/lib/content";
import { FoPage, FoSection, FoHead, Stats } from "@/site/parts";

type Filter = "all" | "journal" | "conference" | "chapter" | "first";

const LABELS: Record<Filter, string> = {
  all: "All",
  journal: "Journals",
  conference: "Conferences",
  chapter: "Chapters",
  first: "First author",
};

const isFirst = (p: Publication) => (p.tags || []).includes("first-author");

export default function Publications() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const list = useMemo(
    () =>
      publications.filter((p) => {
        if (filter === "first" && !isFirst(p)) return false;
        if (["journal", "conference", "chapter"].includes(filter) && p.type !== filter) return false;
        const q = query.trim().toLowerCase();
        if (q) {
          const hay = [p.title, p.venue, (p.tags || []).join(" "), (p.keywords || []).join(" "), p.authors.join(" "), p.abstract || ""]
            .join(" ")
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [filter, query],
  );

  const counts: Record<Filter, number> = {
    all: publications.length,
    journal: publications.filter((p) => p.type === "journal").length,
    conference: publications.filter((p) => p.type === "conference").length,
    chapter: publications.filter((p) => p.type === "chapter").length,
    first: publications.filter(isFirst).length,
  };
  const awards = publications.filter((p) => p.award).length;

  return (
    <FoPage
      eyebrow="Research"
      title={<>Published <em>research</em></>}
      lede={`${counts.all} peer-reviewed works across journals, IEEE and Springer proceedings, and edited volumes. Each entry opens into a research dossier: the problem, the method, what was found and why it matters.`}
      extra={
        <Stats
          items={[
            { v: counts.all, k: "Peer-reviewed papers", n: `${awards === 1 ? "one" : awards} IEEE Best Paper Award` },
            { v: stats.citations, k: "Citations", n: "Google Scholar" },
            { v: counts.first, k: "As first author" },
            { v: stats.reviewsCompleted, k: "Manuscripts reviewed", n: `for ${stats.reviewer} journals and conferences` },
          ]}
        />
      }
    >
      <div className="fo-subnav">
        <div className="fo-wrap fo-subnav-inner">
          <div className="fo-tabs" role="group" aria-label="Filter publications">
            {(Object.keys(LABELS) as Filter[]).map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className="fo-tab">
                {LABELS[f]} <small>{counts[f]}</small>
              </button>
            ))}
          </div>
          <label className="fo-search">
            <span className="sr-only">Search publications</span>
            <Search size={15} strokeWidth={1.9} className="absolute left-3 top-1/2 -translate-y-1/2 fo-muted" aria-hidden />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, venue, keyword" className="fo-input" />
          </label>
        </div>
      </div>

      <FoSection id="papers" tight>
        {list.length === 0 ? (
          <p className="fo-body fo-muted">No publications match that search.</p>
        ) : (
          <ol className="grid gap-4">
            {list.map((p) => (
              <Entry key={p.key} paper={p} open={openKey === p.key} onToggle={() => setOpenKey(openKey === p.key ? null : p.key)} />
            ))}
          </ol>
        )}
      </FoSection>

      <FoSection id="reviewer" alt>
        <FoHead eyebrow="Editorial service" title="Peer reviewer for" lede={`${stats.reviewsCompleted} manuscripts reviewed so far.`} />
        <ul className="fo-rows">
          {reviewerFor.map((r) => (
            <li key={r} className="fo-row">
              <p className="fo-body fo-ink">{r}</p>
            </li>
          ))}
        </ul>
      </FoSection>
    </FoPage>
  );
}

function Entry({ paper, open, onToggle }: { paper: Publication; open: boolean; onToggle: () => void }) {
  const authors = formatAuthors(paper.authors);
  const href = doiUrl(paper.doi);
  const hasDossier = !!(paper.abstract || paper.problem || paper.solution || paper.methodology || paper.keyFindings || paper.impact);

  return (
    <li className="fo-card fo-pub">
      <div className="fo-pub-year">
        {paper.year}
        <small>{paper.type}</small>
      </div>

      <div className="min-w-0">
        <h2 className="fo-h3 text-pretty">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="hover:text-[hsl(var(--accent))] transition-colors">
              {paper.title}
            </a>
          ) : (
            paper.title
          )}
        </h2>

        <p className="fo-small mt-2">
          {authors.map((a, i) => (
            <span key={i}>
              <span className={a.bold ? "fo-ink font-semibold" : undefined}>{a.name}</span>
              {i < authors.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          <span className="italic fo-muted">
            {paper.venue}
            {paper.volume ? `, ${paper.volume}` : ""}
            {paper.pages ? `, pp. ${paper.pages}` : ""}.
          </span>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {paper.award && (
            <span className="fo-badge fo-badge--award">
              <Award size={12} strokeWidth={2} aria-hidden /> {paper.award}
            </span>
          )}
          {isFirst(paper) && <span className="fo-badge fo-badge--neutral">First author</span>}
          {paper.doi && href && (
            <a href={href} target="_blank" rel="noreferrer" className="fo-meta hover:text-[hsl(var(--accent))] transition-colors">
              doi:{paper.doi}
            </a>
          )}
          {typeof paper.citations === "number" && paper.citations > 0 && (
            <span className="fo-meta">
              {paper.citations} citation{paper.citations === 1 ? "" : "s"}
            </span>
          )}
          {paper.pdf && (
            <a href={paper.pdf} target="_blank" rel="noreferrer" className="fo-badge fo-badge--neutral hover:text-[hsl(var(--accent))]">
              <FileText size={12} strokeWidth={1.9} aria-hidden /> PDF
            </a>
          )}
          {hasDossier && (
            <button type="button" onClick={onToggle} aria-expanded={open} className="fo-tab ml-auto !h-8 !border-[hsl(var(--rule))]">
              {open ? "Close dossier" : "Read dossier"}
              <ChevronDown size={14} strokeWidth={2} className={["transition-transform duration-300", open ? "rotate-180" : ""].join(" ")} aria-hidden />
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {open && hasDossier && (
            <motion.div
              key="dossier"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              className="overflow-hidden"
            >
              <Dossier paper={paper} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="fo-overline">{label}</h4>
      <p>{children}</p>
    </div>
  );
}

function Dossier({ paper }: { paper: Publication }) {
  const href = doiUrl(paper.doi);
  return (
    <div className="fo-dossier">
      {paper.abstract && <Block label="Abstract">{paper.abstract}</Block>}
      {(paper.problem || paper.challenges) && (
        <div className="grid gap-5 md:grid-cols-2">
          {paper.problem && <Block label="Problem">{paper.problem}</Block>}
          {paper.challenges && <Block label="Challenges">{paper.challenges}</Block>}
        </div>
      )}
      {paper.solution && (
        <div className="fo-callout">
          <Block label="Proposed solution">{paper.solution}</Block>
        </div>
      )}
      {(paper.methodology || paper.keyFindings) && (
        <div className="grid gap-5 md:grid-cols-2">
          {paper.methodology && <Block label="Methodology">{paper.methodology}</Block>}
          {paper.keyFindings && <Block label="Key findings">{paper.keyFindings}</Block>}
        </div>
      )}
      {paper.impact && <Block label="Impact">{paper.impact}</Block>}
      {paper.keywords && paper.keywords.length > 0 && (
        <div>
          <h4 className="fo-overline">Keywords</h4>
          <ul className="fo-tags mt-2">
            {paper.keywords.map((k) => (
              <li key={k} className="fo-tag !bg-[hsl(var(--paper))]">{k}</li>
            ))}
          </ul>
        </div>
      )}
      {href && (
        <a href={href} target="_blank" rel="noreferrer" className="fo-btn fo-btn--secondary fo-btn--sm w-fit">
          <ExternalLink size={14} strokeWidth={1.9} aria-hidden /> View the publication
        </a>
      )}
    </div>
  );
}
