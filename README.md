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

The build downloads Inter and Cormorant Garamond through `next/font/google` and requires access to Google Fonts.

## Content

- `app/page.tsx`: introduction, current Sage role, skills, education, and contact links.
- `components/portfolio-data.ts`: project archive and previous experience.
- `app/layout.tsx`: page title and search description.
- `app/globals.css`: responsive layout, project illustrations, and visual styles.
- `components/StarryBackground.tsx`: a decorative vector star atlas and sparse ambient stars. The constellations are illustrative arrangements rather than an astronomical sky map.
- `components/Moon.tsx`: a WebGL-rendered lunar sphere with NASA color/elevation maps. Scrolling shrinks the full Moon into a crescent and docks it in the chart; scrolling back reverses the transition. The renderer draws on demand and uses a textured fallback if WebGL is unavailable. Reduced-motion users see the docked crescent without the transition.
- `components/Galaxy.tsx`: displays a local transparent SVG galaxy between the introduction and projects. The spiral rotates once every 90 seconds while retaining its tilted viewing angle. Motion pauses offscreen and respects reduced-motion preferences. It does not create a live canvas or depend on browser canvas support.
- `public/galaxy/spiral.svg`: the generated galaxy artwork. Regenerate its seeded stars, dust lanes, and nucleus with `node scripts/generate-galaxy.mjs`.
- `public/moon/`: locally served lunar textures and [NASA source credits](public/moon/CREDITS.md).

The project illustrations are stylized artwork rather than application screenshots. All twelve projects are available through the expandable project archive.
