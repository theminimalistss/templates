import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useMotion } from "../../hooks/useMotion";
import { useRouteMotion } from "../../hooks/useRouteMotion";

export function RouteScene({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const ref = useRouteMotion();
  useMotion();
  return (
    <div className="route-scene" data-route-path={pathname} ref={ref}>
      {pathname !== "/" && <div className="route-veil" aria-hidden="true" />}
      <div className="route-content">{children}</div>
    </div>
  );
}
