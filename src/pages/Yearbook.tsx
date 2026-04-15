import { useMemo } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { yearbook, education, certifications } from "@/lib/content";

const KIND_LABEL: Record<string, string> = {
  milestone: "Milestone",
  study: "Study",
  work: "Work",
  lead: "Leadership",
  research: "Research",
  award: "Award",
  talk: "Talk",
};

const KIND_TONE: Record<string, string> = {
  milestone: "text-accent border-accent/40",
  study: "text-ink-soft border-rule",
  work: "text-ink border-ink/30",
  lead: "text-ink-soft border-rule",
  research: "text-accent border-accent/40",
  award: "text-accent border-accent/40",
  talk: "text-ink-soft border-rule",
};

function fmt(iso: string) {
  if (iso === "present") return "present";
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function Yearbook() {
  const groupedByYear = useMemo(() => {
    const map = new Map<number, typeof yearbook>();
    yearbook.forEach((e) => {
      const y = Number(e.year);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(e);
    });
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, []);

  const educationSorted = useMemo(
    () => [...education].sort((a, b) => new Date(b.from).getTime() - new Date(a.from).getTime()),
    []
  );

  const currentYear = new Date().getFullYear();
  // Life span — computed from an anchor the site never surfaces.
  const LIFE_ANCHOR = new Date(1998, 10, 11);
  const totalSpan = Math.floor(
    (Date.now() - LIFE_ANCHOR.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <header className="relative border-b rule overflow-hidden">
          <div className="halftone-faint absolute inset-0 opacity-50 pointer-events-none" aria-hidden />
          <div className="shell relative py-14 md:py-20">
            <p className="sig">Storybook</p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.035em] mt-3 text-balance max-w-[22ch]">
              A lifelong <span className="italic font-light">storybook</span> — from{" "}
              <span className="text-accent">Tangail</span> to{" "}
              <span className="text-accent">Dhaka</span>.
            </h1>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-y-3 max-w-2xl border-t rule-soft pt-4">
              {[
                { k: "Entries", v: yearbook.length },
                { k: "Years so far", v: totalSpan },
                { k: "Schools", v: education.length },
                { k: "Certifications", v: certifications.reduce((a, c) => a + c.items.length, 0) },
              ].map((s) => (
                <div key={s.k} className="flex items-baseline gap-2">
                  <span className="font-display text-2xl md:text-3xl tabular-nums">{s.v}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {s.k}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Year-grouped storybook */}
        <section className="relative">
          <div className="shell py-10 md:py-14">
            <ol>
              {groupedByYear.map(([year, entries], gi) => {
                const isFuture = year > currentYear;
                return (
                  <li
                    key={year}
                    id={`y-${year}`}
                    className="relative grid grid-cols-1 md:grid-cols-[180px,1fr] lg:grid-cols-[220px,1fr] gap-4 md:gap-10 py-8 md:py-10 border-b rule-soft last:border-b-0 scroll-mt-20"
                  >
                    {/* Year tombstone */}
                    <div className="md:sticky md:top-20 self-start">
                      <div className="flex items-baseline md:items-start gap-3 md:flex-col md:gap-1">
                        <span
                          className={[
                            "font-display tabular-nums leading-[0.9] tracking-[-0.04em]",
                            "text-5xl md:text-[5.25rem] lg:text-[6.5rem]",
                            isFuture ? "text-muted-foreground" : "text-ink",
                          ].join(" ")}
                        >
                          {year}
                        </span>
                        {year === currentYear && (
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent border border-accent/50 px-1.5 py-0.5 leading-none">
                            Now
                          </span>
                        )}
                        {isFuture && (
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground border border-muted-foreground/40 px-1.5 py-0.5 leading-none">
                            Ahead
                          </span>
                        )}
                      </div>
                      <div className="hidden md:block mt-3 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                        {entries.length} {entries.length === 1 ? "entry" : "entries"}
                      </div>
                    </div>

                    {/* Entries */}
                    <ol className="min-w-0 space-y-6 md:space-y-7">
                      {entries.map((e, ei) => (
                        <li key={ei} className="group">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                            <span
                              className={[
                                "font-mono text-[10px] uppercase tracking-[0.2em] border px-2 py-0.5",
                                KIND_TONE[e.kind] || "text-ink-soft border-rule",
                              ].join(" ")}
                            >
                              {KIND_LABEL[e.kind]}
                            </span>
                            {e.place && (
                              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                {e.place}
                              </span>
                            )}
                            <span
                              className="flex-1 hidden sm:block h-px bg-rule-soft"
                              aria-hidden
                            />
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                              {String(ei + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}
                            </span>
                          </div>
                          <h3 className="font-display text-[1.35rem] md:text-2xl leading-[1.15] tracking-tight text-pretty">
                            {e.headline}
                          </h3>
                          {e.detail && (
                            <p className="mt-2 font-serif-body text-[1rem] leading-[1.65] text-ink-soft max-w-prose text-pretty">
                              {e.detail}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Education */}
        <section className="border-t rule bg-paper-deep/40">
          <div className="shell py-14">
            <div className="mg">
              <div>
                <p className="sig">Schools</p>
                <p className="mt-4 text-sm text-muted-foreground max-w-[14rem] leading-relaxed">
                  The places where the work began — from cadet madrasah to Erasmus exchange.
                </p>
              </div>
              <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
                {educationSorted.map((e) => (
                  <li
                    key={e.school}
                    className="py-5 grid grid-cols-1 md:grid-cols-[1fr,auto] gap-2 md:gap-8 items-baseline"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-lg md:text-xl tracking-tight">
                        {e.url ? (
                          <a className="a" href={e.url} target="_blank" rel="noreferrer">
                            {e.school}
                          </a>
                        ) : (
                          e.school
                        )}
                      </h3>
                      <p className="text-[14px] text-ink-soft">
                        {e.degree}.{" "}
                        <span className="text-muted-foreground">
                          {e.note}
                          {e.place ? ` · ${e.place}` : ""}
                        </span>
                      </p>
                    </div>
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap">
                      {fmt(e.from)} — {fmt(e.to)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="border-t rule">
          <div className="shell py-14">
            <div className="mg">
              <div>
                <p className="sig">Certifications</p>
                <p className="mt-4 text-sm text-muted-foreground max-w-[14rem] leading-relaxed">
                  A long habit of structured learning — data science, machine learning, programming, security.
                </p>
              </div>
              <div className="min-w-0 space-y-8">
                {certifications.map((c, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b rule pb-2">
                      <h3 className="font-display text-lg tracking-tight">{c.group}</h3>
                      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {c.issuer}
                      </span>
                    </div>
                    <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-[14px] text-ink-soft">
                      {c.items.map((it, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="text-muted-foreground">—</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
