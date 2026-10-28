/**
 * @jest-environment node
 */
import { readFileSync } from 'fs';
import path from 'path';
import postcss, { AcceptedPlugin } from 'postcss';

const root = path.resolve(__dirname, '../..');

// Run globals.css through the same plugins Next.js loads from postcss.config.js.
const compileGlobals = async (): Promise<string> => {
  const { plugins } = require(path.join(root, 'postcss.config.js')) as {
    plugins: Record<string, object>;
  };
  const resolved = Object.entries(plugins).map(([name, options]) =>
    require(name)(options)
  ) as AcceptedPlugin[];
  const file = path.join(root, 'src/styles/globals.css');
  const result = await postcss(resolved).process(readFileSync(file, 'utf8'), {
    from: file,
  });
  return result.css;
};

describe('globals.css', () => {
  let css: string;

  beforeAll(async () => {
    css = await compileGlobals();
  }, 30000);

  test('expands the @tailwind directives', () => {
    expect(css).not.toMatch(/@tailwind\s/);
    // Preflight from `@tailwind base`.
    expect(css).toContain('box-sizing: border-box');
  });

  test('generates brand utilities used in src from the theme extension', () => {
    expect(css).toMatch(
      /\.bg-brand-bg\s*\{[^}]*background-color:\s*var\(--color-brand-bg\)/
    );
    expect(css).toMatch(
      /\.font-brand-mono\s*\{[^}]*font-family:\s*var\(--font-brand-mono\)/
    );
    expect(css).toMatch(/\.max-w-shell\s*\{[^}]*max-width:\s*1440px/);
  });

  test('keeps the Twilight Blade keyframes and tb-* classes', () => {
    expect(css).toContain('@keyframes orb-float');
    expect(css).toContain('@keyframes eyebrow-pulse');
    expect(css).toContain('.tb-eyebrow-pulse');
  });
});
