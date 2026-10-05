import { Link } from "react-router-dom";
import { useMedia, useProjects } from "../../hooks/useContent";
import { usePointerDepth } from "../../hooks/usePointerDepth";
import { useHeroIntro } from "../../hooks/useHeroIntro";
import { useHeroMediaPreload } from "../../hooks/useHeroMediaPreload";
import { useHeroCarousel } from "../../hooks/useHeroCarousel";
import { HeroMedia } from "../components/HeroMedia";
import { Arrow } from "../components/Arrow";

export function Hero() {
  const projects = useProjects();
  const detail = useMedia("detail");
  const stair = useMedia("stair");
  const ref = usePointerDepth();
  const { phase, ready, reduced } = useHeroIntro(ref);
  const carousel = useHeroCarousel(projects.length, ref, ready);
  const { index, previous } = carousel;
  const project = projects[index];
  const mainMedia = index === 0 ? detail : project.image;
  const insetMedia = index === 0 ? stair : project.gallery[1];
  const nextProject = projects[(index + 1) % projects.length];
  const nextMainId =
    index === projects.length - 1 ? detail.id : nextProject.image.id;
  useHeroMediaPreload(nextMainId, ready && !reduced);
  return (
    <section
      className="hero"
      ref={ref}
      data-hero-phase={phase}
      data-carousel-playing={carousel.playing}
      aria-label="VOLUME Studio introduction"
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) carousel.pause();
      }}
    >
      <div className="hero-index micro">
        <span className="status-dot" /> INDEPENDENT DESIGN PRACTICE
        <br />
        <span>CEBU, PH / EST. 2020</span>
      </div>
      <span className="hero-vertical micro">SPACE / MATERIAL / LIGHT</span>
      <div className="hero-main-image" data-hero-initial>
        <div className="hero-media-entrance">
          <HeroMedia
            current={mainMedia}
            outgoing={
              previous === null
                ? undefined
                : previous === 0
                  ? detail
                  : projects[previous].image
            }
            initial={index === 0}
          />
          <span className="image-cross" aria-hidden="true">
            +
          </span>
        </div>
      </div>
      <h1 className="hero-title">
        <span className="hero-title-mask">
          <span className="hero-title-word">WE SHAPE</span>
        </span>
        <span className="hero-title-mask">
          <span className="hero-title-word">
            SPACE<span className="title-period">.</span>
          </span>
        </span>
      </h1>
      <div className="hero-small-image" data-hero-initial>
        <div className="hero-media-entrance">
          <HeroMedia
            current={insetMedia}
            outgoing={
              previous === null
                ? undefined
                : previous === 0
                  ? stair
                  : projects[previous].gallery[1]
            }
            inset
            initial={index === 0}
          />
        </div>
      </div>
      <div className="hero-note micro">
        SPACES WITH INTENTION.
        <br />
        DESIGNED AROUND LIFE.
      </div>
      <div className="hero-bottom">
        <div
          className="hero-pagination"
          onMouseEnter={() => carousel.setHoveringControls(true)}
          onMouseLeave={() => carousel.setHoveringControls(false)}
        >
          <span
            className="micro"
            aria-live={carousel.playing ? "off" : "polite"}
          >
            0{index + 1} <span className="muted">/ 04</span>
          </span>
          <div className="slide-lines" aria-label="Featured projects">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => carousel.select(i)}
                aria-label={`Show ${p.title}`}
                aria-pressed={index === i}
              >
                <span key={`${carousel.cycle}-${carousel.playing}`} />
              </button>
            ))}
          </div>
          {!reduced && (
            <button
              className="hero-playback"
              onClick={carousel.toggle}
              aria-label={
                carousel.paused
                  ? "Resume automatic project slideshow"
                  : "Pause automatic project slideshow"
              }
              aria-pressed={carousel.paused}
            >
              <span aria-hidden="true">{carousel.paused ? "▶" : "Ⅱ"}</span>
            </button>
          )}
        </div>
        <Link
          className="hero-project micro"
          key={project.slug}
          to={`/work/${project.slug}`}
          viewTransition
        >
          {project.title}
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
