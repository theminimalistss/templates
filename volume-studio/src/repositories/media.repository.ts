import metadata from "./media-metadata.json";
import type { Media } from "../types/content";
const media: Media[] = [
  {
    id: "casa",
    alt: "Minimal dining room with stone walls, black furniture and a timber stair",
    width: 1920,
    height: 1280,
  },
  {
    id: "monolith",
    alt: "Light-filled home with a timber stair, pale sofas and a garden view",
    width: 1920,
    height: 1280,
  },
  {
    id: "axis",
    alt: "Raw concrete workspace with a simple table and an indoor tree",
    width: 1920,
    height: 2880,
  },
  {
    id: "north",
    alt: "Sunlit living room with a leather sofa, natural furnishings and tall windows",
    width: 1920,
    height: 1280,
  },
  {
    id: "living",
    alt: "Open-plan living room with oak floors and carefully placed furniture",
    width: 1920,
    height: 1280,
  },
  {
    id: "detail",
    alt: "Dark stone, marble and timber meet in a finely detailed interior",
    width: 1920,
    height: 2909,
  },
  {
    id: "stair",
    alt: "A steel staircase cuts diagonally across a raw concrete wall",
    width: 1920,
    height: 2880,
  },
  {
    id: "bath",
    alt: "Minimal stone bathroom with glass partitions and warm wood paneling",
    width: 1920,
    height: 1280,
  },
  {
    id: "light",
    alt: "Daylight falls across timber floors beside a white staircase",
    width: 1920,
    height: 1280,
  },
];
export const mediaRepository = {
  find: (id: string) =>
    media
      .map((item) => ({
        ...item,
        ...metadata[item.id as keyof typeof metadata],
      }))
      .find((item) => item.id === id),
  all: () => media,
};
