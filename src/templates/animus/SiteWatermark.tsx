// Animus: faint DNA helix + scan grid backdrop, fixed.
export default function SiteWatermark() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden">
      {/* Scan grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--ink) / 0.045) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink) / 0.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
          backgroundAttachment: "fixed",
        }}
      />
      {/* DNA helix lines, very faint */}
      <svg
        viewBox="0 0 120 600"
        preserveAspectRatio="none"
        className="absolute top-0 bottom-0 right-6 lg:right-12 hidden md:block opacity-[0.07]"
        style={{ width: 80, height: "100%", color: "hsl(var(--accent))" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M20,0 Q60,30 100,60 T20,120 T100,180 T20,240 T100,300 T20,360 T100,420 T20,480 T100,540 T20,600" />
        <path d="M100,0 Q60,30 20,60 T100,120 T20,180 T100,240 T20,300 T100,360 T20,420 T100,480 T20,540 T100,600" />
      </svg>
      <svg
        viewBox="0 0 120 600"
        preserveAspectRatio="none"
        className="absolute top-0 bottom-0 left-6 lg:left-12 hidden md:block opacity-[0.07]"
        style={{ width: 80, height: "100%", color: "hsl(var(--accent))" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M20,0 Q60,30 100,60 T20,120 T100,180 T20,240 T100,300 T20,360 T100,420 T20,480 T100,540 T20,600" />
        <path d="M100,0 Q60,30 20,60 T100,120 T20,180 T100,240 T20,300 T100,360 T20,420 T100,480 T20,540 T100,600" />
      </svg>
    </div>
  );
}
