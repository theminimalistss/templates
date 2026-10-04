import { useLocation } from "react-router-dom";
import { Meta } from "../components/Meta";
import { TextLink } from "../components/TextLink";
export default function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <>
      <Meta
        title="Space not found"
        description="This space is yet to be imagined. Return to VOLUME Studio."
        path={pathname}
        noindex
      />
      <section className="not-found section-pad">
        <span className="micro">404 / OUTSIDE THE PLAN</span>
        <h1>
          UNBUILT
          <br />
          SPACE.
        </h1>
        <p>
          The page you’re looking for is no longer here.
          <br />
          There is more to explore.
        </p>
        <TextLink to="/">BACK TO THE STUDIO</TextLink>
      </section>
    </>
  );
}
