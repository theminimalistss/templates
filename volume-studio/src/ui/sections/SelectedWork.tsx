import { useRef } from "react";
import { useProjects } from "../../hooks/useContent";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ProjectCard } from "../components/ProjectCard";
import { TextLink } from "../components/TextLink";
import { SectionLabel } from "../components/SectionLabel";
import { Arrow } from "../components/Arrow";
export function SelectedWork() {
  const projects = useProjects();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const move = (direction: number) => {
    const node = ref.current;
    if (!node) return;
    const distance = innerWidth * 0.76;
    if (innerWidth < 1000 || reduced) {
      node.querySelector("[data-track]")?.scrollBy({
        left: direction * distance,
        behavior: reduced ? "instant" : "smooth",
      });
    } else
      window.scrollBy({
        top: direction * innerHeight * 0.85,
        behavior: "smooth",
      });
  };
  return (
    <section className="selected-work">
      <div className="section-pad section-heading">
        <div>
          <SectionLabel number="03">PORTFOLIO / 2025—2026</SectionLabel>
          <h2 data-reveal="rise">
            SELECTED
            <br />
            WORK<span className="heading-count">(04)</span>
          </h2>
        </div>
        <TextLink to="/work">ALL PROJECTS</TextLink>
      </div>
      <div className="work-compositions section-pad">
        <ProjectCard project={projects[0]} />
        <div className="work-side-note micro">
          FOUR SPACES.
          <br />
          FOUR DIFFERENT WAYS
          <br />
          OF SEEING THE EVERYDAY.
        </div>
        <ProjectCard project={projects[1]} className="portrait-project" />
      </div>
      <div className="horizontal-gallery" data-horizontal ref={ref}>
        <div className="horizontal-sticky">
          <div className="horizontal-header micro">
            <span>A CONTINUING EXPLORATION</span>
            <div className="gallery-controls">
              <button aria-label="Previous projects" onClick={() => move(-1)}>
                <Arrow className="reverse" />
              </button>
              <button aria-label="Next projects" onClick={() => move(1)}>
                <Arrow />
              </button>
            </div>
          </div>
          <div className="horizontal-track" data-track>
            {projects.slice(2).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
