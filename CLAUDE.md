# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (pinned via `packageManager` in `package.json`; currently `pnpm@10.33.0`). Enable with `corepack enable` once per machine. Node version is pinned by `.node-version` (20.20.2).

```bash
pnpm install          # install dependencies (use --frozen-lockfile in CI)
pnpm dev              # start Next.js dev server
pnpm build            # production build (used by Vercel and CI)
pnpm start            # serve the built app
pnpm lint             # next lint (ESLint + Prettier via eslint-plugin-prettier)
pnpm test             # jest (jsdom environment)
pnpm test path/to/file.spec.ts          # single file
pnpm test -t "name of test"             # by test name
```

CI (`.github/workflows/ci.yml`) runs `lint`, `test`, and `build` in parallel on PRs to `main`. Deploys are handled by Vercel (`vercel.json`) — previews on PRs, production on merge to `main`. Vercel uses `pnpm install --frozen-lockfile` and `pnpm build` explicitly.

## Environment variables

All are `NEXT_PUBLIC_*` because this is a client-heavy Pages Router app. `src/config/environment.ts` reads them and `warnIfMissing` logs a warning at import time for each.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_ENVIRONMENT` | `local` / `test` / `production` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID |
| `NEXT_PUBLIC_QIITA_TOKEN` | Qiita API token for article aggregation |

Copy `.env.sample` to `.env` for local work. Tests inject dummy values via `spec/setupTest.ts` (registered as `globalSetup` in `jest.config.mjs`).

## Architecture

### Next.js Pages Router

Routing lives in `src/pages/` (classic Pages Router, not App Router). `_app.tsx` is intentionally minimal: it loads `globals.css`, wraps the tree in `BaseLayout`, and wires GA pageview tracking on `routeChangeComplete`. There is no `ChakraProvider` or other framework wrapper. Page files are thin — they call `getStaticProps`, fetch data, and delegate rendering to a `*.page.tsx` component inside the relevant feature folder (`src/pages/index.tsx` → `src/features/home/Home.page.tsx`, `src/pages/articles/index.tsx` → `src/features/article/ArticleList.page.tsx`, `src/pages/brand.tsx` → `src/features/brand/Brand.page.tsx`).

### Feature-based layout under `src/features/<feature>/`

Each feature (`article`, `brand`, `home`, `service`, `works`) owns its `apis/`, `components/`, `types/`, and optionally `data/`, `hooks/`, `functions/`. The top-level `*.page.tsx` inside a feature folder is the page-level component rendered by the matching file in `src/pages/`.

Shared building blocks live outside features:

- `src/components/layouts/` — page chrome (`BaseLayout`, `Header`, `Footer`, `Seo`). `BaseLayout` is the only thing `_app.tsx` knows about; everything else gets pulled in transitively.
- `src/components/parts/` — hand-written Tailwind primitives (`Button`, `Container`, `Eyebrow`, `GridOverlay`, `Link`, `Orb`). All are exported through `src/components/parts/index.ts`. There is no shadcn/ui layer — see `openspec/changes/archive/2026-04-22-platform-migration-pnpm-tailwind-shadcn/design.md` Decision 5 for why.
- `src/libs/` — pure utilities (`date.ts`, `gtag.ts`, `text.ts`, `cn.ts`). Co-located tests like `date.spec.ts` live here. `cn.ts` exposes the `cn(...)` helper (`twMerge(clsx(inputs))`) used when composing Tailwind classes.
- `src/config/` — `environment.ts` (env vars) and `constants.ts` (URLs, page titles, social links).
- `src/styles/globals.css` — Tailwind directives + `brand/tokens.css` import + Twilight Blade-specific keyframes and `tb-*` utility classes (used by `Orb`, `Eyebrow`, `GridOverlay`, gradient period). Loaded once at the top of `src/pages/_app.tsx`.
- `src/types/global.d.ts` — cross-feature type augmentations.

Path alias `@/*` → `src/*` is configured in `tsconfig.json`. Both `@/...` and relative imports appear in the codebase; match whichever style the surrounding file uses.

### Brand SSoT under `brand/` (root)

`brand/` is a separate top-level directory consumed by both build and runtime:

- `brand/tokens.css` — single source of truth for `--color-brand-*` and `--font-brand-*` CSS variables. Imported by `src/styles/globals.css`; Tailwind references the variables via `theme.extend` in `tailwind.config.ts`.
- `brand/tokens.ts` — typed mirror of `tokens.css`. Consumed by `src/features/brand/components/BrandTokens` to render swatches programmatically. `brand/tokens.spec.ts` enforces value sync between `.css`, `.ts`, and `brand.md` — a test will fail if any drift.
- `brand/brand.md` — AI-paste / URL-fetch friendly Twilight Blade spec (philosophy, tokens, DO / DO NOT, references). Distributed via `https://cdn.jsdelivr.net/gh/tokku5552/portfolio/brand/brand.md`. Single source of truth for AI rule consumption.
- `brand/source/twilight-blade-v1/` — original Claude Design handoff bundle (Hero.html). Read-only historical reference; not part of any active deliverable.

There is no `public/brand-assets/` mirror. The `/brand` page's ASSETS section links third parties to GitHub raw / jsdelivr CDN URLs directly.

### Article aggregation

`src/features/article/apis/article.ts` merges four sources — Zenn (`zenn.ts`), Qiita (`qiita.ts`, uses `NEXT_PUBLIC_QIITA_TOKEN`), note.com (`note.ts`, RSS-based with on-page OGP scraping), and hand-curated entries in `data/static-data.ts` — then sorts by `publishedAt` desc. Add permanent items to `static-data.ts`; the external sources populate automatically.

## Conventions

- **Styling**: Tailwind CSS v3 is the only utility layer. Brand tokens come from `brand/tokens.css` via `var(--color-brand-*)`. Compose Tailwind classes with `cn()` from `src/libs/cn.ts`. Do not introduce a second styling system (Chakra UI, Emotion, Framer Motion, styled-components, vanilla-extract, etc.); they were all removed in TOK-83 and the dependency surface should stay minimal.
- **Animation**: CSS `@keyframes` declared in `src/styles/globals.css` (`orb-float`, `eyebrow-pulse`) plus Tailwind's `transition-*` / `animate-*` utilities. There is no JS animation library.
- **Tests**: Jest + `@testing-library/react` in a jsdom environment. Spec files live next to the code they test (`*.spec.ts` / `*.spec.tsx`). `spec/setupTest.ts` provides env stubs as `globalSetup`; `spec/jestPolyfills.ts` provides `setupFiles` polyfills (e.g. for `note.ts` parsing). No project-wide RTL setup file — match neighbor specs (e.g. `Eyebrow.spec.tsx`) when writing new ones; `toBeInTheDocument` from `@testing-library/jest-dom` is **not** wired up, so prefer `expect(el).not.toBeNull()` / DOM querying over jest-dom matchers.
- **Prettier** config (`.prettierrc`): single quotes, 2-space tabs, trailing commas `es5`, always-parens for arrow params. Enforced via `eslint-plugin-prettier` — `pnpm lint` will fail on formatting drift.
- **`eslint.config` disables** `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps`. Don't rely on the hook linter to catch mistakes; review effect dependencies by hand.

## Visual Conventions

This project uses the **Twilight Blade** design system. AI agents working in this repo MUST follow [`brand/brand.md`](brand/brand.md) for every visual decision: colors, typography, gradients, and DO / DO NOT rules. Token values and the full rule set live there as the single source of truth — do not duplicate them inline in this file. See [`/brand`](https://www.tokku-tech.dev/brand) for the rendered reference page, and `brand/tokens.css` / `brand/tokens.ts` for the consumable formats.

## Git workflow

`main` is PR-only. Tracked hooks in `.githooks/` enforce this locally:

- `pre-commit` rejects any commit made while `HEAD` is on `main`.
- `pre-push` rejects any push whose remote ref is `refs/heads/main` (including force-push and `feat:main` style refspecs).

`pnpm install` runs the `prepare` script, which sets `core.hooksPath=.githooks` for your clone — so after cloning and installing, hooks are active automatically. If you skipped install scripts (`--ignore-scripts`), run `git config core.hooksPath .githooks` manually. Client hooks can still be bypassed with `--no-verify`; treat them as the first line of defense and rely on GitHub branch protection on `main` for true enforcement.

## OpenSpec workflow

Feature work is tracked under `openspec/`:

- `openspec/specs/<capability>/spec.md` — current specifications (e.g. `brand-guidelines`, `landing-page`, `page-layout`, `content-pages`, `styling-platform`, `ui-primitives`, `package-management`).
- `openspec/changes/<change-name>/` — in-flight proposals with `proposal.md`, `design.md`, `specs/**/spec.md` (delta), and `tasks.md`.
- `openspec/changes/archive/<YYYY-MM-DD>-<change-name>/` — completed and archived changes; deltas have been synced into the main specs.

Use `openspec status --change <name>` and `openspec instructions <artifact> --change <name>` (CLI) to drive proposal / design / spec / tasks creation, or invoke the OPSX skills (`/opsx:propose`, `/opsx:apply`, `/opsx:verify`, `/opsx:archive`, etc.) when those are available.
