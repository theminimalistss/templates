# Design system

The identity uses scale, rectangular media, thin rules, strong alignment and asymmetry. Photography supplies warmth. Rounded cards, ornamental shadows and decorative gradients are excluded; the hero has only faint grid lines.

- Canvas: `#111111`, `#171717`, `#20201f`.
- Bone surface and primary text: `#e7e0d4`.
- Dark-surface metadata: `#aaa69e`; bone-surface labels: `#625d55`.
- Display: self-hosted Archivo variable, mostly weight 500, tight tracking, uppercase.
- Body: self-hosted Manrope variable. Metadata is deliberately compact; essential form controls remain 16px.
- Gutters: 4.5vw desktop, 6vw small screens. Section spacing ranges from 65px mobile to 150px large desktop.
- Borders are generally one-pixel rules. Focus uses a visible two-pixel outline; form fields strengthen their underline.

Homepage sequence: layered hero → bone manifesto → asymmetric work → one horizontal gallery → service rows → full-screen film → bone process → journal → oversized contact invitation.

Responsive layouts change at 550, 800, 1000, 1100 and 1700px. Mobile stacks typography, turns the gallery into a swipe sequence, replaces service hover previews with expandable rows, and uses a native fullscreen dialog menu. See `src/ui/styles/index.css` for the complete token and composition rules.
