import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
import { FoPage, FoSection, FoHead } from "@/site/parts";
import { CaseStudyFeature } from "@/site/SelectedWork";

export default function Work() {
  const others = projects.filter((p) => !p.flagship);

  return (
    <FoPage
      eyebrow="Work"
      title={<>Selected <em>work</em></>}
      lede="Production systems I have designed, built, or shipped modules for, across travel, government compliance and e-commerce."
    >
      <FoSection tight>
        <CaseStudyFeature metrics={4} />
      </FoSection>

      <FoSection alt>
        <FoHead eyebrow="Earlier work" title="Before Travilo" />
        <ol className="grid gap-4">
          {others.map((p) => (
            <li key={p.name} className="fo-card">
              <div className="grid gap-6 md:grid-cols-[200px,minmax(0,1fr)] md:gap-10">
                <div>
                  <p className="fo-meta">{p.year}</p>
                  <p className="fo-small fo-ink mt-2 font-medium">{p.at}</p>
                  <p className="fo-small fo-muted mt-0.5">{p.role}</p>
                </div>
                <div className="min-w-0">
                  <h3 className="fo-h3">
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-[hsl(var(--accent))] transition-colors">
                        {p.name}
                        <ArrowUpRight size={16} strokeWidth={1.8} className="fo-muted" aria-hidden />
                      </a>
                    ) : (
                      p.name
                    )}
                  </h3>
                  <p className="fo-body mt-2">{p.blurb}</p>
                  <ul className="fo-checks mt-5">
                    {p.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                  <ul className="fo-tags mt-6">
                    {p.stack.map((s) => (
                      <li key={s} className="fo-tag">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </FoSection>
    </FoPage>
  );
}
