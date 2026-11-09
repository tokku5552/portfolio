/**
 * @jest-environment node
 */
import { execFileSync } from 'child_process';
import path from 'path';

const root = path.resolve(__dirname, '../..');

// Run globals.css through the same plugins Next.js loads from
// postcss.config.js. This runs in a child Node process because
// @tailwindcss/node calls module.registerHooks() on import, which Jest 30
// rejects inside its sandboxed module registry.
const compileScript = `
const { readFileSync } = require('fs');
const postcss = require('postcss');
const { plugins } = require('./postcss.config.js');
const file = 'src/styles/globals.css';
postcss(Object.entries(plugins).map(([name, options]) => require(name)(options)))
  .process(readFileSync(file, 'utf8'), { from: require('path').resolve(file) })
  .then((result) => process.stdout.write(result.css));
`;

const compileGlobals = (): string =>
  execFileSync(process.execPath, ['-e', compileScript], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });

describe('globals.css', () => {
  let css: string;

  beforeAll(() => {
    css = compileGlobals();
  }, 30000);

  test('expands the Tailwind import', () => {
    expect(css).not.toMatch(/@import\s+['"]tailwindcss['"]/);
    // Preflight from the tailwindcss import.
    expect(css).toContain('box-sizing: border-box');
  });

  test('does not shadow brand/tokens.css with self-referencing theme variables', () => {
    expect(css).toMatch(/--color-brand-bg:\s*#/i);
    expect(css).not.toMatch(/--color-brand-bg:\s*var\(--color-brand-bg\)/);
  });

  test('generates brand utilities used in src from the @theme mapping', () => {
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
