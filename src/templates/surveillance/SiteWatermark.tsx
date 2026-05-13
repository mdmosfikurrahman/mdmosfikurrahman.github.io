// POI surveillance backdrop:
//   Layer 1: pixel grid (Machine's spatial reference)
//   Layer 2: faint serial-number / coordinate glyphs at page edges
//   Layer 3: reticles pinned to corners (relevant + threat)
// Decorative: aria-hidden, pointer-events-none, hidden in print.

export default function SiteWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden"
    >
      {/* Pixel surveillance grid */}
      <div
        className="absolute inset-0 surveillance-grid"
        style={{ backgroundAttachment: "fixed" }}
      />

      {/* Corner reticles */}
      <div className="absolute inset-0 hidden md:block">
        <Reticle className="absolute top-20 left-4 lg:left-8" />
        <Reticle className="absolute bottom-20 right-4 lg:right-8" />
      </div>

      {/* Drifting coordinate strings */}
      <div className="absolute inset-0 hidden lg:block opacity-[0.12]">
        <span
          className="absolute top-[8%] right-[4%] font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: "hsl(var(--ink))" }}
        >
          LAT 23.8103° / LON 90.4125° / DHAKA
        </span>
        <span
          className="absolute top-1/2 left-2 -translate-y-1/2 origin-left -rotate-90 font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "hsl(var(--ink))" }}
        >
          SCAN {randSerial(8)} // FEED 14221 // SECTOR-04
        </span>
        <span
          className="absolute bottom-[6%] left-[6%] font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: "hsl(var(--ink))" }}
        >
          NODE 0x{randSerial(6)} // CHANNEL A // CHECKSUM {randSerial(4)}
        </span>
        <span
          className="absolute top-[42%] right-[3%] origin-right rotate-90 font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "hsl(var(--ink))" }}
        >
          ADMIN H. FINCH / ASSET J. REESE / ANALOG INTERFACE
        </span>
      </div>
    </div>
  );
}

function Reticle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      width="44"
      height="44"
      className={`opacity-[0.18] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      style={{ color: "hsl(var(--ink))" }}
    >
      <circle cx="30" cy="30" r="22" />
      <circle cx="30" cy="30" r="2" fill="currentColor" />
      <line x1="30" y1="2" x2="30" y2="14" />
      <line x1="30" y1="46" x2="30" y2="58" />
      <line x1="2" y1="30" x2="14" y2="30" />
      <line x1="46" y1="30" x2="58" y2="30" />
    </svg>
  );
}

// Deterministic-ish serial per render. Looks like a checksum, doesn't matter.
function randSerial(len: number) {
  const chars = "0123456789ABCDEF";
  let s = "";
  for (let i = 0; i < len; i++) {
    s += chars[Math.floor((Math.random() * 16) % 16)];
  }
  return s;
}
