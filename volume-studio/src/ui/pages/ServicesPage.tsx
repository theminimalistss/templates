import { useMotion } from "../../hooks/useMotion";
import { Meta } from "../components/Meta";
import { SectionLabel } from "../components/SectionLabel";
import { ServicesList } from "../sections/ServicesList";
import { Process } from "../sections/Process";
import { ContactCTA } from "../sections/ContactCTA";
export default function ServicesPage() {
  useMotion();
  return (
    <>
      <Meta
        title="Our expertise"
        description="Interior architecture, residential interiors, commercial spaces, spatial planning and material curation by VOLUME Studio."
        path="/services"
      />
      <section className="page-intro section-pad">
        <SectionLabel number="01—05">SCOPE OF PRACTICE</SectionLabel>
        <h1>
          FROM SPACE
          <br />
          TO DETAIL.
        </h1>
        <p className="intro-description">
          A continuous design approach.
          <br />
          From the first question to the final object.
        </p>
      </section>
      <ServicesList />
      <Process />
      <ContactCTA />
    </>
  );
}
