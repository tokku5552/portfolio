# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **yarn 1.x** (see `README.md`). Node version is pinned by `.node-version` (20.20.2).

```bash
yarn install          # install dependencies
yarn dev              # start Next.js dev server
yarn build            # production build (used by Vercel and CI)
yarn start            # serve the built app
yarn lint             # next lint (ESLint + Prettier via eslint-plugin-prettier)
yarn test             # jest (jsdom environment)
yarn test path/to/file.spec.ts          # single file
yarn test -t "name of test"             # by test name
```

CI (`.github/workflows/ci.yml`) runs `lint`, `test`, and `build` in parallel on PRs to `main`. Deploys are handled by Vercel (`vercel.json`) — previews on PRs, production on merge to `main`.

## Environment variables

All are `NEXT_PUBLIC_*` because this is a client-heavy Pages Router app. `src/config/environment.ts` reads them and `warnIfMissing` logs a warning at import time for each.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_ENVIRONMENT` | `local` / `test` / `production` — gates feature-flag behavior |
| `NEXT_PUBLIC_SERVICE_DOMAIN` | microCMS service domain |
| `NEXT_PUBLIC_API_KEY` | microCMS API key |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID |
| `NEXT_PUBLIC_QIITA_TOKEN` | Qiita API token for article aggregation |

Copy `.env.sample` to `.env` for local work. Tests inject dummy values via `spec/setupTest.ts` (registered as `globalSetup` in `jest.config.mjs`).

## Architecture

### Next.js Pages Router

Routing lives in `src/pages/` (classic Pages Router, not App Router). `_app.tsx` wires up `ChakraProvider`, `BaseLayout`, and GA pageview tracking on `routeChangeComplete`. Page files are thin — they call `getStaticProps`, fetch data, and delegate rendering to a `*.page.tsx` component inside the relevant feature folder.

### Feature-based layout under `src/features/<feature>/`

Each feature (`article`, `home`, `news`, `service`, `works`) owns its `apis/`, `components/`, `types/`, and optionally `data/`, `hooks/`, `functions/`. The top-level `*.page.tsx` inside a feature folder is the page-level component rendered by the matching file in `src/pages/`.

Shared building blocks live outside features:
- `src/components/layouts/` — page chrome (`BaseLayout`, `Header`, `Footer`, `Hero`, `Seo`, section layouts like `Works`, `YouTube`, `Podcast`).
- `src/components/parts/` — small reusable pieces (`Card`, `DisclosableCard`, `Title`).
- `src/clients/` — external SDK clients.
- `src/apis/` — cross-feature API helpers (e.g. `featureFlags.ts`).
- `src/libs/` — pure utilities (`date.ts`, `gtag.ts`, `text.ts`). Co-located tests like `date.spec.ts` live here.
- `src/config/` — `environment.ts` (env vars) and `constants.ts` (URLs, page titles, social links).
- `src/theme/theme.ts` — Chakra UI theme.
- `src/types/` — cross-feature types (`ListCMS.ts` for microCMS list envelope, `featureFlags.ts`, `global.d.ts`).

Path alias `@/*` → `src/*` is configured in `tsconfig.json`. Both `@/...` and relative imports appear in the codebase; match whichever style the surrounding file uses.

### microCMS client guard

`src/clients/microcms.ts` exports `client` **and** `isMicrocmsConfigured`. When `NEXT_PUBLIC_SERVICE_DOMAIN` or `NEXT_PUBLIC_API_KEY` is missing, `client` is a mock whose every method throws. **Any call site that touches `client` must either check `isMicrocmsConfigured` first or be inside a try/catch that degrades gracefully** — see `src/features/news/apis/news.ts` and `src/pages/index.tsx` for the pattern (return empty list / null, log a warning, never crash the page). This is how preview/local builds without credentials stay bootable.

### Feature flags

`src/apis/featureFlags.ts` fetches a `featureflags` list from microCMS in production, but short-circuits to `{ news: true, works: true, youtube: true }` when `config.environment` is `local` or `test`. When adding a new flag, update both the microCMS-mapping path and the local/test fallback object, plus `src/types/featureFlags.ts`.

### Article aggregation

`src/features/article/apis/article.ts` merges three sources — Zenn (`zenn.ts`), Qiita (`qiita.ts`, uses `NEXT_PUBLIC_QIITA_TOKEN`), and hand-curated entries in `data/static-data.ts` — then sorts by `publishedAt` desc. Add permanent items to `static-data.ts`; the external sources populate automatically.

## Conventions

- **Styling**: Chakra UI v2 + Emotion. Avoid adding competing styling systems.
- **Framer Motion** is available for animations; check `src/components/layouts/Hero` for existing usage patterns before introducing new motion primitives.
- **Tests** use Jest + `@testing-library/react` in a jsdom environment. Spec files live next to the code they test (`*.spec.ts`). There is no project-wide test setup file beyond `globalSetup` env stubs.
- **Prettier** config (`.prettierrc`): single quotes, 2-space tabs, trailing commas `es5`, always-parens for arrow params. Enforced via `eslint-plugin-prettier` — `yarn lint` will fail on formatting drift.
- **`eslint.config` disables** `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps`. Don't rely on the hook linter to catch mistakes; review effect dependencies by hand.

## Git workflow

`main` is PR-only. Tracked hooks in `.githooks/` enforce this locally:

- `pre-commit` rejects any commit made while `HEAD` is on `main`.
- `pre-push` rejects any push whose remote ref is `refs/heads/main` (including force-push and `feat:main` style refspecs).

`yarn install` runs the `prepare` script, which sets `core.hooksPath=.githooks` for your clone — so after cloning and installing, hooks are active automatically. If you skipped install scripts (`--ignore-scripts`), run `git config core.hooksPath .githooks` manually. Client hooks can still be bypassed with `--no-verify`; treat them as the first line of defense and rely on GitHub branch protection on `main` for true enforcement.
