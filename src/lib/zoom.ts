// On wide screens the whole app is zoomed (#root, see index.css). Offsets written
// in CSS pixels must be scaled by it before they are compared with
// getBoundingClientRect() or window scroll positions, which are screen pixels.
export function pageZoom(): number {
  const root = document.getElementById("root");
  const z = root ? parseFloat(getComputedStyle(root).zoom) : 1;
  return Number.isFinite(z) && z > 0 ? z : 1;
}
