import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia, useProjects } from "../../hooks/useContent";
import { usePointerDepth } from "../../hooks/usePointerDepth";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { Arrow } from "../components/Arrow";
export function Hero() {
  const projects = useProjects();
  const [index, setIndex] = useState(0);
  const project = projects[index];
  const detail = useMedia("detail");
  const stair = useMedia("stair");
  const ref = usePointerDepth();
  return (
    <section className="hero" ref={ref} aria-label="VOLUME Studio introduction">
      <div className="hero-index micro">
        <span className="status-dot" /> INDEPENDENT DESIGN PRACTICE
        <br />
        <span>CEBU, PH / EST. 2020</span>
      </div>
      <span className="hero-vertical micro">SPACE / MATERIAL / LIGHT</span>
      <div className="hero-main-image" key={index}>
        <ResponsiveImage
          media={index === 0 ? detail : project.image}
          sizes="(max-width: 700px) 88vw, 48vw"
          priority
        />
        <span className="image-cross" aria-hidden="true">
          +
        </span>
      </div>
      <h1 className="hero-title">
        <span>WE SHAPE</span>
        <span>
          SPACE<span className="title-period">.</span>
        </span>
      </h1>
      <div className="hero-small-image">
        <ResponsiveImage
          media={stair}
          sizes="(max-width: 700px) 26vw, 16vw"
          priority
          decorative
        />
      </div>
      <div className="hero-note micro">
        SPACES WITH INTENTION.
        <br />
        DESIGNED AROUND LIFE.
      </div>
      <div className="hero-bottom">
        <div className="hero-pagination">
          <span className="micro" aria-live="polite">
            0{index + 1} <span className="muted">/ 04</span>
          </span>
          <div className="slide-lines" aria-label="Featured projects">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => setIndex(i)}
                aria-label={`Show ${p.title}`}
                aria-pressed={index === i}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
        <Link
          className="hero-project micro"
          to={`/work/${project.slug}`}
          viewTransition
        >
          {project.title}{" "}
          <span>
            {project.location.toUpperCase()}, {project.year}
          </span>
        </Link>
        <Link className="text-link hero-cta" to="/work" viewTransition>
          <span>VIEW PROJECTS</span>
          <Arrow diagonal />
        </Link>
      </div>
      <a className="hero-scroll micro" href="#studio">
        SCROLL TO EXPLORE <span>↓</span>
      </a>
    </section>
  );
}
