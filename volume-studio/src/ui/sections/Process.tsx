import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SectionLabel } from "../components/SectionLabel";
const stages = [
  {
    title: "OBSERVE",
    copy: "Listen closely. Understand the place, the people and the possibilities.",
  },
  {
    title: "DEFINE",
    copy: "Find the essential idea. Establish a clear direction and material language.",
  },
  {
    title: "SHAPE",
    copy: "Explore proportion. Bring space, light and detail into conversation.",
  },
  {
    title: "REALIZE",
    copy: "Carry the idea through. From the first drawing to the final junction.",
  },
];
export function Process() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const manual = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    let frame = 0;
    const scroll = () => {
      if (manual.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = node.getBoundingClientRect().top;
        const progress = (innerHeight * 0.8 - top) / (innerHeight * 0.8);
        setActive(Math.max(0, Math.min(3, Math.floor(progress * 4))));
      });
    };
    addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", scroll);
    };
  }, [reduced]);
  return (
    <section className="process section-pad" ref={ref}>
      <SectionLabel number="06">HOW WE WORK</SectionLabel>
      <div className="process-header">
        <h2>
          A CONSIDERED
          <br />
          PROCESS.
        </h2>
        <p>
          Every project begins with a question.
          <br />
          We give it the space it deserves.
        </p>
      </div>
      <div className="process-tabs" role="tablist" aria-label="Design process">
        {stages.map((stage, index) => (
          <button
            id={`stage-tab-${index}`}
            role="tab"
            aria-selected={active === index}
            aria-controls="process-panel"
            tabIndex={active === index ? 0 : -1}
            key={stage.title}
            onKeyDown={(event) => {
              if (
                ["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
              ) {
                event.preventDefault();
                manual.current = true;
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? 3
                      : (active + (event.key === "ArrowRight" ? 1 : 3)) % 4;
                setActive(next);
                document.getElementById(`stage-tab-${next}`)?.focus();
              }
            }}
            onClick={() => {
              manual.current = true;
              setActive(index);
            }}
          >
            <span className="micro">0{index + 1}</span>
            {stage.title}
          </button>
        ))}
      </div>
      <div
        className="process-panel"
        id="process-panel"
        role="tabpanel"
        aria-labelledby={`stage-tab-${active}`}
      >
        <svg
          viewBox="0 0 460 180"
          aria-hidden="true"
          className={`process-diagram stage-${active}`}
        >
          <path
            d="M30 145h400M70 160V25M215 160V15M390 160V25"
            className="diagram-guides"
          />
          <path d="m90 125 115-70 150 40-115 70Zm0 0V50l115-35v40m0-40 150 40v40M240 165V85L90 50m150 35 115-30M205 15v75l-115 35" />
          <circle cx="205" cy="55" r={active === 0 ? 28 : 8} />
          <path d="m300 20 50 0m-25-10v20" />
        </svg>
        <div className="process-description">
          <span className="process-numeral">0{active + 1}</span>
          <p>{stages[active].copy}</p>
        </div>
      </div>
    </section>
  );
}
