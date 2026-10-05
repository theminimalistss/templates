import { useEffect, useRef, useState } from "react";
import { useMedia } from "../../hooks/useContent";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ResponsiveImage } from "../components/ResponsiveImage";
export function Philosophy() {
  const media = useMedia("living");
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "150px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const player = video.current;
    if (!player) return;
    if (visible && !reduced && !paused) void player.play().catch(() => {});
    else player.pause();
  }, [visible, reduced, paused]);
  return (
    <section className="philosophy" ref={ref} data-story>
      <div className="philosophy-media" data-parallax>
        <ResponsiveImage media={media} />
        {visible && !reduced && (
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="none"
            poster="/media/video/interior-poster.webp"
            aria-hidden="true"
          >
            <source src="/media/video/interior-720.webm" type="video/webm" />
            <source src="/media/video/interior-720.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      <div className="philosophy-content">
        <span className="micro">[ 05 ] / OUR PHILOSOPHY</span>
        <h2 data-reveal="type" data-kinetic>
          <span className="reveal-line">
            <span>FORM</span>
          </span>
          <span className="reveal-line">
            <span>FOLLOWS</span>
          </span>
          <span className="reveal-line">
            <span>LIFE.</span>
          </span>
        </h2>
        <div className="philosophy-bottom">
          <p>
            Spaces designed around how people
            <br />
            move, gather and live.
          </p>
          {!reduced && (
            <button
              className="micro film-toggle"
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
            >
              {paused ? "PLAY" : "PAUSE"} MOTION {paused ? "▶" : "Ⅱ"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
