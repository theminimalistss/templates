import { useMotion } from "../../hooks/useMotion";
import { Meta } from "../components/Meta";
import { SectionLabel } from "../components/SectionLabel";
import { JournalGrid } from "../sections/JournalGrid";
import { ContactCTA } from "../sections/ContactCTA";
export default function JournalPage() {
  useMotion();
  return (
    <>
      <Meta
        title="Journal"
        description="Notes on material, light, objects and the spaces between. Observations from VOLUME Studio."
        path="/journal"
      />
      <section className="page-intro section-pad">
        <SectionLabel number="01—03">NOTES FROM THE STUDIO</SectionLabel>
        <h1>
          THINKING
          <br />
          IN SPACE.
        </h1>
        <p className="intro-description">
          Ongoing observations.
          <br />A record of what holds our attention.
        </p>
      </section>
      <JournalGrid standalone />
      <ContactCTA />
    </>
  );
}
