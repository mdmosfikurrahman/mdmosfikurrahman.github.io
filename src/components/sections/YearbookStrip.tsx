import { Link } from "react-router-dom";
import { yearbook } from "@/lib/content";

const KIND_LABEL: Record<string, string> = {
  milestone: "milestone",
  study: "study",
  work: "work",
  lead: "lead",
  research: "research",
  award: "award",
  talk: "talk",
};

export default function YearbookStrip() {
  const picks = yearbook
    .filter((y) =>
      [2004, 2008, 2014, 2016, 2018, 2020, 2021, 2022, 2024, 2026].includes(Number(y.year))
    )
    .sort((a, b) => Number(b.year) - Number(a.year));

  const currentYear = new Date().getFullYear();

  return (
    <section id="yearbook" className="border-b rule-soft relative overflow-hidden">
      <div className="shell py-16 md:py-24">
        <div className="mg">
          <div>
            <p className="sig">A Life In Years</p>
            <h2 className="font-display text-2xl md:text-3xl mt-1 tracking-tight">
              A life, in years
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-[13rem] leading-relaxed">
              A short yearbook. Newest first. Scholarships, papers, roles, and one stamp for whatever comes next.
            </p>
            <Link to="/yearbook" className="a-arrow text-sm mt-5 inline-block">
              Full story <span className="arw">→</span>
            </Link>
          </div>

          <ol className="min-w-0 relative border-l rule pl-6 md:pl-8">
            {picks.map((y, i) => {
              const isFuture = Number(y.year) > currentYear;
              return (
                <li key={`${y.year}-${i}`} className="relative py-4 first:pt-0 last:pb-0">
                  <span
                    aria-hidden
                    className={[
                      "absolute -left-[31px] md:-left-[39px] top-5 w-[9px] h-[9px] rounded-full border-2",
                      isFuture ? "bg-paper border-accent" : "bg-ink border-ink",
                    ].join(" ")}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-xl md:text-2xl tabular-nums leading-none text-ink">
                      {y.year}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {KIND_LABEL[y.kind]}
                      {y.place ? ` · ${y.place}` : ""}
                    </span>
                  </div>
                  <p className="mt-1.5 font-serif-body text-[1.05rem] leading-snug text-ink text-pretty">
                    {y.headline}
                  </p>
                  {y.detail && (
                    <p className="text-[13px] text-muted-foreground leading-snug mt-0.5">
                      {y.detail}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
