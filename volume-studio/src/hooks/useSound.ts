import { useCallback, useEffect, useRef, useState } from "react";
export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const sound = useRef<HTMLAudioElement | null>(null);
  const play = useCallback(() => {
    const audio = sound.current;
    if (audio) {
      audio.currentTime = 0;
      void audio.play().catch(() => setEnabled(false));
    }
  }, []);
  const toggle = () => {
    if (enabled) {
      sound.current?.pause();
      setEnabled(false);
    } else {
      sound.current ??= new Audio("/media/audio/navigation.mp3");
      sound.current.volume = 0.12;
      setEnabled(true);
      play();
    }
  };
  useEffect(() => {
    if (!enabled) return;
    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-sound-control]")) return;
      if (target.closest("a,button")) play();
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [enabled, play]);
  useEffect(
    () => () => {
      sound.current?.pause();
    },
    [],
  );
  return { enabled, toggle };
}
