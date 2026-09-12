import type { ReactNode } from "react";
import { ArrowUpRight, Award, Globe2, Mic } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  profile,
  education,
  certifications,
  distinctions,
  reviewerFor,
  type Distinction,
} from "@/lib/content";
import { useCvUrl, useCvLabel, useAvatarUrl } from "@/lib/settings";

function kindIcon(kind: Distinction["kind"]) {
  if (kind === "exchange") return Globe2;
  if (kind === "talk") return Mic;
  return Award;
}

export default function About() {
  const cvUrl = useCvUrl();
  const cvLabel = useCvLabel();
  const avatar = useAvatarUrl();
  const educationSorted = [...education].sort(
    (a, b) => new Date(b.from).getTime() - new Date(a.from).getTime(),
  );

  return (
    <>
      <SiteHeader />
      <main>
        <header className="border-b rule-soft">
          <div className="shell py-14 md:py-20">
            <p className="sig">Profile</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-[-0.03em] mt-2 text-balance">
              A brief.
            </h1>
            <p className="mt-5 max-w-prose font-serif-body text-[1.075rem] leading-[1.6] text-ink-soft">
              A portrait, in prose: where the work started, where it has been, and where
              it is going. Told in three short acts, with the recognitions that mark them.
            </p>
          </div>
        </header>

        {/* Masthead */}
        <section className="border-b rule-soft">
          <div className="shell py-14">
            <div className="grid grid-cols-12 gap-8 md:gap-10 items-start">
              <figure className="col-span-12 md:col-span-4">
                <div className="relative mx-auto md:mx-0 w-[240px] md:w-full max-w-[320px]">
                  <div
                    className="absolute -inset-2 border rule rotate-[-3deg] bg-paper-deep/50"
                    aria-hidden
                  />
                  <div className="relative overflow-hidden border rule bg-paper-deep shadow-[0_1px_0_hsl(var(--ink)/0.04),0_16px_36px_-20px_hsl(var(--ink)/0.4)]">
                    <img
                      src={avatar}
                      alt="Portrait of Md. Mosfikur Rahman"
                      className="w-full h-auto block"
                      style={{
                        filter:
                          "sepia(0.38) saturate(0.82) contrast(0.92) brightness(0.98) hue-rotate(-4deg)",
                      }}
                      loading="eager"
                    />
                    <span
                      className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(110,70,40,0.12) 0%, rgba(110,70,40,0) 45%, rgba(30,20,10,0.18) 100%)",
                      }}
                      aria-hidden
                    />
                    <span
                      className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-ink/25 to-transparent pointer-events-none"
                      aria-hidden
                    />
                    <span className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-[0.22em] text-paper bg-ink/80 px-1.5 py-0.5">
                      Fig. 01
                    </span>
                  </div>
                  <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-relaxed">
                    {profile.name} <br />
                    {profile.role}
                  </figcaption>
                </div>
              </figure>

              <div className="col-span-12 md:col-span-8 min-w-0">
                <p className="sig">Dateline</p>
                <h2 className="font-display text-3xl md:text-4xl leading-[1.05] tracking-[-0.025em] mt-2 text-balance">
                  {profile.name}
                </h2>
                <p className="mt-3 font-serif-body text-[1.125rem] leading-[1.6] text-ink-soft max-w-prose">
                  Dhaka-based backend architect. Ten peer-reviewed papers and an IEEE Best
                  Paper Award along the way, with current work on a configurable OTA
                  platform at iBOS.
                </p>

                <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 max-w-xl">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Based in
                    </dt>
                    <dd className="mt-1 text-[15px] text-ink-soft">{profile.location}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Currently
                    </dt>
                    <dd className="mt-1 text-[15px] text-ink-soft">{profile.roleLong}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1 text-[15px]">
                      <a className="a" href={`mailto:${profile.email}`}>
                        {profile.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Elsewhere
                    </dt>
                    <dd className="mt-1 text-[15px] flex flex-wrap gap-x-4 gap-y-1">
                      <a className="a" href={profile.links.github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                      <a className="a" href={profile.links.linkedin} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                      <a className="a" href={profile.links.scholar} target="_blank" rel="noreferrer">
                        Scholar
                      </a>
                      <a className="a" href={profile.links.orcid} target="_blank" rel="noreferrer">
                        ORCID
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Act I: Origin */}
        <Act kicker="Act I" title="Tangail to Dhaka.">
          <p>
            The schooling was provincial and plural: a cadet madrasah through class four,
            a primary-school scholarship in 2008, SSC and HSC in Tangail, before the move
            to Dhaka in 2018 to read Computer Science and Engineering at Daffodil
            International University.
          </p>
          <p>
            Undergraduate research began earlier than the timing might suggest. A first
            IEEE paper on an IoT-based autonomous smart-sewerage system was presented at
            WIECON-ECE 2020, won the Best Paper Award, and quietly seeded everything that
            came afterwards. Three journal papers followed in 2021, two as first author,
            on the mental-health and situational aftermath of COVID-19, all in Elsevier's{" "}
            <em className="italic">Current Research in Behavioral Sciences</em>. A
            mid-degree Erasmus+ exchange at Adam Mickiewicz University in Poznań closed
            the undergraduate chapter.
          </p>
        </Act>

        <DistinctionsRail items={distinctions.filter((d) => d.year <= 2021)} />

        {/* Act II: Work */}
        <Act kicker="Act II" title="Backend, shipped.">
          <p>
            Career began in April 2022 at BJIT Group, building GraphQL BFF services for
            Rakuten Echiba in Japan and a Thymeleaf-driven corporate CMS for Denka. Two
            lessons from that room: how to hold a resolver graph steady under nested
            joins, and how Japanese enterprise software is reviewed for calmness as much
            as correctness.
          </p>
          <p>
            At REVE Systems (2023–24), I shipped production modules on the national NBR
            Customs Bond Management System: a full-stack engagement across Spring Boot,
            Thymeleaf, and Oracle, collaborating with senior engineers on system design,
            with a ~25% throughput lift earned through query tuning and OAuth2 hardening.
            Since November 2024 at iBOS, the work has been backend architecture and
            system design for Travilo, a multi-client OTA SaaS platform on .NET 9 —
            scalable, configurable, rule-driven services, on-call production support, and
            mentoring the junior engineers on the team. Service-boundary-first work.
            Details under wraps until launch.
          </p>
        </Act>

        {/* Act III: Now & Next */}
        <Act kicker="Act III" title="In review, in transit.">
          <p>
            The preference these days is the quiet half of software: services, schemas,
            and workflows that hold a product together once traffic arrives. Configuration
            over code, explicit rules over clever ones, boundaries over clever shortcuts.
          </p>
          <p>
            Alongside work, peer-review service for{" "}
            <em className="italic">ISA Transactions</em>, the{" "}
            <em className="italic">
              Journal of King Saud University, Computer and Information Sciences
            </em>
            , the <em className="italic">Natural Language Processing Journal</em>, and
            several others below. Next on the runway: more writing, more shipping, and a
            deliberate return to formal research, ideally in a doctoral program where
            configurable systems, security, and applied ML intersect. Until then, more of
            the same, written carefully.
          </p>
        </Act>

        <DistinctionsRail items={distinctions.filter((d) => d.year > 2021)} />

        {/* Endmatter: Schools */}
        <section className="border-t rule bg-paper-deep/40">
          <div className="shell py-14">
            <div className="mg">
              <div>
                <p className="mg-label">Endnotes · Schools</p>
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
                      {fmt(e.from)} – {fmt(e.to)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Endmatter: Certifications */}
        <section className="border-t rule">
          <div className="shell py-14">
            <div className="mg">
              <div>
                <p className="mg-label">Endnotes · Certifications</p>
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
                          <span className="text-muted-foreground">·</span>
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

        {/* Endmatter: Reviewer service */}
        <section className="border-t rule bg-paper-deep/40">
          <div className="shell py-14">
            <div className="mg">
              <div>
                <p className="mg-label">Endnotes · Editorial service</p>
              </div>
              <div className="min-w-0">
                <p className="font-serif-body text-[1rem] leading-[1.65] text-ink-soft max-w-prose">
                  Reviewer for the following journals and conferences:
                </p>
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

        {/* Contact footer */}
        <section className="border-t rule">
          <div className="shell py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="sig">Correspondence</p>
              <h2 className="font-display text-2xl md:text-3xl tracking-tight mt-2 max-w-[28ch] text-balance">
                Comments, questions, or quiet collaborations.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <a className="a-arrow" href={`mailto:${profile.email}`}>
                Write <span className="arw">→</span>
              </a>
              <a
                className="a-arrow"
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
              >
                {cvLabel} <ArrowUpRight size={14} strokeWidth={1.6} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Act({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b rule-soft">
      <div className="shell py-14 md:py-16">
        <div className="mg">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              {kicker}
            </p>
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-3xl md:text-4xl tracking-[-0.02em] text-pretty max-w-[22ch]">
              {title}
            </h2>
            <div className="mt-6 space-y-5 font-serif-body text-[1.075rem] leading-[1.7] text-ink-soft max-w-prose">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DistinctionsRail({ items }: { items: Distinction[] }) {
  if (items.length === 0) return null;
  return (
    <section className="border-b rule-soft bg-paper-deep/40">
      <div className="shell py-10 md:py-12">
        <div className="mg">
          <div>
            <p className="mg-label">Distinctions</p>
          </div>
          <ul className="min-w-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {items.map((d) => {
              const Icon = kindIcon(d.kind);
              return (
                <li
                  key={`${d.year}-${d.headline}`}
                  className="pl-4 border-l-2"
                  style={{ borderColor: "hsl(var(--accent))" }}
                >
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <Icon
                      size={14}
                      strokeWidth={1.6}
                      aria-hidden
                      style={{ color: "hsl(var(--accent-deep))" }}
                    />
                    <span>{d.year}</span>
                    <span className="w-6 h-px bg-rule-soft" aria-hidden />
                    <span>{d.issuer}</span>
                  </p>
                  <h3 className="mt-1.5 font-display text-[1.2rem] md:text-[1.35rem] leading-snug tracking-tight">
                    {d.headline}
                  </h3>
                  {d.detail && (
                    <p className="mt-1 text-[13.5px] text-ink-soft leading-relaxed text-pretty">
                      {d.detail}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function fmt(iso: string) {
  if (iso === "present") return "present";
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}
