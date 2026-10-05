const descriptions = [
  "Observe: a survey frame examines the proportions of an existing volume",
  "Define: a focal point establishes the organising axis of the space",
  "Shape: floor, wall and roof planes assemble into an architectural volume",
  "Realize: a completed interior with solid walls, a window, seating and a table",
];
const focusPoints = [
  [205, 75, 28],
  [240, 105, 8],
  [205, 20, 10],
  [309, 128, 6],
];

export function ProcessDiagram({ stage }: { stage: number }) {
  const [x, y, radius] = focusPoints[stage];
  return (
    <svg
      viewBox="0 0 460 220"
      role="img"
      aria-label={descriptions[stage]}
      className={`process-diagram stage-${stage}`}
    >
      <g className="diagram-guides">
        <path d="M25 190h410M70 205V15M215 205V10M390 205V15" />
        <path d="M50 180 195 95 415 155M80 200 235 110 420 160" />
      </g>
      <g className="diagram-layer diagram-survey" data-active={stage < 2}>
        <path d="m90 145 115-70 150 40-115 70Zm0 0V70l115-35v40m0-40 150 40v40M240 185v-80L90 70m150 35 115-30M205 35v75L90 145" />
        <path d="M300 25h50m-25-10v20" />
        <path
          className="diagram-axis"
          data-active={stage === 1}
          d="M240 45v150M160 105h160"
        />
      </g>
      <g className="diagram-layer diagram-assembly" data-active={stage === 2}>
        <g className="shape-floor">
          <path className="diagram-plane" d="m90 145 115-70 150 40-115 70Z" />
          <path d="m115 145 90-55 123 32-90 55Z" />
        </g>
        <g className="shape-wall">
          <path className="diagram-plane" d="M205 75V20l150 40v55Z" />
          <path d="M280 40v55" />
        </g>
        <g className="shape-roof">
          <path className="diagram-plane" d="m90 90 115-70 150 40-115 70Z" />
        </g>
        <path
          className="diagram-construction"
          d="M90 90v55M240 130v55M70 90v55M64 90h12M64 145h12M100 180l135 35M100 175v10M235 210v10"
        />
        <text x="302" y="192" className="diagram-annotation">
          PLANES → VOLUME
        </text>
      </g>
      <g className="diagram-layer diagram-realized" data-active={stage === 3}>
        <path
          className="diagram-solid-floor"
          d="m90 145 115-70 150 40-115 70Z"
        />
        <path
          className="diagram-solid-wall"
          d="M90 145V70l115-65v70Zm115-70V5l150 40v70Z"
        />
        <path d="M90 145V70L205 5l150 40v70l-115 70-150-40m115-70V5m0 70 150 40M90 145l115-70M125 81l46-26v66l-46 27" />
        <g className="realize-window">
          <path className="diagram-window" d="m238 31 87 23v44l-87-23Z" />
          <path d="m280 42 0 45M238 55l87 23" />
        </g>
        <g className="realize-furniture">
          <path
            className="diagram-furniture"
            d="m210 106 66 18-23 14-66-18v-14l23-14 66 18v14m-89-18 66 18 23-14m-23 14v14"
          />
          <path className="diagram-furniture" d="m147 139 32-19 34 9-32 20Z" />
          <path d="M147 139v15m66-25v15m-32 5v15M299 135v12m20-24v12" />
          <ellipse cx="309" cy="128" rx="16" ry="7" />
        </g>
        <text x="302" y="192" className="diagram-annotation">
          BUILT / INHABITED
        </text>
      </g>
      <g
        className="diagram-tracker"
        style={{ transform: `translate(${x}px, ${y}px)` }}
      >
        <circle className="diagram-focus" cx="0" cy="0" r={radius} />
        <circle className="diagram-focus-center" cx="0" cy="0" r="1.5" />
      </g>
    </svg>
  );
}
