import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RouteScene } from "./RouteScene";
import { site } from "../../config/site";
export function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              VOLUME<span>OPENING SPACE…</span>
            </div>
          }
        >
          <RouteScene key={pathname}>
            <Outlet />
          </RouteScene>
        </Suspense>
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
