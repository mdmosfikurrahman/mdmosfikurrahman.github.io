import { roles, education, stats } from "@/lib/content";
import { FoHead, FoSection } from "./parts";
import { duration, fmtRange } from "./format";

// Degree-level study only; schooling lives on /experience.
const DEGREES = ["Daffodil International University", "Adam Mickiewicz University"];

export default function ExperienceStrip({ alt }: { alt?: boolean }) {
  const study = education
    .filter((e) => DEGREES.includes(e.school))
    .sort((a, b) => DEGREES.indexOf(a.school) - DEGREES.indexOf(b.school));

  return (
    <FoSection id="record" alt={alt}>
      <FoHead
        eyebrow="Record"
        title="Experience and education"
        lede={`${stats.years}+ years across ${roles.length} companies, after a B.Sc. in Computer Science and Engineering with an Erasmus+ semester in Poland.`}
        action={{ to: "/experience", label: "Full record" }}
      />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] lg:gap-16">
        <div>
          <h3 className="fo-overline pb-3">Experience</h3>
          <ol className="fo-rows">
            {roles.map((r) => (
              <li key={r.company} className="fo-row fo-row--split">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a href={r.companyUrl} target="_blank" rel="noreferrer" className="fo-row-title">
                      {r.company}
                    </a>
                    {r.to === "present" && <span className="fo-badge">Current</span>}
                  </div>
                  <p className="fo-small mt-1">{r.title}</p>
                </div>
                <div>
                  <p className="fo-meta whitespace-nowrap">{fmtRange(r.from, r.to)}</p>
                  <p className="fo-small fo-muted mt-0.5">{duration(r.from, r.to)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="fo-overline pb-3">Education</h3>
          <ol className="fo-rows">
            {study.map((e) => (
              <li key={e.school} className="fo-row">
                <div className="min-w-0">
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noreferrer" className="fo-row-title">{e.school}</a>
                  ) : (
                    <p className="fo-row-title">{e.school}</p>
                  )}
                  <p className="fo-small mt-1">{e.degree}</p>
                  <p className="fo-small fo-muted mt-0.5">{e.note}</p>
                </div>
                <p className="fo-meta">{fmtRange(e.from, e.to)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </FoSection>
  );
}
