import { site } from "../../config/site";
export function Meta({
  title,
  description,
  path = "/",
  image = "detail",
  noindex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}) {
  const fullTitle = `${title} — VOLUME Studio`;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? "noindex,follow" : "index,follow"}
      />
      <link rel="canonical" href={`${site.origin}${path}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${site.origin}${path}`} />
      <meta
        property="og:image"
        content={`${site.origin}/media/images/${image}-1440.webp`}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={`${site.origin}/media/images/${image}-1440.webp`}
      />
    </>
  );
}
