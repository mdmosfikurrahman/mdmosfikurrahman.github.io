import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { roles, projects, education, talksAndService } from "@/lib/content";

function fmt(iso: string) {
  if (iso === "present") return "present";
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

const SECTIONS = [
  { id: "employment", label: "Employment" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "talks", label: "Talks & service" },
] as const;

const SCROLL_OFFSET = 112; // sticky header (56) + sub-nav (~48) + breathing room

function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      let current: string = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + y;
        if (top - SCROLL_OFFSET - 8 <= y) {
          current = s.id;
        } else {
          break;
        }
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
    if (hash && SECTIONS.some((s) => s.id === hash)) {
      requestAnimationFrame(() => scrollToSection(hash));
    }
  }, []);

  return active;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}

function ExperienceNav({ active }: { active: string }) {
  return (
    <nav
      aria-label="Experience sections"
      className="sticky top-14 z-30 border-b rule bg-paper/90 backdrop-blur-md"
    >
      <div className="shell">
        <ul className="flex overflow-x-auto no-scrollbar -mx-1">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(s.id);
                  }}
                  className={[
                    "inline-flex items-baseline gap-2 px-3 md:px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] whitespace-nowrap transition-colors",
                    isActive ? "text-ink" : "text-muted-foreground hover:text-ink",
                  ].join(" ")}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="relative">
                    <span>{s.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-accent" />
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default function Experience() {
  const active = useActiveSection();

  return (
    <>
      <SiteHeader />
      <main>
        <header className="border-b rule-soft">
          <div className="shell py-14 md:py-20">
            <p className="sig">Experience Log</p>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-[-0.03em] mt-2 text-balance">
              Experience in chronology.
            </h1>
            <p className="mt-5 max-w-prose font-serif-body text-[1.075rem] leading-[1.6] text-ink-soft">
              A full record of where I have worked, what I have shipped, and what else I
              have spent time on. Dates are ISO; everything is verifiable.
            </p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
              {[
                { k: "Employment", v: roles.length },
                { k: "Projects", v: projects.length },
                { k: "Education", v: education.length },
                { k: "Talks & service", v: talksAndService.length },
              ].map((s) => (
                <button
                  key={s.k}
                  onClick={() => {
                    const id = SECTIONS.find((x) => x.label === s.k)?.id;
                    if (id) scrollToSection(id);
                  }}
                  className="text-left flex items-baseline gap-3 hover:text-accent transition-colors"
                >
                  <span className="font-display text-3xl leading-none">{s.v}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {s.k}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <ExperienceNav active={active} />

        {/* Employment */}
        <section id="employment" className="border-b rule-soft scroll-mt-28">
          <div className="shell py-16">
            <div className="mg">
              <div>
                <p className="mg-label">01 · Employment</p>
              </div>
              <ol className="min-w-0 space-y-14">
                {roles.map((r) => (
                  <li key={r.company}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b rule pb-2">
                      <h2 className="font-display text-2xl md:text-3xl tracking-tight">
                        <a className="a" href={r.companyUrl} target="_blank" rel="noreferrer">
                          {r.company}
                        </a>
                      </h2>
                      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap">
                        {fmt(r.from)} – {fmt(r.to)}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {r.title} · {r.place}
                    </p>
                    <p className="mt-4 font-serif-body text-[1.05rem] leading-[1.6] text-ink-soft max-w-prose">
                      {r.summary}
                    </p>
                    <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed max-w-prose">
                      {r.bullets.map((b, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="font-mono text-[11px] text-muted-foreground pt-[5px] w-6 shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-ink-soft">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono uppercase tracking-[0.12em] text-muted-foreground">
                      {r.stack.map((s) => (
                        <li key={s} className="before:content-['·'] before:mr-3 first:before:hidden">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="border-b rule-soft bg-paper-deep/40 scroll-mt-28">
          <div className="shell py-16">
            <div className="mg">
              <div>
                <p className="mg-label">02 · Projects</p>
              </div>
              <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
                {projects.map((p, i) => (
                  <li
                    key={p.name}
                    className="py-7 grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] gap-x-4 md:gap-x-8 items-baseline"
                  >
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="md:hidden font-mono text-[11px] text-muted-foreground mb-1">
                        {p.year}
                      </p>
                      <h3 className="font-display text-xl tracking-tight">
                        {p.href ? (
                          <a className="a" href={p.href} target="_blank" rel="noreferrer">
                            {p.name}
                          </a>
                        ) : (
                          p.name
                        )}
                      </h3>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {p.at} · {p.role}
                      </p>
                      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft max-w-prose">
                        {p.blurb}
                      </p>
                    </div>
                    <span className="hidden md:inline font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {p.year}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="border-b rule-soft scroll-mt-28">
          <div className="shell py-16">
            <div className="mg">
              <div>
                <p className="mg-label">03 · Education</p>
              </div>
              <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
                {education.map((e) => (
                  <li key={e.school} className="py-6 grid grid-cols-1 md:grid-cols-[1fr,auto] gap-2 md:gap-4 items-baseline">
                    <div className="min-w-0">
                      <h3 className="font-display text-xl tracking-tight">
                        <a className="a" href={e.url} target="_blank" rel="noreferrer">
                          {e.school}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-ink-soft">
                        {e.degree}. <span className="text-muted-foreground">{e.note}</span>
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {e.place}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {fmt(e.from)} – {fmt(e.to)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Talks & service */}
        <section id="talks" className="border-b rule-soft bg-paper-deep/40 scroll-mt-28">
          <div className="shell py-16">
            <div className="mg">
              <div>
                <p className="mg-label">04 · Talks &amp; service</p>
              </div>
              <ol className="min-w-0 divide-y rule-soft border-y rule-soft">
                {talksAndService.map((t, i) => (
                  <li key={i} className="py-5 grid grid-cols-[auto,1fr] gap-x-4 md:gap-x-8 items-baseline">
                    <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {t.year}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/90">
                        {t.kind}
                      </p>
                      <p className="mt-1 text-[15px] text-ink-soft leading-relaxed max-w-prose">
                        {t.title}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
