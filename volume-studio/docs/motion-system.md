# Motion system

Native CSS, IntersectionObserver, requestAnimationFrame and the Web Animations API keep motion small and maintainable. No GSAP, Lenis, WebGL or 3D dependency is needed for this design.

| Motion | Behavior |
| --- | --- |
| Intro | A line and wordmark clear upward in roughly 1.1 seconds; pointer events are never blocked. |
| Hero | Masked image and staggered title entrance; fine pointers shift image layers by at most 4px. Featured slides change only on request. |
| Route entry | 550ms mask/vertical reveal, with cancellation on subsequent navigation. Native document view transitions enhance cross-document navigation where supported. |
| Scroll reveals | One observer reveals selected headings and images once. Content is visible without JavaScript. |
| Parallax | One passive scroll listener schedules one frame; shifts are capped at 40px. No React renders on parallax scroll. |
| Work gallery | One pinned desktop composition translates with vertical scroll. Under 1000px it becomes a native swipe gallery. Controls support both modes. |
| Process | Scroll progresses through four stages. Explicit selection takes control; tabs support arrow keys, Home and End. |
| Film | Five-second silent local loop, loaded only near the viewport. Pauses offscreen and through its visible control. |
| Sound | A compressed navigation tick at 12% volume. Off on every load; Audio is created only after opt-in. Playback rejection returns to off. |

Reduced motion is observed live. It disables the intro, route reveals, pointer depth, parallax, smooth scrolling and film. The desktop gallery becomes a native horizontal scroller. Tab controls and content remain available.

Native scrolling is retained. CSS smooth behavior applies to deliberate anchor/control movement; wheel and touch gestures are not intercepted.
