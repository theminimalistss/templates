import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "./useReducedMotion";
export function useMotion() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    let frame = 0;
    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    reveals.forEach((node) => {
      if (node.getBoundingClientRect().top < innerHeight)
        node.classList.add("revealed");
      observer.observe(node);
    });
    root.classList.add("motion-ready");
    const parallax = [
      ...document.querySelectorAll<HTMLElement>("[data-parallax]"),
    ];
    const horizontal = document.querySelector<HTMLElement>("[data-horizontal]");
    const track = horizontal?.querySelector<HTMLElement>("[data-track]");
    const update = () => {
      frame = 0;
      const desktop = innerWidth >= 1000;
      parallax.forEach((node) => {
        const box = node.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 0) {
          const delta = desktop
            ? (innerHeight / 2 - box.top - box.height / 2) * 0.075
            : 0;
          node.style.setProperty(
            "--parallax",
            `${Math.max(-40, Math.min(40, delta))}px`,
          );
        }
      });
      if (horizontal && track) {
        const box = horizontal.getBoundingClientRect();
        const progress = Math.min(
          1,
          Math.max(0, -box.top / (box.height - innerHeight)),
        );
        const distance = track.scrollWidth - horizontal.clientWidth;
        track.style.transform = desktop
          ? `translate3d(${-progress * distance}px,0,0)`
          : "";
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      root.classList.remove("motion-ready");
      parallax.forEach((node) => node.style.removeProperty("--parallax"));
      if (track) track.style.transform = "";
    };
  }, [pathname, reduced]);
}
