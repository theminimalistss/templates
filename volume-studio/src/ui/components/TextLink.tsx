import { Link } from "react-router-dom";
import { Arrow } from "./Arrow";
export function TextLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link className={`text-link ${className}`} to={to} viewTransition>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}
