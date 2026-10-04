import { useMemo } from "react";
import {
  getProjects,
  getProject,
  getNextProject,
  getMedia,
  getJournal,
  getArticle,
  getServices,
} from "../services/content.service";
import type { Filter } from "../types/content";
export const useProjects = (filter: Filter = "All") =>
  useMemo(() => getProjects(filter), [filter]);
export const useProject = (slug: string) =>
  useMemo(
    () => ({ project: getProject(slug), next: getNextProject(slug) }),
    [slug],
  );
export const useMedia = (id: string) => useMemo(() => getMedia(id), [id]);
export const useJournal = () => useMemo(() => getJournal(), []);
export const useArticle = (slug: string) =>
  useMemo(() => getArticle(slug), [slug]);
export const useServices = () => useMemo(() => getServices(), []);
