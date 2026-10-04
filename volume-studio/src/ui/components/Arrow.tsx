export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 22 22 6M6 6h16v16" : "M3 14h21M15 5l9 9-9 9"}
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
