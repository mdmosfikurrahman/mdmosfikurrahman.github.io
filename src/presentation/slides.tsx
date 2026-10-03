// Slide content for Present mode. The deck shell (components/PresentationDeck.tsx)
// supplies the frame, chrome, animation and arrow navigation. Projects and
// publications are the focus: every project and every paper is its own
// dossier slide. Single data source stays @/lib/content.
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github, Linkedin, Mail, GraduationCap, FileText, Award,
  ArrowUpRight, ChevronDown, Download, Maximize2,
  type LucideIcon,
} from "lucide-react";
import {
  profile, preamble, figures, roles, projects,
  publications, doiUrl, formatAuthors, reviewerFor, skillGroups,
  education, distinctions, talksAndService, verifiedBadges,
  type Publication,
} from "@/lib/content";
import type { DeckId } from "@/lib/presentation";
import { useCvUrl, useCvLabel, useAvatarUrl } from "@/lib/settings";
import Channel from "@/site/Channel";

function fmt(iso: string) {
  if (iso === "present") return "Present";
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/* ── Title ──────────────────────────────────────────────────────────── */
const channels: { Icon: LucideIcon; href: string; label: string; ext?: boolean }[] = [
  { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
  { Icon: Github, href: profile.links.github, label: "GitHub", ext: true },
  { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn", ext: true },
  { Icon: GraduationCap, href: profile.links.scholar, label: "Scholar", ext: true },
  { Icon: FileText, href: profile.cvUrl, label: "CV", ext: true },
];

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 + i * 0.09 },
  }),
};

const pop = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: 0.55 + i * 0.1 },
  }),
};

function TitleSlide() {
  const cvUrl = useCvUrl();
  const cvLabel = useCvLabel();
  const avatar = useAvatarUrl();
  const titleChannels = channels.map((c) =>
    c.label === "CV" ? { ...c, href: cvUrl, label: cvLabel } : c,
  );
  const tagline = profile.tagline;
  const at = tagline.indexOf("quiet half");
  return (
    <div className="relative w-full mx-auto max-w-[1040px]">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr),250px] lg:gap-14 items-center">
        <div className="min-w-0">
          <motion.p custom={0} variants={rise} initial="hidden" animate="show" className="sig">
            {profile.role}
          </motion.p>
          <motion.h1 custom={1} variants={rise} initial="hidden" animate="show"
              className="mt-5 font-display leading-[0.98] tracking-[-0.05em] text-[clamp(2.2rem,5.6vw,4.6rem)]"
              style={{ color: "hsl(var(--ink))" }}>
            {profile.name}
          </motion.h1>
          <motion.p custom={2} variants={rise} initial="hidden" animate="show"
             className="mt-6 max-w-[36ch] text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.4]"
             style={{ fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif", color: "hsl(var(--ink-soft))" }}>
            {at >= 0 ? (
              <>
                {tagline.slice(0, at)}
                <em className="kn-mark">quiet half</em>
                {tagline.slice(at + "quiet half".length)}
              </>
            ) : tagline}
          </motion.p>
          <motion.p custom={3} variants={rise} initial="hidden" animate="show"
             className="mt-5 max-w-[60ch] text-[clamp(0.95rem,1.2vw,1.08rem)] leading-[1.6]"
             style={{ color: "hsl(var(--muted))" }}>
            Engineering Team Lead at <strong style={{ color: "hsl(var(--ink-soft))" }}>Akij iBOS Ltd.</strong>, where I designed
            and built a multi-client OTA platform from an empty repository. {publications.length} peer-reviewed papers and an
            IEEE Best Paper Award along the way.
          </motion.p>
          <motion.div custom={4} variants={rise} initial="hidden" animate="show"
              className="mt-6 flex items-center gap-x-5 gap-y-2 flex-wrap">
            {titleChannels.map(({ Icon, href, label, ext }) => (
              <a key={label} href={href} target={ext ? "_blank" : undefined} rel={ext ? "noreferrer" : undefined}
                 className="inline-flex items-center gap-1.5 text-[13.5px] font-medium transition-colors hover:text-[hsl(var(--accent))]"
                 style={{ color: "hsl(var(--muted))" }}>
                <Icon size={15} strokeWidth={1.9} /> {label}
              </a>
            ))}
          </motion.div>
        </div>
        <motion.figure custom={1} variants={pop} initial="hidden" animate="show" className="hidden lg:block kn-portrait">
          <img src={avatar} alt="Portrait of Md. Mosfikur Rahman" loading="eager" />
        </motion.figure>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-y-6 pt-6 border-t rule">
        {figures.map((f, i) => (
          <motion.div key={f.k} custom={i} variants={pop} initial="hidden" animate="show"
               className={i ? "md:pl-6 md:border-l rule-soft" : ""}>
            <div className="font-display text-[clamp(1.6rem,2.8vw,2.3rem)] leading-none tracking-[-0.04em] tabular-nums"
                 style={{ color: "hsl(var(--ink))" }}>{f.v}</div>
            <div className="mt-2 text-[13px] font-semibold first-letter:uppercase" style={{ color: "hsl(var(--ink))" }}>{f.k}</div>
            <p className="mt-0.5 text-[12px]" style={{ color: "hsl(var(--muted))" }}>{f.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Earlier experience ─────────────────────────────────────────────── */
function ExperienceSlide() {
  const earlier = roles.slice(1); // previous roles (current is the "Now" slide)
  return (
    <div>
      <p className="sig">Earlier experience</p>
      <h2 className="mt-5 font-display leading-[1.0] tracking-[-0.04em] text-[clamp(1.8rem,4vw,3.25rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        Where I <span className="kn-mark">shipped before.</span>
      </h2>
      <div className="mt-7 grid lg:grid-cols-2 gap-5">
        {earlier.map((r) => (
          <div key={r.company} className="kn-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
              <div>
                <h3 className="font-display text-[clamp(1.25rem,2.2vw,1.7rem)] tracking-[-0.03em]"
                    style={{ color: "hsl(var(--ink))" }}>
                  <a className="a" href={r.companyUrl} target="_blank" rel="noreferrer">{r.company}</a>
                </h3>
                <p className="mt-1 text-[13px]" style={{ color: "hsl(var(--muted))" }}>{r.title} · {r.place}</p>
              </div>
              <span className="kn-pill px-3 py-1 text-[12px] font-medium tabular-nums shrink-0">
                {fmt(r.from)} – {fmt(r.to)}
              </span>
            </div>
            <p className="mt-4 text-[13.5px] leading-[1.55]" style={{ color: "hsl(var(--ink-soft))" }}>
              {r.summary}
            </p>
            <ul className="mt-4 space-y-2">
              {r.bullets.slice(0, 3).map((b, i) => (
                <li key={i} className="flex gap-3 text-[13px] leading-[1.45]">
                  <span className="font-mono text-[11px] pt-[2px] shrink-0 font-semibold tabular-nums"
                        style={{ color: "hsl(var(--accent))" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ color: "hsl(var(--ink-soft))" }}>{b}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-4 pt-3.5 flex flex-wrap gap-2 border-t rule-soft">
              {r.stack.map((s) => <li key={s} className="kn-pill px-2.5 py-1 text-[11.5px]">{s}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Now ────────────────────────────────────────────────────────────── */
function NowSlide() {
  const r = roles[0];
  return (
    <div>
      <p className="sig">Right now</p>
      <h2 className="mt-5 font-display leading-[1.0] tracking-[-0.04em] text-[clamp(1.8rem,4vw,3.25rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        What I&apos;m <span className="kn-mark">building today.</span>
      </h2>
      <div className="mt-7 kn-card p-7 md:p-9">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
          <div>
            <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.9rem)] tracking-[-0.03em]" style={{ color: "hsl(var(--ink))" }}>
              <a className="a" href={r.companyUrl} target="_blank" rel="noreferrer">{r.company}</a>
            </h3>
            <p className="mt-1.5 text-[14px]" style={{ color: "hsl(var(--muted))" }}>{r.title} · {r.place}</p>
          </div>
          <span className="kn-pill px-3.5 py-1.5 text-[12.5px] font-medium tabular-nums">{fmt(r.from)} – {fmt(r.to)}</span>
        </div>
        <p className="mt-5 max-w-[70ch] text-[clamp(0.97rem,1.3vw,1.15rem)] leading-[1.6]" style={{ color: "hsl(var(--ink-soft))" }}>
          {r.summary}
        </p>
        <ul className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-3">
          {r.bullets.map((b, i) => (
            <li key={i} className="flex gap-4 text-[14px] leading-[1.5]">
              <span className="font-mono text-[12px] pt-[2px] shrink-0 font-semibold tabular-nums" style={{ color: "hsl(var(--accent))" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ color: "hsl(var(--ink-soft))" }}>{b}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-6 pt-5 flex flex-wrap gap-2 border-t rule-soft">
          {r.stack.map((s) => <li key={s} className="kn-pill px-3 py-1 text-[12px]">{s}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ── Toolbox ────────────────────────────────────────────────────────── */
function SkillsSlide() {
  return (
    <div>
      <p className="sig">Toolbox</p>
      <h2 className="mt-5 font-display leading-[1.0] tracking-[-0.04em] text-[clamp(1.8rem,4vw,3.25rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        What I <span className="kn-mark">reach for.</span>
      </h2>
      <dl className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillGroups.map((g) => (
          <div key={g.label} className="kn-card p-5">
            <dt className="flex items-center gap-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.16em]"
                style={{ color: "hsl(var(--accent))" }}>
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "hsl(var(--accent))" }} />
              {g.label}
            </dt>
            <dd className="mt-3.5 flex flex-wrap gap-2">
              {g.items.map((it) => <span key={it} className="kn-pill px-2.5 py-1 text-[12.5px]">{it}</span>)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ── Section divider ────────────────────────────────────────────────── */
function Divider({ kicker, title, sub, verifyHref }:
  { kicker: string; title: string; sub: string; verifyHref?: string }) {
  return (
    <div className="text-center">
      <p className="sig justify-center">{kicker}</p>
      <h2 className="mt-7 font-display leading-[0.95] tracking-[-0.05em] text-[clamp(2.75rem,9vw,6rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        <span className="kn-mark">{title}</span>
      </h2>
      <p className="mt-6 text-[clamp(1rem,1.5vw,1.3rem)]" style={{ color: "hsl(var(--ink-soft))" }}>{sub}</p>
      {verifyHref && (
        <a href={verifyHref} target="_blank" rel="noreferrer"
           className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold"
           style={{ color: "hsl(var(--accent))" }}>
          Verify on Google Scholar <ArrowUpRight size={14} strokeWidth={2.2} />
        </a>
      )}
    </div>
  );
}

/* ── Project dossier ────────────────────────────────────────────────── */
function WorkSlide() {
  const [open, setOpen] = useState(projects.findIndex((p) => p.flagship) >= 0
    ? projects.findIndex((p) => p.flagship) : 0);
  return (
    <div>
      <p className="sig">Selected work</p>
      <h2 className="mt-5 font-display leading-[1.0] tracking-[-0.04em] text-[clamp(1.8rem,4vw,3.25rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        Systems I&apos;d put <span className="kn-mark">on the cover.</span>
      </h2>

      <ul className="mt-7 [@media(max-height:760px)]:mt-5 flex flex-col gap-3 [@media(max-height:760px)]:gap-2">
        {projects.map((p, i) => {
          const isOpen = open === i;
          return (
            <li key={p.name} className="kn-card overflow-hidden">
              <button type="button" onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full flex items-center gap-4 px-5 py-4 [@media(max-height:760px)]:py-3 text-left"
                      aria-expanded={isOpen}>
                <span className="font-mono text-[13px] font-bold tabular-nums shrink-0"
                      style={{ color: "hsl(var(--accent))" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display text-[clamp(1.1rem,2vw,1.5rem)] tracking-[-0.03em]"
                        style={{ color: "hsl(var(--ink))" }}>
                    {p.name}
                  </span>
                  <span className="block text-[12.5px] mt-0.5 truncate" style={{ color: "hsl(var(--muted))" }}>
                    {p.at} · {p.role}
                  </span>
                </span>
                {p.flagship && (
                  <span className="hidden sm:inline px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0"
                        style={{ background: "hsl(var(--accent-wash))", color: "hsl(var(--accent-deep))" }}>
                    Flagship
                  </span>
                )}
                <span className="text-[12.5px] tabular-nums shrink-0" style={{ color: "hsl(var(--muted))" }}>
                  {p.year}
                </span>
                <ChevronDown size={18} strokeWidth={2}
                             className="shrink-0 transition-transform duration-300"
                             style={{ color: "hsl(var(--accent))", transform: isOpen ? "rotate(180deg)" : "none" }} />
              </button>

              <div className="grid transition-[grid-template-rows] duration-300 ease-out"
                   style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <div className="px-5 pb-6 pt-1 border-t rule-soft">
                    <p className="mt-3 text-[14.5px] leading-[1.6] text-pretty"
                       style={{ color: "hsl(var(--ink-soft))" }}>
                      {p.blurb}
                    </p>

                    <p className="mg-label mt-5" style={{ color: "hsl(var(--accent))" }}>
                      Key contributions
                    </p>
                    <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                      {p.highlights.map((h, hi) => (
                        <li key={hi} className="flex gap-3 text-[13.5px] leading-[1.5]">
                          <span className="font-mono text-[11px] pt-[3px] shrink-0 font-semibold tabular-nums"
                                style={{ color: "hsl(var(--accent))" }}>
                            {String(hi + 1).padStart(2, "0")}
                          </span>
                          <span style={{ color: "hsl(var(--ink-soft))" }}>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 pt-4 border-t rule-soft flex flex-wrap items-center gap-2">
                      <span className="mg-label mr-1" style={{ color: "hsl(var(--muted))" }}>Stack</span>
                      {p.stack.map((t) => <span key={t} className="kn-pill px-3 py-1 text-[12px]">{t}</span>)}
                      {p.href && (
                        <a href={p.href} target="_blank" rel="noreferrer"
                           className="ml-auto inline-flex items-center gap-1 text-[12.5px] font-semibold"
                           style={{ color: "hsl(var(--accent))" }}>
                          Visit <ArrowUpRight size={13} strokeWidth={2.2} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Paper dossier ──────────────────────────────────────────────────── */
function Block({ label, text }: { label: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="pt-3 border-t rule">
      <p className="mg-label" style={{ color: "hsl(var(--accent-deep))" }}>{label}</p>
      <p className="mt-1.5 text-[13px] leading-[1.55]" style={{ color: "hsl(var(--ink-soft))" }}>{text}</p>
    </div>
  );
}

function PaperDossier({ p, i, total }: { p: Publication; i: number; total: number }) {
  const authors = formatAuthors(p.authors);
  const isFirst = p.authors[0] === "Rahman, Md. Mosfikur";
  const [showPdf, setShowPdf] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="sig">Paper {String(i + 1).padStart(2, "0")}</p>
        <div className="flex flex-wrap items-center gap-2 text-[12px]" style={{ color: "hsl(var(--muted))" }}>
          {isFirst && <span className="kn-badge kn-badge--accent">First author</span>}
          <span className="kn-badge">{p.year}</span>
          <span className="kn-badge capitalize">{p.type}</span>
          {typeof p.citations === "number" && p.citations > 0 && (
            <a href={profile.links.scholar} target="_blank" rel="noreferrer"
               className="kn-badge kn-badge--accent"
               title="Citations on Google Scholar">
              {p.citations} citation{p.citations === 1 ? "" : "s"}
            </a>
          )}
          {p.award && (
            <span className="kn-badge kn-badge--gold" title={p.award}>
              <Award className="w-3 h-3" aria-hidden /> Best paper
            </span>
          )}
        </div>
      </div>

      <h2 className="mt-5 font-display leading-[1.12] tracking-[-0.03em] text-[clamp(1.35rem,2.7vw,2.35rem)] text-pretty"
          style={{ color: "hsl(var(--ink))" }}>
        {p.doi ? (
          <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer"
             className="no-underline transition-colors hover:text-[hsl(var(--accent))]"
             style={{ color: "inherit", textDecoration: "none" }}>
            {p.title}
          </a>
        ) : p.title}
      </h2>
      <p className="mt-3 text-[13px] leading-[1.5]" style={{ color: "hsl(var(--ink-soft))" }}>
        {authors.map((a, idx) => (
          <span key={idx}>
            <span style={{ color: a.bold ? "hsl(var(--accent))" : undefined, fontWeight: a.bold ? 600 : 400 }}>{a.name}</span>
            {idx < authors.length - 1 ? ", " : "."}
          </span>
        ))}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl px-4 py-2.5"
           style={{ background: "hsl(var(--accent-wash))" }}>
        <span className="mg-label" style={{ color: "hsl(var(--accent-deep))" }}>Published in</span>
        <span className="text-[13.5px] font-medium" style={{ color: "hsl(var(--ink))" }}>
          {p.venue}
        </span>
        <span className="text-[12.5px]" style={{ color: "hsl(var(--muted))" }}>
          · {p.year}{p.volume ? ` · vol. ${p.volume}` : ""}{p.pages ? ` · pp. ${p.pages}` : ""}
        </span>
        {p.doi && (
          <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-1 text-[12px] font-semibold ml-auto"
             style={{ color: "hsl(var(--accent-deep))" }}>
            DOI <ArrowUpRight size={12} strokeWidth={2.2} />
          </a>
        )}
      </div>

      <div className={p.pdf ? "mt-5 grid lg:grid-cols-[1.15fr,0.85fr] gap-6" : "mt-5"}>
        <div>
          <div className={p.pdf ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5"}>
            <Block label="Problem" text={p.problem} />
            <Block label="Solution" text={p.solution} />
            <Block label="Methodology" text={p.methodology} />
            <Block label="Key findings" text={p.keyFindings} />
            <Block label="Impact" text={p.impact} />
            <Block label="Challenges" text={p.challenges} />
          </div>
          {p.keywords && p.keywords.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.keywords.map((k) => <li key={k} className="kn-pill px-2.5 py-1 text-[12px]">{k}</li>)}
            </ul>
          )}
        </div>

        {p.pdf && (
          <aside className="kn-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b rule-soft">
              <span className="inline-flex items-center gap-2 mg-label" style={{ color: "hsl(var(--accent))" }}>
                <FileText size={13} strokeWidth={2} /> Full paper
              </span>
              <div className="flex items-center gap-2">
                {showPdf && (
                  <button type="button" onClick={() => setShowPdf(false)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold"
                          style={{ border: "1px solid hsl(var(--rule))", color: "hsl(var(--ink))" }}>
                    Hide
                  </button>
                )}
                <a href={p.pdf} target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold"
                   style={{ border: "1px solid hsl(var(--rule))", color: "hsl(var(--ink))" }}
                   title="Open full PDF in a new tab">
                  <Maximize2 size={12} strokeWidth={2.2} /> Open
                </a>
                <a href={p.pdf} download
                   className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold"
                   style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-ink))" }}
                   title="Download PDF">
                  <Download size={12} strokeWidth={2.4} /> PDF
                </a>
              </div>
            </div>

            {showPdf ? (
              <object data={`${p.pdf}#view=FitH`} type="application/pdf"
                      className="w-full h-[56vh] lg:h-[68vh]" aria-label={`${p.title}, full paper PDF`}>
                <div className="p-6 text-center text-[13px]" style={{ color: "hsl(var(--ink-soft))" }}>
                  Inline preview isn&apos;t supported here.{" "}
                  <a href={p.pdf} target="_blank" rel="noreferrer"
                     className="font-semibold" style={{ color: "hsl(var(--accent))" }}>
                    Open the PDF →
                  </a>
                </div>
              </object>
            ) : (
              <div className="flex-1 grid place-items-center text-center px-6 py-12">
                <div>
                  <div className="mx-auto w-12 h-12 grid place-items-center rounded-xl"
                       style={{ background: "hsl(var(--accent-wash))", color: "hsl(var(--accent-deep))" }}>
                    <FileText size={20} strokeWidth={1.8} />
                  </div>
                  <p className="mt-4 text-[14px] font-medium" style={{ color: "hsl(var(--ink))" }}>
                    Full paper available
                  </p>
                  <p className="mt-1 text-[12.5px] max-w-[34ch] mx-auto" style={{ color: "hsl(var(--muted))" }}>
                    The complete PDF can be opened here on request.
                  </p>
                  <button type="button" onClick={() => setShowPdf(true)}
                          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
                          style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-ink))" }}>
                    Preview paper
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

/* ── Contact ────────────────────────────────────────────────────────── */
function ContactSlide() {
  const cvUrl = useCvUrl();
  const cvLabel = useCvLabel();
  const links: { label: string; href: string; Icon: LucideIcon; what: string }[] = [
    { label: "GitHub", href: profile.links.github, Icon: Github, what: "GitHub link" },
    { label: "LinkedIn", href: profile.links.linkedin, Icon: Linkedin, what: "LinkedIn link" },
    { label: "Google Scholar", href: profile.links.scholar, Icon: GraduationCap, what: "Google Scholar link" },
    { label: cvLabel, href: cvUrl, Icon: FileText, what: `${cvLabel} link` },
  ];
  return (
    <div className="grid grid-cols-12 gap-x-14 gap-y-10 items-center">
      <div className="col-span-12 lg:col-span-7">
        <p className="sig">Let&apos;s talk</p>
        <h2 className="mt-5 font-display leading-[0.98] tracking-[-0.045em] text-[clamp(2.1rem,5vw,4rem)]"
            style={{ color: "hsl(var(--ink))" }}>
          If this fits what you need, <span className="kn-mark">write to me.</span>
        </h2>
        <p className="mt-6 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.6] max-w-[46ch]" style={{ color: "hsl(var(--ink-soft))" }}>
          I reply within forty-eight hours, usually sooner. Based in Dhaka (GMT+6).
          Open to backend architecture, applied ML, and research collaboration.
        </p>
      </div>
      <div className="col-span-12 lg:col-span-5 min-w-0">
        <p className="mg-label mb-3">Reach me</p>
        <div className="grid gap-2.5">
          <Channel variant="primary" block href={`mailto:${profile.email}`} label="Email me" Icon={Mail}
                   copyText={profile.email} copyWhat="Email address" />
          {links.map((l) => (
            <Channel key={l.label} block href={l.href} label={l.label} Icon={l.Icon} copyText={l.href} copyWhat={l.what} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Education ──────────────────────────────────────────────────────── */
function EducationSlide() {
  return (
    <div>
      <p className="sig">Education</p>
      <h2 className="mt-5 font-display leading-[1.0] tracking-[-0.04em] text-[clamp(1.8rem,4vw,3.25rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        Where I <span className="kn-mark">studied.</span>
      </h2>
      <ol className="mt-8 grid sm:grid-cols-2 gap-4">
        {education
          .filter((e) => /B\.Sc\.|Erasmus/.test(e.degree))
          .map((e) => (
          <li key={e.school + e.degree} className="kn-card p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11.5px] font-semibold tabular-nums" style={{ color: "hsl(var(--accent))" }}>
                {e.from.slice(0, 4)} – {e.to.slice(0, 4)}
              </span>
              {e.note && <span className="kn-pill px-2.5 py-0.5 text-[11px]">{e.note}</span>}
            </div>
            <h3 className="mt-2 font-display text-[clamp(1.05rem,1.7vw,1.3rem)] tracking-[-0.02em]"
                style={{ color: "hsl(var(--ink))" }}>
              {e.degree}
            </h3>
            <p className="mt-1 text-[13px]" style={{ color: "hsl(var(--ink-soft))" }}>
              {e.url ? (
                <a className="a" href={e.url} target="_blank" rel="noreferrer">{e.school}</a>
              ) : e.school}
              {e.place ? ` · ${e.place}` : ""}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Certifications ─────────────────────────────────────────────────── */
function CertificationsSlide() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="sig">Certifications</p>
        <span className="kn-pill px-3 py-1 text-[12px] font-semibold">Credly · verifiable</span>
      </div>
      <h2 className="mt-5 font-display leading-[1.0] tracking-[-0.04em] text-[clamp(1.8rem,4vw,3.25rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        Verified <span className="kn-mark">credentials.</span>
      </h2>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {verifiedBadges.filter((b) => b.level !== "Foundational").map((b) => (
          <a key={b.title} href={b.url} target="_blank" rel="noreferrer"
             className="kn-card group p-6 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: "hsl(var(--accent))" }}>
                {b.authorizedBy} · {b.issuer}
              </span>
              <span className="kn-pill px-2.5 py-0.5 text-[10.5px] font-semibold">{b.level}</span>
            </div>
            <h3 className="mt-3 font-display text-[clamp(1.15rem,2vw,1.55rem)] tracking-[-0.02em] flex items-start gap-2"
                style={{ color: "hsl(var(--ink))" }}>
              {b.title}
              <ArrowUpRight size={17} strokeWidth={2}
                            className="mt-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"
                            style={{ color: "hsl(var(--accent))" }} />
            </h3>
            <p className="mt-2.5 text-[13px] leading-[1.55] flex-1" style={{ color: "hsl(var(--ink-soft))" }}>
              {b.blurb}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold"
                  style={{ color: "hsl(var(--accent))" }}>
              Verify on Credly <ArrowUpRight size={13} strokeWidth={2.2} />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Peer review & recognition ──────────────────────────────────────── */
function ReviewSlide() {
  return (
    <div>
      <p className="sig">Service &amp; recognition</p>
      <h2 className="mt-5 font-display leading-[1.0] tracking-[-0.04em] text-[clamp(1.8rem,4vw,3.25rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        Peer review &amp; <span className="kn-mark">recognition.</span>
      </h2>
      <div className="mt-8 grid lg:grid-cols-2 gap-5">
        <div className="kn-card p-6">
          <p className="mg-label" style={{ color: "hsl(var(--accent))" }}>Reviewer for</p>
          <ul className="mt-3 space-y-2.5">
            {reviewerFor.map((r) => (
              <li key={r} className="flex gap-3 text-[14px] leading-[1.45]" style={{ color: "hsl(var(--ink-soft))" }}>
                <span className="font-mono text-[12px] pt-[2px]" style={{ color: "hsl(var(--accent))" }}>▹</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="kn-card p-6">
          <p className="mg-label" style={{ color: "hsl(var(--accent))" }}>Recognition</p>
          <ul className="mt-3 space-y-4">
            {distinctions.map((d) => (
              <li key={d.headline}>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] font-semibold tabular-nums" style={{ color: "hsl(var(--accent))" }}>
                    {d.year}
                  </span>
                  <span className="font-display text-[15px] tracking-[-0.02em]" style={{ color: "hsl(var(--ink))" }}>
                    {d.headline}
                  </span>
                </div>
                <p className="mt-0.5 ml-[2.7rem] text-[12.5px]" style={{ color: "hsl(var(--muted))" }}>
                  {d.issuer}{d.detail ? `. ${d.detail}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Leadership & activities ────────────────────────────────────────── */
function ActivitiesSlide() {
  return (
    <div>
      <p className="sig">Beyond the work</p>
      <h2 className="mt-5 font-display leading-[1.0] tracking-[-0.04em] text-[clamp(1.8rem,4vw,3.25rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        Leadership &amp; <span className="kn-mark">activities.</span>
      </h2>
      <ol className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3">
        {talksAndService.map((t, i) => (
          <li key={i} className="flex gap-4 py-2.5 border-b rule-soft">
            <span className="font-mono text-[12px] font-semibold tabular-nums pt-0.5 shrink-0" style={{ color: "hsl(var(--accent))" }}>
              {t.year}
            </span>
            <div className="min-w-0">
              <span className="kn-pill px-2.5 py-0.5 text-[11px] font-semibold">{t.kind}</span>
              <p className="mt-1.5 text-[13.5px] leading-[1.45]" style={{ color: "hsl(var(--ink-soft))" }}>{t.title}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Deck order: projects and publications are the spine ─────────────── */
export type DeckSlide = { label: string; render: () => JSX.Element };

// First-author papers lead, then the rest; newest first within each group.
const isFirstAuthor = (p: Publication) => p.authors[0] === "Rahman, Md. Mosfikur";
const orderedPubs = [...publications].sort((a, b) => {
  const fa = isFirstAuthor(a), fb = isFirstAuthor(b);
  if (fa !== fb) return fa ? -1 : 1;          // first-author papers lead
  const ra = a.impactRank ?? 99, rb = b.impactRank ?? 99;
  if (ra !== rb) return ra - rb;              // then strongest by impact
  return b.year - a.year;                     // tie-break: newest first
});
const firstAuthorCount = publications.filter(isFirstAuthor).length;
const totalCitations = publications.reduce((n, p) => n + (p.citations ?? 0), 0);

// ── Reusable slide units ───────────────────────────────────────────────
const S = {
  title:      { label: "Title", render: () => <TitleSlide /> } as DeckSlide,
  now:        { label: "Now", render: () => <NowSlide /> } as DeckSlide,
  earlier:    { label: "Earlier experience", render: () => <ExperienceSlide /> } as DeckSlide,
  education:  { label: "Education", render: () => <EducationSlide /> } as DeckSlide,
  peerReview: { label: "Peer review & recognition", render: () => <ReviewSlide /> } as DeckSlide,
  work:       { label: "Selected work", render: () => <WorkSlide /> } as DeckSlide,
  toolbox:    { label: "Toolbox", render: () => <SkillsSlide /> } as DeckSlide,
  certs:      { label: "Certifications", render: () => <CertificationsSlide /> } as DeckSlide,
  leadership: { label: "Leadership & activities", render: () => <ActivitiesSlide /> } as DeckSlide,
  contact:    { label: "Contact", render: () => <ContactSlide /> } as DeckSlide,
};

const researchDivider: DeckSlide = {
  label: "Research",
  render: () => <Divider kicker="Section" title="Research"
    sub={`${publications.length} peer-reviewed papers · ${firstAuthorCount} as first author · ${totalCitations} citations · 1 IEEE best paper.`}
    verifyHref={profile.links.scholar} />,
};
const engineeringDivider: DeckSlide = {
  label: "Engineering",
  render: () => <Divider kicker="Section" title="Engineering"
    sub={`${projects.length} systems shipped, at national, global and product scale.`} />,
};
const papers = (n?: number): DeckSlide[] => {
  const list = typeof n === "number" ? orderedPubs.slice(0, n) : orderedPubs;
  return list.map((p, i) => ({
    label: `Paper · ${p.year}`,
    render: () => <PaperDossier p={p} i={i} total={list.length} />,
  }));
};

// ── Three professionally-ordered decks, one per presentation context ────
// Research / PhD: research is the spine, every paper in depth.
const DECK_RESEARCH: DeckSlide[] = [
  S.title, S.now, S.earlier, S.education,
  researchDivider, ...papers(), S.peerReview,
  engineeringDivider, S.work, S.toolbox,
  S.certs, S.leadership, S.contact,
];

// Engineering / technical interview: systems first, research kept brief.
const DECK_TECH: DeckSlide[] = [
  S.title, S.now,
  engineeringDivider, S.work, S.toolbox,
  S.earlier, S.education,
  researchDivider, ...papers(2),
  S.certs, S.contact,
];

// Seminar / self-presentation: balanced, concise, well-rounded.
const DECK_TALK: DeckSlide[] = [
  S.title, S.now, S.earlier, S.education,
  researchDivider, ...papers(3), S.peerReview,
  engineeringDivider, S.work, S.toolbox,
  S.certs, S.leadership, S.contact,
];

export function deckFor(id: DeckId): DeckSlide[] {
  if (id === "engineering") return DECK_TECH;
  if (id === "seminar") return DECK_TALK;
  return DECK_RESEARCH;
}

// Back-compat default (research deck).
export const SLIDES: DeckSlide[] = DECK_RESEARCH;
