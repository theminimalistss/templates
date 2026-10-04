import { useMotion } from "../../hooks/useMotion";
import { Hero } from "../sections/Hero";
import { Manifesto } from "../sections/Manifesto";
import { SelectedWork } from "../sections/SelectedWork";
import { ServicesList } from "../sections/ServicesList";
import { Philosophy } from "../sections/Philosophy";
import { Process } from "../sections/Process";
import { JournalGrid } from "../sections/JournalGrid";
import { ContactCTA } from "../sections/ContactCTA";
import { Meta } from "../components/Meta";
export default function HomePage() {
  useMotion();
  return (
    <>
      <Meta
        title="Space, considered"
        description="An independent interior architecture and spatial design practice. Exploring the relationship between space, material and light."
      />
      <Hero />
      <Manifesto />
      <SelectedWork />
      <ServicesList />
      <Philosophy />
      <Process />
      <JournalGrid />
      <ContactCTA />
    </>
  );
}
