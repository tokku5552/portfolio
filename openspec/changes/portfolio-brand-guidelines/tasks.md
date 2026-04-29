## 1. SSoT under `brand/`

- [x] 1.1 Create `brand/tokens.ts` exporting `brandTokens` as a `const` object with `color` and `font` sections, mirroring `brand/tokens.css` exactly (per design Decision 2).
- [x] 1.2 Create `brand/brand.md` containing: 1–2 paragraph philosophy prose, Tokens section (Colors + Fonts with values), DO list, DO NOT list, Reference section (links to `/brand`, GitHub raw / jsdelivr `tokens.css` URL, repo URL). Per design Decision 8.
- [x] 1.3 Confirm `brand/CLAUDE.md` and `brand/README.md` are NOT created. `brand/source/` remains untouched.

## 2. OGP image

- [x] 2.1 Hand-craft a PNG matching Hero.html's "Twilight Blade." styling (dark bg + Orb + giant typography), saved as `public/brand-og.png` (top-level, NOT `public/brand-assets/`). Aspect ratio ≈ 1.91:1; recommended 1200×630 but proximate dimensions accepted.
- [x] 2.2 Verify the file is a PNG with the expected aspect ratio and within 2 MB. (Optimal target is < 500 KB; current 1.05 MB is within the relaxed allowance.)
- [x] 2.3 Confirm `public/brand-assets/` directory is NOT created.

## 3. `/brand` page scaffolding

- [x] 3.1 Create `src/features/brand/Brand.page.tsx` orchestrating the 6 sections inside the existing `Container` + `GridOverlay` + `Orb` layout language.
- [x] 3.2 Create `src/features/brand/data/rules.ts` (or inline) holding structured DO / DON'T data and asset URLs (GitHub raw / jsdelivr links).
- [x] 3.3 Create `src/pages/brand.tsx` as a thin wrapper that renders `<Brand.page />` and passes a `Seo` config with `ogImage="/brand-og.png"`.

## 4. `/brand` section components

- [x] 4.1 Implement `src/features/brand/components/BrandHero/index.tsx`: `Eyebrow` + giant "Twilight Blade." typography (gradient period reuse) + 1-line concept + Orb backdrop.
- [x] 4.2 Implement `src/features/brand/components/BrandConcept/index.tsx`: 1–2 paragraphs of philosophy prose (post-hoc articulation of the existing implementation) + DO / DON'T list. Sourced from `data/rules.ts` where appropriate.
- [x] 4.3 Implement `src/features/brand/components/BrandTokens/index.tsx`: import `brandTokens` from `brand/tokens.ts`, render color swatches (with hex/rgba labels) and font-stack samples in a responsive grid.
- [x] 4.4 Implement `src/features/brand/components/BrandInUse/index.tsx`: live demos of gradient period, Orb, eyebrow-pulse, 12-col grid overlay, and the two-tier (primary + ghost) CTA pattern — all reusing existing primitives.
- [x] 4.5 Implement `src/features/brand/components/BrandAssets/index.tsx`: render external links (GitHub raw or jsdelivr CDN) for `tokens.css` and `brand.md`, with each URL displayed in a copyable `<code>` block. `target="_blank"` + `rel="noopener noreferrer"`. No links to `/brand-assets/`.
- [x] 4.6 Implement `src/features/brand/components/BrandColophon/index.tsx`: list Geist / Geist Mono, last-updated date, license (MIT), and a brief credit line.
- [x] 4.7 Use `cn()` for class composition and ensure every component uses only `text-brand-fg` / `text-brand-muted` / `bg-brand-bg` / `border-brand-border*` Tailwind utilities (no `text-white` / `text-gray-*` / hardcoded hex).
- [x] 4.8 Apply `grid grid-cols-1 md:grid-cols-2` (or `md:grid-cols-3` where appropriate) so each section collapses to a single column below 768 px (per spec & design Decision 10).

## 5. Header nav and Footer link to `/brand`

- [x] 5.1 Edit `src/components/layouts/Footer/` to add a `Link` primitive pointing to `/brand` (label `Brand` or `Brand Guidelines`). Place it inside the existing info column or alongside the copyright row.
- [x] 5.2 Add a `Brand` entry pointing to `/brand` to `src/features/home/menus.ts` so the existing global Header surfaces a 5-item nav (Work / Music / Podcast / Writing / Brand).
- [x] 5.3 Verify `BaseLayout` continues to wrap `/brand` with the same Header + Footer (no `/brand`-specific chrome introduced).

## 6. Root `CLAUDE.md` augmentation

- [x] 6.1 Append a `## Visual Conventions` section to repo root `CLAUDE.md` containing: a 1-paragraph statement that AI agents must follow `brand/brand.md` for visual decisions, plus a reference link to `/brand`. Do NOT inline token values or DO/DON'T lists (those live in `brand/brand.md`).
- [x] 6.2 Confirm no new `brand/CLAUDE.md` is created (single AI rule SoT at `brand/brand.md`).

## 7. Tests

- [x] 7.1 Add `brand/tokens.spec.ts` (or `spec/brand/tokensSync.spec.ts`) parsing `brand/tokens.css` for `--color-brand-*` / `--font-brand-*` declarations and asserting each value equals the corresponding entry in `brandTokens`.
- [x] 7.2 Add a spec asserting that hex / rgba values listed in `brand/brand.md` match the corresponding values in `brand/tokens.css` (parse both files, compare).
- [x] 7.3 Add a render test for `Brand.page.tsx` (jsdom + RTL) verifying all 6 section headings appear in document order: HERO / CONCEPT / TOKENS / IN USE / ASSETS / COLOPHON.
- [x] 7.4 Add a Footer spec verifying a link with `href="/brand"` renders.
- [x] 7.5 Add a `BrandTokens` spec verifying it imports from `brand/tokens.ts` and renders at least one swatch per color token without hardcoding hex strings in the component file.
- [x] 7.6 Add a `BrandAssets` spec verifying its links target external GitHub / jsdelivr URLs (not `/brand-assets/...`).

## 8. Lint / type / build verification

- [x] 8.1 Run `pnpm lint` and resolve all reported issues.
- [x] 8.2 Run `pnpm test` and ensure all new and existing specs pass.
- [x] 8.3 Run `pnpm build` locally to ensure the production bundle compiles.
- [x] 8.4 Run `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/features/brand/` and confirm zero matches.
- [x] 8.5 Run `grep -R "@chakra-ui\|@emotion\|framer-motion\|microcms-js-sdk" src/features/brand/ src/pages/brand.tsx` and confirm zero matches.
- [x] 8.6 Run `ls brand/CLAUDE.md brand/README.md public/brand-assets` and confirm none of them exist.

## 9. Visual / accessibility verification

- [x] 9.1 `pnpm dev` and visit `/brand`; verify all 6 sections render and OGP meta tags are present in the served HTML pointing to `/brand-og.png`. (Verified via static build output: `og:image` and `twitter:image` both point to `https://www.tokku-tech.dev/brand-og.png`, `og:image:width=1200`, `og:image:height=630`.)
- [x] 9.2 Resize the browser to 375 px width and confirm `/brand` is single-column with no horizontal scrollbar.
- [x] 9.3 Resize to ≥ 1280 px and confirm TOKENS / CONCEPT / IN USE use multi-column grids.
- [x] 9.4 Spot-check contrast: confirm body text uses `--color-brand-fg` and only auxiliary labels use `--color-brand-muted`.
- [x] 9.5 Click each ASSETS external link and confirm it opens GitHub raw / jsdelivr in a new tab and serves the canonical file.
- [x] 9.6 Tab through `/brand` and verify focus-visible rings appear on all interactive elements.

## 10. Wrap-up

- [ ] 10.1 Update Linear with a progress comment summarizing the change once tasks 1–9 are complete (manual step at apply time).
- [ ] 10.2 Open a PR with title referencing `TOK-84` and summarizing the SSoT + `/brand` publication.
- [ ] 10.3 After merge, run `openspec verify portfolio-brand-guidelines` (or the OPSX equivalent) and archive the change.
