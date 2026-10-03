import { skillGroups } from "@/lib/content";
import { FoHead, FoSection } from "./parts";

export default function Capabilities({ alt }: { alt?: boolean }) {
  return (
    <FoSection id="skills" alt={alt}>
      <FoHead eyebrow="Capabilities" title="What I work with" lede="Grouped by layer." />
      <div className="fo-caps">
        {skillGroups.map((g) => (
          <div key={g.label} className="fo-cap">
            <h3 className="fo-overline">{g.label}</h3>
            <ul>
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </FoSection>
  );
}
