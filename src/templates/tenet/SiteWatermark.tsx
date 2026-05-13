// Tenet: very subtle palindrome-arrow ornaments at the page edges.
export default function SiteWatermark() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden">
      {/* Two opposing chevron rows on left/right edges */}
      <div className="absolute top-0 bottom-0 left-2 hidden md:flex flex-col justify-evenly opacity-[0.10]"
           style={{ color: "hsl(var(--accent))" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="font-mono text-[12px]">▸</span>
        ))}
      </div>
      <div className="absolute top-0 bottom-0 right-2 hidden md:flex flex-col justify-evenly opacity-[0.10]"
           style={{ color: "hsl(var(--signal-crit))" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="font-mono text-[12px]">◂</span>
        ))}
      </div>
    </div>
  );
}
