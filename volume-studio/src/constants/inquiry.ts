import type { Inquiry } from "../types/content";
export const projectTypes = [
  "Residential",
  "Hospitality",
  "Commercial",
  "Retail",
  "Other",
] as const;
export const emptyInquiry: Inquiry = {
  name: "",
  email: "",
  type: "",
  location: "",
  size: "",
  message: "",
};
