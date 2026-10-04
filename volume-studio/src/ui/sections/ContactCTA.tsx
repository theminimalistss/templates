import { TextLink } from "../components/TextLink";
import { SectionLabel } from "../components/SectionLabel";
export function ContactCTA() {
  return (
    <section className="contact-cta section-pad">
      <SectionLabel number="08">A NEW CONVERSATION</SectionLabel>
      <div className="cta-grid">
        <h2 data-reveal="rise">
          LET’S SHAPE
          <br />
          WHAT’S NEXT<span>.</span>
        </h2>
        <div>
          <p>
            A place to live. A space to gather.
            <br />
            Something entirely new.
          </p>
          <TextLink to="/contact">START A PROJECT</TextLink>
        </div>
      </div>
    </section>
  );
}
