import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useRouteMotion } from "../../hooks/useRouteMotion";
import { site } from "../../config/site";
export function Layout() {
  useRouteMotion();
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [pathname, hash]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Header />
      <div className="intro" aria-hidden="true">
        <span>
          VOLUME<sup>01</sup>
        </span>
        <i />
      </div>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: site.name,
          description: site.descriptor,
          url: site.origin,
          areaServed: ["Philippines", "Singapore", "Australia"],
        })}
      </script>
    </>
  );
}
