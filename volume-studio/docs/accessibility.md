# Accessibility

Semantic landmarks and a single page H1 establish the document structure. A skip link moves to the focusable main region. Route navigation resets position and moves focus to main. All meaningful photographs have alt text; duplicate decorative imagery and arrow graphics are hidden from assistive technology.

The mobile menu is a native modal dialog: browser focus trap, Escape dismissal, background inertness, close control, focus restoration and body scroll lock. It closes on route changes and when resized to desktop.

Services use buttons with `aria-expanded` and associated hidden details. Process tabs support Left/Right, Home/End and roving tabindex. Filter and sound buttons expose pressed state. Gallery arrows are named. The featured slideshow starts after its entrance and has a visible pause/resume button. Manual selection and keyboard focus pause it until explicitly resumed; hovering its controls, hidden tabs and leaving the viewport suspend its timer. Automatic changes are not announced through a live region. Reduced motion disables automatic rotation while preserving manual selection.

The inquiry form has persistent labels, required states, inline errors connected by `aria-describedby`, `aria-invalid`, first-error focus and a focused success announcement. Nothing is transmitted; the outcome explicitly says so.

A live `prefers-reduced-motion` subscription disables motion while preserving content and controls. Sound always begins off and requires explicit interaction. The decorative film is silent, can be paused, and does not mount under reduced motion.

Bone-section labels and large secondary typography were adjusted following automated contrast findings. Automated axe checks support, but do not replace, manual assistive-technology review. Editorial micro-labels are small; browser zoom/reflow and clear hierarchy retain usability. Core mobile form inputs are 16px.
