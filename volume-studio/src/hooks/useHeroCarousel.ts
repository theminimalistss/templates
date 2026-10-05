import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { HERO_HOLD_MS, HERO_TRANSITION_MS } from "../constants/motion";
import { useReducedMotion } from "./useReducedMotion";

export function useHeroCarousel(
  count: number,
  ref: RefObject<HTMLElement | null>,
  ready: boolean,
) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [hoveringControls, setHoveringControls] = useState(false);
  const [cycle, setCycle] = useState(0);
  const active = useRef(0);
  const playing =
    ready && !paused && !reduced && visible && !hidden && !hoveringControls;
  const change = useCallback((next: number) => {
    if (next === active.current) return;
    setPrevious(active.current);
    active.current = next;
    setIndex(next);
    setCycle((value) => value + 1);
  }, []);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(node);
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [ref]);
  useEffect(() => {
    if (!playing || count < 2) return;
    const timer = window.setTimeout(
      () => change((index + 1) % count),
      HERO_HOLD_MS,
    );
    return () => clearTimeout(timer);
  }, [playing, count, index, change]);
  useEffect(() => {
    if (previous === null) return;
    const timer = window.setTimeout(
      () => setPrevious(null),
      reduced ? 0 : HERO_TRANSITION_MS,
    );
    return () => clearTimeout(timer);
  }, [index, previous, reduced]);
  const select = (next: number) => {
    setPaused(true);
    change(next);
  };
  return {
    index,
    previous,
    cycle,
    playing,
    paused,
    reduced,
    select,
    pause: () => setPaused(true),
    toggle: () => setPaused((value) => !value),
    setHoveringControls,
  };
}
