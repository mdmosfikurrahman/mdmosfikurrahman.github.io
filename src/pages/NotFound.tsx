import { useLocation } from "react-router-dom";

export default function NotFound() {
  const loc = useLocation();
  return (
    <main>
      <section className="shell py-24 md:py-36">
        <p className="sig">Errata · 404</p>
        <h1 className="mt-2 font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.03em]">
          Not in the archive.
        </h1>
        <p className="mt-5 max-w-prose font-serif-body text-[1.075rem] leading-[1.6] text-ink-soft">
          The path{" "}
          <code className="font-mono text-[13px] px-1.5 py-0.5 border rule bg-paper-deep">
            {loc.pathname}
          </code>{" "}
          is not catalogued on this site. If you believe it should be, please write.
        </p>
        <div className="mt-8">
          <a className="a-arrow" href="/">
            Return to the front cover <span className="arw">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
