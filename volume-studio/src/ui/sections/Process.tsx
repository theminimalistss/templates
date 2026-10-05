import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ProcessDiagram } from "../components/ProcessDiagram";
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
      <div className="process-header" data-reveal="rise">
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
        <ProcessDiagram stage={active} />
        <div className="process-description-stack">
          {stages.map((stage, index) => (
            <div
              className="process-description"
              key={stage.title}
              data-active={active === index}
              aria-hidden={active !== index}
            >
              <span className="process-numeral">0{index + 1}</span>
              <p>{stage.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
