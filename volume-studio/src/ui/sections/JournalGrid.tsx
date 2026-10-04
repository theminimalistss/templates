import { Link } from "react-router-dom";
import { useJournal } from "../../hooks/useContent";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { SectionLabel } from "../components/SectionLabel";
import { TextLink } from "../components/TextLink";
import { Arrow } from "../components/Arrow";
export function JournalGrid({ standalone = false }: { standalone?: boolean }) {
  const entries = useJournal();
  const Heading = standalone ? "h2" : "h3";
  return (
    <section
      className={`journal-section section-pad ${standalone ? "standalone" : ""}`}
    >
      {!standalone && (
        <div className="section-heading">
          <div>
            <SectionLabel number="07">NOTES FROM THE STUDIO</SectionLabel>
            <h2>JOURNAL</h2>
          </div>
          <TextLink to="/journal">ALL NOTES</TextLink>
        </div>
      )}
      <div className="journal-grid">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            to={`/journal/${entry.slug}`}
            className="journal-card"
            viewTransition
          >
            <div className="journal-image" data-reveal="image">
              <ResponsiveImage
                media={entry.image}
                sizes="(max-width: 700px) 100vw, 33vw"
              />
            </div>
            <p className="micro">
              <span>{entry.category}</span>
              <span>{entry.number}</span>
            </p>
            <Heading>
              {entry.title}
              <Arrow diagonal />
            </Heading>
          </Link>
        ))}
      </div>
    </section>
  );
}
