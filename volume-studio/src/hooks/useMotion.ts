import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "./useReducedMotion";
const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));

export function useMotion() {
  const { pathname, search } = useLocation();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    let frame = 0;
    const enhanced = [
      ...document.querySelectorAll<HTMLElement>(
        ".section-label, .service-row, .project-caption, .journal-card > .micro, .journal-card > h2, .journal-card > h3, .cta-grid > div, .studio-story h2, .studio-story-grid > div > p, .intro-description, .studio-lead, .article-copy p, .project-overview > *, .contact-aside > p, .contact-aside > a",
      ),
    ];
    enhanced.forEach((node) => {
      if (!node.dataset.reveal) node.dataset.reveal = "rise";
    });
    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    reveals.forEach((node) => {
      if (node.getBoundingClientRect().top < innerHeight * 0.92)
        node.dataset.revealed = "true";
      observer.observe(node);
    });
    root.classList.add("motion-ready");
    const parallax = [
      ...document.querySelectorAll<HTMLElement>("[data-parallax]"),
    ];
    const depths = [
      ...document.querySelectorAll<HTMLElement>("[data-image-depth]"),
    ];
    const kinetic = [
      ...document.querySelectorAll<HTMLElement>("[data-kinetic]"),
    ];
    const stories = [...document.querySelectorAll<HTMLElement>("[data-story]")];
    const headings = [
      ...document.querySelectorAll<HTMLElement>("[data-scroll-heading]"),
    ];
    const hero = document.querySelector<HTMLElement>(".hero");
    const horizontal = document.querySelector<HTMLElement>("[data-horizontal]");
    const track = horizontal?.querySelector<HTMLElement>("[data-track]");
    const update = () => {
      frame = 0;
      const desktop = innerWidth >= 1000;
      const tablet = innerWidth >= 700;
      const travel = desktop ? 1 : tablet ? 0.55 : 0.25;
      if (hero) {
        const box = hero.getBoundingClientRect();
        hero.style.setProperty(
          "--hero-exit",
          String(clamp(-box.top / box.height)),
        );
      }
      headings.forEach((node) => {
        const previous =
          parseFloat(node.style.getPropertyValue("--heading-drift")) || 0;
        const top = node.getBoundingClientRect().top - previous;
        node.style.setProperty(
          "--heading-drift",
          `${clamp((innerHeight * 0.3 - top) * -0.2 * travel, -75, 35)}px`,
        );
      });
      parallax.forEach((node) => {
        const box = node.getBoundingClientRect();
        if (box.top < innerHeight + 100 && box.bottom > -100) {
          const delta =
            (innerHeight / 2 - box.top - box.height / 2) * 0.16 * travel;
          node.style.setProperty("--parallax", `${clamp(delta, -60, 60)}px`);
        }
      });
      depths.forEach((node) => {
        const box = node.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 0) {
          const progress =
            (innerHeight / 2 - box.top - box.height / 2) /
            (innerHeight + box.height);
          node.style.setProperty(
            "--image-drift",
            `${clamp(progress * 100 * travel, -35, 35)}px`,
          );
        }
      });
      kinetic.forEach((node) => {
        const box = node.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 0)
          node.style.setProperty(
            "--type-travel",
            `${clamp((innerHeight / 2 - box.top - box.height / 2) * 0.11 * travel, -45, 45)}px`,
          );
      });
      stories.forEach((node) => {
        const box = node.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 0)
          node.style.setProperty(
            "--story-progress",
            String(clamp((innerHeight - box.top) / (innerHeight * 0.85))),
          );
      });
      if (horizontal && track) {
        const box = horizontal.getBoundingClientRect();
        const progress = clamp(
          -box.top / Math.max(1, box.height - innerHeight),
        );
        track.style.transform = desktop
          ? `translate3d(${-progress * (track.scrollWidth - horizontal.clientWidth)}px,0,0)`
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
      enhanced.forEach((node) => {
        delete node.dataset.reveal;
      });
      (
        [
          [parallax, "--parallax"],
          [depths, "--image-drift"],
          [kinetic, "--type-travel"],
          [stories, "--story-progress"],
          [headings, "--heading-drift"],
        ] as const
      ).forEach(([nodes, property]) =>
        nodes.forEach((node) => node.style.removeProperty(property)),
      );
      hero?.style.removeProperty("--hero-exit");
      if (track) track.style.transform = "";
    };
  }, [pathname, search, reduced]);
}
