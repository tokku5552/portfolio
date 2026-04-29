/**
 * Twilight Blade design tokens (typed mirror of brand/tokens.css).
 *
 * The CSS file is the single source of truth; this TypeScript module
 * exposes the same values for type-safe consumption (e.g. the /brand
 * TOKENS section renders swatches by iterating brandTokens.color).
 *
 * Sync between this file and brand/tokens.css is enforced by
 * brand/tokens.spec.ts. Do not edit one without the other.
 */
export const brandTokens = {
  color: {
    bg: '#0a0a12',
    fg: '#ffffff',
    muted: '#6b6b7b',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.14)',
    orbIndigo: '#4f46e5',
    orbViolet: '#8b5cf6',
    orbPink: '#ec4899',
  },
  font: {
    sans: "'Geist', system-ui, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace",
  },
} as const;

export type BrandTokens = typeof brandTokens;
export type BrandColorKey = keyof BrandTokens['color'];
export type BrandFontKey = keyof BrandTokens['font'];

/**
 * CSS variable name corresponding to each color token. Used by /brand TOKENS
 * to surface both the value and the var() reference for copy-paste.
 */
export const colorCssVar: Record<BrandColorKey, string> = {
  bg: '--color-brand-bg',
  fg: '--color-brand-fg',
  muted: '--color-brand-muted',
  border: '--color-brand-border',
  borderStrong: '--color-brand-border-strong',
  orbIndigo: '--color-brand-orb-indigo',
  orbViolet: '--color-brand-orb-violet',
  orbPink: '--color-brand-orb-pink',
};

export const fontCssVar: Record<BrandFontKey, string> = {
  sans: '--font-brand-sans',
  mono: '--font-brand-mono',
};
