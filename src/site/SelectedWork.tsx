import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { caseStudies, projects, type Project } from "@/lib/content";
import { FoHead, FoSection } from "./parts";
import { fmtMonth } from "./format";

// Only Work and the case study page carry figures. The landing variant (Home,
// Hire) pairs the short summary with what the work was instead.
export function CaseStudyFeature({ metrics = 4, landing }: { metrics?: number; landing?: boolean }) {
  const cs = caseStudies[0];
  if (!cs) return null;
  return (
    <Link to={`/work/${cs.slug}`} className="fo-feature fo-card--link group">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="fo-badge">Case study</span>
          <span className="fo-meta">
            {cs.org} · {fmtMonth(cs.from)} – {fmtMonth(cs.to)}
          </span>
        </div>
        <h3 className="fo-h2 fo-card-title mt-5">{cs.name}</h3>
        <p className="fo-body mt-3 max-w-[52ch]">{landing ? cs.landingSummary : cs.summary}</p>
        <p className="fo-link mt-6">
          Read the case study <span className="arw" aria-hidden>→</span>
        </p>
      </div>
      {landing ? (
        <dl className="fo-specs">
          <div className="fo-spec">
            <dt>Role</dt>
            <dd>{cs.role}</dd>
          </div>
          <div className="fo-spec">
            <dt>Systems</dt>
            <dd>
              <ul className="fo-spec-list">
                {cs.architecture.core.map((c) => (
                  <li key={c.label}>{c.label}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="fo-spec">
            <dt>Stack</dt>
            <dd>
              <ul className="fo-tags">
                {cs.stack.map((t) => (
                  <li key={t} className="fo-tag">{t}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      ) : (
        <dl className="fo-metrics">
          {cs.metrics.slice(0, metrics).map((m) => (
            <div key={m.k} className="fo-metric">
              <dt className="sr-only">{m.k}</dt>
              <dd>
                <b>{m.v}</b>
                <span>{m.k}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Link>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="fo-meta">{p.year}</span>
        {p.href && <ArrowUpRight size={16} strokeWidth={1.8} className="fo-muted" aria-hidden />}
      </div>
      <h3 className="fo-h3 fo-card-title mt-4">{p.name}</h3>
      <p className="fo-small fo-muted mt-1">{p.at}</p>
      <p className="fo-small mt-4">{p.blurb}</p>
      <ul className="fo-tags mt-auto pt-5">
        {p.tags.map((t) => (
          <li key={t} className="fo-tag">{t}</li>
        ))}
      </ul>
    </>
  );
  return p.href ? (
    <a href={p.href} target="_blank" rel="noreferrer" className="fo-card fo-card--link flex flex-col">
      {body}
    </a>
  ) : (
    <div className="fo-card flex flex-col">{body}</div>
  );
}

export default function SelectedWork({ alt }: { alt?: boolean }) {
  const others = projects.filter((p) => !p.flagship);
  return (
    <FoSection id="work" alt={alt}>
      <FoHead
        eyebrow="Selected work"
        title="Systems I have designed and shipped"
        lede="Production work across travel, government compliance and e-commerce."
        action={{ to: "/work", label: "All work" }}
      />
      <CaseStudyFeature landing />
      <div className="fo-grid-3 mt-4">
        {others.map((p) => (
          <ProjectCard key={p.name} p={p} />
        ))}
      </div>
    </FoSection>
  );
}
