export type MediaAsset = {
  id: string;
  category: string;
  width: number;
  height: number;
  alt: string;
  widths: number[];
};

export const media = {
  estateMobile: { id: 'maison-vielle-estate-mobile', category: 'hero', width: 1024, height: 1844, alt: 'The pale stone estate seen from its garden', widths: [480, 768] },
  estate: { id: 'maison-vielle-estate', category: 'estate', width: 3269, height: 1844, alt: 'Warm stone European estate framed by mature trees and formal gardens', widths: [480, 768, 1200, 1600, 2000] },
  architecture: { id: 'estate-architecture', category: 'estate', width: 2268, height: 4032, alt: 'Sunlight falling across the architectural details of a European estate', widths: [480, 768, 1200] },
  hall: { id: 'grand-hall', category: 'spaces', width: 4256, height: 2832, alt: 'An elegant dining room with timeless architectural details', widths: [480, 768, 1200, 1600] },
  courtyard: { id: 'courtyard-dinner', category: 'spaces', width: 4896, height: 3264, alt: 'An intimate courtyard setting surrounded by greenery', widths: [480, 768, 1200, 1600] },
  garden: { id: 'estate-garden', category: 'estate', width: 3024, height: 4032, alt: 'A quiet garden with sculpted greenery and warm natural light', widths: [480, 768, 1200, 1600, 2000] },
  wedding: { id: 'wedding-flowers', category: 'weddings', width: 3648, height: 5472, alt: 'Refined white wedding flowers and softly textured details', widths: [480, 768, 1200] },
  florals: { id: 'ivory-florals', category: 'details', width: 6016, height: 4016, alt: 'Ivory roses and delicate green stems on an elegantly laid wedding table', widths: [480, 768, 1200] },
  table: { id: 'wedding-table', category: 'details', width: 4000, height: 6000, alt: 'An elegant wedding table with linen, glassware and romantic floral details', widths: [480, 768, 1200] },
} satisfies Record<string, MediaAsset>;

export const gallery = [
  { image: media.estate, label: 'An arrival to remember', category: 'The estate' },
  { image: media.table, label: 'Every detail, considered', category: 'At the table' },
  { image: media.architecture, label: 'A little history, a new story', category: 'The estate' },
  { image: media.wedding, label: 'The beauty in small things', category: 'Celebrations' },
  { image: media.florals, label: 'A table set with love', category: 'At the table' },
  { image: media.garden, label: 'Room to simply be', category: 'The gardens' },
  // Not shown at first: the living mosaic rotates these into the grid.
  { image: media.hall, label: 'Dinner in the Grand Hall', category: 'At the table' },
  { image: media.courtyard, label: 'Long lunches, open skies', category: 'Celebrations' },
  { image: media.estateMobile, label: 'Morning light on the façade', category: 'The estate' },
];

/** Number of gallery tiles in the full mosaic; the remaining gallery entries rotate in over time. */
export const galleryTiles = 6;
