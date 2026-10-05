# Follow-up

Fix the browser check "expertise text stays revealed through hover, expansion and returning to the section" (`tests/motion.spec.ts`). On `/services`, the hovered row's hidden title layer stays at `translateY(35.3px)` instead of 0. It already failed before 0.3.0, so it is not caused by the header entrance.

No other required local implementation work remains after the recorded checks.

For a real launch: replace fictional content and `.example` contact/domain settings; supply verified social profile URLs; optionally connect a server-side delivery provider; test Safari/Firefox and physical devices; deploy only to the requested destination and verify real HTTP status/caching behavior.
