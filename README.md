# rahulc.xyz

Personal landing page — a "phosphor terminal" themed, scroll-driven showcase.

- **Stack**: Vite + React 19 + TypeScript, GSAP (ScrollTrigger, SplitText, MotionPath), Three.js via react-three-fiber
- **Hero**: WebGL orbital system — 6 cloud-provider nodes orbiting a unified core; contracts as you scroll
- **Sections**: pinned scroll stories (multi-cloud convergence, NestJS→Go rewrite), reveal sections (Web3, zero-to-one)
- **Graceful degradation**: static SVG fallback without WebGL, full content with `prefers-reduced-motion`

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build && npm run preview
```

All copy lives in `src/content.ts`.
