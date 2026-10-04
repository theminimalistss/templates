export type Category = "Residential" | "Commercial";
export type Filter = "All" | Category;
export interface Media {
  id: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
}
export interface ProjectRecord {
  slug: string;
  number: string;
  title: string;
  category: Category;
  location: string;
  country: string;
  year: number;
  area: number;
  image: string;
  gallery: string[];
  description: string;
  materials: string[];
}
export interface Project extends Omit<ProjectRecord, "image" | "gallery"> {
  image: Media;
  gallery: Media[];
}
export interface JournalRecord {
  slug: string;
  number: string;
  title: string;
  category: string;
  date: string;
  image: string;
  intro: string;
  paragraphs: string[];
}
export interface Journal extends Omit<JournalRecord, "image"> {
  image: Media;
}
export interface Service {
  number: string;
  title: string;
  description: string;
  image: string;
  deliverables: string[];
}
export interface Inquiry {
  name: string;
  email: string;
  type: string;
  location: string;
  size: string;
  message: string;
}
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;
export interface Brief {
  filename: string;
  content: string;
}
