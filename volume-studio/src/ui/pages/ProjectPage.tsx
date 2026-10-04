import { Link, useParams } from "react-router-dom";
import { useProject } from "../../hooks/useContent";
import { useMotion } from "../../hooks/useMotion";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { Meta } from "../components/Meta";
import { Arrow } from "../components/Arrow";
import NotFoundPage from "./NotFoundPage";
export default function ProjectPage() {
  const { slug = "" } = useParams();
  const { project, next } = useProject(slug);
  useMotion();
  if (!project) return <NotFoundPage />;
  return (
    <>
      <Meta
        title={project.title}
        description={project.description}
        path={`/work/${project.slug}`}
        image={project.image.id}
      />
      <section className="project-intro section-pad">
        <Link className="micro breadcrumb" to="/work">
          ← BACK TO WORK
        </Link>
        <div className="project-title-line">
          <h1>{project.title}</h1>
          <span className="project-big-number">{project.number}</span>
        </div>
        <div className="project-hero-meta micro">
          <span>{project.category}</span>
          <span>
            {project.location} / {project.country}
          </span>
          <span>{project.year}</span>
        </div>
      </section>
      <div className="project-hero-image">
        <ResponsiveImage media={project.image} priority />
      </div>
      <section className="project-overview section-pad">
        <dl>
          {[
            ["PROJECT", project.title],
            ["LOCATION", project.location],
            ["TYPE", project.category],
            ["YEAR", project.year],
            ["AREA", `${project.area} SQM`],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p>{project.description}</p>
          <span className="micro">{project.materials.join(" / ")}</span>
        </div>
      </section>
      <div className="project-image-sequence section-pad">
        <figure className="sequence-wide" data-reveal="image">
          <ResponsiveImage media={project.gallery[0]} />
          <figcaption className="micro">01 / A SPACE TO INHABIT</figcaption>
        </figure>
        <figure className="sequence-portrait" data-reveal="image">
          <ResponsiveImage
            media={project.gallery[1]}
            sizes="(max-width: 700px) 85vw, 45vw"
          />
          <figcaption className="micro">02 / MATERIAL IN DETAIL</figcaption>
        </figure>
        <div className="project-plan">
          <span className="micro">SPATIAL STUDY / CONCEPT PLAN</span>
          <svg
            viewBox="0 0 500 380"
            aria-label="Conceptual floor plan showing an open living area and three enclosed rooms"
            role="img"
          >
            <path d="M40 40h420v290H40zM40 160h200V40m0 120h220M240 160v170M340 160v170M40 260h200M80 70h100v60H80zM75 185h120v40H75zM270 200h45v95h-45zM370 200h60v95h-60z" />
            <path
              className="plan-dimensions"
              d="M20 40v290M10 40h20M10 330h20M40 355h420M40 345v20M460 345v20"
            />
          </svg>
          <p className="micro">PROPORTION / CIRCULATION / HUMAN SCALE</p>
        </div>
      </div>
      <div className="project-last-image" data-parallax>
        <ResponsiveImage media={project.gallery[2]} />
      </div>
      <Link className="next-project" to={`/work/${next.slug}`} viewTransition>
        <ResponsiveImage media={next.image} />
        <div>
          <span className="micro">NEXT PROJECT / {next.number}</span>
          <h2>{next.title}</h2>
          <span className="next-project-arrow">
            <Arrow diagonal />
          </span>
        </div>
      </Link>
    </>
  );
}
