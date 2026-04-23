import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ChevronDown, ExternalLink } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  publications,
  doiUrl,
  formatAuthors,
  reviewerFor,
  type Publication,
} from "@/lib/content";

type Filter = "all" | "journal" | "conference" | "chapter" | "first";

const filterLabels: Record<Filter, string> = {
  all: "All",
  journal: "Journals",
  conference: "Conferences",
  chapter: "Chapters",
  first: "First-author",
};

export default function Publications() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const list = useMemo(() => {
    return publications.filter((p) => {
      if (filter === "first" && !(p.tags || []).includes("first-author")) return false;
      if (["journal", "conference", "chapter"].includes(filter) && p.type !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = [
          p.title,
          p.venue,
          (p.tags || []).join(" "),
          (p.keywords || []).join(" "),
          p.authors.join(" "),
          p.abstract || "",
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filter, query]);

  const counts = {
    total: publications.length,
    journal: publications.filter((p) => p.type === "journal").length,
    conference: publications.filter((p) => p.type === "conference").length,
    chapter: publications.filter((p) => p.type === "chapter").length,
    first: publications.filter((p) => (p.tags || []).includes("first-author")).length,
    awards: publications.filter((p) => p.award).length,
  };

  return (
    <>
      <SiteHeader />
      <main>
        <header className="border-b rule-soft">
          <div className="shell py-14 md:py-20">
            <p className="sig">Bibliography</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-[-0.03em] mt-2 text-balance">
              Publications.
            </h1>
            <p className="mt-5 max-w-prose font-serif-body text-[1.075rem] leading-[1.6] text-ink-soft">
              {counts.total} peer-reviewed works across journals, IEEE / Springer conference
              proceedings, and edited volumes. {counts.first} as first author, {counts.awards}{" "}
              IEEE Best Paper Award. Each entry opens into a research dossier: abstract,
              problem, methodology, findings, and impact, drawn from the published manuscript.
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-3">
              {[
                { k: "Journals", v: counts.journal },
                { k: "Conferences", v: counts.conference },
                { k: "Chapters", v: counts.chapter },
                { k: "First-author", v: counts.first },
                { k: "Best paper", v: counts.awards },
              ].map((s) => (
                <div key={s.k} className="flex items-baseline gap-3">
                  <span className="font-display text-3xl leading-none">{s.v}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {s.k}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Filters */}
        <section className="border-b rule-soft bg-paper-deep/40 sticky top-14 z-30 backdrop-blur-md">
          <div className="shell py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 -mx-0.5">
              {(Object.keys(filterLabels) as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={[
                    "px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.16em] border rule transition-colors whitespace-nowrap",
                    filter === f
                      ? "bg-ink text-paper border-ink"
                      : "text-muted-foreground hover:text-ink hover:border-ink/60",
                  ].join(" ")}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>
            <label className="relative flex items-center w-full md:w-64">
              <span className="sr-only">Search publications</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, venue, keyword…"
                className="w-full bg-transparent border-b rule py-1.5 pr-2 text-[13px] focus:outline-none focus:border-accent placeholder:text-whisper"
              />
              <span className="absolute right-0 font-mono text-[10px] text-muted-foreground">
                {list.length}
              </span>
            </label>
          </div>
        </section>

        {/* List */}
        <section>
          <div className="shell py-10 md:py-14">
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matches for that query.</p>
            ) : (
              <ol className="divide-y rule-soft border-y rule-soft">
                {list.map((p, i) => (
                  <PublicationEntry
                    key={p.key}
                    paper={p}
                    index={i}
                    open={openKey === p.key}
                    onToggle={() => setOpenKey(openKey === p.key ? null : p.key)}
                  />
                ))}
              </ol>
            )}
          </div>
        </section>

        {/* Reviewer service */}
        <section className="border-t rule-soft bg-paper-deep/40">
          <div className="shell py-14">
            <div className="mg">
              <div>
                <p className="mg-label">Editorial service</p>
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-2xl tracking-tight">Reviewer for</h2>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-[15px] text-ink-soft max-w-prose">
                  {reviewerFor.map((r) => (
                    <li key={r} className="flex gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground pt-[5px]">·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function PublicationEntry({
  paper,
  index,
  open,
  onToggle,
}: {
  paper: Publication;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const authors = formatAuthors(paper.authors);
  const hasDossier =
    !!paper.abstract ||
    !!paper.problem ||
    !!paper.solution ||
    !!paper.methodology ||
    !!paper.keyFindings ||
    !!paper.impact;

  return (
    <li
      className={[
        "py-7 grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-x-4 md:gap-x-8 items-baseline transition-colors",
        open ? "bg-paper-deep/30" : "",
      ].join(" ")}
    >
      <span className="font-mono text-[11px] text-muted-foreground pt-[3px] whitespace-nowrap">
        [{String(index + 1).padStart(2, "0")}]
      </span>

      <div className="min-w-0">
        <h2 className="font-serif-body text-[1.075rem] md:text-[1.15rem] leading-snug text-ink text-pretty">
          {paper.doi ? (
            <a className="a" href={doiUrl(paper.doi)} target="_blank" rel="noreferrer">
              {paper.title}
            </a>
          ) : (
            paper.title
          )}
        </h2>

        <p className="mt-1.5 text-[13px] text-ink-soft leading-snug">
          {authors.map((a, ai) => (
            <span key={ai}>
              <span className={a.bold ? "font-semibold text-ink" : ""}>{a.name}</span>
              {ai < authors.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          <span className="italic text-muted-foreground">{paper.venue}</span>
          {paper.volume ? `, ${paper.volume}` : ""}
          {paper.pages ? `, pp. ${paper.pages}` : ""}.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {paper.type} · {paper.year}
            {paper.doi && (
              <>
                {" · "}
                <a
                  href={doiUrl(paper.doi)}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent"
                >
                  doi:{paper.doi}
                </a>
              </>
            )}
          </p>

          {paper.award && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border rule-soft bg-[hsl(var(--accent-wash))] text-[10px] font-mono uppercase tracking-[0.16em] text-[hsl(var(--accent-deep))]">
              <Award className="w-3 h-3" aria-hidden />
              {paper.award}
            </span>
          )}

          {hasDossier && (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent transition-colors"
            >
              <span>{open ? "Close dossier" : "Read dossier"}</span>
              <ChevronDown
                className={[
                  "w-3.5 h-3.5 transition-transform duration-300",
                  open ? "rotate-180" : "",
                ].join(" ")}
                aria-hidden
              />
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
              transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
              className="overflow-hidden"
            >
              <Dossier paper={paper} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="hidden md:inline font-mono text-[11px] text-muted-foreground whitespace-nowrap pt-[3px]">
        {paper.year}
      </span>
    </li>
  );
}

function Dossier({ paper }: { paper: Publication }) {
  return (
    <div className="mt-6 pt-6 border-t rule-soft space-y-6">
      {paper.abstract && (
        <Block label="Abstract" lead>
          {paper.abstract}
        </Block>
      )}

      {(paper.problem || paper.challenges) && (
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          {paper.problem && <Block label="Problem">{paper.problem}</Block>}
          {paper.challenges && <Block label="Challenges">{paper.challenges}</Block>}
        </div>
      )}

      {paper.solution && (
        <div
          className="pl-4 border-l-2"
          style={{ borderColor: "hsl(var(--accent))" }}
        >
          <p
            className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2"
            style={{ color: "hsl(var(--accent-deep))" }}
          >
            Proposed solution
          </p>
          <p className="font-serif-body text-[15.5px] leading-[1.65] text-ink text-pretty">
            {paper.solution}
          </p>
        </div>
      )}

      {(paper.methodology || paper.keyFindings) && (
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          {paper.methodology && <Block label="Methodology">{paper.methodology}</Block>}
          {paper.keyFindings && <Block label="Key findings">{paper.keyFindings}</Block>}
        </div>
      )}

      {paper.impact && <Block label="Impact">{paper.impact}</Block>}

      {paper.keywords && paper.keywords.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Keywords
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-ink-soft">
            {paper.keywords.map((kw) => (
              <li
                key={kw}
                className="before:content-['·'] before:mr-3 before:text-muted-foreground first:before:hidden"
              >
                {kw}
              </li>
            ))}
          </ul>
        </div>
      )}

      {paper.doi && (
        <div className="pt-2">
          <a
            href={doiUrl(paper.doi)}
            target="_blank"
            rel="noreferrer"
            className="a-arrow font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
            <span>View publication</span>
            <span className="arw">→</span>
          </a>
        </div>
      )}
    </div>
  );
}

function Block({
  label,
  lead,
  children,
}: {
  label: string;
  lead?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {label}
      </p>
      <p
        className={[
          "font-serif-body text-pretty leading-[1.65] text-ink-soft",
          lead ? "text-[15.5px]" : "text-[14.5px]",
        ].join(" ")}
      >
        {children}
      </p>
    </div>
  );
}
