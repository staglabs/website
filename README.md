# Staglabs

Staglabs is a software agency built for short runways: production software in
tight, visible increments, without skipping the parts that keep it standing.
This repository is the Staglabs marketing site — a Next.js 15 App Router app
built with React 19, TypeScript, and Tailwind CSS 4. The landing page walks
through proof, method, quality, outcomes, FAQ, and starting a project.

## Tech Stack

-   **Framework:** Next.js 15 (App Router) with React 19.
-   **Language:** TypeScript 5.
-   **Styling:** Tailwind CSS 4 via `@tailwindcss/postcss`, with design tokens
    in `app/globals.css`.
-   **Fonts and helpers:** `next/font` (Archivo, JetBrains Mono), plus `clsx`
    and `tailwind-merge` in `lib/utils.ts`.

## Project Structure

```
staglabs/
    app/                        # App Router routes, root layout, global styles
        page.tsx                # Landing page composition
        layout.tsx              # Fonts, metadata, header and footer
        globals.css             # Tailwind entry point and design tokens
        about/                  # About pages (index, Chirag, Ishan)
        opengraph-image.tsx     # Generated social share image
        icon.svg                # Favicon
    components/                 # site-header.tsx, site-footer.tsx
    lib/                        # utils.ts class-name helper
    public/                     # Static assets
    DESIGN.md                   # Design direction and divergence constraints
    next.config.ts              # Next.js configuration
    postcss.config.mjs          # Tailwind CSS 4 PostCSS plugin
    package.json                # Metadata and scripts
    tsconfig.json               # TypeScript configuration
```

`app/page.tsx` composes the landing page from six sections, in order: `proof`,
`method`, `quality`, `outcomes`, `faq`, and `start`.

Note that `package.json` also declares motion, 3D, and icon packages that the
current pages do not import yet.

## Getting Started

Node.js and npm are required. No Node version is pinned in this repository —
there is no `.nvmrc`, `.node-version`, or `engines` field.

### Install

1. Clone the repository and enter it.

    ```bash
    git clone <repository-url> staglabs
    cd staglabs
    ```

2. Install dependencies. `package-lock.json` is committed, so use `npm ci` for
   a clean install:

    ```bash
    npm ci
    ```

    `npm install` also works, but may update the lockfile.

### Run

```bash
npm run dev      # development server on http://localhost:3000
npm run build    # create the production build
npm run start    # serve the production build
```

## Scripts

| Script  | Command                | Description                                     |
| ------- | ---------------------- | ----------------------------------------------- |
| `dev`   | `next dev --turbopack` | Start the development server with Turbopack.    |
| `build` | `next build`           | Create the optimized production build.          |
| `start` | `next start`           | Serve the production build.                     |
| `lint`  | `next lint`            | Lint the project — not runnable yet; see Notes. |

## Notes

-   **Linting is not wired up.** There is no ESLint config file (`.eslintrc*`
    or `eslint.config.*`) and no `eslint` dependency, so `npm run lint` prompts
    interactively for a config and cannot run non-interactively. Set up ESLint
    before relying on it in CI.
-   **No environment variables are required.** The application reads no
    `process.env` values, and `.env*` files are gitignored.
-   **Design constraints live in `DESIGN.md`.** It documents the monochrome
    palette and the divergence constraints for this site: a reference for craft
    and pacing, not a layout to reproduce.
-   **Private and unlicensed.** `package.json` sets `"private": true` and the
    repository has no `LICENSE` file.
