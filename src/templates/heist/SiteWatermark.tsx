// Heist: cork-board texture (faint speckle) + a red yarn diagonal.
export default function SiteWatermark() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden">
      {/* Cork-board noise via SVG dots */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="cork" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="3"  cy="6"  r="0.8" fill="currentColor" />
            <circle cx="14" cy="3"  r="0.6" fill="currentColor" />
            <circle cx="9"  cy="16" r="0.7" fill="currentColor" />
            <circle cx="18" cy="13" r="0.5" fill="currentColor" />
            <circle cx="6"  cy="19" r="0.4" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cork)" style={{ color: "hsl(var(--ink))" }} />
      </svg>
      {/* Red yarn — long diagonal */}
      <div
        className="absolute hidden md:block"
        style={{
          top: "12%",
          left: "-10%",
          width: "120%",
          height: 2,
          background: "hsl(var(--accent))",
          opacity: 0.18,
          transform: "rotate(-12deg)",
          boxShadow: "0 0 8px hsl(var(--accent) / 0.3)",
        }}
      />
      <div
        className="absolute hidden md:block"
        style={{
          bottom: "16%",
          left: "-10%",
          width: "120%",
          height: 2,
          background: "hsl(var(--accent))",
          opacity: 0.14,
          transform: "rotate(8deg)",
          boxShadow: "0 0 8px hsl(var(--accent) / 0.3)",
        }}
      />
    </div>
  );
}
