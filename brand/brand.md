# Twilight Blade

Twilight Blade is the visual system of `tokku-tech.dev`. It is a quiet,
mono-typed dark surface that earns one accent — the
indigo→violet→pink gradient — and uses it sparingly to mark identity
moments (the period in the wordmark, the orb that sits behind the hero).
Everything else is held back. Borders are nearly invisible. Type does
the heavy lifting in two voices: `Geist` for body, `Geist Mono` for
labels and structural marks. The outcome is a page that reads as
deliberate without trying to be loud.

This file is the single source of truth for AI agents (chat AIs, slide
generators, image generators) that need to follow the system. Paste it
into your tool, or fetch it directly from the URL listed below.

## Tokens

### Colors (use only these)

- `bg`: `#0a0a12`
- `fg`: `#ffffff`
- `muted`: `#6b6b7b`
- `border`: `rgba(255, 255, 255, 0.08)`
- `border-strong`: `rgba(255, 255, 255, 0.14)`
- `orb-indigo`: `#4f46e5`
- `orb-violet`: `#8b5cf6`
- `orb-pink`: `#ec4899`

The accent gradient is composed in this order: `indigo → violet → pink`.
Do not invert it, recolor it, or mix in other hues.

### Fonts

- Sans: `'Geist', system-ui, sans-serif`
- Mono: `'Geist Mono', ui-monospace, monospace`

Body text uses sans. Labels, eyebrows, side meta, and structural marks
use mono. There is no third typeface.

## DO

- Use brand tokens for every color decision. Reference them as
  `var(--color-brand-*)` in CSS or via `brandTokens.color.*` in
  TypeScript (see `brand/tokens.ts`).
- Reserve the indigo→violet→pink gradient for a single accent moment per
  view: a wordmark period, an orb behind a hero, the primary button
  hover state. One accent per surface.
- Keep backgrounds dark (`bg`), foreground crisp (`fg`), supporting text
  muted (`muted`).
- Use `Geist` for body and headings, `Geist Mono` for eyebrows, side
  meta, and structural marks.
- Compose `Geist Mono` labels in uppercase with letter-spacing (Hero.html
  pattern: `font-brand-mono text-[12px] tracking-[0.12em] uppercase`).
- Use the existing primitives (`Button`, `Container`, `Eyebrow`, `Orb`,
  `GridOverlay`, `Link`) from `src/components/parts/` when working in
  this codebase.

## DO NOT

- Do not introduce new color literals (`#xxxxxx`, `rgb(...)`, `rgba(...)`)
  in the codebase. New colors require new tokens, and new tokens require
  human approval.
- Do not apply `box-shadow` to indicate elevation. Depth in Twilight
  Blade comes from `border` / `border-strong`, never from shadow.
- Do not introduce gradients other than `indigo → violet → pink`. No
  rainbow, no neon, no warm/cool mixes.
- Do not use Chakra UI, Emotion, or Framer Motion. These were removed
  in TOK-83. Animations come from CSS keyframes (see `globals.css`) or
  Tailwind transition utilities.
- Do not use neon greens, yellows, oranges, or any saturated hue outside
  the brand tokens.
- Do not apply background-image patterns (stripes, dots, noise) beyond
  the existing `tb-grain` and `tb-grid-overlay` utilities.

## Reference

- Live page: https://www.tokku-tech.dev/brand
- Tokens (CSS): https://cdn.jsdelivr.net/gh/tokku5552/portfolio/brand/tokens.css
- This file (markdown): https://cdn.jsdelivr.net/gh/tokku5552/portfolio/brand/brand.md
- Source repository: https://github.com/tokku5552/portfolio

License for the tokens and this document: MIT (same as the repository).
Reuse and remix freely.
