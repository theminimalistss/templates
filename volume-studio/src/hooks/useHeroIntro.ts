import { useEffect, useState, useRef, type RefObject } from "react";
import { HERO_INTRO_MS } from "../constants/motion";
import { useReducedMotion } from "./useReducedMotion";

export function useHeroIntro(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  const finished = useRef(false);
  const [phase, setPhase] = useState<
    "static" | "waiting" | "entering" | "ready"
  >("static");
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || finished.current) {
      finished.current = true;
      setPhase("ready");
      return;
    }
    let disposed = false;
    let finishTimer = 0;
    let frame = 0;
    setPhase("waiting");
    const images = [
      ...node.querySelectorAll<HTMLImageElement>("[data-hero-initial] img"),
    ];
    const listeners: (() => void)[] = [];
    const ready = images.map(
      (img) =>
        new Promise<void>((resolve) => {
          const finish = () => {
            if (typeof img.decode === "function")
              void img
                .decode()
                .catch(() => {})
                .then(resolve);
            else resolve();
          };
          if (img.complete) finish();
          else {
            img.addEventListener("load", finish, { once: true });
            img.addEventListener("error", finish, { once: true });
            listeners.push(() => {
              img.removeEventListener("load", finish);
              img.removeEventListener("error", finish);
            });
          }
        }),
    );
    let started = false;
    const start = () => {
      if (disposed || started) return;
      started = true;
      frame = requestAnimationFrame(() => {
        setPhase("entering");
        finishTimer = window.setTimeout(() => {
          finished.current = true;
          setPhase("ready");
        }, HERO_INTRO_MS);
      });
    };
    void Promise.all(ready).then(start);
    // A failed image request must never hold the headline or controls indefinitely.
    const fallback = window.setTimeout(start, 1500);
    return () => {
      disposed = true;
      clearTimeout(fallback);
      clearTimeout(finishTimer);
      cancelAnimationFrame(frame);
      listeners.forEach((remove) => remove());
    };
  }, [ref, reduced]);
  return { phase, ready: phase === "ready", reduced };
}
