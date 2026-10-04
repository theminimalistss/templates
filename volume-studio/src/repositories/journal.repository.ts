import type { JournalRecord } from "../types/content";
const entries: JournalRecord[] = [
  {
    slug: "the-weight-of-material",
    number: "01",
    title: "THE WEIGHT OF MATERIAL",
    category: "Material studies",
    date: "2026-09-18",
    image: "detail",
    intro:
      "A material is more than its surface. It carries a temperature, a history and a way of meeting the hand.",
    paragraphs: [
      "We start with materials that can be understood without explanation. The grain of timber, the small irregularities in stone, the depth of a plaster wall. Each offers something a perfect surface cannot: evidence of how it was made.",
      "In a quiet interior, these differences become more visible. A single junction between oak and stone can establish the character of a whole room. We study these meetings at the scale of the hand before considering them at the scale of the building.",
      "Our material palettes are deliberately limited. The intention is to allow a few elements to develop a richer conversation over time. Patina, weathering and use are part of the design.",
    ],
  },
  {
    slug: "light-as-architecture",
    number: "02",
    title: "LIGHT AS ARCHITECTURE",
    category: "Observations",
    date: "2026-08-24",
    image: "light",
    intro:
      "Light has no fixed form. Yet it can give a room its clearest definition.",
    paragraphs: [
      "Before drawing a wall, we observe the light. Where it enters, how it moves and what it touches at different hours. A plan begins to take shape through these daily patterns.",
      "Deep window reveals soften direct sun. A narrow opening draws a line across a wall. An enclosed corner becomes a place to pause when light reaches it in the late afternoon. These small shifts give a space a rhythm.",
      "Artificial light continues the same thinking after dark. We favour pools of light and moments of shadow, allowing the room to retain its depth rather than illuminating every surface equally.",
    ],
  },
  {
    slug: "objects-in-space",
    number: "03",
    title: "OBJECTS IN SPACE",
    category: "Objects & form",
    date: "2026-07-12",
    image: "north",
    intro: "The space around an object matters as much as the object itself.",
    paragraphs: [
      "A chair can establish a place for solitude. A long table can suggest gathering. Objects carry an invitation through their proportion, position and relationship to the architecture around them.",
      "We select pieces with a clear material presence. A strong silhouette can hold an empty corner; a low, generous form can bring a large room back to human scale.",
      "Curation is a process of subtraction. We leave enough room for movement, for change and for the objects that life will bring. An interior should always have the capacity to evolve.",
    ],
  },
];
export const journalRepository = {
  all: (): readonly JournalRecord[] => entries,
};
