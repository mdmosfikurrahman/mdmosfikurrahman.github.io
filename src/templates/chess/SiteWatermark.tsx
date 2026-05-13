// Chess: 8x8 board pattern, very faint, fixed.
export default function SiteWatermark() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="board" x="0" y="0" width="112" height="112" patternUnits="userSpaceOnUse">
            <rect x="0"  y="0"  width="56" height="56" fill="currentColor" />
            <rect x="56" y="56" width="56" height="56" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#board)" style={{ color: "hsl(var(--ink))" }} />
      </svg>
    </div>
  );
}
