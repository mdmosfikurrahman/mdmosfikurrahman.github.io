import { recommendations } from "@/lib/content";
import { FoHead, FoSection } from "./parts";

// Renders nothing until `recommendations` in content.ts holds a real quote.
export default function Recommendations({ alt }: { alt?: boolean }) {
  if (recommendations.length === 0) return null;
  return (
    <FoSection id="recommendations" alt={alt}>
      <FoHead eyebrow="Recommendations" title="What people I have worked with say" />
      <div className="fo-grid-2">
        {recommendations.map((r) => (
          <figure key={r.name} className="fo-card flex flex-col">
            <blockquote className="fo-quote">“{r.quote}”</blockquote>
            <figcaption className="mt-auto pt-6">
              {r.url ? (
                <a href={r.url} target="_blank" rel="noreferrer" className="fo-h4 fo-inline">{r.name}</a>
              ) : (
                <p className="fo-h4">{r.name}</p>
              )}
              <p className="fo-small fo-muted mt-0.5">{r.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </FoSection>
  );
}
