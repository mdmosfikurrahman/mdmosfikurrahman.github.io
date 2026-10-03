import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Award, FileText, Github, Globe2, GraduationCap, IdCard, Linkedin, Mail, Mic, type LucideIcon } from "lucide-react";
import { profile, certifications, distinctions, type Distinction } from "@/lib/content";
import { useCvDownload, useAvatarUrl } from "@/lib/settings";
import { FoPage, FoSection, FoHead } from "@/site/parts";
import Channel from "@/site/Channel";

function kindIcon(kind: Distinction["kind"]) {
  if (kind === "exchange") return Globe2;
  if (kind === "talk") return Mic;
  return Award;
}

export default function About() {
  const cv = useCvDownload();
  const avatar = useAvatarUrl();

  const links: { label: string; href: string; Icon: LucideIcon; what: string }[] = [
    { label: "GitHub", href: profile.links.github, Icon: Github, what: "GitHub link" },
    { label: "LinkedIn", href: profile.links.linkedin, Icon: Linkedin, what: "LinkedIn link" },
    { label: "Scholar", href: profile.links.scholar, Icon: GraduationCap, what: "Google Scholar link" },
    { label: "ORCID", href: profile.links.orcid, Icon: IdCard, what: "ORCID link" },
  ];

  return (
    <FoPage
      eyebrow="About"
      title={<>A <em>brief</em></>}
      lede="A portrait, in prose: where the work started, where it has been, and where it is going. Told in three short acts, with the recognitions that mark them."
    >
      <FoSection tight>
        <div className="grid gap-8 md:grid-cols-[240px,minmax(0,1fr)] md:gap-12 items-center">
          <figure className="fo-portrait !block w-[200px] md:w-full">
            <img src={avatar} alt={`Portrait of ${profile.name}`} loading="eager" />
          </figure>
          <div className="min-w-0">
            <p className="fo-chip">{profile.role}</p>
            <h2 className="fo-h2 mt-4">{profile.name}</h2>
            <p className="fo-lead mt-3 max-w-[54ch]">
              Dhaka-based backend architect. Ten peer-reviewed papers and an IEEE Best Paper Award along the way,
              with current work on a configurable OTA platform at iBOS.
            </p>
            <dl className="mt-7 grid gap-x-10 gap-y-5 sm:grid-cols-2 max-w-xl">
              <Fact label="Based in">{profile.location}</Fact>
              <Fact label="Currently">{profile.roleLong}</Fact>
            </dl>
            <div className="mt-7">
              <p className="fo-overline">Reach me</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Channel size="sm" variant="primary" href={`mailto:${profile.email}`} label="Email me" Icon={Mail} copyText={profile.email} copyWhat="Email address" />
                {links.map((l) => (
                  <Channel key={l.label} size="sm" href={l.href} label={l.label} Icon={l.Icon} copyText={l.href} copyWhat={l.what} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </FoSection>

      <section className="fo-section !pt-0">
        <div className="fo-wrap">
          <Act mark="I" label="Act one" title="Tangail to Dhaka.">
            <p>
              The schooling was provincial and plural: a cadet madrasah through class four, a primary-school scholarship in 2008,
              SSC and HSC in Tangail, before the move to Dhaka in 2018 to read Computer Science and Engineering at Daffodil
              International University.
            </p>
            <p>
              Undergraduate research began earlier than the timing might suggest. A first IEEE paper on an IoT-based autonomous
              smart-sewerage system was presented at WIECON-ECE 2020, won the Best Paper Award, and quietly seeded everything that
              came afterwards. Three journal papers followed in 2021, two as first author, on the mental-health and situational
              aftermath of COVID-19, all in Elsevier's <em>Current Research in Behavioral Sciences</em>. A mid-degree Erasmus+
              exchange at Adam Mickiewicz University in Poznań closed the undergraduate chapter.
            </p>
            <Distinctions items={distinctions.filter((d) => d.year <= 2021)} />
          </Act>

          <Act mark="II" label="Act two" title="Backend, shipped.">
            <p>
              Career began in April 2022 at BJIT Group, building GraphQL BFF services for Rakuten Echiba in Japan and a
              Thymeleaf-driven corporate CMS for Denka. Two lessons from that room: how to hold a resolver graph steady under
              nested joins, and how Japanese enterprise software is reviewed for calmness as much as correctness.
            </p>
            <p>
              At REVE Systems (2023–24), I shipped production modules on the national NBR Customs Bond Management System: a
              full-stack engagement across Spring Boot, Thymeleaf, and Oracle, collaborating with senior engineers on system
              design, with a ~25% throughput lift earned through query tuning and OAuth2 hardening. Since November 2024 at iBOS,
              the work has been backend architecture and system design for Travilo, a multi-client OTA SaaS platform on .NET 9:
              scalable, configurable, rule-driven services, on-call production support, and mentoring the junior engineers on
              the team. Service-boundary-first work. Details under wraps until launch.
            </p>
          </Act>

          <Act mark="III" label="Act three" title="In review, in transit.">
            <p>
              The preference these days is the quiet half of software: services, schemas, and workflows that hold a product
              together once traffic arrives. Configuration over code, explicit rules over clever ones, boundaries over clever
              shortcuts.
            </p>
            <p>
              Alongside work, peer-review service for <em>ISA Transactions</em>, the{" "}
              <em>Journal of King Saud University, Computer and Information Sciences</em>, the{" "}
              <em>Natural Language Processing Journal</em>, and several others. Next on the runway: more writing, more shipping,
              and a deliberate return to formal research, ideally in a doctoral program where configurable systems, security,
              and applied ML intersect. Until then, more of the same, written carefully.
            </p>
            <Distinctions items={distinctions.filter((d) => d.year > 2021)} />
          </Act>
        </div>
      </section>

      <FoSection id="certifications" alt>
        <FoHead eyebrow="Certifications" title="Courses and certificates" />
        <div className="fo-grid-3">
          {certifications.map((c, i) => (
            <article key={i} className="fo-card">
              <h3 className="fo-h4">{c.group}</h3>
              <p className="fo-small fo-muted mt-0.5">{c.issuer}</p>
              <ul className="fo-checks mt-4">
                {c.items.map((it, j) => (
                  <li key={j} className="!text-[14px]">{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </FoSection>

      <section className="fo-band">
        <div className="fo-wrap">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="fo-eyebrow">Correspondence</p>
              <h2 className="fo-h2 mt-3 max-w-[22ch]">Comments, questions, or quiet collaborations.</h2>
            </div>
            <div className="fo-actions">
              <Channel variant="primary" href={`mailto:${profile.email}`} label="Write to me" Icon={Mail} copyText={profile.email} copyWhat="Email address" />
              <a href={cv.href} target="_blank" rel="noreferrer" download={cv.download || undefined} className="fo-btn fo-btn--secondary">
                <FileText size={16} strokeWidth={1.8} aria-hidden /> {cv.label}
              </a>
              <Link to="/work" className="fo-btn fo-btn--secondary">See my work</Link>
            </div>
          </div>
        </div>
      </section>
    </FoPage>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="fo-overline">{label}</dt>
      <dd className="fo-body fo-ink mt-1.5">{children}</dd>
    </div>
  );
}

function Act({ mark, label, title, children }: { mark: string; label: string; title: string; children: ReactNode }) {
  return (
    <section className="fo-act">
      <div className="fo-act-mark" aria-hidden>
        <b>{mark}</b>
        <span className="fo-overline">{label}</span>
      </div>
      <div className="min-w-0">
        <h2 className="fo-h2">{title}</h2>
        <div className="fo-prose mt-6">{children}</div>
      </div>
    </section>
  );
}

function Distinctions({ items }: { items: Distinction[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="fo-grid-2 !mt-8 max-w-[66ch] font-sans">
      {items.map((d) => {
        const Icon = kindIcon(d.kind);
        return (
          <li key={`${d.year}-${d.headline}`} className="fo-card !p-5">
            <div className="flex items-center gap-2.5">
              <span
                className="grid place-items-center w-8 h-8 rounded-lg"
                style={
                  d.kind === "award"
                    ? { background: "hsl(var(--gold-wash))", color: "hsl(var(--gold-deep))" }
                    : { background: "hsl(var(--accent-wash))", color: "hsl(var(--accent-deep))" }
                }
              >
                <Icon size={15} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="fo-meta">{d.year}</span>
            </div>
            <h3 className="fo-h4 mt-3">{d.headline}</h3>
            <p className="fo-small fo-muted mt-0.5">{d.issuer}</p>
            {d.detail && <p className="fo-small mt-2">{d.detail}</p>}
          </li>
        );
      })}
    </ul>
  );
}
