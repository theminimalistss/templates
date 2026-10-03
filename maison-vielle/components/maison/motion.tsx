'use client';
import { useEffect } from 'react';

/** One observer + a single scheduled frame; scrolling never updates React state. */
export function Motion() {
  useEffect(() => {
    // The header and hero intro is CSS-timed from load; after it, newly displayed items skip it.
    const introTimer = setTimeout(() => document.documentElement.classList.add('intro-done'), 3400);
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};
    const initialize = () => {
      dispose();
      const root = document.documentElement;
      if (preference.matches) { root.classList.remove('motion-ready'); return; }
      const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
      const frames = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
      const visible = new Set<HTMLElement>();
      const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      // Already on screen at load: reveal straight away (next frame, so the transition still plays).
      requestAnimationFrame(() => reveals.forEach(el => { if (el.getBoundingClientRect().top < innerHeight * 0.94) el.classList.add('is-visible'); }));
      reveals.forEach(el => revealObserver.observe(el));
      root.classList.add('motion-ready');
      const frameObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target as HTMLElement); else visible.delete(entry.target as HTMLElement);
      }), { rootMargin: '100px' });
      frames.forEach(el => frameObserver.observe(el));
      const hero = document.querySelector<HTMLElement>('.hero');
      let heroProgress = -1;
      // [data-scrub] sections: --scrub = viewports scrolled since the section pinned (CSS derives each phase from it).
      const scrubbers = [...document.querySelectorAll<HTMLElement>('[data-scrub]')].map(el => ({ el, value: -1 }));
      let scheduled = 0;
      const update = () => {
        scheduled = 0;
        const mobile = innerWidth < 768;
        // Hero exit: 0 at the top, 1 once the hero has scrolled away. Skipped when unchanged.
        if (hero) {
          const progress = Math.min(1, Math.max(0, scrollY / hero.offsetHeight));
          if (Math.abs(progress - heroProgress) > 0.001) { heroProgress = progress; hero.style.setProperty('--hero-progress', progress.toFixed(3)); }
        }
        scrubbers.forEach(item => {
          const box = item.el.getBoundingClientRect();
          if (box.top > innerHeight || box.bottom < 0) return;
          const scrub = Math.min((box.height - innerHeight) / innerHeight, Math.max(0, -box.top / innerHeight));
          if (Math.abs(scrub - item.value) > 0.001) { item.value = scrub; item.el.style.setProperty('--scrub', scrub.toFixed(3)); }
        });
        visible.forEach(el => {
          const box = el.getBoundingClientRect();
          const amount = mobile ? 0 : Number(el.dataset.parallax || 26);
          const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - box.top - box.height / 2) / (innerHeight / 2 + box.height / 2)));
          el.style.setProperty('--parallax-y', `${(progress * amount).toFixed(2)}px`);
        });
        document.querySelector('header')?.classList.toggle('is-scrolled', scrollY > 60);
      };
      const schedule = () => { if (!scheduled) scheduled = requestAnimationFrame(update); };
      addEventListener('scroll', schedule, { passive: true });
      addEventListener('resize', schedule, { passive: true });
      update();
      dispose = () => {
        revealObserver.disconnect(); frameObserver.disconnect(); cancelAnimationFrame(scheduled);
        removeEventListener('scroll', schedule); removeEventListener('resize', schedule);
        root.classList.remove('motion-ready'); frames.forEach(el => el.style.removeProperty('--parallax-y'));
        hero?.style.removeProperty('--hero-progress');
        scrubbers.forEach(item => item.el.style.removeProperty('--scrub'));
      };
    };
    initialize(); preference.addEventListener('change', initialize);
    return () => { clearTimeout(introTimer); dispose(); preference.removeEventListener('change', initialize); };
  }, []);
  return null;
}
