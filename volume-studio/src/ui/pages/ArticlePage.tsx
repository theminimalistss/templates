import { useParams, Link } from "react-router-dom";
import { useArticle } from "../../hooks/useContent";
import { Meta } from "../components/Meta";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { ContactCTA } from "../sections/ContactCTA";
import NotFoundPage from "./NotFoundPage";
export default function ArticlePage() {
  const { slug = "" } = useParams();
  const article = useArticle(slug);
  if (!article) return <NotFoundPage />;
  return (
    <>
      <Meta
        title={article.title}
        description={article.intro}
        path={`/journal/${article.slug}`}
        image={article.image.id}
      />
      <article>
        <div className="page-intro article-intro section-pad">
          <Link to="/journal" className="micro breadcrumb">
            ← ALL NOTES
          </Link>
          <p className="micro article-category">
            {article.category} /{" "}
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </p>
          <h1>{article.title}</h1>
        </div>
        <div className="article-hero">
          <ResponsiveImage media={article.image} priority />
        </div>
        <div className="article-copy section-pad">
          <span className="micro">VOLUME / JOURNAL {article.number}</span>
          <div>
            <p className="article-deck">{article.intro}</p>
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link to="/journal" className="text-link">
              BACK TO JOURNAL →
            </Link>
          </div>
        </div>
      </article>
      <ContactCTA />
    </>
  );
}
