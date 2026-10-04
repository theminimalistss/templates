import { Link } from "react-router-dom";
import type { Project } from "../../types/content";
import { ResponsiveImage } from "./ResponsiveImage";
import { Arrow } from "./Arrow";
export function ProjectCard({
  project,
  className = "",
  priority = false,
  headingLevel = "h3",
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <Link
      to={`/work/${project.slug}`}
      viewTransition
      className={`project-card ${className}`}
    >
      <div className="project-photo" data-reveal="image">
        <ResponsiveImage
          media={project.image}
          sizes="(max-width: 700px) 100vw, 70vw"
          priority={priority}
        />
        <span className="view-project">
          VIEW PROJECT <Arrow diagonal />
        </span>
      </div>
      <div className="project-caption">
        <span className="project-number">{project.number}</span>
        <div>
          <Heading>{project.title}</Heading>
          <p>
            {project.location} / {project.country}
          </p>
        </div>
        <span className="project-type">
          {project.category}
          <br />
          {project.year}
        </span>
        <Arrow diagonal />
      </div>
    </Link>
  );
}
