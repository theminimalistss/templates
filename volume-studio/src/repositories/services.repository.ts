import type { Service } from "../types/content";
const services: Service[] = [
  {
    number: "01",
    title: "INTERIOR ARCHITECTURE",
    description:
      "Space rethought from the inside out. Structure, proportion and detail, considered together.",
    image: "stair",
    deliverables: [
      "Concept development",
      "Interior detailing",
      "Construction documentation",
    ],
  },
  {
    number: "02",
    title: "RESIDENTIAL INTERIORS",
    description: "Personal spaces shaped around the rituals of everyday life.",
    image: "casa",
    deliverables: ["Private residences", "Renovations", "Bespoke joinery"],
  },
  {
    number: "03",
    title: "COMMERCIAL SPACES",
    description:
      "Distinct environments for work, hospitality and human connection.",
    image: "axis",
    deliverables: ["Workplaces", "Hospitality", "Retail environments"],
  },
  {
    number: "04",
    title: "SPATIAL PLANNING",
    description: "A clear framework for how people move, gather and use space.",
    image: "light",
    deliverables: [
      "Feasibility studies",
      "Space planning",
      "Circulation studies",
    ],
  },
  {
    number: "05",
    title: "MATERIAL + OBJECT CURATION",
    description:
      "A restrained selection of finishes, furniture and objects with lasting presence.",
    image: "detail",
    deliverables: [
      "Material palettes",
      "Furniture selection",
      "Custom objects",
    ],
  },
];
export const servicesRepository = { all: () => services };
