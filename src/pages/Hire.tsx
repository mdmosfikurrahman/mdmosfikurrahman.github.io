import { Navigate } from "react-router-dom";
import { ArrowUpRight, Github, Mail } from "lucide-react";
import { freelance, profile } from "@/lib/content";
import { useHireLinks, useHireMeEnabled } from "@/lib/settings";
import { FoPage, FoSection, FoHead } from "@/site/parts";
import { emphasise } from "@/site/format";
import { CaseStudyFeature } from "@/site/SelectedWork";
import Channel from "@/site/Channel";

// ".NET 9 microservices" and the ".NET 9 microservice" gig are the same thing.
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "").replace(/s$/, "");

export default function Hire() {
  const enabled = useHireMeEnabled();
  const links = useHireLinks();
  if (!freelance.available || !enabled) return <Navigate to="/" replace />;

  const gigFor = (title: string) => links.find((l) => norm(l.label) === norm(title));
  const extraGigs = links.filter((l) => !freelance.services.some((s) => norm(s.title) === norm(l.label)));
  const lastWord = freelance.headline.replace(/[?.!]$/, "").split(" ").pop() ?? "";

  return (
    <FoPage
      eyebrow="Hire me"
      title={emphasise(freelance.headline, lastWord)}
      lede={freelance.blurb}
      extra={
        <div className="fo-actions">
          <Channel variant="primary" href={`mailto:${profile.email}`} label="Email me" Icon={Mail} copyText={profile.email} copyWhat="Email address" />
          {freelance.links.fiverr && (
            <a href={freelance.links.fiverr} target="_blank" rel="noreferrer" className="fo-btn fo-btn--secondary">
              Fiverr profile <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden />
            </a>
          )}
          {freelance.links.upwork && (
            <a href={freelance.links.upwork} target="_blank" rel="noreferrer" className="fo-btn fo-btn--secondary">
              Upwork profile <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden />
            </a>
          )}
          <span className="fo-chip">
            <span className="fo-dot fo-dot--live" aria-hidden />
            {freelance.label}
          </span>
        </div>
      }
    >
      <FoSection id="services">
        <FoHead eyebrow="Services" title="What I take on" lede="Backend work in .NET and Java, plus the frontend wiring that has to meet it." />
        <div className="fo-grid-2">
          {freelance.services.map((s, i) => {
            const gig = gigFor(s.title);
            return (
              <article key={s.title} className="fo-card flex flex-col">
                <p className="fo-meta">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="fo-h3 mt-3">{s.title}</h3>
                <p className="fo-body mt-2">{s.detail}</p>
                {gig && (
                  <a href={gig.url} target="_blank" rel="noreferrer" className="fo-link mt-auto pt-6">
                    See the gig <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden />
                  </a>
                )}
              </article>
            );
          })}
        </div>
        {extraGigs.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="fo-small fo-muted">Also offered:</span>
            {extraGigs.map((g) => (
              <a key={g.url} href={g.url} target="_blank" rel="noreferrer" className="fo-link">
                {g.label} <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden />
              </a>
            ))}
          </div>
        )}
      </FoSection>

      <FoSection id="process" alt>
        <FoHead eyebrow="Process" title="How an engagement runs" />
        <ol className="fo-grid-2 lg:!grid-cols-4">
          {freelance.process.map((step, i) => (
            <li key={step.title} className="fo-card">
              <span className="fo-badge">Step {i + 1}</span>
              <h3 className="fo-h4 mt-4">{step.title}</h3>
              <p className="fo-small mt-2">{step.detail}</p>
            </li>
          ))}
        </ol>
        <dl className="fo-facts mt-10">
          <div>
            <dt className="fo-overline">Capacity</dt>
            <dd>{freelance.capacity}</dd>
          </div>
          <div>
            <dt className="fo-overline">Response</dt>
            <dd>{freelance.responseTime}</dd>
          </div>
          <div>
            <dt className="fo-overline">Based in</dt>
            <dd>{profile.location}</dd>
          </div>
          <div>
            <dt className="fo-overline">Stack</dt>
            <dd>.NET 9, Spring Boot, SQL, Next.js</dd>
          </div>
        </dl>
      </FoSection>

      <FoSection id="proof">
        <FoHead eyebrow="Proof" title="Read the work before you hire" />
        <CaseStudyFeature landing />
        <a href={freelance.standardUrl} target="_blank" rel="noreferrer" className="fo-card fo-card--link mt-4 flex items-start gap-4">
          <span className="fo-channel-icon shrink-0" aria-hidden>
            <Github size={16} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="fo-h4 fo-card-title">Flavian, on GitHub</p>
            <p className="fo-small mt-1">My clean-architecture foundation for .NET 9: the standard every engagement is built to.</p>
          </div>
          <ArrowUpRight size={16} strokeWidth={1.8} className="fo-muted ml-auto shrink-0" aria-hidden />
        </a>
      </FoSection>

      <section className="fo-band">
        <div className="fo-wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="fo-eyebrow">Start here</p>
            <h2 className="fo-h2 mt-3 max-w-[20ch]">Have a backend problem? Send it over.</h2>
          </div>
          <div className="fo-actions">
            <Channel variant="primary" href={`mailto:${profile.email}`} label="Email me" Icon={Mail} copyText={profile.email} copyWhat="Email address" />
          </div>
        </div>
      </section>
    </FoPage>
  );
}
