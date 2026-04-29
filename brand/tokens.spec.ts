import { readFileSync } from 'fs';
import { resolve } from 'path';
import { brandTokens } from './tokens';

const repoRoot = resolve(__dirname, '..');
const tokensCss = readFileSync(resolve(repoRoot, 'brand/tokens.css'), 'utf8');
const brandMd = readFileSync(resolve(repoRoot, 'brand/brand.md'), 'utf8');

interface CssVarPair {
  name: string;
  value: string;
}

function extractCssVars(css: string, prefix: string): CssVarPair[] {
  const regex = new RegExp(
    `--${prefix}-([a-z0-9-]+)\\s*:\\s*([^;]+);`,
    'gi'
  );
  const result: CssVarPair[] = [];
  let match;
  while ((match = regex.exec(css)) !== null) {
    result.push({
      name: match[1].trim(),
      value: match[2].trim(),
    });
  }
  return result;
}

const cssColorPairs = extractCssVars(tokensCss, 'color-brand');
const cssFontPairs = extractCssVars(tokensCss, 'font-brand');

const cssToTsKey: Record<string, string> = {
  bg: 'bg',
  fg: 'fg',
  muted: 'muted',
  border: 'border',
  'border-strong': 'borderStrong',
  'orb-indigo': 'orbIndigo',
  'orb-violet': 'orbViolet',
  'orb-pink': 'orbPink',
  sans: 'sans',
  mono: 'mono',
};

describe('brand/tokens.ts ↔ brand/tokens.css sync', () => {
  it('every CSS color variable has a matching value in brandTokens.color', () => {
    for (const { name, value } of cssColorPairs) {
      const tsKey = cssToTsKey[name];
      expect(tsKey).toBeDefined();
      expect((brandTokens.color as Record<string, string>)[tsKey]).toBe(value);
    }
  });

  it('every CSS font variable has a matching value in brandTokens.font', () => {
    for (const { name, value } of cssFontPairs) {
      const tsKey = cssToTsKey[name];
      expect(tsKey).toBeDefined();
      expect((brandTokens.font as Record<string, string>)[tsKey]).toBe(value);
    }
  });

  it('brandTokens does not contain extra keys beyond what tokens.css declares', () => {
    const cssColorKeys = new Set(
      cssColorPairs.map(({ name }) => cssToTsKey[name])
    );
    const cssFontKeys = new Set(
      cssFontPairs.map(({ name }) => cssToTsKey[name])
    );
    expect(new Set(Object.keys(brandTokens.color))).toEqual(cssColorKeys);
    expect(new Set(Object.keys(brandTokens.font))).toEqual(cssFontKeys);
  });
});

describe('brand/brand.md ↔ brand/tokens.css value sync', () => {
  it('every color value in tokens.css appears in brand.md', () => {
    for (const { value } of cssColorPairs) {
      expect(brandMd).toContain(value);
    }
  });

  it('every font value in tokens.css appears in brand.md', () => {
    for (const { value } of cssFontPairs) {
      expect(brandMd).toContain(value);
    }
  });
});
