import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";
export function usePointerDepth() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || !matchMedia("(pointer:fine)").matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = node.getBoundingClientRect();
        node.style.setProperty(
          "--pointer-x",
          `${((event.clientX - box.left - box.width / 2) / box.width) * 8}px`,
        );
        node.style.setProperty(
          "--pointer-y",
          `${((event.clientY - box.top - box.height / 2) / box.height) * 8}px`,
        );
      });
    };
    const reset = () => {
      node.style.setProperty("--pointer-x", "0px");
      node.style.setProperty("--pointer-y", "0px");
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [reduced]);
  return ref;
}
