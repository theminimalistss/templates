import type { ProjectRecord } from "../types/content";
const projects: ProjectRecord[] = [
  {
    slug: "casa-v01",
    number: "01",
    title: "CASA V01",
    category: "Residential",
    location: "Cebu",
    country: "Philippines",
    year: 2026,
    area: 320,
    image: "casa",
    gallery: ["living", "detail", "casa"],
    description:
      "An intimate residence composed around the movement of daylight. Warm oak, tactile stone and quiet thresholds bring a sense of permanence to everyday rituals. Open living spaces give way to smaller, sheltered moments.",
    materials: ["Natural oak", "Limestone", "Lime plaster"],
  },
  {
    slug: "monolith-house",
    number: "02",
    title: "MONOLITH HOUSE",
    category: "Residential",
    location: "Manila",
    country: "Philippines",
    year: 2026,
    area: 480,
    image: "monolith",
    gallery: ["stair", "bath", "monolith"],
    description:
      "A study in mass and restraint. Deep reveals and grounded material surfaces frame the changing tropical light. Private rooms gather around a generous shared space, balancing the scale of the building with the intimacy of home.",
    materials: ["Board-formed concrete", "Smoked oak", "Bronze"],
  },
  {
    slug: "axis-workspace",
    number: "03",
    title: "AXIS WORKSPACE",
    category: "Commercial",
    location: "Singapore",
    country: "Singapore",
    year: 2025,
    area: 860,
    image: "axis",
    gallery: ["detail", "stair", "axis"],
    description:
      "A place for focused work and unexpected exchange. An open plan is organised by material thresholds, shared tables and quiet edges. The existing structure remains visible, giving the workspace an honest, unpolished character.",
    materials: ["Exposed concrete", "Birch plywood", "Brushed steel"],
  },
  {
    slug: "north-house",
    number: "04",
    title: "NORTH HOUSE",
    category: "Residential",
    location: "Melbourne",
    country: "Australia",
    year: 2025,
    area: 260,
    image: "north",
    gallery: ["living", "detail", "north"],
    description:
      "A home that turns toward the light. Soft neutral surfaces and natural timber form a quiet backdrop to daily life. Spaces unfold gradually, offering long views and moments of enclosure in equal measure.",
    materials: ["Australian oak", "Travertine", "Linen"],
  },
];
export const projectsRepository = {
  all: (): readonly ProjectRecord[] => projects,
};
