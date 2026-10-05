# Motion system

Layered depth, cinematic transitions and scroll storytelling follow the studio's architectural language: planes assemble, openings reveal images, and typography moves on clear axes. Native CSS, IntersectionObserver and requestAnimationFrame provide these effects without an animation library or scroll interception.

| Motion | Behavior |
| --- | --- |
| Homepage entrance | Wait for the two initial images (with a 1.5s fallback). Main media settles from 1.48× scale over 1.15s; the detail begins 280ms later from 1.75× scale. Headline masks open after the images settle, at 1.38s and 1.5s. The complete sequence lasts 2.2s. |
| Hero depth | Fine pointers move the main plane up to 30px horizontally and 24px vertically, with 3°/4° perspective tilt. The detail moves 1.35× in the opposing direction; the headline counters gently. Damped frames stop once settled. Scrolling separates the layers vertically, with smaller travel on mobile. |
| Featured slideshow | After the entrance, advance every 5.5s. Keep outgoing media beneath incoming masks for 1.25s: the main frame wipes horizontally, the detail vertically. Preload only the next primary image after the entrance. A progress line shows the current interval. |
| Slideshow controls | Manual slide selection or keyboard focus pauses until explicitly resumed. The pause/resume control is always available when motion is enabled. Hovering controls, hidden tabs and leaving the viewport suspend the timer; resuming starts a fresh interval. |
| Inner-page entry | A short wordmark curtain on initial entry; 550ms route masks thereafter, canceled on subsequent navigation. Native view transitions enhance navigation where supported. The homepage owns its image-first entrance and has no covering curtain. |
| Scroll reveals | One observer reveals headings line by line, image windows with scale/perspective, and captions, service rows and rules with staggered vertical movement. Reveals run once per element. Targets are registered again after route/filter changes. |
| Scroll depth | One scheduled scroll frame adjusts capped image travel (35px), parallax (60px), and opposing typography travel (45px). Mobile/tablet amplitudes are reduced. No React render runs on each parallax frame. |
| Philosophy | A framed, enlarged film composition expands to the full section width as it enters the viewport. The local silent loop loads nearby and has its own pause control. |
| Work gallery | A pinned desktop composition translates with vertical scrolling. Under 1000px it becomes a native swipe gallery. Controls support both modes. |
| Process | Scroll advances four stages; explicit selection takes control. Observe retains a survey frame; Define establishes an axis. Shape assembles floor, wall and roof planes. Realize builds solid walls, then reveals a window and furnishings. Tabs support arrow keys, Home and End. |
| Sound | Compressed navigation tick at 12% volume, off on every load. Audio is created only after opt-in; playback rejection returns to off. |

`src/constants/motion.ts` holds entrance, slide hold and transition durations. Matching CSS durations live in `src/ui/styles/motion.css`. Keep these synchronized when changing the choreography. Separate media containers let entrance, pointer depth, scroll movement and slide transitions compose without restarting one another.

Reduced motion is observed live: final content appears immediately; automatic rotation, depth, entrances, scroll transforms and film stop. The desktop gallery becomes a native horizontal scroller. Manual slide and process controls remain available. Content also stays readable without JavaScript.

Native scrolling is retained. CSS smooth behavior applies only to deliberate anchor/control movement; wheel and touch gestures are not intercepted.
