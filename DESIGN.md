# DESIGN.md

> Staglabs landing page design system. The layout, typography, spacing, colour,
> and motion language follow the Agent Integrator reference build. The **copy is
> Staglabs' own** — the reference is a design source, not a content source.

## Direction

- Editorial agency landing page: white page, large photographic cover bands,
  floating white nav pill, numbered section rhythm (`01 ·`, `02 ·`, …).
- Display type is a condensed serif; body and utility type are Roboto / Roboto Mono.
- Accent blue is used for utility marks only: the star in eyebrow pills, `FIG.`
  labels, check circles, status chips, and the CTA arrow chip. Everything else is
  black, white, and neutral grey.
- Proof is operational: figure panels, console read-outs, and status chips rather
  than decorative cards.

## Where it lives

| File | Role |
| --- | --- |
| `app/staglabs.css` | The whole landing design system, scoped under `.ca-page` |
| `app/layout.tsx` | Loads Archivo/JetBrains Mono (site) and Roboto/Roboto Mono (`--font-roboto-ca`, `--font-robotomono-ca`) |
| `app/page.tsx` | Composes the page inside `.ca-page` |
| `components/staglabs/*` | One component per section |
| `public/img/*.avif` | Cover-band imagery: `hero-bg`, `sky-night`, `bookend-sky` |
| `public/fonts/catalis/*.woff2` | Libre Caslon Condensed (regular + italic) |

`app/globals.css` keeps the monochrome tokens used by the site header, footer,
and the `/about` routes. It deliberately does not overlap with `staglabs.css`.

## Tokens

Declared on `.ca-page`:

- `--ca-blue: #2c7fd6` — utility accent
- `--ca-blue-grad: linear-gradient(180deg,#63a9ea,#3b8adf 48%,#2472c8)` — CTA hover fill and arrow chips
- `--ca-ink: #131313`, `--ca-sub: #4c4c4c`, `--ca-btn: #1d1d1d`
- `--ca-smoke: #f5f5f5` (cards), `--ca-table: #f3f3f3`, `--ca-hairline: #efeff2`
- `--ca-badge-border: #00000014`
- Radii: `--ca-r-lg: 2rem`, `--ca-r-md: 1.5rem`, `--ca-r-sm: .5rem`
- Easing: `--ca-ease-out: cubic-bezier(.215,.61,.355,1)`

## Type scale

`.ca-h1`/`.ca-stat` 4.5rem → 4 → 3.25 → 3rem across breakpoints. `.ca-h2` 4rem.
`.ca-h3` 3.5rem. `.ca-h4` 3rem. `.ca-h5` 2.5rem. `.ca-h6` 2rem. `.ca-label` is the
uppercase 0.75rem / 500 utility face. `.ca-body-lg` is 1.125rem.

Display headings step down at 991px, 767px, and 479px.

## Layout

- `.ca-cm` 67.5rem, `.ca-cl` 86.5rem, `.ca-cx` 93.5rem — all with 3.25rem inline
  padding, 1.75rem below 768px, 1.25rem below 480px.
- `.ca-sec` is 6rem block padding, 4.5rem below 768px.
- `.ca-anchor` gives 6.5rem scroll margin for the fixed nav.
- `.ca-pc` / `.ca-pc__inner` build the rounded full-bleed cover bands; `data-band`
  selects the gradient fallback (`day` / `dusk` / `night`) and `data-tone="dark"`
  flips the text colour.

## Components

`ca-acta` (pill CTA with sliding gradient and arrow chip), `ca-pill` (eyebrow, with
a blue star), `ca-card`, `ca-chip`, `ca-icircle`, `ca-check`, `ca-dot--pulse`,
`ca-console` (the white activity read-out), `ca-status--amber|blue|green`,
`ca-faq` (accordion), `ca-nav` (floating pill with corner cut-outs), `ca-menu`
(mobile overlay), `ca-ilink`, `ca-flink`, `ca-wordmark`.

## Motion

- Display headings reveal word by word via `.ca-word` + `ca-word-up`.
- `ca-figbar` grows figure bars from the left.
- CTA hover slides a gradient panel in and shifts the label and chip.
- FAQ opens by animating `grid-template-rows` 0fr → 1fr; the icon rotates 45°.
- Everything is disabled under `prefers-reduced-motion: reduce`, and content is
  never hidden by an animation that fails to run.

## Section order

1. Hero — full-bleed cover, `#top`
2. `01 · Method` — five alternating steps, each with a `FIG.` panel, `#method`
3. `02 · Proof` — four stat cards, `#proof`
4. `03 · Quality` — four gate cards with console panels, `#quality`
5. Quote band — night cover
6. `04 · Outcomes` — two-column split, `#outcomes`
7. `05 · FAQ` — accordion, `#faq`
8. CTA band — day cover with tilted glass feeds
9. Footer with the oversized `STAGLABS` wordmark

## Content rules

- Copy stays Staglabs' own: software agency, short runways, the five-checkpoint
  lane. The reference's AI-agents copy is **not** used.
- There is no public email address. Every CTA points at `/about`.
- No invented client metrics or guaranteed delivery timelines.
