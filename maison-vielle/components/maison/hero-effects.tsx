'use client';
import { useEffect, useRef } from 'react';
import { createDepthScene, type DepthScene } from './hero-depth';

type Mote = { x: number; y: number; size: number; depth: number; drift: number; rise: number; phase: number; twinkle: number; alpha: number };

/**
 * Hero life, all from one requestAnimationFrame loop that only runs while the hero is on screen:
 * - a spatial (depth-separated) photograph whose virtual camera follows the cursor, device tilt
 *   and scroll, opens with a slow sweep, and otherwise drifts in a gentle orbit;
 * - drifting sunlit motes and a warm light that follows the cursor;
 * - a magnetic scroll badge. The hero text does not follow the cursor.
 * Without JavaScript, WebGL or under reduced motion the static <picture> and text remain.
 */
export function HeroEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    const hero = canvas?.closest<HTMLElement>('.hero');
    const context = canvas?.getContext('2d');
    if (!canvas || !glow || !hero || !context) return;
    const badge = hero.querySelector<HTMLElement>('.hero-badge');
    const depthCanvas = hero.querySelector<HTMLCanvasElement>('.hero-depth');
    const photo = hero.querySelector<HTMLImageElement>('.hero-image img');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

    // Pre-render one soft glow sprite; every mote is a scaled, faded copy of it.
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const spriteContext = sprite.getContext('2d')!;
    const gradient = spriteContext.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 246, 222, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 228, 176, .55)');
    gradient.addColorStop(1, 'rgba(255, 214, 150, 0)');
    spriteContext.fillStyle = gradient;
    spriteContext.fillRect(0, 0, 64, 64);

    let width = 0, height = 0, dpr = 1;
    let motes: Mote[] = [];
    const seed = (anywhere: boolean): Mote => {
      const depth = Math.random();
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + 20,
        size: 2 + depth * depth * 16 + (Math.random() < 0.08 ? 22 : 0),
        depth,
        drift: (Math.random() - 0.5) * 0.18,
        rise: 0.06 + depth * 0.22,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.4 + Math.random() * 1.4,
        alpha: 0.25 + Math.random() * 0.55,
      };
    };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      width = hero.clientWidth; height = hero.clientHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene?.resize();
      const count = width < 768 ? 26 : 54;
      motes = Array.from({ length: count }, () => seed(true));
    };

    // Pointer state, all eased toward targets inside the frame loop.
    const pointer = { active: false, x: 0, y: 0 };
    const eased = { mx: 0, my: 0, gx: 0, gy: 0, bx: 0, by: 0 };
    const onMove = (event: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      pointer.active = true; pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top;
    };
    const onLeave = () => { pointer.active = false; };

    // Device tilt (Android and others that allow it without a prompt), relative to the first reading.
    const tilt = { active: false, x: 0, y: 0, baseBeta: NaN, baseGamma: NaN };
    const onTilt = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      if (Number.isNaN(tilt.baseBeta)) { tilt.baseBeta = event.beta; tilt.baseGamma = event.gamma; }
      tilt.active = true;
      tilt.x = Math.max(-1, Math.min(1, (event.gamma - tilt.baseGamma) / 18));
      tilt.y = Math.max(-1, Math.min(1, (event.beta - tilt.baseBeta) / 18));
    };

    // Spatial photograph: loads after the static hero has painted, then fades in over it.
    let scene: DepthScene | null = null, sceneVersion = 0, sweepStart = 0;
    const camera = { x: 0, y: 0 };
    const loadScene = async () => {
      if (!depthCanvas || !photo || reduced.matches) return;
      const version = ++sceneVersion;
      scene?.dispose(); scene = null;
      const mobile = (photo.currentSrc || photo.src).includes('estate-mobile');
      const next = await createDepthScene(depthCanvas, photo, {
        depthSrc: `/media/images/hero/maison-vielle-estate${mobile ? '-mobile' : ''}-depth.webp`,
        focus: mobile ? 0.23 : 0.29,
        strength: mobile ? [0.07, 0.036] : [0.05, 0.034],
      });
      if (version !== sceneVersion) { next?.dispose(); return; }
      scene = next;
      if (!scene) return;
      // Sweep the camera in only while the intro curtain still hides the hand-off from the static photo;
      // a later-loading scene eases in from rest instead.
      sweepStart = performance.now() < 1000 ? performance.now() : 0;
      scene.render(camera.x, camera.y);
      depthCanvas.classList.add('is-live');
    };
    const onPhotoSwap = () => { depthCanvas?.classList.remove('is-live'); loadScene(); };

    let frame = 0, running = false, last = 0, time = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(48, now - (last || now)) / 16.67; last = now; time += dt;
      const usePointer = pointer.active && finePointer.matches;

      // Cursor position as -1..1 around the hero centre, eased. Drives the photo and motes only; the type stays put.
      const tx = usePointer ? (pointer.x / width) * 2 - 1 : 0;
      const ty = usePointer ? (pointer.y / height) * 2 - 1 : 0;
      eased.mx += (tx - eased.mx) * 0.07 * dt; eased.my += (ty - eased.my) * 0.07 * dt;

      // Spatial camera: cursor, then tilt, then a slow idle orbit; scroll pushes it upward; intro sweeps in.
      if (scene) {
        const orbit = { x: Math.sin(time * 0.007) * 0.9, y: Math.sin(time * 0.005 + 1.2) * 0.55 };
        let cx = usePointer ? eased.mx * 1.2 + orbit.x * 0.15 : tilt.active ? tilt.x * 1.2 : orbit.x;
        let cy = usePointer ? eased.my + orbit.y * 0.15 : tilt.active ? tilt.y * 1.2 : orbit.y;
        cy += Math.min(1, scrollY / height) * 1.4;
        if (sweepStart > 0) {
          const t = Math.min(1, (now - sweepStart) / 3200), ease = Math.pow(1 - t, 3);
          cx += ease * -2.2; cy += ease * 1.4;
          if (t >= 1) sweepStart = 0;
        }
        camera.x += (cx - camera.x) * 0.08 * dt; camera.y += (cy - camera.y) * 0.08 * dt;
        if (sweepStart > 0) { camera.x = cx; camera.y = cy; }
        scene.render(camera.x, camera.y);
      }

      // Warm light: follows the cursor, otherwise drifts slowly like late sun.
      const gx = usePointer ? pointer.x : width * (0.72 + Math.sin(time * 0.004) * 0.1);
      const gy = usePointer ? pointer.y : height * (0.24 + Math.cos(time * 0.0031) * 0.08);
      if (!eased.gx && !eased.gy) { eased.gx = gx; eased.gy = gy; }
      eased.gx += (gx - eased.gx) * 0.06 * dt; eased.gy += (gy - eased.gy) * 0.06 * dt;
      glow.style.transform = `translate3d(${eased.gx.toFixed(1)}px, ${eased.gy.toFixed(1)}px, 0)`;

      // Magnetic badge: leans toward a nearby cursor.
      if (badge) {
        let bx = 0, by = 0;
        if (usePointer) {
          const box = badge.getBoundingClientRect(), heroBox = hero.getBoundingClientRect();
          const dx = pointer.x - (box.left - heroBox.left + box.width / 2 + eased.bx);
          const dy = pointer.y - (box.top - heroBox.top + box.height / 2 + eased.by);
          if (Math.hypot(dx, dy) < box.width * 1.15) { bx = dx * 0.32; by = dy * 0.32; }
        }
        eased.bx += (bx - eased.bx) * 0.12 * dt; eased.by += (by - eased.by) * 0.12 * dt;
        badge.style.translate = `${eased.bx.toFixed(2)}px ${eased.by.toFixed(2)}px`;
      }

      // Motes: rise, sway, twinkle; nearer motes shift more with the mouse.
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';
      for (let i = 0; i < motes.length; i++) {
        const mote = motes[i];
        mote.y -= mote.rise * dt;
        mote.x += (mote.drift + Math.sin(time * 0.012 + mote.phase) * 0.12) * dt;
        if (mote.y < -40 || mote.x < -40 || mote.x > width + 40) { motes[i] = seed(false); continue; }
        const shine = 0.55 + Math.sin(time * 0.03 * mote.twinkle + mote.phase) * 0.45;
        const fadeTop = Math.min(1, mote.y / (height * 0.25));
        context.globalAlpha = Math.max(0, mote.alpha * shine * fadeTop * (mote.size > 20 ? 0.18 : 1));
        const size = mote.size;
        context.drawImage(sprite, mote.x - eased.mx * mote.depth * 26 - size / 2, mote.y - eased.my * mote.depth * 16 - size / 2, size, size);
      }
      context.globalAlpha = 1;
    };

    const start = () => { if (!running && !reduced.matches) { running = true; last = 0; frame = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(frame); };
    const visibility = new IntersectionObserver(([entry]) => entry.isIntersecting ? start() : stop());
    const sizeObserver = new ResizeObserver(resize);
    const onPreference = () => {
      if (reduced.matches) {
        stop(); context.clearRect(0, 0, width, height);
        glow.style.removeProperty('transform'); badge?.style.removeProperty('translate');
        sceneVersion++; scene?.dispose(); scene = null; depthCanvas?.classList.remove('is-live');
      } else { loadScene(); if (hero.getBoundingClientRect().bottom > 0) start(); }
    };

    resize();
    sizeObserver.observe(hero);
    visibility.observe(hero);
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave);
    reduced.addEventListener('change', onPreference);
    addEventListener('deviceorientation', onTilt, { passive: true });
    photo?.addEventListener('load', onPhotoSwap);
    loadScene();
    return () => {
      stop(); visibility.disconnect(); sizeObserver.disconnect();
      hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerleave', onLeave);
      reduced.removeEventListener('change', onPreference);
      removeEventListener('deviceorientation', onTilt);
      photo?.removeEventListener('load', onPhotoSwap);
      sceneVersion++; scene?.dispose(); scene = null;
    };
  }, []);

  return <>
    <div className="hero-glow" ref={glowRef} aria-hidden="true" />
    <canvas className="hero-motes" ref={canvasRef} aria-hidden="true" />
  </>;
}
