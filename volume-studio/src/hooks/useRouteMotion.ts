import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "./useReducedMotion";
export function useRouteMotion() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);
  const reduced = useReducedMotion();
  useEffect(() => {
    const changed = previous.current !== pathname;
    previous.current = pathname;
    if (!changed || reduced) return;
    const main = document.getElementById("main");
    const animation = main?.animate?.(
      [
        {
          opacity: 0,
          clipPath: "inset(0 0 7% 0)",
          transform: "translateY(18px)",
        },
        { opacity: 1, clipPath: "inset(0)", transform: "translateY(0)" },
      ],
      { duration: 550, easing: "cubic-bezier(.22,.68,0,1.01)" },
    );
    return () => animation?.cancel();
  }, [pathname, reduced]);
}
