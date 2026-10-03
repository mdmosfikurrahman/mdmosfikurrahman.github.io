import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export function FoSection({
  id,
  alt,
  tight,
  children,
}: {
  id?: string;
  alt?: boolean;
  tight?: boolean;
  children: ReactNode;
}) {
  const cls = ["fo-section", alt ? "fo-section--alt" : "", tight ? "fo-section--tight" : ""].join(" ");
  return (
    <section id={id} className={cls}>
      <div className="fo-wrap">{children}</div>
    </section>
  );
}

export function FoHead({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: { to: string; label: string };
}) {
  return (
    <div className="fo-head">
      <div>
        <p className="fo-eyebrow">{eyebrow}</p>
        <h2 className="fo-h2 mt-3">{title}</h2>
        {lede && <p className="fo-lede mt-3 max-w-[58ch]">{lede}</p>}
      </div>
      {action && (
        <Link to={action.to} className="fo-link">
          {action.label} <span className="arw" aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

// Frame for every inner page: header, a title block, the page, the footer.
export function FoPage({
  eyebrow,
  crumbs,
  here,
  title,
  lede,
  extra,
  children,
}: {
  eyebrow?: string;
  crumbs?: { to: string; label: string }[];
  here?: string;
  title: ReactNode;
  lede?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="fo-pagehero">
          <div className="fo-wrap">
            {crumbs && (
              <nav aria-label="Breadcrumb" className="fo-crumbs mb-5">
                {crumbs.map((c) => (
                  <span key={c.to} className="inline-flex items-center gap-2">
                    <Link to={c.to}>{c.label}</Link>
                    <span aria-hidden>/</span>
                  </span>
                ))}
                {here && <span aria-current="page" className="fo-ink">{here}</span>}
              </nav>
            )}
            {eyebrow && <p className="fo-eyebrow">{eyebrow}</p>}
            <h1 className="fo-h1 mt-3 max-w-[22ch]">{title}</h1>
            {lede && <p className="fo-lead mt-5 max-w-[60ch]">{lede}</p>}
            {extra && <div className="mt-10">{extra}</div>}
          </div>
        </header>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

export type StatItem = { v: string | number; k: string; n?: string; onClick?: () => void };

export function Stats({ items }: { items: StatItem[] }) {
  return (
    <div className="fo-stats" style={{ ["--fo-cols" as string]: String(items.length) }}>
      {items.map((s) => {
        const inner = (
          <>
            <div className="fo-stat-v">{s.v}</div>
            <div className="fo-stat-k">{s.k}</div>
            {s.n && <div className="fo-stat-n">{s.n}</div>}
          </>
        );
        return s.onClick ? (
          <button key={s.k} type="button" onClick={s.onClick} className="fo-stat">
            {inner}
          </button>
        ) : (
          <div key={s.k} className="fo-stat">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export function TimelineItem({
  when,
  sub,
  current,
  children,
}: {
  when: string;
  sub?: string;
  current?: boolean;
  children: ReactNode;
}) {
  return (
    <li className={["fo-tl-item", current ? "fo-tl-item--current" : ""].join(" ")}>
      <div className="fo-tl-when">
        <p>{when}</p>
        {sub && <span>{sub}</span>}
      </div>
      <div className="min-w-0">{children}</div>
    </li>
  );
}
