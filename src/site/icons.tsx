type IconProps = { size?: number | string; strokeWidth?: number | string; className?: string };

// Lucide has no WhatsApp mark; this is the familiar outline, drawn to sit beside
// Lucide's stroke icons at the same size and weight.
export function WhatsAppIcon({ size = 16, strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.4z" />
      <path d="M9.2 8.6c.2-.5.5-.6.8-.6h.6c.2 0 .4.1.5.4l.8 1.8c.1.2 0 .5-.1.6l-.6.7c-.1.2-.1.4 0 .6.6 1 1.5 1.8 2.5 2.4.2.1.4.1.6 0l.7-.7c.2-.2.4-.2.6-.1l1.8.8c.3.1.4.3.4.5v.6c0 .3-.1.6-.6.8-.6.3-1.4.4-2.1.2-1.9-.5-3.6-1.7-4.8-3.3-.8-1.1-1.3-2.3-1.4-3.1-.1-.6 0-1.2.3-1.6z" />
    </svg>
  );
}
