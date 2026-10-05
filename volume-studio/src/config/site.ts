export const site = {
  name: "VOLUME Studio",
  origin: (
    import.meta.env.VITE_SITE_URL || "https://volume-studio.example"
  ).replace(/\/$/, ""),
  email: "hello@volume-studio.example",
  descriptor: "Interior architecture / Spatial design",
  version: "0.3.0",
  socialLinks: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Pinterest", href: "https://www.pinterest.com/" },
  ],
};
export const navigation = [
  { label: "Studio", to: "/studio" },
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "Journal", to: "/journal" },
];
