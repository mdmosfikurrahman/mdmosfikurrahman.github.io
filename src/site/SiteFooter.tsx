import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Facebook, FileText, Github, GraduationCap, IdCard, Linkedin, Mail, type LucideIcon } from "lucide-react";
import { profile, freelance } from "@/lib/content";
import { useAvatarUrl, useCvDownload, useHireMeEnabled } from "@/lib/settings";
import { FOLIO_NAV } from "./nav";
import Channel from "./Channel";
import { useDhakaTime } from "./time";
import { WhatsAppIcon } from "./icons";

type Profile = { label: string; href: string; Icon: LucideIcon };

export default function SiteFooter() {
  const { pathname } = useLocation();
  const avatar = useAvatarUrl();
  const cv = useCvDownload();
  const hireOn = useHireMeEnabled() && freelance.available;
  const dhaka = useDhakaTime();
  const year = new Date().getFullYear();

  // Records of the work, and the places to start a conversation.
  const profiles: Profile[] = [
    { label: "GitHub", href: profile.links.github, Icon: Github },
    { label: "Google Scholar", href: profile.links.scholar, Icon: GraduationCap },
    { label: "ORCID", href: profile.links.orcid, Icon: IdCard },
  ];
  const navigate = [{ to: "/", label: "Home" }, ...FOLIO_NAV];

  return (
    <footer className="fo-footer">
      <div className="fo-wrap">
        {/* Home ends on its own Contact section; every other page closes here. */}
        {pathname !== "/" && (
          <div className="fo-footer-cta">
            <p className="fo-footer-statement">
              Available for senior backend, system design, and applied-ML collaborations.
            </p>
            <div className="fo-actions">
              <Channel variant="primary" href={`mailto:${profile.email}`} label="Email me" Icon={Mail}
                       copyText={profile.email} copyWhat="Email address" />
              <a href={cv.href} target="_blank" rel="noreferrer" download={cv.download || undefined} className="fo-btn fo-btn--secondary">
                <FileText size={16} strokeWidth={1.8} aria-hidden /> {cv.label}
              </a>
            </div>
          </div>
        )}

        <div className="fo-footer-grid">
          <div className="fo-footer-brand">
            <Link to="/" className="fo-brand" aria-label={`${profile.name}, home`}>
              <img src={avatar} alt="" />
              <span>{profile.name}</span>
            </Link>
            <p className="fo-small mt-4 max-w-[34ch]">
              Backend architect and applied-ML researcher, building production systems in Dhaka.
            </p>
            <p className="fo-small mt-3">
              Local time <span className="fo-footer-time">{dhaka}</span> (GMT+6)
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="fo-overline">Navigate</h2>
            <ul>
              {navigate.map((n) => (
                <li key={n.to}>
                  <Link to={n.to}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="fo-overline">Profiles</h2>
            <ul>
              {profiles.map((p) => (
                <li key={p.label}>
                  <a href={p.href} target="_blank" rel="noreferrer" className="fo-footer-link">
                    <p.Icon size={15} strokeWidth={1.8} aria-hidden /> {p.label}
                    <ArrowUpRight size={12} strokeWidth={1.8} aria-hidden className="fo-footer-ext" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="fo-overline">Contact</h2>
            <ul className="fo-footer-channels">
              <li>
                <Channel size="sm" block href={`mailto:${profile.email}`} label="Email" Icon={Mail}
                         copyText={profile.email} copyWhat="Email address" />
              </li>
              <li>
                <Channel size="sm" block href={profile.links.whatsapp} label="WhatsApp" Icon={WhatsAppIcon}
                         copyText={profile.phone} copyWhat="WhatsApp number" />
              </li>
              <li>
                <Channel size="sm" block href={profile.links.linkedin} label="LinkedIn" Icon={Linkedin}
                         copyText={profile.links.linkedin} copyWhat="LinkedIn link" />
              </li>
              <li>
                <Channel size="sm" block href={profile.links.facebook} label="Facebook" Icon={Facebook}
                         copyText={profile.links.facebook} copyWhat="Facebook link" />
              </li>
              {hireOn && (
                <li className="pt-1">
                  <Link to="/hire">Freelance work</Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="fo-footer-bottom">
          <p>© {year} {profile.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
