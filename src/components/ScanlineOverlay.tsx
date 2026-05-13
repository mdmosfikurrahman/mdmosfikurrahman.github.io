// Global scanline + soft CRT vignette. Decorative, pointer-events-none.
// Lives above SiteWatermark, below interactive content.
export default function ScanlineOverlay() {
  return (
    <>
      <div aria-hidden className="scan-overlay print:hidden" />
      <div aria-hidden className="crt-vignette print:hidden" />
    </>
  );
}
