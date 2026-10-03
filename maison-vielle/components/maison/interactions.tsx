'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type SubmitEvent } from 'react';
import { flushSync } from 'react-dom';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { ResponsiveImage, srcSetFor } from './responsive-image';
import { gallery, galleryTiles } from '@/content/media';

const links = [['The estate', '#estate'], ['Our spaces', '#spaces'], ['Weddings', '#weddings'], ['Gallery', '#gallery']];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pending = useRef<string | null>(null);

  // The full-screen menu is mobile-only: close it if the window widens past the breakpoint.
  useEffect(() => {
    const desktop = matchMedia('(min-width: 768px)');
    const close = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);

  // A menu link closes the menu first. Once it has fully closed (scroll lock released), scroll to the section
  // and move focus there, instead of letting the dialog return focus to the toggle at the top of the page.
  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => { event.preventDefault(); pending.current = href; setOpen(false); };
  const afterClose = (event: Event) => {
    const href = pending.current;
    pending.current = null;
    if (!href) return;
    event.preventDefault();
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', href);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  return <header className="site-header"><a href="#main" className="brand" aria-label="Maison Vielle home"><span className="brand-monogram">MV</span><span>MAISON VIELLE</span></a><nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav><a className="header-inquire" href="#inquire">MAKE AN INQUIRY</a><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="menu-toggle" aria-label="Open navigation"><span /> <span /></button></DialogTrigger><DialogContent className="mobile-menu" showCloseButton={false} onCloseAutoFocus={afterClose}><DialogTitle className="eyebrow">MAISON VIELLE</DialogTitle><DialogDescription className="sr-only">Explore the estate and begin planning your celebration.</DialogDescription><DialogClose className="menu-close">Close <span aria-hidden="true">×</span></DialogClose><nav aria-label="Mobile navigation">{[...links, ['Inquire', '#inquire']].map(([label, href], i) => <a href={href} key={href} onClick={event => navigate(event, href)}><span>0{i + 1}</span>{label}</a>)}</nav><p className="eyebrow">A PRIVATE ESTATE IN PROVENCE</p></DialogContent></Dialog></header>;
}

type GalleryEntry = (typeof gallery)[number] & { index: number };
const entries: GalleryEntry[] = gallery.map((item, index) => ({ ...item, index }));
const isWide = (entry: GalleryEntry) => entry.image.width > entry.image.height;
// Tile shapes in the full mosaic (see .gallery-item-N); rotation only swaps in photos of the same orientation.
const tileIsWide = [true, false, false, false, true, true];
const SWAP_EVERY = 3800;
const LIGHTBOX_SIZES = '90vw';

/** Warm the exact file the lightbox <picture> will pick, so the morph never lands on a blank frame (capped wait). */
function preloadLightbox(entry: GalleryEntry) {
  const image = new Image();
  image.sizes = LIGHTBOX_SIZES;
  image.srcset = srcSetFor(entry.image, 'avif');
  return Promise.race([image.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 700))]);
}

/**
 * Shared-element morph between a gallery tile and the lightbox photo (View Transitions API).
 * The tile's photo box and the lightbox photo take turns holding the `gallery-photo` name, so the browser
 * animates one into the other. Falls back to an instant update without support or under reduced motion.
 */
function morph(tile: HTMLElement | null | undefined, update: () => void, direction: 'open' | 'close') {
  if (!tile || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { update(); return; }
  if (direction === 'open') tile.style.viewTransitionName = 'gallery-photo';
  const transition = document.startViewTransition(() => {
    flushSync(update);
    tile.style.viewTransitionName = direction === 'open' ? '' : 'gallery-photo';
  });
  transition.finished.finally(() => { tile.style.viewTransitionName = ''; });
}

/** One mosaic tile. When its entry changes, the new photo pushes in over the old one and the caption rolls over. */
function GalleryTile({ entry, className, order, onOpen }: { entry: GalleryEntry; className: string; order: number; onOpen: (index: number, tile: HTMLElement | null) => void }) {
  const [current, setCurrent] = useState(entry);
  const [previous, setPrevious] = useState<GalleryEntry | null>(null);
  const [ready, setReady] = useState(true);
  const incoming = useRef<HTMLSpanElement>(null);
  if (entry.index !== current.index) { setPrevious(current); setCurrent(entry); setReady(false); }

  // Start the push only once the incoming photo has loaded, so it never slides in blank.
  useEffect(() => {
    if (ready) return;
    const image = incoming.current?.querySelector('img');
    if (!image || (image.complete && image.naturalWidth)) { setReady(true); return; }
    const done = () => setReady(true);
    image.addEventListener('load', done, { once: true }); image.addEventListener('error', done, { once: true });
    return () => { image.removeEventListener('load', done); image.removeEventListener('error', done); };
  }, [ready, current.index]);

  const changing = previous !== null;
  return <button className={`gallery-item ${className}`} style={{ '--n': order } as CSSProperties} data-index={current.index} onClick={event => onOpen(current.index, event.currentTarget.querySelector('.gallery-image'))} aria-label={`View ${current.label}`}>
    <span className="gallery-image">
      {previous && <span className={`gallery-layer ${ready ? 'is-leaving' : ''}`} key={`was-${previous.index}`}><ResponsiveImage asset={previous.image} sizes="(max-width: 767px) 80vw, 38vw" /></span>}
      <span ref={incoming} key={current.index} className={`gallery-layer ${changing ? (ready ? 'is-entering' : 'is-waiting') : ''}`}
        onAnimationEnd={event => { if (event.target === event.currentTarget) setPrevious(null); }}>
        <ResponsiveImage asset={current.image} sizes="(max-width: 767px) 80vw, 38vw" />
      </span>
      <span className="gallery-expand" aria-hidden="true">+</span>
    </span>
    <span className="gallery-caption" aria-hidden="true">
      <span className="caption-roll"><span key={current.index} className={changing && ready ? 'is-entering' : ''}>{current.label}</span></span>
      <span className="caption-roll"><span key={current.index} className={changing && ready ? 'is-entering' : ''}>{current.category}</span></span>
    </span>
  </button>;
}

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState<'next' | 'prev' | null>(null);
  // Previous/next inside the lightbox: the new photo glides in from the side it came from.
  const go = (direction: 'next' | 'prev') => { setStep(direction); setSelected(value => value === null ? null : (value + (direction === 'next' ? 1 : gallery.length - 1)) % gallery.length); };
  const [filter, setFilter] = useState('All moments');
  const [slots, setSlots] = useState(() => entries.slice(0, galleryTiles).map(entry => entry.index));
  const stage = useRef<HTMLDivElement>(null);
  const slotsRef = useRef(slots);
  useEffect(() => { slotsRef.current = slots; }, [slots]);
  const mosaic = filter === 'All moments';

  // Living mosaic: every few seconds one tile (never the hovered one, never twice running) takes a photo
  // that is not on screen. Runs only while the full mosaic is visible, the lightbox is closed and motion is allowed.
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false, lastTile = -1;
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; element.classList.toggle('is-live', inView); }, { threshold: 0.15 });
    observer.observe(element);
    if (!mosaic || selected !== null) return () => observer.disconnect();
    const timer = setInterval(() => {
      if (!inView || document.hidden || reduced.matches) return;
      const current = slotsRef.current;
      const tiles = [...element.querySelectorAll('.gallery-item')];
      const order = current.map((_, tile) => tile).filter(tile => tile !== lastTile && !tiles[tile]?.matches(':hover')).sort(() => Math.random() - 0.5);
      for (const tile of order) {
        const options = entries.filter(entry => !current.includes(entry.index) && isWide(entry) === tileIsWide[tile]);
        if (!options.length) continue;
        const next = [...current];
        next[tile] = options[Math.floor(Math.random() * options.length)].index;
        lastTile = tile; setSlots(next);
        return;
      }
    }, SWAP_EVERY);
    return () => { clearInterval(timer); observer.disconnect(); };
  }, [mosaic, selected]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go('next');
      if (event.key === 'ArrowLeft') go('prev');
    };
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey);
  }, [selected]);

  const openLightbox = async (index: number, tile: HTMLElement | null) => {
    await preloadLightbox(entries[index]);
    morph(tile, () => { setStep(null); setSelected(index); }, 'open');
  };
  // Collapse back into whichever tile shows the photo now; if it is not on screen, the dialog simply fades.
  const closeLightbox = () => morph(stage.current?.querySelector<HTMLElement>(`[data-index="${selected}"] .gallery-image`), () => setSelected(null), 'close');

  const shown = mosaic ? slots.map(index => entries[index]) : entries.filter(entry => entry.category === filter);
  const current = selected === null ? null : gallery[selected];
  return <><div className="gallery-filters" aria-label="Filter gallery" data-reveal="rise">{['All moments', 'The estate', 'The gardens', 'At the table', 'Celebrations'].map(label => <button key={label} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}</div>
    <div className="gallery-stage" ref={stage} data-reveal="gallery">
      <div className={`gallery-grid ${mosaic ? '' : 'gallery-filtered'}`}>{shown.map((entry, position) => <GalleryTile key={mosaic ? `tile-${position}` : `${filter}-${entry.index}`} entry={entry} order={position} className={mosaic ? `gallery-item-${position + 1}` : ''} onOpen={openLightbox} />)}</div>
    </div>
    <p className="gallery-hint" data-reveal="rise">A CLOSER LOOK IS ALWAYS WORTH IT.</p><Dialog open={selected !== null} onOpenChange={open => { if (!open) closeLightbox(); }}><DialogContent className="gallery-dialog">{current && <><DialogTitle className="sr-only">{current.label}</DialogTitle><DialogDescription className="sr-only">{current.image.alt}. Use the previous and next buttons or your keyboard arrow keys.</DialogDescription><ResponsiveImage key={selected} asset={current.image} sizes={LIGHTBOX_SIZES} priority className={`lightbox-photo ${step ? `is-${step}` : ''}`} style={{ '--ratio': current.image.width / current.image.height } as CSSProperties} /><div className="lightbox-controls"><button onClick={() => go('prev')}>Previous</button><span>{String(selected! + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')} — {current.label}</span><button onClick={() => go('next')}>Next</button></div></>}</DialogContent></Dialog></>;
}

export function EstateFilm() {
  const [open, setOpen] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReduced(query.matches); if (query.matches) video.current?.pause(); };
    change(); query.addEventListener('change', change); return () => query.removeEventListener('change', change);
  }, []);
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="film-button"><span className="play-circle" aria-hidden="true">▷</span><span>A MOMENT IN THE GARDENS</span></button></DialogTrigger><DialogContent className="film-dialog"><DialogTitle>A moment in the gardens.</DialogTitle><DialogDescription>Take a breath. Stay a little while.</DialogDescription>{open && <video ref={video} controls playsInline autoPlay={!reduced} muted loop preload="metadata" poster="/media/video/atmosphere/garden-film-poster.webp"><source src="/media/video/atmosphere/garden-film.webm" type="video/webm" /><source src="/media/video/atmosphere/garden-film.mp4" type="video/mp4" />Your browser cannot play this film. Enjoy the gardens in our photo gallery.</video>}</DialogContent></Dialog>;
}

/**
 * Drag-to-close for a bottom sheet (phones only). Pull down from the handle area, or from anywhere once the
 * sheet is scrolled to the top; release past a quarter of its height or with a quick flick to close,
 * otherwise it springs back. The backdrop lightens while dragging.
 */
function useSheetDrag(sheet: HTMLDivElement | null, onClose: () => void) {
  useEffect(() => {
    if (!sheet) return;
    const backdrop = sheet.previousElementSibling as HTMLElement | null;
    let startY = 0, offset = 0, fromHandle = false, dragging = false, active = false;
    let samples: { y: number; t: number }[] = [];
    const set = (y: number, animate: boolean) => {
      sheet.style.transition = animate ? 'translate .35s cubic-bezier(.16,1,.3,1)' : 'none';
      sheet.style.translate = y ? `0 ${y}px` : '';
      if (backdrop) { backdrop.style.transition = sheet.style.transition.replace('translate', 'opacity'); backdrop.style.opacity = y ? String(Math.max(0.15, 1 - y / sheet.offsetHeight)) : ''; }
    };
    const onStart = (event: TouchEvent) => {
      active = matchMedia('(max-width: 767px)').matches && event.touches.length === 1;
      if (!active) return;
      startY = event.touches[0].clientY; offset = 0; dragging = false; samples = [];
      fromHandle = startY - sheet.getBoundingClientRect().top < 56;
    };
    const onMove = (event: TouchEvent) => {
      if (!active) return;
      const dy = event.touches[0].clientY - startY;
      if (!dragging) {
        const field = (event.target as HTMLElement).closest('textarea');
        const atTop = sheet.scrollTop <= 0 && (!field || field.scrollTop <= 0);
        if (dy > 6 && (fromHandle || atTop)) dragging = true;
        else if (Math.abs(dy) > 6) { active = false; return; }
        else return;
      }
      event.preventDefault();
      offset = Math.max(0, dy - 6);
      const now = performance.now();
      samples.push({ y: offset, t: now });
      samples = samples.filter(sample => now - sample.t < 120);
      set(offset, false);
    };
    const onEnd = () => {
      if (!active || !dragging) { active = false; return; }
      active = dragging = false;
      // Release speed over the last ~120ms of movement, so a late flick counts even after a slow start.
      const first = samples[0], last = samples[samples.length - 1];
      const velocity = first && last && last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0;
      if (offset > sheet.offsetHeight * 0.25 || (velocity > 0.5 && offset > 40)) {
        if (backdrop) backdrop.style.opacity = '';
        onClose(); // the exit animation slides out from where the finger left it
      } else set(0, true);
    };
    sheet.addEventListener('touchstart', onStart, { passive: true });
    sheet.addEventListener('touchmove', onMove, { passive: false });
    sheet.addEventListener('touchend', onEnd);
    sheet.addEventListener('touchcancel', onEnd);
    return () => {
      sheet.removeEventListener('touchstart', onStart); sheet.removeEventListener('touchmove', onMove);
      sheet.removeEventListener('touchend', onEnd); sheet.removeEventListener('touchcancel', onEnd);
      sheet.style.translate = sheet.style.transition = '';
      if (backdrop) backdrop.style.opacity = backdrop.style.transition = '';
    };
  }, [sheet, onClose]);
}

export function Inquiry() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [name, setName] = useState('');
  const [saved, setSaved] = useState({ email: '', date: '', guests: '', story: '' });
  // The sheet element arrives through a callback ref: the dialog portal mounts it after this component renders.
  const [sheet, setSheet] = useState<HTMLDivElement | null>(null);
  const closeSheet = useCallback(() => setOpen(false), []);
  useSheetDrag(sheet, closeSheet);
  const form = useRef<HTMLFormElement>(null);
  const prepare = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setName(String(values.get('names')));
    setSaved({ email: String(values.get('email') || ''), date: String(values.get('date') || ''), guests: String(values.get('guests') || ''), story: String(values.get('story') || '') });
    setDraft(`MAISON VIELLE — CELEBRATION ENQUIRY\n\nNames: ${values.get('names')}\nEmail: ${values.get('email')}\nPreferred date: ${values.get('date') || 'Flexible / to be decided'}\nGuests: ${values.get('guests')}\n\nOur celebration\n${values.get('story') || 'We would love to explore the possibilities.'}\n\nThis is a saved enquiry brief. It has not been sent to the venue.`);
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'maison-vielle-enquiry.txt'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="solid-button">Begin your inquiry</button></DialogTrigger><DialogContent className="inquiry-dialog" ref={setSheet}><DialogTitle>{draft ? 'Your story starts here.' : 'Tell us what you’re dreaming of.'}</DialogTitle><DialogDescription>{draft ? `${name}, your celebration brief is ready to keep.` : 'A few details, a little inspiration, and the beginning of something beautiful.'}</DialogDescription>{draft ? <div className="inquiry-result"><p>Your inquiry has been prepared. Download a copy for your planning notes.</p><p className="form-note">Nothing has been sent. This copy is yours to share when you’re ready.</p><div className="form-actions"><button className="solid-button" onClick={download}>Download your inquiry</button><button className="text-link" onClick={() => setDraft('')}>Edit details</button></div></div> : <form ref={form} onSubmit={prepare}><div className="form-row"><label>Your names<input name="names" value={name} onChange={e => setName(e.target.value)} autoComplete="name" required maxLength={120} placeholder="Charlotte & James" /></label><label>Email address<input name="email" defaultValue={saved.email} type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label></div><div className="form-row"><label>Preferred date <span>(optional)</span><input name="date" defaultValue={saved.date} type="date" min={new Date().toLocaleDateString('en-CA')} /></label><label>Number of guests<input name="guests" defaultValue={saved.guests} type="number" min="2" max="120" required placeholder="e.g. 80" /></label></div><label>A little about your celebration<textarea name="story" defaultValue={saved.story} rows={3} maxLength={3000} placeholder="The feeling, the people, the little things you have in mind…" /></label><p className="form-note">Create a personal inquiry brief to save and share. Your details stay in this session.</p><button className="solid-button" type="submit">Prepare your inquiry</button></form>}</DialogContent></Dialog>;
}
