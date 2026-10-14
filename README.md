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
components/threeui/   vendored ThreeUI Get Started button (unmodified)
components/avatar/    avatar mascot (themed Strobi) and its lazy loader
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

## ThreeUI Get Started button

The hero "Start a project" control is ThreeUI's `GetStartedButton`. Its three
registered files live unmodified in `components/threeui/` (SHA-256 identical to
the published bundle at `threeui.com/source-code/get-started-button.json`).
Everything this project changes is in two strict build-time loaders, so an
upstream update that moves any adapted token fails the build instead of
silently shipping:

- `lib/threeui-source-loader.js`: transparent background, "START" label, the
  frame size contract, and a click bridge (the button runs in a sandboxed
  iframe that cannot navigate the page).
- `lib/threeui-css-loader.js`: drops one `@font-face` for a font file the
  bundle does not ship.
- `components/staglabs/hero-start-button.tsx` receives the click and routes to
  `/about`, accepting messages only from its own iframe.

Limits: the embedded Geist Mono subset contains A-Z only, so the label is
"START" rather than "Start a project" (15 characters would not fit anyway). The
button needs WebGL 2 and JavaScript. Without JavaScript a plain link is shown.

## Avatar mascot

A small fixed companion ("Strobi") from `@bible-strong/avatar-react`, pinned to
exactly `0.1.0`. Installed with `--ignore-scripts` after reading both tarballs:
no install scripts, no network, `eval` or `process` access in the shipped code,
and the installed files are identical to the audited ones.

- `components/avatar/strobi.avatar.json`: the sample definition from the
  package author's repo, unmodified.
- `lib/avatar-theme.ts`: recolours a definition. It writes colour fields only,
  so geometry, expressions and timings are the author's. The palette is chrome
  grey, picked by rendering four monochrome candidates on white, ink and grey.
- `components/avatar/mascot.tsx`: the section in the middle of the viewport sets
  the animation through a `data-mood` attribute on that section (hero idle,
  work curious, method working, quality proud, outcomes excited, FAQ thinking,
  quote happy, CTA celebrate, footer sleeping). Hover is surprised and a click
  laughs for a few seconds.
- `components/avatar/mascot-loader.tsx`: the library validates its JSON in the
  browser with a full schema validator (about 190 KB). It is loaded on the
  visitor's first scroll, pointer move, touch or key press, or 6 seconds after
  load, so it never competes with the page. Measured against the build without
  it, the deferred version matches on Lighthouse performance and blocking time.
- Below 1024px it is click-through, because it otherwise covers FAQ rows.
- It is `aria-hidden` and has no keyboard action: it is decoration.

**Licence:** the avatar packages are `AGPL-3.0-only`. Confirm that is acceptable
for this site before shipping it publicly.

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
