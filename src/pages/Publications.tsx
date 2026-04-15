import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { publications, doiUrl, formatAuthors, reviewerFor } from "@/lib/content";

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

  const list = useMemo(() => {
    return publications.filter((p) => {
      if (filter === "first" && !(p.tags || []).includes("first-author")) return false;
      if (["journal", "conference", "chapter"].includes(filter) && p.type !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = [p.title, p.venue, (p.tags || []).join(" "), p.authors.join(" ")]
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
              proceedings, and edited volumes. {counts.first} as first author. Every entry links
              to its DOI.
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
              {[
                { k: "Journals", v: counts.journal },
                { k: "Conferences", v: counts.conference },
                { k: "Chapters", v: counts.chapter },
                { k: "First-author", v: counts.first },
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
        <section className="border-b rule-soft bg-paper-deep/40">
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
                placeholder="Search title, venue, author…"
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
                {list.map((p, i) => {
                  const authors = formatAuthors(p.authors);
                  return (
                    <li
                      key={p.key}
                      className="py-7 grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-x-4 md:gap-x-8 items-baseline"
                    >
                      <span className="font-mono text-[11px] text-muted-foreground pt-[3px] whitespace-nowrap">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-serif-body text-[1.075rem] md:text-[1.15rem] leading-snug text-ink text-pretty">
                          {p.doi ? (
                            <a className="a" href={doiUrl(p.doi)} target="_blank" rel="noreferrer">
                              {p.title}
                            </a>
                          ) : (
                            p.title
                          )}
                        </h2>
                        <p className="mt-1.5 text-[13px] text-ink-soft leading-snug">
                          {authors.map((a, i) => (
                            <span key={i}>
                              <span className={a.bold ? "font-semibold text-ink" : ""}>
                                {a.name}
                              </span>
                              {i < authors.length - 1 ? ", " : "."}
                            </span>
                          ))}{" "}
                          <span className="italic text-muted-foreground">{p.venue}</span>
                          {p.volume ? `, ${p.volume}` : ""}
                          {p.pages ? `, pp. ${p.pages}` : ""}.
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {p.type} · {p.year}
                          {p.doi && (
                            <>
                              {" · "}
                              <a
                                href={doiUrl(p.doi)}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-accent"
                              >
                                doi:{p.doi}
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                      <span className="hidden md:inline font-mono text-[11px] text-muted-foreground whitespace-nowrap pt-[3px]">
                        {p.year}
                      </span>
                    </li>
                  );
                })}
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
