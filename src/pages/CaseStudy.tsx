import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { caseStudies, profile } from "@/lib/content";
import { FoPage } from "@/site/parts";
import Channel from "@/site/Channel";
import { emphasise, fmtRange } from "@/site/format";
import { pageZoom } from "@/lib/zoom";

const BLOCKS = [
  { id: "context", label: "Context" },
  { id: "problem", label: "The problem" },
  { id: "architecture", label: "Architecture" },
  { id: "built", label: "What I built" },
  { id: "leadership", label: "Leadership" },
  { id: "outcome", label: "Outcome" },
] as const;

function useActiveBlock() {
  const [active, setActive] = useState<string>(BLOCKS[0].id);
  useEffect(() => {
    const onScroll = () => {
      const line = 140 * pageZoom();
      let current: string = BLOCKS[0].id;
      for (const b of BLOCKS) {
        const el = document.getElementById(b.id);
        if (el && el.getBoundingClientRect().top - line <= 0) current = b.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return active;
}

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="fo-cs-block">
      <h2 className="fo-h2 !text-[1.75rem]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Arrow() {
  return (
    <div className="fo-dg-arrow" aria-hidden>
      <ArrowRight size={18} strokeWidth={1.8} />
    </div>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const cs = caseStudies.find((c) => c.slug === slug);
  const active = useActiveBlock();
  if (!cs) return <Navigate to="/work" replace />;
  const a = cs.architecture;

  return (
    <FoPage
      crumbs={[{ to: "/work", label: "Work" }]}
      here={cs.name}
      eyebrow="Case study"
      title={emphasise(cs.title, cs.emphasis)}
      lede={cs.summary}
      extra={
        <dl className="fo-facts">
          <div>
            <dt className="fo-overline">Role</dt>
            <dd>{cs.role}</dd>
          </div>
          <div>
            <dt className="fo-overline">Company</dt>
            <dd>
              <a className="fo-inline" href={cs.orgUrl} target="_blank" rel="noreferrer">{cs.org}</a>
            </dd>
          </div>
          <div>
            <dt className="fo-overline">Timeline</dt>
            <dd>{fmtRange(cs.from, cs.to)}</dd>
          </div>
          <div>
            <dt className="fo-overline">Stack</dt>
            <dd>{cs.stack.join(", ")}</dd>
          </div>
        </dl>
      }
    >
      <section className="fo-section fo-section--tight">
        <div className="fo-wrap">
          <dl className="fo-metrics fo-metrics--4">
            {cs.metrics.map((m) => (
              <div key={m.k} className="fo-metric">
                <dt className="sr-only">{m.k}</dt>
                <dd>
                  <b>{m.v}</b>
                  <span>{m.k}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="fo-section !pt-4">
        <div className="fo-wrap fo-cs">
          <nav className="fo-toc" aria-label="On this page">
            <p className="fo-overline mb-3">On this page</p>
            {BLOCKS.map((b) => (
              <a key={b.id} href={`#${b.id}`} aria-current={active === b.id ? "true" : undefined}>
                {b.label}
              </a>
            ))}
          </nav>

          <div className="min-w-0">
            <Block id="context" title="Context">
              <div className="fo-prose">
                {cs.context.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Block>

            <Block id="problem" title="The problem">
              <div className="fo-prose">
                {cs.problem.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Block>

            <Block id="architecture" title="Architecture">
              <p className="fo-body max-w-[66ch]">
                The shape of the platform at the level that is public. Requests from every channel meet one set of services; search
                fans out to the suppliers and streams results back as they arrive.
              </p>
              <div className="fo-diagram mt-6">
                <div className="fo-dg-col">
                  <h4 className="fo-overline">Channels</h4>
                  {a.channels.map((n) => (
                    <div key={n.label} className="fo-dg-node">
                      {n.label}
                      {n.note && <small>{n.note}</small>}
                    </div>
                  ))}
                </div>
                <Arrow />
                <div className="fo-dg-col">
                  <h4 className="fo-overline">Platform</h4>
                  {a.core.map((n, i) => (
                    <div key={n.label} className={["fo-dg-node", i === 0 ? "fo-dg-core" : ""].join(" ")}>
                      {n.label}
                      {n.note && <small>{n.note}</small>}
                    </div>
                  ))}
                  <div className="fo-dg-node !bg-transparent !border-dashed">
                    Data
                    <small>{a.data}</small>
                  </div>
                </div>
                <Arrow />
                <div className="fo-dg-col">
                  <h4 className="fo-overline">Suppliers</h4>
                  {a.suppliers.map((n) => (
                    <div key={n.label} className="fo-dg-node">
                      {n.label}
                      {n.note && <small>{n.note}</small>}
                    </div>
                  ))}
                </div>
              </div>
            </Block>

            <Block id="built" title="What I built">
              <div className="fo-grid-2">
                {cs.built.map((b, i) => (
                  <article key={b.title} className="fo-card">
                    <p className="fo-meta">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="fo-h4 mt-2">{b.title}</h3>
                    <p className="fo-small mt-2">{b.body}</p>
                  </article>
                ))}
              </div>
            </Block>

            <Block id="leadership" title="Leadership">
              <div className="fo-prose">
                {cs.leadership.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Block>

            <Block id="outcome" title="Outcome">
              <ul className="fo-checks max-w-[66ch]">
                {cs.outcome.map((p, i) => (
                  <li key={i} className="!text-[1.0625rem]">{p}</li>
                ))}
              </ul>
            </Block>

            <div className="mt-16 fo-card flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="fo-h4">Building something with the same shape?</p>
                <p className="fo-small fo-muted mt-1">Multi-tenant rules, supplier fan-out, or a platform that has to stay up.</p>
              </div>
              <div className="fo-actions">
                <Channel variant="primary" href={`mailto:${profile.email}`} label="Email me" Icon={Mail} copyText={profile.email} copyWhat="Email address" size="sm" />
                <Link to="/experience" className="fo-btn fo-btn--secondary fo-btn--sm">
                  Full experience <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </FoPage>
  );
}
