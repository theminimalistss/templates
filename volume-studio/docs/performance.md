# Performance

The initial runtime has only React, React DOM and React Router. Pages are split at route boundaries; shared visual components are factored into small chunks. The initial application bundle is approximately 86KB gzip before route-specific code. The homepage route adds approximately 4.3KB gzip, and the stylesheet is approximately 11KB gzip.

All nine photographs have five responsive widths and two codecs. The complete image library is approximately 5MB on disk; a visit selects only the applicable size/codec. Video, audio and fonts bring total local media to approximately 6MB. The film is not requested until its section approaches the viewport, and audio is not requested until opt-in.

Build-time rendering exposes content and SEO metadata before JavaScript. Intrinsic image dimensions and fixed media frames reserve geometry. Font swap uses neutral sans-serif fallbacks. All font and image requests are same-origin.

Scroll motion uses one scheduled animation frame, bounded transforms and a one-time reveal observer. Mobile does not run pointer depth or pinned horizontal motion. The hero preloads only its next primary image after the entrance, and automatic slide timers suspend offscreen or in hidden tabs. Pointer damping stops scheduling frames once its target is reached. No WebGL, analytics, third-party embeds or external font CSS is included.

Lighthouse targets: performance ≥90, accessibility ≥95, best practices ≥95, SEO ≥95. Local results and test conditions are recorded in `verification.md`; field Core Web Vitals and deployed caching cannot be inferred from local audits.
