## 1. SSoT under `brand/`

- [ ] 1.1 Create `brand/tokens.ts` exporting `brandTokens` as a `const` object with `color` and `font` sections, mirroring `brand/tokens.css` exactly (per design Decision 2).
- [ ] 1.2 Confirm `brand/brand.md`, `brand/CLAUDE.md`, `brand/README.md` are NOT created. `brand/source/` remains untouched.

## 2. Distribution sync

- [ ] 2.1 Create `scripts/sync-brand-assets.mjs` that copies `brand/tokens.css` to `public/brand-assets/tokens.css` (creating the directory if missing). Do not copy any markdown files.
- [ ] 2.2 Add `"sync:brand": "node scripts/sync-brand-assets.mjs"` to `package.json` `scripts`.
- [ ] 2.3 Wire `prebuild` to run `pnpm sync:brand` (chained before existing build steps).
- [ ] 2.4 Update the existing `prepare` script to also run `pnpm sync:brand` after the `core.hooksPath` config (chained with `&&`).
- [ ] 2.5 Run `pnpm sync:brand` once locally and commit the resulting `public/brand-assets/tokens.css` so fresh clones can `pnpm test` without a sync step.

## 3. OGP image

- [ ] 3.1 Hand-craft a 1200×630 PNG matching Hero.html's "Twilight Blade." styling (dark bg + Orb + giant typography). Save as `public/brand-assets/brand-og.png`.
- [ ] 3.2 Verify the file size is reasonable (< 500 KB; optimize with a PNG compressor if needed).

## 4. `/brand` page scaffolding

- [ ] 4.1 Create `src/features/brand/Brand.page.tsx` orchestrating the 6 sections inside the existing `Container` + `GridOverlay` + `Orb` layout language.
- [ ] 4.2 Create `src/features/brand/data/rules.ts` (or inline) holding structured DO / DON'T data consumed by `BrandConcept` and the AI-rule-derived parts of `BrandInUse`.
- [ ] 4.3 Create `src/pages/brand.tsx` as a thin wrapper that renders `<Brand.page />` and passes a `Seo` config with `ogImage="/brand-assets/brand-og.png"`.

## 5. `/brand` section components

- [ ] 5.1 Implement `src/features/brand/components/BrandHero/index.tsx`: `Eyebrow` + giant "Twilight Blade." typography (gradient period reuse) + 1-line concept + Orb backdrop.
- [ ] 5.2 Implement `src/features/brand/components/BrandConcept/index.tsx`: 1–2 paragraphs of philosophy prose (post-hoc articulation of the existing implementation) + DO / DON'T list. Sourced from `data/rules.ts` where appropriate.
- [ ] 5.3 Implement `src/features/brand/components/BrandTokens/index.tsx`: import `brandTokens` from `brand/tokens.ts`, render color swatches (with hex/rgba labels) and font-stack samples in a responsive grid.
- [ ] 5.4 Implement `src/features/brand/components/BrandInUse/index.tsx`: live demos of gradient period, Orb, eyebrow-pulse, 12-col grid overlay, and the two-tier (primary + ghost) CTA pattern — all reusing existing primitives.
- [ ] 5.5 Implement `src/features/brand/components/BrandAssets/index.tsx`: render a single `<a href="/brand-assets/tokens.css" download>` card with a one-line description. No links to markdown or json files.
- [ ] 5.6 Implement `src/features/brand/components/BrandColophon/index.tsx`: list Geist / Geist Mono, last-updated date, Linear issue ID `TOK-84`, and a brief credit line.
- [ ] 5.7 Use `cn()` for class composition and ensure every component uses only `text-brand-fg` / `text-brand-muted` / `bg-brand-bg` / `border-brand-border*` Tailwind utilities (no `text-white` / `text-gray-*` / hardcoded hex).
- [ ] 5.8 Apply `grid grid-cols-1 md:grid-cols-2` (or `md:grid-cols-3` where appropriate) so each section collapses to a single column below 768 px (per spec & design Decision 9).

## 6. Footer link to `/brand`

- [ ] 6.1 Edit `src/components/layouts/Footer/` to add a `Link` primitive pointing to `/brand` (label `Brand` or `Brand Guidelines`). Place it inside the existing info column or alongside the copyright row — do NOT modify Header.
- [ ] 6.2 Verify `BaseLayout` continues to wrap `/brand` with the same Header + Footer (no `/brand`-specific chrome introduced).

## 7. Root `CLAUDE.md` augmentation

- [ ] 7.1 Append a `## Visual Conventions (Twilight Blade)` section to repo root `CLAUDE.md` containing: token list (colors + fonts), DO list, DO NOT list, and a reference to `/brand` and `brand/tokens.css`.
- [ ] 7.2 Confirm no new `brand/CLAUDE.md` is created (single AI rule file at repo root).

## 8. Tests

- [ ] 8.1 Add `brand/tokens.spec.ts` (or `spec/brand/tokensSync.spec.ts`) parsing `brand/tokens.css` for `--color-brand-*` / `--font-brand-*` declarations and asserting each value equals the corresponding entry in `brandTokens`.
- [ ] 8.2 Add a spec asserting `brand/tokens.css` and `public/brand-assets/tokens.css` are byte-for-byte identical (read both as `Buffer` and compare with `equals`).
- [ ] 8.3 Add a render test for `Brand.page.tsx` (jsdom + RTL) verifying all 6 section headings appear in document order: HERO / CONCEPT / TOKENS / IN USE / ASSETS / COLOPHON.
- [ ] 8.4 Add a Footer spec verifying a link with `href="/brand"` renders.
- [ ] 8.5 Add a `BrandTokens` spec verifying it imports from `brand/tokens.ts` and renders at least one swatch per color token without hardcoding hex strings in the component file.

## 9. Lint / type / build verification

- [ ] 9.1 Run `pnpm lint` and resolve all reported issues.
- [ ] 9.2 Run `pnpm test` and ensure all new and existing specs pass.
- [ ] 9.3 Run `pnpm build` locally to ensure `prebuild` (`sync:brand`) executes and the production bundle compiles.
- [ ] 9.4 Run `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/features/brand/` and confirm zero matches.
- [ ] 9.5 Run `grep -R "@chakra-ui\|@emotion\|framer-motion\|microcms-js-sdk" src/features/brand/ src/pages/brand.tsx` and confirm zero matches.
- [ ] 9.6 Run `ls brand/*.md` and confirm zero matches (other than `brand/source/.../README.md` which is excluded by path).

## 10. Visual / accessibility verification

- [ ] 10.1 `pnpm dev` and visit `/brand`; verify all 6 sections render and OGP meta tags are present in the served HTML.
- [ ] 10.2 Resize the browser to 375 px width and confirm `/brand` is single-column with no horizontal scrollbar.
- [ ] 10.3 Resize to ≥ 1280 px and confirm TOKENS / CONCEPT / IN USE use multi-column grids.
- [ ] 10.4 Spot-check contrast: confirm body text uses `--color-brand-fg` and only auxiliary labels use `--color-brand-muted`.
- [ ] 10.5 Click the ASSETS download link and confirm `tokens.css` downloads with content matching `brand/tokens.css`.
- [ ] 10.6 Tab through `/brand` and verify focus-visible rings appear on all interactive elements.

## 11. Wrap-up

- [ ] 11.1 Update Linear with a progress comment summarizing the change once tasks 1–10 are complete (manual step at apply time).
- [ ] 11.2 Open a PR with title referencing `TOK-84` and summarizing the SSoT + `/brand` publication.
- [ ] 11.3 After merge, run `openspec verify portfolio-brand-guidelines` (or the OPSX equivalent) and archive the change.
