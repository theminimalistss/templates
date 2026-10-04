import { projectsRepository } from "../repositories/projects.repository";
import { mediaRepository } from "../repositories/media.repository";
import { journalRepository } from "../repositories/journal.repository";
import { servicesRepository } from "../repositories/services.repository";
import type { Filter, Project, Journal } from "../types/content";
export function getMedia(id: string) {
  const media = mediaRepository.find(id);
  if (!media) throw new Error(`Unknown media: ${id}`);
  return media;
}
export function getProjects(filter: Filter = "All"): Project[] {
  return projectsRepository
    .all()
    .filter((p) => filter === "All" || p.category === filter)
    .map((p) => ({
      ...p,
      image: getMedia(p.image),
      gallery: p.gallery.map(getMedia),
    }));
}
export function getProject(slug: string) {
  return getProjects().find((p) => p.slug === slug);
}
export function getNextProject(slug: string) {
  const all = getProjects();
  const index = all.findIndex((p) => p.slug === slug);
  return all[(index + 1) % all.length];
}
export function getJournal(): Journal[] {
  return journalRepository
    .all()
    .map((entry) => ({ ...entry, image: getMedia(entry.image) }));
}
export function getArticle(slug: string) {
  return getJournal().find((entry) => entry.slug === slug);
}
export function getServices() {
  return servicesRepository
    .all()
    .map((service) => ({ ...service, image: getMedia(service.image) }));
}
