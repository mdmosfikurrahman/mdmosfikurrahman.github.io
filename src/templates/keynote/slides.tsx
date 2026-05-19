// Slide content for the Keynote deck. The Deck shell (SiteWatermark.tsx)
// supplies the frame, chrome, animation and arrow navigation. Projects and
// publications are the focus: every project and every paper is its own
// dossier slide. Single data source stays @/lib/content.
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github, Linkedin, Mail, GraduationCap, FileText, Award,
  Copy, Check, ArrowUpRight, ChevronDown, Download, Maximize2,
  type LucideIcon,
} from "lucide-react";
import {
  profile, preamble, figures, roles, projects,
  publications, doiUrl, formatAuthors, reviewerFor, skillGroups,
  education, distinctions, talksAndService, verifiedBadges,
  type Publication,
} from "@/lib/content";

const avatar = "/profile-avatar.png";

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
  return (
    <div className="relative w-full">
      {/* motion behind the cover: rotating aura + drifting orbs. These are
          clipped softly by the cover's overflow-hidden stage (not by this
          box), so no hard rectangle and no scrollbar jitter. */}
      <div className="kn-aura" aria-hidden />
      <span className="kn-orb" aria-hidden
            style={{ width: 340, height: 340, top: "-12%", left: "-8%" }} />
      <span className="kn-orb" aria-hidden
            style={{ width: 280, height: 280, bottom: "-14%", right: "4%", animationDelay: "-5s" }} />

      <div className="relative z-10 mx-auto max-w-[940px] flex flex-col items-center text-center">
        <motion.p custom={0} variants={rise} initial="hidden" animate="show"
           className="inline-flex items-center gap-2.5 font-mono text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.24em]"
           style={{ color: "hsl(var(--muted))" }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                  style={{ background: "hsl(var(--accent))" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "hsl(var(--accent))" }} />
          </span>
          {profile.role}
        </motion.p>

        <motion.div custom={1} variants={pop} initial="hidden" animate="show"
            className="mt-5 kn-ring w-[104px] h-[104px] sm:w-[120px] sm:h-[120px]">
          <img src={avatar} alt="Portrait of Md. Mosfikur Rahman"
               className="w-full h-full object-cover rounded-full block"
               style={{ border: "2px solid hsl(var(--paper))" }} loading="eager" />
        </motion.div>

        <motion.h1 custom={2} variants={rise} initial="hidden" animate="show"
            className="mt-5 font-display leading-[0.98] tracking-[-0.05em] whitespace-nowrap
                       text-[clamp(1.9rem,5.6vw,4.25rem)]"
            style={{ color: "hsl(var(--ink))" }}>
          Md. <span className="kn-mark-live">Mosfik</span>ur Rahman
        </motion.h1>

        <motion.div className="kn-bar mt-4 w-24"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />

        <motion.p custom={3} variants={rise} initial="hidden" animate="show"
           className="mt-5 max-w-[64ch] text-[clamp(0.98rem,1.3vw,1.2rem)] leading-[1.55]"
           style={{ color: "hsl(var(--ink-soft))" }}>
          {preamble[0]}
        </motion.p>

        <motion.p custom={4} variants={rise} initial="hidden" animate="show"
           className="mt-3 max-w-[64ch] text-[clamp(0.92rem,1.15vw,1.05rem)] leading-[1.55]"
           style={{ color: "hsl(var(--muted))" }}>
          Backend architect at <strong style={{ color: "hsl(var(--ink-soft))" }}>iBOS Ltd.</strong>
          {" "}— I designed and built an OTA platform now serving 10k+ daily users —
          alongside ten peer-reviewed papers, an IEEE Best Paper, and journal
          peer-review service.
        </motion.p>

        <motion.div custom={5} variants={rise} initial="hidden" animate="show"
            className="mt-6 flex items-center justify-center gap-x-5 gap-y-2 flex-wrap">
          {channels.map(({ Icon, href, label, ext }) => (
            <a key={label} href={href} target={ext ? "_blank" : undefined} rel={ext ? "noreferrer" : undefined}
               className="group inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
               style={{ color: "hsl(var(--muted))" }}
               onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--accent))")}
               onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--muted))")}>
              <Icon size={14} strokeWidth={1.9} /> {label}
            </a>
          ))}
        </motion.div>

        <div className="mt-7 w-full flex flex-wrap items-stretch rounded-2xl overflow-hidden"
             style={{ border: "1px solid hsl(var(--rule))" }}>
          {figures.map((f, i) => (
            <motion.div key={f.k} custom={i} variants={pop} initial="hidden" animate="show"
                 className="flex-1 min-w-[150px] px-5 py-4 text-center"
                 style={{ borderLeft: i === 0 ? "none" : "1px solid hsl(var(--rule))" }}>
              <div className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] tracking-[-0.04em] tabular-nums"
                   style={{ color: "hsl(var(--ink))" }}>{f.v}</div>
              <div className="mt-0.5 text-[11.5px] font-semibold" style={{ color: "hsl(var(--accent))" }}>{f.k}</div>
              <p className="text-[11px]" style={{ color: "hsl(var(--muted))" }}>{f.note}</p>
            </motion.div>
          ))}
        </div>
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

      <ul className="mt-7 flex flex-col gap-3">
        {projects.map((p, i) => {
          const isOpen = open === i;
          return (
            <li key={p.name} className="kn-card overflow-hidden">
              <button type="button" onClick={() => setOpen(isOpen ? -1 : i)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left"
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
    <div className="kn-card p-4">
      <p className="mg-label" style={{ color: "hsl(var(--accent))" }}>{label}</p>
      <p className="mt-1.5 text-[12.5px] leading-[1.5]" style={{ color: "hsl(var(--ink-soft))" }}>{text}</p>
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
          {isFirst && (
            <span className="inline-flex items-center gap-1 px-3 py-1 font-semibold rounded-full"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--paper))" }} title="First author">
              ★ First author
            </span>
          )}
          <span className="kn-pill px-3 py-1 tabular-nums">{p.year}</span>
          <span className="kn-pill px-3 py-1 uppercase tracking-[0.12em]">{p.type}</span>
          {typeof p.citations === "number" && p.citations > 0 && (
            <a href={profile.links.scholar} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-1.5 px-3 py-1 font-semibold rounded-full tabular-nums"
               style={{ background: "hsl(var(--accent-wash))", color: "hsl(var(--accent-deep))" }}
               title="Cited by — verify on Google Scholar">
              {p.citations} citation{p.citations === 1 ? "" : "s"}
            </a>
          )}
          {p.award && (
            <span className="inline-flex items-center gap-1 px-3 py-1 font-semibold rounded-full"
                  style={{ background: "hsl(var(--accent-wash))", color: "hsl(var(--accent-deep))" }} title={p.award}>
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
          <div className={p.pdf ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-3" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-3"}>
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
                   style={{ background: "hsl(var(--accent))", color: "hsl(var(--paper))" }}
                   title="Download PDF">
                  <Download size={12} strokeWidth={2.4} /> PDF
                </a>
              </div>
            </div>

            {showPdf ? (
              <object data={`${p.pdf}#view=FitH`} type="application/pdf"
                      className="w-full h-[56vh] lg:h-[68vh]" aria-label={`${p.title} — full paper PDF`}>
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
                          style={{ background: "hsl(var(--accent))", color: "hsl(var(--paper))" }}>
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
const contacts = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "GitHub", value: profile.links.github.replace(/^https?:\/\//, ""), href: profile.links.github },
  { label: "LinkedIn", value: profile.links.linkedin.replace(/^https?:\/\//, ""), href: profile.links.linkedin },
  { label: "Scholar", value: profile.links.scholar.replace(/^https?:\/\//, ""), href: profile.links.scholar },
  { label: "CV", value: profile.cvUrl.replace(/^https?:\/\//, ""), href: profile.cvUrl },
];

function ContactRow({ c }: { c: { label: string; value: string; href: string } }) {
  const [copied, setCopied] = useState(false);
  const ext = c.href.startsWith("http");
  return (
    <li className="flex items-center gap-4 py-3 border-b rule-soft last:border-b-0">
      <span className="w-20 shrink-0 font-mono text-[11.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "hsl(var(--accent))" }}>
        {c.label}
      </span>
      <a href={c.href} target={ext ? "_blank" : undefined} rel={ext ? "noreferrer" : undefined}
         className="flex-1 min-w-0 truncate text-[14.5px] hover:text-[hsl(var(--accent))] transition-colors" style={{ color: "hsl(var(--ink-soft))" }}>
        {c.value}
      </a>
      <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(c.value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* no-op */ } }}
              className="shrink-0 inline-flex items-center gap-1.5 text-[12.5px]" style={{ color: "hsl(var(--muted))" }} aria-label={`Copy ${c.label}`}>
        {copied ? <Check size={13} strokeWidth={2.4} /> : <Copy size={13} strokeWidth={1.7} />}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
      </button>
    </li>
  );
}

function ContactSlide() {
  return (
    <div className="grid grid-cols-12 gap-x-14 gap-y-10 items-center">
      <div className="col-span-12 lg:col-span-7">
        <p className="sig">Let&apos;s talk</p>
        <h2 className="mt-5 font-display leading-[0.98] tracking-[-0.045em] text-[clamp(2.1rem,5vw,4rem)]"
            style={{ color: "hsl(var(--ink))" }}>
          If this fits what you need,{" "}
          <a className="kn-mark hover:opacity-80 transition-opacity" href={`mailto:${profile.email}`}>write to me.</a>
        </h2>
        <p className="mt-6 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.6] max-w-[46ch]" style={{ color: "hsl(var(--ink-soft))" }}>
          I reply within forty-eight hours, usually sooner. Based in Dhaka (GMT+6).
          Open to backend architecture, applied ML, and research collaboration.
        </p>
        <p className="mt-5 text-[13.5px]" style={{ color: "hsl(var(--muted))" }}>
          {profile.location} · {profile.phone}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-5 min-w-0 kn-card p-6">
        <p className="mg-label mb-1">Channels</p>
        <ul>{contacts.map((c) => <ContactRow key={c.label} c={c} />)}</ul>
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
      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {verifiedBadges.map((b) => (
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
                  {d.issuer}{d.detail ? ` — ${d.detail}` : ""}
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

/* ── Deck order — projects + publications are the spine ─────────────── */
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
    sub={`${projects.length} systems shipped — national, global, and product scale.`} />,
};
const papers = (n?: number): DeckSlide[] => {
  const list = typeof n === "number" ? orderedPubs.slice(0, n) : orderedPubs;
  return list.map((p, i) => ({
    label: `Paper · ${p.year}`,
    render: () => <PaperDossier p={p} i={i} total={list.length} />,
  }));
};

// ── Three professionally-ordered decks, one per presentation context ────
// Research / PhD — research is the spine, every paper in depth.
const DECK_RESEARCH: DeckSlide[] = [
  S.title, S.now, S.earlier, S.education,
  researchDivider, ...papers(), S.peerReview,
  engineeringDivider, S.work, S.toolbox,
  S.certs, S.leadership, S.contact,
];

// Engineering / Technical interview — systems first, research kept brief.
const DECK_TECH: DeckSlide[] = [
  S.title, S.now,
  engineeringDivider, S.work, S.toolbox,
  S.earlier, S.education,
  researchDivider, ...papers(2),
  S.certs, S.contact,
];

// Seminar / Self-presentation — balanced, concise, well-rounded.
const DECK_TALK: DeckSlide[] = [
  S.title, S.now, S.earlier, S.education,
  researchDivider, ...papers(3), S.peerReview,
  engineeringDivider, S.work, S.toolbox,
  S.certs, S.leadership, S.contact,
];

export function deckFor(template: string): DeckSlide[] {
  if (template === "keynote-tech") return DECK_TECH;
  if (template === "keynote-talk") return DECK_TALK;
  return DECK_RESEARCH;
}

// Back-compat default (research deck).
export const SLIDES: DeckSlide[] = DECK_RESEARCH;
