// Two-layer background watermark:
//   Layer 1: faint engineering grid (minor 16px + major 64px)
//   Layer 2: sparse research / engineering glyphs, fixed at page edges
// Fully decorative: aria-hidden, pointer-events-none, hidden in print.

export default function SiteWatermark() {
  const gridBg = [
    // minor grid
    "linear-gradient(hsl(var(--ink) / 0.022) 1px, transparent 1px)",
    "linear-gradient(90deg, hsl(var(--ink) / 0.022) 1px, transparent 1px)",
    // major grid
    "linear-gradient(hsl(var(--ink) / 0.045) 1px, transparent 1px)",
    "linear-gradient(90deg, hsl(var(--ink) / 0.045) 1px, transparent 1px)",
  ].join(", ");

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden"
    >
      {/* Layer 1: grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: gridBg,
          backgroundSize: "16px 16px, 16px 16px, 64px 64px, 64px 64px",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Layer 2: glyphs (hidden on small screens so mobile stays calm) */}
      <div className="absolute inset-0 hidden md:block text-ink">
        {/* Sine curve on axes: upper-right quadrant */}
        <svg
          viewBox="0 0 180 110"
          className="absolute top-20 right-4 lg:right-8 w-[180px] lg:w-[220px] h-auto opacity-[0.055]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Y axis + arrow */}
          <line x1="18" y1="10" x2="18" y2="100" />
          <path d="M14 14 L18 10 L22 14" />
          {/* X axis + arrow */}
          <line x1="12" y1="96" x2="175" y2="96" />
          <path d="M171 92 L175 96 L171 100" />
          {/* X ticks */}
          <line x1="52" y1="94" x2="52" y2="98" />
          <line x1="86" y1="94" x2="86" y2="98" />
          <line x1="120" y1="94" x2="120" y2="98" />
          <line x1="154" y1="94" x2="154" y2="98" />
          {/* Y ticks */}
          <line x1="16" y1="40" x2="20" y2="40" />
          <line x1="16" y1="68" x2="20" y2="40" transform="translate(0 28)" />
          {/* Sine-like curve */}
          <path
            d="M 18 68 C 35 28, 50 28, 70 68 C 90 108, 100 108, 120 68 C 140 28, 155 28, 172 68"
            strokeWidth="1.3"
          />
          {/* Tiny label */}
          <text
            x="130"
            y="26"
            fontSize="9"
            fontFamily="JetBrains Mono, monospace"
            fill="currentColor"
            stroke="none"
            letterSpacing="0.06em"
          >
            f(x)
          </text>
        </svg>

        {/* Microservice architecture: left middle (api → rules → db) */}
        <svg
          viewBox="0 0 220 70"
          className="absolute top-1/2 -translate-y-1/2 left-2 lg:left-6 w-[220px] lg:w-[260px] h-auto opacity-[0.055]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Service boxes */}
          <rect x="6" y="22" width="50" height="24" rx="2.5" />
          <rect x="82" y="22" width="56" height="24" rx="2.5" />
          <rect x="164" y="22" width="50" height="24" rx="2.5" />
          {/* Connecting arrows */}
          <line x1="56" y1="34" x2="78" y2="34" />
          <path d="M74 31 L78 34 L74 37 Z" fill="currentColor" stroke="none" />
          <line x1="138" y1="34" x2="160" y2="34" />
          <path d="M156 31 L160 34 L156 37 Z" fill="currentColor" stroke="none" />
          {/* Tiny mono labels */}
          <text
            x="16"
            y="38"
            fontSize="9"
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            fill="currentColor"
            stroke="none"
            letterSpacing="0.08em"
          >
            api
          </text>
          <text
            x="89"
            y="38"
            fontSize="9"
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            fill="currentColor"
            stroke="none"
            letterSpacing="0.08em"
          >
            rules
          </text>
          <text
            x="176"
            y="38"
            fontSize="9"
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            fill="currentColor"
            stroke="none"
            letterSpacing="0.08em"
          >
            db
          </text>
        </svg>

        {/* Integral with limits: bottom-right */}
        <svg
          viewBox="0 0 170 90"
          className="absolute bottom-12 right-6 lg:right-10 w-[160px] lg:w-[200px] h-auto opacity-[0.06]"
          fill="currentColor"
          stroke="none"
        >
          <text
            x="4"
            y="76"
            fontSize="96"
            fontFamily="Fraunces, serif"
            fontStyle="italic"
            fontWeight="200"
          >
            ∫
          </text>
          <text
            x="34"
            y="22"
            fontSize="14"
            fontFamily="Fraunces, serif"
            fontStyle="italic"
          >
            b
          </text>
          <text
            x="34"
            y="80"
            fontSize="14"
            fontFamily="Fraunces, serif"
            fontStyle="italic"
          >
            a
          </text>
          <text
            x="60"
            y="56"
            fontSize="22"
            fontFamily="Fraunces, serif"
            fontStyle="italic"
          >
            f(x)
          </text>
          <text
            x="110"
            y="56"
            fontSize="20"
            fontFamily="Fraunces, serif"
            fontStyle="italic"
          >
            dx
          </text>
        </svg>

        {/* Neural net 3-2-1: mid-left, lower zone */}
        <svg
          viewBox="0 0 120 100"
          className="absolute bottom-32 left-4 lg:left-10 w-[120px] lg:w-[150px] h-auto opacity-[0.05]"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
        >
          {/* edges L1 -> L2 */}
          <line x1="12" y1="18" x2="60" y2="36" />
          <line x1="12" y1="18" x2="60" y2="70" />
          <line x1="12" y1="50" x2="60" y2="36" />
          <line x1="12" y1="50" x2="60" y2="70" />
          <line x1="12" y1="82" x2="60" y2="36" />
          <line x1="12" y1="82" x2="60" y2="70" />
          {/* edges L2 -> L3 */}
          <line x1="60" y1="36" x2="108" y2="52" />
          <line x1="60" y1="70" x2="108" y2="52" />
          {/* nodes */}
          {[
            [12, 18],
            [12, 50],
            [12, 82],
            [60, 36],
            [60, 70],
            [108, 52],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="4"
              fill="currentColor"
              fillOpacity="0.55"
              stroke="none"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
