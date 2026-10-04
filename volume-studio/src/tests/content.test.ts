import { describe, it, expect } from "vitest";
import {
  getProjects,
  getProject,
  getNextProject,
  getMedia,
  getJournal,
  getArticle,
  getServices,
} from "../services/content.service";
import { projectsRepository } from "../repositories/projects.repository";
import { mediaRepository } from "../repositories/media.repository";
import { journalRepository } from "../repositories/journal.repository";
import { servicesRepository } from "../repositories/services.repository";
describe("content repositories and service", () => {
  it("provides four unique projects with complete media", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(4);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(4);
    for (const project of projects) {
      expect(project.image.width).toBeGreaterThan(0);
      expect(project.gallery).toHaveLength(3);
      expect(project.description.split(" ").length).toBeLessThanOrEqual(60);
    }
    expect(projectsRepository.all()).toHaveLength(4);
  });
  it("filters without mutating the source", () => {
    expect(getProjects("Residential")).toHaveLength(3);
    expect(getProjects("Commercial").map((p) => p.slug)).toEqual([
      "axis-workspace",
    ]);
    expect(getProjects("All")).toHaveLength(4);
  });
  it("resolves projects, wraps next-project navigation and handles unknown slugs", () => {
    expect(getProject("casa-v01")?.number).toBe("01");
    expect(getProject("missing")).toBeUndefined();
    expect(getNextProject("north-house").slug).toBe("casa-v01");
    expect(getNextProject("casa-v01").slug).toBe("monolith-house");
    expect(getNextProject("missing").slug).toBe("casa-v01");
  });
  it("rejects missing media and exposes local metadata", () => {
    expect(() => getMedia("missing")).toThrow("Unknown media");
    expect(getMedia("stair").width).toBe(1920);
    expect(mediaRepository.all()).toHaveLength(9);
    expect(mediaRepository.find("none")).toBeUndefined();
  });
  it("resolves journal entries and service illustrations", () => {
    expect(getJournal()).toHaveLength(3);
    expect(getArticle("light-as-architecture")?.number).toBe("02");
    expect(getArticle("unknown")).toBeUndefined();
    expect(journalRepository.all()).toHaveLength(3);
    expect(getServices()).toHaveLength(5);
    expect(servicesRepository.all()).toHaveLength(5);
    expect(getServices()[0].image.id).toBe("stair");
  });
});
