import { useMedia } from "../../hooks/useContent";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { SectionLabel } from "../components/SectionLabel";
import { TextLink } from "../components/TextLink";
export function Manifesto() {
  const image = useMedia("north");
  return (
    <section className="manifesto section-pad" id="studio">
      <SectionLabel number="02">THE STUDIO</SectionLabel>
      <div className="manifesto-grid">
        <h2 data-reveal="rise">
          SPACE.
          <br />
          <span>MATERIAL.</span>
          <br />
          LIGHT.
        </h2>
        <div className="manifesto-copy">
          <p>
            We create interiors defined by
            <br className="desktop-break" /> proportion, material and
            atmosphere.
          </p>
          <TextLink to="/studio">MEET VOLUME</TextLink>
        </div>
        <div className="manifesto-image" data-parallax>
          <ResponsiveImage
            media={image}
            sizes="(max-width: 700px) 65vw, 25vw"
          />
        </div>
        <span className="manifesto-caption micro">
          A DIALOGUE BETWEEN
          <br />
          THE RAW AND THE REFINED.
        </span>
      </div>
    </section>
  );
}
