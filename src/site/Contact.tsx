import { Link } from "react-router-dom";
import { FileText, Github, GraduationCap, IdCard, Linkedin, Mail, type LucideIcon } from "lucide-react";
import { freelance, profile } from "@/lib/content";
import { useCvUrl, useCvLabel, useHireMeEnabled } from "@/lib/settings";
import { FoSection } from "./parts";
import Channel from "./Channel";

type Row = { label: string; note: string; href: string; Icon: LucideIcon; what: string };

export default function Contact({ alt }: { alt?: boolean }) {
  const cvUrl = useCvUrl();
  const cvLabel = useCvLabel();
  const hireOn = useHireMeEnabled() && freelance.available;

  const elsewhere: Row[] = [
    { label: "GitHub", note: "Code and side projects", href: profile.links.github, Icon: Github, what: "GitHub link" },
    { label: "LinkedIn", note: "Network and long-form notes", href: profile.links.linkedin, Icon: Linkedin, what: "LinkedIn link" },
    { label: "Google Scholar", note: "Research index and citations", href: profile.links.scholar, Icon: GraduationCap, what: "Google Scholar link" },
    { label: "ORCID", note: "Persistent author identifier", href: profile.links.orcid, Icon: IdCard, what: "ORCID link" },
    { label: cvLabel, note: "The full record", href: cvUrl, Icon: FileText, what: `${cvLabel} link` },
  ];

  return (
    <FoSection id="contact" alt={alt}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)] lg:gap-20 items-start">
        <div>
          <p className="fo-eyebrow">Contact</p>
          <h2 className="fo-h2 mt-3 max-w-[16ch]">If something here is useful, write to me.</h2>
          <p className="fo-lede mt-4 max-w-[46ch]">
            I reply within forty-eight hours, usually sooner. Based in Dhaka (GMT+6). Happy to discuss
            backend architecture, applied ML, or research collaboration.
          </p>
          <div className="mt-8">
            <Channel
              variant="primary"
              href={`mailto:${profile.email}`}
              label="Email me"
              Icon={Mail}
              copyText={profile.email}
              copyWhat="Email address"
            />
          </div>
          {hireOn && (
            <p className="fo-small fo-muted mt-8 max-w-[46ch]">
              I also take a small number of freelance backend engagements.{" "}
              <Link to="/hire" className="fo-inline">How I work</Link>
            </p>
          )}
        </div>

        <div>
          <h3 className="fo-overline mb-4">Elsewhere</h3>
          <div className="grid gap-2.5">
            {elsewhere.map((c) => (
              <Channel
                key={c.label}
                block
                href={c.href}
                label={c.label}
                note={c.note}
                Icon={c.Icon}
                copyText={c.href}
                copyWhat={c.what}
              />
            ))}
          </div>
        </div>
      </div>
    </FoSection>
  );
}
