// Slide content for the Keynote deck. The Deck shell (SiteWatermark.tsx)
// supplies the frame, chrome, animation and arrow navigation. Projects and
// publications are the focus: every project and every paper is its own
// dossier slide. Single data source stays @/lib/content.
import { useState } from "react";
import {
  Github, Linkedin, Mail, GraduationCap, FileText, Award,
  Copy, Check, ArrowUpRight, ChevronDown, type LucideIcon,
} from "lucide-react";
import {
  profile, figures, roles, projects,
  publications, doiUrl, formatAuthors, reviewerFor, skillGroups,
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

function TitleSlide() {
  return (
    <div>
      <div className="grid grid-cols-12 gap-x-16 gap-y-12 items-center">
        <div className="col-span-12 lg:col-span-7">
          <p className="flex flex-wrap items-center gap-2.5 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em]"
             style={{ color: "hsl(var(--muted))" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                    style={{ background: "hsl(var(--accent))" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "hsl(var(--accent))" }} />
            </span>
            {profile.role}
          </p>

          <h1 className="mt-7 font-display leading-[0.92] tracking-[-0.05em]
                         text-[clamp(2.6rem,6.4vw,5rem)]"
              style={{ color: "hsl(var(--ink))" }}>
            <span className="block">Md.</span>
            <span className="block kn-mark">Mosfikur Rahman</span>
          </h1>

          <p className="mt-7 max-w-[50ch] text-[clamp(1.05rem,1.5vw,1.4rem)] leading-[1.5]"
             style={{ color: "hsl(var(--ink-soft))" }}>
            {profile.tagline}
          </p>

          <ul className="mt-9 flex items-center gap-2 flex-wrap">
            {channels.map(({ Icon, href, label, ext }) => (
              <li key={label}>
                <a href={href} target={ext ? "_blank" : undefined} rel={ext ? "noreferrer" : undefined}
                   className="kn-pill inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium transition-colors hover:!border-[hsl(var(--accent))] hover:!text-[hsl(var(--accent))]">
                  <Icon size={14} strokeWidth={1.8} /> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <aside className="col-span-12 lg:col-span-5">
          <figure className="relative mx-auto lg:ml-auto w-[210px] sm:w-[260px]">
            <div className="absolute -inset-5 rounded-[2rem] blur-2xl"
                 style={{ background: "radial-gradient(closest-side, hsl(var(--accent) / 0.28), transparent)" }} />
            <div className="absolute -inset-2 rounded-[1.9rem] rotate-3"
                 style={{ border: "1px solid hsl(var(--accent) / 0.35)" }} />
            <div className="relative overflow-hidden"
                 style={{ border: "1px solid hsl(var(--rule))", borderRadius: "1.6rem" }}>
              <img src={avatar} alt="Portrait of Md. Mosfikur Rahman" className="w-full h-auto block" loading="eager" />
            </div>
            <figcaption className="mt-4 text-center text-[13px]" style={{ color: "hsl(var(--muted))" }}>
              {profile.roleLong}
            </figcaption>
          </figure>
        </aside>
      </div>

      <div className="mt-12 flex flex-wrap items-stretch rounded-2xl overflow-hidden"
           style={{ border: "1px solid hsl(var(--rule))" }}>
        {figures.map((f, i) => (
          <div key={f.k} className="flex-1 min-w-[140px] px-6 py-5"
               style={{ borderLeft: i === 0 ? "none" : "1px solid hsl(var(--rule))" }}>
            <div className="font-display text-[clamp(1.6rem,3vw,2.4rem)] tracking-[-0.04em] tabular-nums"
                 style={{ color: "hsl(var(--ink))" }}>{f.v}</div>
            <div className="mt-0.5 text-[12px] font-semibold" style={{ color: "hsl(var(--accent))" }}>{f.k}</div>
            <p className="text-[11.5px]" style={{ color: "hsl(var(--muted))" }}>{f.note}</p>
          </div>
        ))}
      </div>

      <p className="mt-9 inline-flex items-center gap-2.5 font-mono text-[12px] tracking-[0.16em] uppercase"
         style={{ color: "hsl(var(--whisper))" }}>
        <span className="kn-key">←</span><span className="kn-key">→</span>
        <span>or the arrows below to walk through — papers first, then work</span>
      </p>
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
function Divider({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div className="text-center">
      <p className="sig justify-center">{kicker}</p>
      <h2 className="mt-7 font-display leading-[0.95] tracking-[-0.05em] text-[clamp(2.75rem,9vw,6rem)]"
          style={{ color: "hsl(var(--ink))" }}>
        <span className="kn-mark">{title}</span>
      </h2>
      <p className="mt-6 text-[clamp(1rem,1.5vw,1.3rem)]" style={{ color: "hsl(var(--ink-soft))" }}>{sub}</p>
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
    <div className="kn-card p-5">
      <p className="mg-label" style={{ color: "hsl(var(--accent))" }}>{label}</p>
      <p className="mt-2 text-[13px] leading-[1.55]" style={{ color: "hsl(var(--ink-soft))" }}>{text}</p>
    </div>
  );
}

function PaperDossier({ p, i, total }: { p: Publication; i: number; total: number }) {
  const authors = formatAuthors(p.authors);
  const isFirst = p.authors[0] === "Rahman, Md. Mosfikur";
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="sig">Paper · {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
        <div className="flex flex-wrap items-center gap-2 text-[12px]" style={{ color: "hsl(var(--muted))" }}>
          {isFirst && (
            <span className="inline-flex items-center gap-1 px-3 py-1 font-semibold rounded-full"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--paper))" }} title="First author">
              ★ First author
            </span>
          )}
          <span className="kn-pill px-3 py-1 tabular-nums">{p.year}</span>
          <span className="kn-pill px-3 py-1 uppercase tracking-[0.12em]">{p.type}</span>
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
        {p.doi ? <a className="a" href={doiUrl(p.doi)} target="_blank" rel="noreferrer">{p.title}</a> : p.title}
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

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <p className="mg-label">Reviewer for</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]" style={{ color: "hsl(var(--ink-soft))" }}>
            {reviewerFor.slice(0, 4).map((r) => (
              <li key={r} className="before:content-['·'] before:mr-3 before:text-[hsl(var(--accent))] first:before:hidden">{r}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-5 min-w-0 kn-card p-6">
        <p className="mg-label mb-1">Channels</p>
        <ul>{contacts.map((c) => <ContactRow key={c.label} c={c} />)}</ul>
      </div>
    </div>
  );
}

/* ── Deck order — projects + publications are the spine ─────────────── */
export type DeckSlide = { label: string; render: () => JSX.Element };

// First-author papers lead, then the rest; newest first within each group.
const isFirstAuthor = (p: Publication) => p.authors[0] === "Rahman, Md. Mosfikur";
const orderedPubs = [...publications].sort((a, b) => {
  const fa = isFirstAuthor(a), fb = isFirstAuthor(b);
  if (fa !== fb) return fa ? -1 : 1;
  return b.year - a.year;
});
const firstAuthorCount = publications.filter(isFirstAuthor).length;

export const SLIDES: DeckSlide[] = [
  { label: "Title", render: () => <TitleSlide /> },
  { label: "Now", render: () => <NowSlide /> },
  { label: "Toolbox", render: () => <SkillsSlide /> },
  {
    label: "Research",
    render: () => <Divider kicker="Section" title="Research"
      sub={`${publications.length} peer-reviewed papers · ${firstAuthorCount} as first author · 1 IEEE best paper.`} />,
  },
  ...orderedPubs.map((p, i): DeckSlide => ({
    label: `Paper · ${p.year}`,
    render: () => <PaperDossier p={p} i={i} total={orderedPubs.length} />,
  })),
  { label: "Selected work", render: () => <WorkSlide /> },
  { label: "Contact", render: () => <ContactSlide /> },
];
