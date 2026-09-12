import { ArrowUpRight } from "lucide-react";
import { freelance } from "@/lib/content";
import { useHireLinks } from "@/lib/settings";

// The freelance band. Written once and shared by every industry template:
// it is built entirely from the theme tokens (--ink, --accent, --rule-soft)
// and the global utility classes, so it takes on each template's palette
// without a per-template variant. If one template ever needs its own voice
// here, drop a Hire.tsx in that folder and point the dispatcher at it.
export default function Hire() {
  const links = useHireLinks();

  return (
    <section id="hire" className="border-t rule-soft">
      <div className="mx-auto w-full max-w-[920px] px-5 sm:px-6 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-10 gap-y-12">
          {/* Left: the offer */}
          <div className="col-span-12 md:col-span-5">
            <p className="sig">Freelance</p>

            {freelance.available && (
              <p
                className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[12.5px]"
                style={{
                  color: "hsl(var(--accent))",
                  border: "1px solid hsl(var(--rule-soft))",
                }}
              >
                <span
                  aria-hidden
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: "hsl(var(--accent))" }}
                />
                {freelance.label}
              </p>
            )}

            <h2
              className="mt-4 font-display text-[30px] md:text-[40px] leading-[1.12] tracking-[-0.025em]"
              style={{ color: "hsl(var(--ink))" }}
            >
              {freelance.headline}
            </h2>

            <p
              className="mt-5 text-[15.5px] leading-[1.7] max-w-[46ch] text-pretty"
              style={{ color: "hsl(var(--ink-soft))" }}
            >
              {freelance.blurb}
            </p>

            <dl className="mt-7 space-y-2.5 text-[14.5px]">
              <div className="flex gap-3">
                <dt className="w-[92px] shrink-0" style={{ color: "hsl(var(--muted))" }}>
                  Capacity
                </dt>
                <dd style={{ color: "hsl(var(--ink-soft))" }}>{freelance.capacity}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-[92px] shrink-0" style={{ color: "hsl(var(--muted))" }}>
                  Response
                </dt>
                <dd style={{ color: "hsl(var(--ink-soft))" }}>{freelance.responseTime}</dd>
              </div>
            </dl>

            {links.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2">
                {links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[13.5px] transition-colors"
                      style={{
                        color: "hsl(var(--ink))",
                        border: "1px solid hsl(var(--rule-soft))",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--accent))")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--ink))")}
                    >
                      {l.label}
                      <ArrowUpRight size={13} strokeWidth={1.8} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right: what the work actually is */}
          <div className="col-span-12 md:col-span-7 min-w-0">
            <p className="mg-label mb-3">What I take on</p>
            <ul>
              {freelance.services.map((s, i) => (
                <li
                  key={s.title}
                  className="grid grid-cols-[28px,1fr] gap-4 py-5 border-b rule-soft last:border-b-0"
                >
                  <span
                    className="text-[13px] pt-[3px] tabular-nums"
                    style={{ color: "hsl(var(--muted))" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3
                      className="text-[16px] font-medium tracking-[-0.01em]"
                      style={{ color: "hsl(var(--ink))" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="mt-1.5 text-[14.5px] leading-[1.6] text-pretty"
                      style={{ color: "hsl(var(--ink-soft))" }}
                    >
                      {s.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
