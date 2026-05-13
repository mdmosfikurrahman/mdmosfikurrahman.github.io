// Inception: drafting paper grid + Penrose-stair ornament in the corners.
export default function SiteWatermark() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden">
      {/* Drafting grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--ink) / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink) / 0.04) 1px, transparent 1px), linear-gradient(hsl(var(--ink) / 0.07) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink) / 0.07) 1px, transparent 1px)",
          backgroundSize: "12px 12px, 12px 12px, 60px 60px, 60px 60px",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Penrose stair, faint */}
      <svg
        viewBox="0 0 200 200"
        className="absolute bottom-10 right-6 lg:right-12 hidden md:block opacity-[0.09]"
        style={{ width: 180, color: "hsl(var(--accent))" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M30 170 L30 130 L70 130 L70 90 L110 90 L110 50 L170 50 L170 110 L130 110 L130 150 L90 150 L90 190 L30 190 Z" />
      </svg>
    </div>
  );
}
