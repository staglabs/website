# Staglabs

Marketing site for Staglabs, a software agency built for short runways.
Editorial, monochrome, motion-led. Next.js 15 (App Router), React 19,
Tailwind v4, Framer Motion, Lenis smooth scroll.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page: hero, work, method, quality, quote, outcomes, FAQ, CTA |
| `/about` | Studio principles and team |
| `/about/chirag`, `/about/ishan` | Founder profiles |
| `/robots.txt`, `/sitemap.xml` | Generated from `lib/site.ts` |
| `/opengraph-image`, `/icon.png` | Social card and favicon |

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Structure

```
app/                  routes, layout, global CSS, staglabs.css (design system)
components/staglabs/  one component per section, plus primitives and icons
lib/site.ts           canonical URL, site name, sitemap routes
public/img/           cover imagery (AVIF), sky-night hero cover
DESIGN.md             design system: tokens, type scale, motion, section order
```

See [DESIGN.md](./DESIGN.md) before changing visuals.

## Configuration

`NEXT_PUBLIC_SITE_URL` sets the canonical origin used for metadata, the
sitemap, robots and JSON-LD. Set it at **build time** once the production
domain is live. It defaults to the current sslip.io deployment.

## Conventions

- Icons are inline SVG (`components/staglabs/icons.tsx`). Do not use text
  glyphs such as arrows or check marks, they render as boxes without a
  symbol font.
- Respect `prefers-reduced-motion`. Content must never depend on an animation
  running.
- Copy stays Staglabs' own. No invented client metrics or timelines.

## Notes

- **Linting:** `npm run lint` runs ESLint with the Next.js core-web-vitals and
  TypeScript rules (`eslint.config.mjs`). It currently passes with no warnings.
- **Environment:** the only variable read is the optional
  `NEXT_PUBLIC_SITE_URL`. `.env*` files are gitignored.
- **Private and unlicensed.** `package.json` sets `"private": true` and there
  is no `LICENSE` file.

## Deployment

Currently served from a single host behind Caddy:

- systemd unit `staglabs-website` runs `next start` on port 3002 and restarts
  on failure.
- Rebuild and restart with `redeploy.sh` (kept alongside the repo).
