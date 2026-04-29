/**
 * Brand-page structured data: DO/DON'T rules and asset URLs surfaced by
 * the /brand sections. Mirrors the prose in brand/brand.md (intentional
 * duplication, manual sync — the brand.md spec hex values are checked
 * against tokens.css automatically).
 */

export const doRules: string[] = [
  'Use brand tokens for every color decision (var(--color-brand-*) or brandTokens.color.*).',
  'Reserve the indigo→violet→pink gradient for a single accent moment per surface.',
  'Keep backgrounds dark, foreground crisp, supporting text muted.',
  'Use Geist for body and headings, Geist Mono for eyebrows and structural marks.',
  'Compose mono labels in uppercase with letter-spacing.',
  'Reuse the existing primitives in src/components/parts/.',
];

export const dontRules: string[] = [
  'Do not introduce new color literals (#xxx, rgb, rgba) outside brand tokens.',
  'Do not apply box-shadow to indicate elevation — depth comes from borders.',
  'Do not introduce gradients other than indigo→violet→pink.',
  'Do not use Chakra UI, Emotion, or Framer Motion.',
  'Do not use neon greens, yellows, oranges, or any saturated hue outside the brand tokens.',
  'Do not apply background-image patterns beyond the existing tb-grain and tb-grid-overlay utilities.',
];

export interface AssetLink {
  label: string;
  description: string;
  /**
   * External URL — points to the canonical file on GitHub raw or jsdelivr CDN.
   * Must be an absolute URL with `http(s)://` so the BrandAssets spec can
   * detect that we are not pointing at a local /brand-assets/ mirror.
   */
  url: string;
}

const REPO = 'tokku5552/portfolio';
const BRANCH = 'main';

const cdn = (path: string): string =>
  `https://cdn.jsdelivr.net/gh/${REPO}/${path}`;

export const assetLinks: AssetLink[] = [
  {
    label: 'tokens.css',
    description:
      'Brand CSS variables. Drop into any project with @import url(...) or copy the values.',
    url: cdn(`brand/tokens.css`),
  },
  {
    label: 'brand.md',
    description:
      'AI-paste / fetch friendly spec. Tokens, DO / DO NOT, references — single file.',
    url: cdn(`brand/brand.md`),
  },
];

export const sourceRepoUrl = `https://github.com/${REPO}`;
export const sourceBranch = BRANCH;
