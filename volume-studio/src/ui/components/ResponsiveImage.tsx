import type { Media } from "../../types/content";
const widths = [480, 768, 1024, 1440, 1920];
export function ResponsiveImage({
  media,
  sizes = "100vw",
  priority = false,
  className = "",
  decorative = false,
}: {
  media: Media;
  sizes?: string;
  priority?: boolean;
  className?: string;
  decorative?: boolean;
}) {
  const srcset = (format: string) =>
    widths
      .map((width) => `/media/images/${media.id}-${width}.${format} ${width}w`)
      .join(", ");
  return (
    <picture className={`image ${className}`}>
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={`/media/images/${media.id}-1024.webp`}
        width={media.width}
        height={media.height}
        alt={decorative ? "" : media.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={{ objectPosition: media.position }}
      />
    </picture>
  );
}
