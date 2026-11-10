export type Photo = {
  slug: string;
  title: string;
  year?: number;
  w: number;
  h: number;
};

export const photos: Photo[] = [
  { slug: "tea", title: "Morning tea", year: 2018, w: 1067, h: 1067 },
  { slug: "boatman", title: "Boatman", year: 2017, w: 1600, h: 896 },
  { slug: "diya", title: "Diya", year: 2018, w: 1600, h: 911 },
  { slug: "street-kitchen", title: "Street kitchen", year: 2018, w: 1600, h: 1140 },
  { slug: "marbles", title: "Marbles", w: 1271, h: 952 },
  { slug: "crow", title: "Crow on the railing", year: 2018, w: 1600, h: 1197 },
  { slug: "dragonfly", title: "Dragonfly", year: 2018, w: 1600, h: 1163 },
  { slug: "evening-walk", title: "Evening walk", year: 2018, w: 897, h: 1600 },
  { slug: "grass", title: "Grass in seed", year: 2018, w: 1600, h: 1198 },
  { slug: "vendor", title: "Street vendor", year: 2018, w: 1180, h: 1600 },
  { slug: "lights", title: "Lights", w: 1600, h: 997 },
  { slug: "padlocks", title: "Padlocks", w: 954, h: 714 },
  { slug: "kittens", title: "Kittens", year: 2018, w: 1600, h: 1141 },
  { slug: "old-door", title: "Old door", year: 2018, w: 1074, h: 696 },
  { slug: "sunset", title: "Sunset", year: 2017, w: 1600, h: 896 },
  { slug: "pond", title: "Pond at dusk", year: 2018, w: 1600, h: 896 },
];

export const photoSrc = (p: Photo, small = false) => `/photography/${p.slug}${small ? "-sm" : ""}.jpg`;
