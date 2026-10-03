import { Fragment, useMemo, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteHeader from "@/site/SiteHeader";
import SiteFooter from "@/site/SiteFooter";
import { FOLIO_NAV } from "@/site/nav";

const messages = [
  "Nothing lives at {path}.",
  "{path} is not a page on this site.",
  "{path} either moved or never existed.",
];

function withPath(message: string, path: string): ReactNode[] {
  const parts = message.split("{path}");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <code className="fo-meta fo-ink px-1.5 py-0.5 rounded bg-[hsl(var(--paper-deep))] border border-[hsl(var(--rule))]">{path}</code>}
    </Fragment>
  ));
}

export default function NotFound() {
  const { pathname } = useLocation();
  const message = useMemo(() => messages[Math.floor(Math.random() * messages.length)], []);
  return (
    <>
      <SiteHeader />
      <main>
        <section className="fo-pagehero !border-b-0">
          <div className="fo-wrap">
            <p className="fo-eyebrow">Error 404</p>
            <h1 className="fo-h1 mt-3">
              Page <em>not found</em>
            </h1>
            <p className="fo-lead mt-5 max-w-[56ch]">{withPath(message, pathname)}</p>
            <div className="fo-actions mt-9">
              <Link to="/" className="fo-btn fo-btn--primary">Back to home</Link>
              <Link to="/work" className="fo-btn fo-btn--secondary">See my work</Link>
            </div>
            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
              {FOLIO_NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="fo-link">
                    {n.label} <span className="arw" aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
