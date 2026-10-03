import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { roles, education, talksAndService, stats } from "@/lib/content";
import { FoPage, FoSection, FoHead, Stats, TimelineItem } from "@/site/parts";
import { duration, fmtRange } from "@/site/format";
import { pageZoom } from "@/lib/zoom";

const SECTIONS = [
  { id: "employment", label: "Employment" },
  { id: "education", label: "Education" },
  { id: "talks", label: "Talks & service" },
] as const;

// Sticky site header (64) plus the section bar (~54).
const OFFSET = 128;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - (OFFSET - 48) * pageZoom();
  window.scrollTo({ top: y, behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}

function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const onScroll = () => {
      const line = OFFSET * pageZoom();
      let current: string = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top - line <= 0) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && SECTIONS.some((s) => s.id === hash)) requestAnimationFrame(() => scrollToSection(hash));
  }, []);
  return active;
}

export default function Experience() {
  const active = useActiveSection();

  return (
    <FoPage
      eyebrow="Experience"
      title={<>Experience in <em>chronology</em></>}
      lede="A full record of where I have worked, what I shipped there, and what else I have spent time on. Everything here is verifiable."
      extra={
        <Stats
          items={[
            { v: `${stats.years}+`, k: "Years in industry", onClick: () => scrollToSection("employment") },
            { v: roles.length, k: "Companies", onClick: () => scrollToSection("employment") },
            { v: education.length, k: "Schools", onClick: () => scrollToSection("education") },
            { v: talksAndService.length, k: "Talks and service", onClick: () => scrollToSection("talks") },
          ]}
        />
      }
    >
      <nav aria-label="Sections" className="fo-subnav">
        <div className="fo-wrap fo-subnav-inner">
          <div className="fo-tabs">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(s.id);
                }}
                aria-current={active === s.id ? "true" : undefined}
                className="fo-tab"
              >
                {s.label}
              </a>
            ))}
          </div>
          <Link to="/work" className="fo-link !text-[13.5px]">
            Projects and case studies <span className="arw" aria-hidden>→</span>
          </Link>
        </div>
      </nav>

      <FoSection id="employment">
        <FoHead eyebrow="Employment" title="Where I have worked" />
        <ol className="fo-tl">
          {roles.map((r) => (
            <TimelineItem key={r.company} when={fmtRange(r.from, r.to)} sub={duration(r.from, r.to)} current={r.to === "present"}>
              <article className="fo-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="fo-h3">
                      <a href={r.companyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-[hsl(var(--accent))] transition-colors">
                        {r.company}
                        <ArrowUpRight size={15} strokeWidth={1.8} className="fo-muted" aria-hidden />
                      </a>
                    </h3>
                    <p className="fo-small fo-muted mt-1">{r.title} · {r.place}</p>
                  </div>
                  {r.to === "present" && (
                    <span className="fo-badge">
                      <span className="fo-dot" aria-hidden /> Current
                    </span>
                  )}
                </div>
                <p className="fo-body mt-5 max-w-[70ch]">{r.summary}</p>
                <ul className="fo-checks mt-5">
                  {r.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <ul className="fo-tags mt-6">
                  {r.stack.map((s) => (
                    <li key={s} className="fo-tag">{s}</li>
                  ))}
                </ul>
              </article>
            </TimelineItem>
          ))}
        </ol>
      </FoSection>

      <FoSection id="education" alt>
        <FoHead eyebrow="Education" title="Where I studied" />
        <ol className="fo-tl">
          {education.map((e) => (
            <TimelineItem key={e.school} when={fmtRange(e.from, e.to)} sub={duration(e.from, e.to)}>
              <article className="fo-card">
                <h3 className="fo-h4">
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noreferrer" className="hover:text-[hsl(var(--accent))] transition-colors">
                      {e.school}
                    </a>
                  ) : (
                    e.school
                  )}
                </h3>
                <p className="fo-small mt-1.5">
                  {e.degree}. <span className="fo-muted">{e.note}</span>
                </p>
                {e.place && <p className="fo-small fo-muted mt-0.5">{e.place}</p>}
              </article>
            </TimelineItem>
          ))}
        </ol>
      </FoSection>

      <FoSection id="talks">
        <FoHead eyebrow="Talks & service" title="Speaking, teaching and community work" />
        <ol className="fo-rows">
          {talksAndService.map((t, i) => (
            <li key={i} className="fo-row fo-row--dated">
              <span className="fo-meta">{t.year}</span>
              <p className="fo-body min-w-0">{t.title}</p>
              <span className="fo-badge fo-badge--neutral md:justify-self-end">{t.kind}</span>
            </li>
          ))}
        </ol>
      </FoSection>
    </FoPage>
  );
}
