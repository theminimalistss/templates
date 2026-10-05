import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "./useReducedMotion";

export function useRouteMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname, hash } = useLocation();
  const reduced = useReducedMotion();
  // RouteScene is inside Suspense: run only once the destination DOM exists.
  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("main")?.focus({ preventScroll: true });
    } else {
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView();
    }
  }, [pathname, hash]);
  useLayoutEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    scene.dataset.routePhase = "ready";
    if (reduced || pathname === "/") return;
    const content = scene.querySelector<HTMLElement>(".route-content");
    const veil = scene.querySelector<HTMLElement>(".route-veil");
    if (!content?.animate) return;
    scene.dataset.routePhase = "entering";
    const entrance = content.animate(
      [
        {
          opacity: 0,
          transform: "translateY(90px)",
          clipPath: "inset(0 0 15% 0)",
        },
        { opacity: 1, transform: "translateY(0)", clipPath: "inset(0)" },
      ],
      {
        duration: 1200,
        delay: 120,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "backwards",
      },
    );
    entrance.id = "volume-route-enter";
    const shutter = veil?.animate(
      [
        { opacity: 1, clipPath: "inset(0 0 0 0)" },
        { opacity: 1, clipPath: "inset(0 0 100% 0)" },
      ],
      { duration: 950, easing: "cubic-bezier(.76,0,.24,1)" },
    );
    entrance.onfinish = () => {
      scene.dataset.routePhase = "ready";
    };
    return () => {
      entrance.cancel();
      shutter?.cancel();
      scene.dataset.routePhase = "ready";
    };
  }, [pathname, reduced]);
  return ref;
}
