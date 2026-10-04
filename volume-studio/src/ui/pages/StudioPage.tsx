import { useMedia } from "../../hooks/useContent";
import { useMotion } from "../../hooks/useMotion";
import { Meta } from "../components/Meta";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { SectionLabel } from "../components/SectionLabel";
import { Process } from "../sections/Process";
import { ContactCTA } from "../sections/ContactCTA";
export default function StudioPage() {
  useMotion();
  const studio = useMedia("axis");
  const detail = useMedia("stair");
  return (
    <>
      <Meta
        title="The studio"
        description="VOLUME is an independent interior architecture practice based in Cebu, exploring the meeting of space, material and light."
        path="/studio"
      />
      <section className="page-intro studio-intro section-pad">
        <SectionLabel number="01">
          INDEPENDENT IN THOUGHT. CONNECTED IN PRACTICE.
        </SectionLabel>
        <h1>
          SPACE,
          <br />
          CONSIDERED.
        </h1>
        <div className="studio-lead">
          <span className="micro">
            CEBU, PHILIPPINES
            <br />
            WORKING EVERYWHERE.
          </span>
          <p>
            We are VOLUME. An independent practice
            <br />
            working at the intersection of interior
            <br />
            architecture, objects and everyday life.
          </p>
        </div>
      </section>
      <div className="studio-visual">
        <ResponsiveImage media={studio} priority />
        <span className="studio-visual-word" aria-hidden="true">
          VOLUME
        </span>
      </div>
      <section className="studio-story section-pad">
        <SectionLabel number="02">A WAY OF SEEING</SectionLabel>
        <h2>
          LESS NOISE.
          <br />
          MORE MEANING.
        </h2>
        <div className="studio-story-grid">
          <ResponsiveImage
            media={detail}
            sizes="(max-width: 700px) 100vw, 45vw"
          />
          <div>
            <p>
              Our work begins with listening. To a place, to its light, and to
              the people who will make it their own.
            </p>
            <p>
              We work across scales, from the arrangement of a room to the
              detail of a single junction. A restrained palette and an honest
              approach to materials connect every project.
            </p>
            <p className="micro">
              SMALL PRACTICE. CLOSE COLLABORATION.
              <br />
              ONE COHERENT IDEA, CARRIED THROUGH.
            </p>
          </div>
        </div>
      </section>
      <Process />
      <ContactCTA />
    </>
  );
}
