import { useEffect } from "react";

export function useHeroMediaPreload(id: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const image = new Image();
    image.srcset = [480, 768, 1024, 1440, 1920]
      .map((width) => `/media/images/${id}-${width}.avif ${width}w`)
      .join(", ");
    image.sizes = "(max-width: 700px) 88vw, 48vw";
    image.src = `/media/images/${id}-768.avif`;
  }, [id, enabled]);
}
