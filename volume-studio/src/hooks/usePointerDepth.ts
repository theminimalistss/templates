import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";
export function usePointerDepth() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || !matchMedia("(pointer:fine)").matches) return;
    let frame = 0;
    let x = 0,
      y = 0,
      targetX = 0,
      targetY = 0;
    const render = () => {
      x += (targetX - x) * 0.105;
      y += (targetY - y) * 0.105;
      node.style.setProperty("--pointer-x", `${(x * 30).toFixed(3)}px`);
      node.style.setProperty("--pointer-y", `${(y * 24).toFixed(3)}px`);
      node.style.setProperty("--pointer-rx", `${(-y * 3).toFixed(3)}deg`);
      node.style.setProperty("--pointer-ry", `${(x * 4).toFixed(3)}deg`);
      frame =
        Math.abs(targetX - x) + Math.abs(targetY - y) > 0.001
          ? requestAnimationFrame(render)
          : 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      targetX = Math.max(
        -1,
        Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1),
      );
      targetY = Math.max(
        -1,
        Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1),
      );
      schedule();
    };
    const reset = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
      ["--pointer-x", "--pointer-y", "--pointer-rx", "--pointer-ry"].forEach(
        (property) => node.style.removeProperty(property),
      );
    };
  }, [reduced]);
  return ref;
}
