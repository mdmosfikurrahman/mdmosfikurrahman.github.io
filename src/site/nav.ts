// Primary navigation. The header, the mobile menu, the footer and the 404 page
// all read this list, so a page is added in one place. Work and Research sit
// side by side: neither side of the profile outranks the other.
export const FOLIO_NAV = [
  { to: "/work", label: "Work" },
  { to: "/publications", label: "Research" },
  { to: "/experience", label: "Experience" },
  { to: "/about", label: "About" },
] as const;
