import { Link } from "react-router-dom";
import { ArrowUpRight, FileDown, Github, GraduationCap, IdCard, Linkedin, Mail, type LucideIcon } from "lucide-react";
import { profile, preamble, stats, publications } from "@/lib/content";
import { useAvatarUrl, useCvDownload } from "@/lib/settings";
import { useLens, type Lens } from "@/lib/lens";
import { emphasise } from "./format";

const CHIP: Record<Lens, string> = {
  balanced: "Backend architect · applied-ML researcher · Dhaka",
  industry: "Backend architect · engineering team lead · Dhaka",
  academia: "Applied-ML researcher · backend architect · Dhaka",
};

type Track = {
  id: "engineering" | "research";
  eyebrow: string;
  title: string;
  figures: { v: string; k: string }[];
  primary: { to: string; label: string };
  secondary: { href: string; label: string; external?: boolean };
};

function TrackCard({ t }: { t: Track }) {
  return (
    <article className="fo-track">
      <p className="fo-eyebrow">{t.eyebrow}</p>
      <h2 className="fo-h4 mt-2">{t.title}</h2>
      <dl className="fo-track-figs">
        {t.figures.map((f) => (
          <div key={f.k}>
            <dt className="sr-only">{f.k}</dt>
            <dd>
              <b>{f.v}</b>
              <span>{f.k}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="fo-track-links">
        <Link to={t.primary.to} className="fo-link">
          {t.primary.label} <span className="arw" aria-hidden>→</span>
        </Link>
        {t.secondary.external ? (
          <a href={t.secondary.href} target="_blank" rel="noreferrer" className="fo-link fo-link--quiet">
            {t.secondary.label} <ArrowUpRight size={13} strokeWidth={1.9} aria-hidden />
          </a>
        ) : (
          <Link to={t.secondary.href} className="fo-link fo-link--quiet">
            {t.secondary.label}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function Hero() {
  const avatar = useAvatarUrl();
  const cv = useCvDownload();
  const lens = useLens();
  const awards = publications.filter((p) => p.award).length;

  const engineering: Track = {
    id: "engineering",
    eyebrow: "Engineering",
    title: profile.roleLong,
    figures: [
      { v: `${stats.years}+`, k: "years in industry" },
      { v: String(stats.systems), k: "systems shipped" },
    ],
    primary: { to: "/work", label: "See the work" },
    secondary: { href: "/experience", label: "Experience" },
  };
  const research: Track = {
    id: "research",
    eyebrow: "Research",
    title: `Applied ML, IoT and security · ${awards === 1 ? "IEEE Best Paper Award" : `${awards} best paper awards`}`,
    figures: [
      { v: String(stats.publications), k: `papers, ${stats.firstAuthor} as first author` },
      { v: String(stats.citations), k: "citations on Google Scholar" },
    ],
    primary: { to: "/publications", label: "Read the research" },
    secondary: { href: profile.links.scholar, label: "Google Scholar", external: true },
  };
  const tracks = lens === "academia" ? [research, engineering] : [engineering, research];

  const socials: { Icon: LucideIcon; href: string; label: string; newTab?: boolean; download?: boolean }[] = [
    { Icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
    { Icon: Github, href: profile.links.github, label: "GitHub", newTab: true },
    { Icon: Linkedin, href: profile.links.linkedin, label: "LinkedIn", newTab: true },
    { Icon: GraduationCap, href: profile.links.scholar, label: "Google Scholar", newTab: true },
    { Icon: IdCard, href: profile.links.orcid, label: "ORCID", newTab: true },
    { Icon: FileDown, href: cv.href, label: cv.title, newTab: true, download: cv.download },
  ];

  return (
    <section id="top" className="fo-hero">
      <div className="fo-wrap">
        <div className="fo-hero-grid">
          <div className="min-w-0">
            <img src={avatar} alt="" className="fo-avatar-sm" />
            <p className="fo-chip fo-chip--parts">
              {CHIP[lens].split(" · ").map((part, i, all) => (
                <span key={part}>{i < all.length - 1 ? `${part} ·` : part}</span>
              ))}
            </p>
            <h1 className="fo-display mt-6">{profile.name}</h1>
            <p className="fo-lead mt-6 max-w-[38ch]">{emphasise(profile.tagline, "quiet half")}</p>
            <p className="fo-body mt-5 max-w-[56ch]">{preamble[1]}</p>
            <div className="fo-socials -ml-2.5 mt-7">
              {socials.map(({ Icon, href, label, newTab, download }) => (
                <a
                  key={label}
                  href={href}
                  target={newTab ? "_blank" : undefined}
                  rel={newTab ? "noreferrer" : undefined}
                  download={download || undefined}
                  aria-label={label}
                  title={label}
                  className="fo-social"
                >
                  <Icon size={18} strokeWidth={1.7} />
                </a>
              ))}
            </div>
          </div>

          <figure className="fo-portrait">
            <img src={avatar} alt={`Portrait of ${profile.name}`} loading="eager" />
          </figure>
        </div>

        <div className="fo-tracks mt-12 md:mt-14">
          {tracks.map((t) => (
            <TrackCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
