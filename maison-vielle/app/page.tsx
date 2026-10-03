import type { CSSProperties, ReactNode } from 'react';
import { ResponsiveImage } from '@/components/maison/responsive-image';
import { HeroEffects } from '@/components/maison/hero-effects';
import { Petals } from '@/components/maison/petals';
import { Motion } from '@/components/maison/motion';
import { Navigation, Gallery, Inquiry, EstateFilm } from '@/components/maison/interactions';
import { media } from '@/content/media';

const spaces = [
  { number: '01', name: 'The Grand Hall', subtitle: 'For evenings that become memories.', copy: 'Light-filled windows. Long tables. The quiet anticipation of a room waiting to be filled with your favourite people. A timeless setting, entirely your own.', note: 'DINNER & DANCING · UP TO 120 GUESTS', image: media.hall },
  { number: '02', name: 'The Courtyard', subtitle: 'A celebration under open skies.', copy: 'A long, unhurried lunch. Aperitifs in the afternoon sun. Candlelight as the sky turns blue. Here, the best moments have a way of lasting a little longer.', note: 'APERITIFS & AL FRESCO DINING', image: media.courtyard },
  { number: '03', name: 'The Gardens', subtitle: 'Where your next chapter begins.', copy: 'Exchange your promises surrounded by green, with birdsong for company. Find a secluded corner for a quiet moment, then return to the people you love.', note: 'CEREMONIES & GOLDEN-HOUR GATHERINGS', image: media.garden },
];

// Split per letter for the staggered title reveal; screen readers get the plain heading text.
const heroWords = ['Maison', 'Vielle'];
const heroTitle = heroWords.flatMap((word, w) => {
  const offset = heroWords.slice(0, w).join('').length;
  const letters = [...word].map((char, i) => <span className="hero-char" key={i} style={{ '--i': offset + i } as CSSProperties}>{char}</span>);
  return [w > 0 ? ' ' : null, <span className="hero-word" key={word}>{letters}</span>];
});

/** Masked line reveal: each line slides up from its own mask when the nearest [data-reveal] becomes visible. */
const lines = (...content: ReactNode[]) => content.map((line, i) => <span className="reveal-line" key={i}><span style={{ '--l': i } as CSSProperties}>{line}</span></span>);

/** Words lit one by one as the cinematic break is scrolled; --i orders them across both lines. */
const scrubWords = (text: string, offset: number) => text.split(' ').flatMap((word, i) => [i > 0 ? ' ' : null, <span className="break-word" key={i} style={{ '--i': offset + i } as CSSProperties}>{word}</span>]);

export default function Home() {
  return <>
    <div className="intro-curtain" aria-hidden="true"><div className="curtain-panel curtain-back" /><div className="curtain-panel curtain-front"><div className="curtain-mark"><span>MV</span><span className="curtain-line" /></div></div></div>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation />
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-image parallax-frame" data-parallax="46"><ResponsiveImage asset={media.estate} mobileAsset={media.estateMobile} priority sizes="100vw" /><canvas className="hero-depth" aria-hidden="true" /></div>
        <div className="hero-grade" aria-hidden="true" />
        <div className="hero-rays" aria-hidden="true" />
        <HeroEffects />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-title-wrap">
          <p className="eyebrow hero-eyebrow">A PRIVATE ESTATE. AN UNFORGETTABLE BEGINNING.</p>
          <h1 id="hero-title"><span className="sr-only">Maison Vielle</span><span className="hero-letters" aria-hidden="true">{heroTitle}</span></h1>
        </div>
        <div className="hero-bottom">
          <div>
            <p className="eyebrow hero-rise" style={{ '--d': 0 } as CSSProperties}>WEDDINGS & CELEBRATIONS · PROVENCE</p>
            <h2><span className="hero-line"><span style={{ '--d': 1 } as CSSProperties}>A timeless setting</span></span><span className="hero-line"><span style={{ '--d': 2 } as CSSProperties}>for <em>beautiful beginnings.</em></span></span></h2>
          </div>
          <div className="hero-aside">
            <p className="hero-rise" style={{ '--d': 3 } as CSSProperties}>Yours for a moment.<br />Remembered for a lifetime.</p>
            <a href="#estate" className="hero-badge" aria-label="Step inside the estate">
              <svg viewBox="0 0 120 120" aria-hidden="true" className="badge-ring"><defs><path id="hero-ring-path" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" /></defs><text><textPath href="#hero-ring-path" textLength="292" lengthAdjust="spacing">STEP INSIDE · MAISON VIELLE · EST. 1892 ·</textPath></text></svg>
              <span className="badge-core" aria-hidden="true"><span className="badge-arrow" /></span>
            </a>
          </div>
        </div>
        <div className="hero-footnote"><span>43° 50′ N &nbsp; 5° 18′ E</span><span>THE ART OF COMING TOGETHER</span><span>EST. 1892</span></div>
      </section>

      <section className="introduction section-pad" id="estate" aria-labelledby="intro-title">
        <div className="section-label" data-reveal="fade-up"><span className="eyebrow">01 / THE MAISON</span><span className="tiny-mark" aria-hidden="true">MV</span></div>
        <div className="intro-statement" data-reveal="fade-up"><p className="eyebrow">SOME PLACES YOU VISIT. OTHERS YOU FEEL.</p><h2 id="intro-title">{lines('A house with a history.', <em>A home for your story.</em>)}</h2></div>
        <div className="intro-composition"><figure className="intro-portrait image-frame" data-reveal="image" data-parallax="25"><ResponsiveImage asset={media.architecture} sizes="(max-width: 767px) 84vw, 35vw" /><figcaption>Quiet corners. Endless possibilities.</figcaption></figure><div className="intro-copy" data-reveal="fade-up"><span className="serif-flourish" aria-hidden="true">M</span><p>Tucked away in the Provençal countryside, Maison Vielle is a place to slow down, settle in, and celebrate what matters.</p><p>Old-world character meets an easy, generous spirit. Sun-warmed stone, gardens that invite you to wander, and spaces made for gathering. For one beautiful weekend, it all belongs to you.</p><a className="text-link" href="#spaces">Explore the estate</a><div className="estate-facts" data-rule><div><strong>One estate.</strong><span>Exclusively yours</span></div><div><strong>A whole weekend.</strong><span>Beautifully unhurried</span></div></div></div></div>
      </section>

      <section className="spaces section-pad" id="spaces" aria-labelledby="spaces-title"><div className="section-heading" data-reveal="fade-up" data-rule><p className="eyebrow">02 / PLACES TO COME TOGETHER</p><h2 id="spaces-title">{lines('Different spaces.', <em>The same feeling.</em>)}</h2><p>From the first welcome to the last dance,<br />a setting for every part of your story.</p></div>
        <div className="space-list">{spaces.map(space => <article className="space" key={space.number}><div className="space-image image-frame" data-reveal="image" data-parallax="28"><ResponsiveImage asset={space.image} sizes="(max-width: 767px) 100vw, 58vw" /></div><div className="space-copy" data-reveal="fade-up"><span className="space-number">{space.number}</span><h3>{space.name}</h3><p className="space-subtitle">{space.subtitle}</p><p>{space.copy}</p><span className="eyebrow space-note">{space.note}</span><a className="text-link" href="#inquire">Imagine your celebration</a></div></article>)}</div>
      </section>

      <section className="cinematic-break" aria-labelledby="break-title" data-scrub>
        <div className="break-stage">
          <div className="break-frame"><div className="break-image"><ResponsiveImage asset={media.garden} sizes="100vw" /></div><div className="break-shade" /></div>
          <Petals />
          <div className="break-copy">
            <p className="eyebrow break-eyebrow">NOT JUST A DAY. A FEELING.</p>
            <h2 id="break-title" className="break-words">
              <span className="break-line">{scrubWords('Let the world wait.', 0)}</span>{' '}
              <em className="break-line">{scrubWords('This moment is yours.', 4)}</em>
            </h2>
            <div className="break-end"><EstateFilm /></div>
          </div>
          <div className="break-progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <section className="weddings section-pad" id="weddings" aria-labelledby="weddings-title"><div className="section-label" data-reveal="fade-up"><span className="eyebrow">03 / YOUR CELEBRATION</span><span className="eyebrow">THOUGHTFULLY PERSONAL. BEAUTIFULLY YOURS.</span></div><div className="wedding-heading" data-reveal="fade-up"><h2 id="weddings-title">{lines('More than a wedding.', <em>Your kind of wonderful.</em>)}</h2><p>A celebration should feel like the two of you. Intimate or exuberant, beautifully simple or a little unexpected. We make the space. You make it yours.</p></div><div className="wedding-pair"><figure className="wedding-main image-frame" data-reveal="image" data-parallax="24"><ResponsiveImage asset={media.table} sizes="(max-width: 767px) 80vw, 48vw" /></figure><div className="wedding-side"><figure className="image-frame" data-reveal="image" data-parallax="12"><ResponsiveImage asset={media.wedding} sizes="(max-width: 767px) 62vw, 30vw" /></figure><p data-reveal="rise">Good company. A beautifully laid table.<br />All the little things that mean everything.</p><a className="text-link" href="#inquire" data-reveal="rise">Begin your story</a></div></div><div className="experience-notes" data-reveal="fade-up" data-rule><div><span className="eyebrow">01 — ARRIVE</span><h3>Make yourself at home.</h3><p>A welcome dinner, a glass in the garden, a weekend waiting to unfold.</p></div><div><span className="eyebrow">02 — CELEBRATE</span><h3>Be here, completely.</h3><p>The promises, the people, the party. A day with your name written all over it.</p></div><div><span className="eyebrow">03 — LINGER</span><h3>Stay a little longer.</h3><p>A slow morning and one more coffee. No need to say goodbye just yet.</p></div></div></section>

      <section className="gallery-section section-pad" id="gallery" aria-labelledby="gallery-title"><div className="gallery-heading"><div data-reveal="fade-up"><p className="eyebrow">04 / THE MAISON, IN MOMENTS</p><h2 id="gallery-title">{lines(<>A feeling, <em>in frames.</em></>)}</h2></div><p data-reveal="rise">A glimpse of what could be.<br />The rest is yours to imagine.</p></div><Gallery /></section>

      <section className="quote-section section-pad" data-reveal="fade-up"><p className="eyebrow">THE THINGS THAT STAY WITH YOU</p><span className="quote-mark" aria-hidden="true">“</span><blockquote>{lines('Not a single moment felt rushed.', 'It was as if the whole house', <em>was celebrating with us.</em>)}</blockquote><p className="quote-credit">CHARLOTTE & JAMES <span>— A SEPTEMBER CELEBRATION</span></p></section>

      <section className="inquiry-section" id="inquire" aria-labelledby="inquiry-title"><div className="inquiry-image image-frame" data-parallax="22" data-reveal="image"><ResponsiveImage asset={media.estate} sizes="(max-width: 767px) 100vw, 50vw" /></div><div className="inquiry-copy" data-reveal="fade-up"><p className="eyebrow">EVERY GOOD STORY STARTS WITH HELLO.</p><h2 id="inquiry-title">{lines('Shall we make', <em>something beautiful?</em>)}</h2><p>Tell us a little about the day you’re dreaming of. We’d love to help you imagine it here.</p><Inquiry /><span className="inquiry-small">Weddings, intimate gatherings & beautiful beginnings.</span></div></section>
    </main>
    <footer className="footer"><div className="footer-top" data-reveal="fade-up"><a className="footer-monogram" href="#main" aria-label="Maison Vielle, back to top">MV</a><p>A private estate.<br />A place to belong.</p><nav aria-label="Footer navigation"><a href="#estate">The estate</a><a href="#weddings">Weddings</a><a href="#gallery">Gallery</a><a href="#inquire">Inquire</a></nav><p>PROVENCE, FRANCE<br /><span>By appointment, always with pleasure.</span></p></div><a href="#main" className="footer-wordmark" aria-label="Maison Vielle, back to top" data-reveal="lines">{lines('Maison Vielle')}</a><div className="footer-bottom"><span>© {new Date().getFullYear()} Maison Vielle</span><span>MADE FOR THE MOMENTS THAT MATTER.</span><a href="#main">Back to the beginning</a></div></footer>
    <Motion />
  </>;
}
