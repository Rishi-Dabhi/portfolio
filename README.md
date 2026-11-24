# Portfolio — Rishi Dabhi

Personal portfolio built with Next.js, React, TypeScript, and Tailwind CSS. An observatory-inspired editorial design with engraved celestial artwork, warm ivory typography, and individually illustrated projects.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npx tsc --noEmit
npm run build
```

Inter and Cormorant Garamond are bundled in `app/fonts/` and loaded through `next/font/local`. Builds do not fetch Google Fonts. Font sources and licenses are included alongside the files.

## Content

- `app/page.tsx`: introduction, current Sage role, skills, education, and contact links.
- `components/portfolio-data.ts`: project archive and previous experience.
- `app/layout.tsx`: page title and search description.
- `app/globals.css`: responsive layout, project illustrations, and visual styles.
- `components/StarryBackground.tsx`: a decorative vector star atlas and sparse ambient stars. The constellations are illustrative arrangements rather than an astronomical sky map.
- `components/Moon.tsx`: a WebGL-rendered lunar sphere with a 4K NASA color map and elevation relief. It renders at up to 3× pixel density (1536px cap), with anisotropic texture filtering where supported. Its surface rotates once every 90 seconds beneath fixed lighting. Scrolling shrinks the full Moon into a crescent and docks it in the chart; scrolling back reverses the transition. Rendering is capped at 30fps and rotation pauses offscreen or in hidden tabs. A textured fallback also rotates if WebGL is unavailable. Reduced-motion users see a stationary, docked crescent without the transition.
- `components/Galaxy.tsx`: displays a local transparent SVG galaxy between the introduction and projects. The spiral rotates once every 90 seconds while retaining its tilted viewing angle. Motion pauses offscreen and respects reduced-motion preferences. It does not create a live canvas or depend on browser canvas support.
- `public/galaxy/spiral.svg`: the generated galaxy artwork. Regenerate its seeded stars, dust lanes, and nucleus with `node scripts/generate-galaxy.mjs`.
- `public/moon/`: locally served lunar textures and [NASA source credits](public/moon/CREDITS.md).

The project illustrations are stylized artwork rather than application screenshots. All twelve projects are available through the expandable project archive.
