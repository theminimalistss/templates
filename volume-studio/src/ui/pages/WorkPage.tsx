import { useSearchParams } from "react-router-dom";
import { useProjects } from "../../hooks/useContent";
import type { Filter } from "../../types/content";
import { ProjectCard } from "../components/ProjectCard";
import { Meta } from "../components/Meta";
import { SectionLabel } from "../components/SectionLabel";
import { ContactCTA } from "../sections/ContactCTA";
export default function WorkPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("type");
  const filter: Filter =
    raw === "Residential" || raw === "Commercial" ? raw : "All";
  const projects = useProjects(filter);
  return (
    <>
      <Meta
        title="Selected work"
        description="Residential and commercial spaces, considered through material, light and human scale. Explore four studies by VOLUME Studio."
        path="/work"
        image="casa"
      />
      <section className="page-intro section-pad">
        <SectionLabel number="01—04">PROJECT INDEX / 2025—2026</SectionLabel>
        <h1>
          OUR WORK<span className="heading-count">(04)</span>
        </h1>
        <div className="work-filter" aria-label="Filter projects">
          {(["All", "Residential", "Commercial"] as const).map((type) => (
            <button
              key={type}
              aria-pressed={filter === type}
              onClick={() => setParams(type === "All" ? {} : { type })}
            >
              {type}
              <span>
                {type === "All" ? "04" : type === "Residential" ? "03" : "01"}
              </span>
            </button>
          ))}
          <span className="micro" role="status">
            {projects.length} PROJECT{projects.length === 1 ? "" : "S"}
          </span>
        </div>
      </section>
      <div className="work-index section-pad">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            headingLevel="h2"
            priority={index === 0}
          />
        ))}
      </div>
      <ContactCTA />
    </>
  );
}
