# Templates

Website templates by The Minimalist. Each folder is a complete, self-contained site with its own dependencies, scripts and documentation.

## Templates

| Template | Version | What it is | Stack |
|---|---|---|---|
| [Maison Vielle](maison-vielle/) | 0.2.0 | Editorial luxury wedding-estate site with a spatial WebGL hero, pinned cinematic scroll section, living gallery and inquiry brief builder. | React 19, TypeScript, Vinext/Vite, Tailwind CSS 4 |
| [VOLUME Studio](volume-studio/) | 0.3.0 | Brutalist interior-architecture portfolio with cinematic media, layered typography, visual case studies, a horizontal gallery and a validated project brief. | React 19, TypeScript, Vite, React Router |

## Working on a template

Every template is installed and run from its own folder. There is no shared root package.

```sh
cd maison-vielle
npm ci
npm run dev
```

Each template's README lists its requirements, scripts and customization points.

## Conventions

Every template follows the same layout so the next person, or the next AI assistant, can pick it up quickly:

- **`VERSION`:** the template's current version, mirrored in its `package.json` and `package-lock.json`. Bump all three together.
- **`README.md`:** what the template is, how to run it, and what to replace before real-world use.
- **`docs/`:** architecture, media sources and licensing, and what was verified for the current version.
- **`.agent/`:** dated change notes for AI-assisted work, one per version, with follow-ups for whoever comes next.

The root `.gitignore` covers dependencies, build output, caches, env files and editor files for every template. Put rules that only apply to one template in that template's own `.gitignore`.

## Adding a template

1. Create a new top-level folder named after the template, in kebab-case.
2. Give it its own `package.json`, `README.md`, `VERSION`, `docs/` and `.agent/README.md`, following the conventions above.
3. Add a row to the table in this README.

## Content and licensing

Templates ship with fictional sample content and licensed stock media. Replace demonstration copy, venue or brand claims, and placeholder flows with real content before using a template for an actual business. Stock media and fonts keep their own licenses; see each template's `docs/media-sources.md`.
