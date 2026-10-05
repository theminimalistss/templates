import type { Media } from "../../types/content";
import { ResponsiveImage } from "./ResponsiveImage";

export function HeroMedia({
  current,
  outgoing,
  inset = false,
  initial = false,
}: {
  current: Media;
  outgoing?: Media;
  inset?: boolean;
  initial?: boolean;
}) {
  return (
    <div className={`hero-media-stack ${outgoing ? "is-changing" : ""}`}>
      {outgoing && (
        <div
          className="hero-slide hero-slide-outgoing"
          key={`out-${outgoing.id}`}
          aria-hidden="true"
        >
          <ResponsiveImage
            media={outgoing}
            decorative
            sizes={inset ? "26vw" : "(max-width: 700px) 88vw, 48vw"}
          />
        </div>
      )}
      <div
        className={`hero-slide hero-slide-current ${outgoing ? "is-incoming" : ""}`}
        key={current.id}
      >
        <ResponsiveImage
          media={current}
          sizes={
            inset
              ? "(max-width: 700px) 26vw, 16vw"
              : "(max-width: 700px) 88vw, 48vw"
          }
          priority={initial || Boolean(outgoing)}
          decorative={inset}
        />
      </div>
    </div>
  );
}
