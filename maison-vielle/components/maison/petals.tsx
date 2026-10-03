'use client';
import { useEffect, useRef } from 'react';

type Petal = { x: number; y: number; size: number; fall: number; drift: number; spin: number; angle: number; flutter: number; phase: number; alpha: number };

/**
 * Ivory petals drifting down over the pinned cinematic photograph.
 * They fade in with the frame's expansion (first half-viewport of --scrub on the section) and only animate while the stage is on screen.
 * Nothing renders under reduced motion.
 */
export function Petals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const section = canvas?.closest<HTMLElement>('.cinematic-break');
    if (!canvas || !context || !section) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');

    // One soft petal sprite, drawn once; each petal is a rotated, fluttering copy.
    const sprite = document.createElement('canvas');
    sprite.width = 40; sprite.height = 56;
    const paint = sprite.getContext('2d')!;
    const fill = paint.createLinearGradient(0, 0, 40, 56);
    fill.addColorStop(0, 'rgba(255, 252, 246, .95)');
    fill.addColorStop(1, 'rgba(244, 226, 220, .8)');
    paint.fillStyle = fill;
    paint.beginPath();
    paint.moveTo(20, 2);
    paint.bezierCurveTo(38, 14, 36, 42, 20, 54);
    paint.bezierCurveTo(4, 42, 2, 14, 20, 2);
    paint.fill();

    let width = 0, height = 0, petals: Petal[] = [];
    const seed = (anywhere: boolean): Petal => ({
      x: Math.random() * width * 1.2 - width * 0.1,
      y: anywhere ? Math.random() * height : -30 - Math.random() * 80,
      size: 6 + Math.random() * 8,
      fall: 0.55 + Math.random() * 0.9,
      drift: 0.25 + Math.random() * 0.5,
      spin: (Math.random() - 0.5) * 0.04,
      angle: Math.random() * Math.PI * 2,
      flutter: 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.4 + Math.random() * 0.35,
    });
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      petals = Array.from({ length: width < 768 ? 9 : 16 }, () => seed(true));
    };

    let frame = 0, running = false, last = 0, time = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(48, now - (last || now)) / 16.67; last = now; time += dt;
      const expansion = Math.min(1, Number(section.style.getPropertyValue('--scrub') || 9) / 0.5);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = canvas.width / width;
      for (let i = 0; i < petals.length; i++) {
        const petal = petals[i];
        petal.y += petal.fall * dt;
        petal.x += (petal.drift + Math.sin(time * 0.02 + petal.phase) * 0.6) * dt;
        petal.angle += petal.spin * dt;
        if (petal.y > height + 40 || petal.x > width + 40) { petals[i] = seed(false); continue; }
        // Flutter: squash one axis over time so the petal appears to turn in the air.
        const turn = Math.cos(time * petal.flutter + petal.phase);
        context.globalAlpha = petal.alpha * Math.max(0, expansion);
        context.setTransform(dpr, 0, 0, dpr, petal.x * dpr, petal.y * dpr);
        context.rotate(petal.angle);
        context.scale(0.35 + Math.abs(turn) * 0.65, 1);
        context.drawImage(sprite, -petal.size / 2, -petal.size * 0.7, petal.size, petal.size * 1.4);
      }
      context.globalAlpha = 1;
    };

    const start = () => { if (!running && !reduced.matches) { running = true; last = 0; frame = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(frame); };
    const visibility = new IntersectionObserver(([entry]) => entry.isIntersecting ? start() : stop());
    const sizeObserver = new ResizeObserver(resize);
    const onPreference = () => {
      if (reduced.matches) { stop(); context.clearRect(0, 0, canvas.width, canvas.height); }
      else if (canvas.getBoundingClientRect().bottom > 0 && canvas.getBoundingClientRect().top < innerHeight) start();
    };
    resize();
    sizeObserver.observe(canvas);
    visibility.observe(canvas);
    reduced.addEventListener('change', onPreference);
    return () => { stop(); visibility.disconnect(); sizeObserver.disconnect(); reduced.removeEventListener('change', onPreference); };
  }, []);

  return <canvas className="break-petals" ref={canvasRef} aria-hidden="true" />;
}
