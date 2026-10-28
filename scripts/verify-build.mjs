// Checks the output of `pnpm build`: every statically generated page exists
// with its <head> and body filled in, and the stylesheet it links contains the
// Tailwind / brand CSS. A dependency update can break these while the build
// itself still succeeds. Run after `pnpm build` (CI does this in the build job).
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const nextDir = path.resolve(import.meta.dirname, '..', '.next');
const siteName = "tokku's portfolio";

const pages = [
  { route: '/', file: 'index.html', title: siteName, text: 'Tokuda' },
  {
    route: '/articles',
    file: 'articles.html',
    title: `記事一覧 | ${siteName}`,
    text: 'Articles',
  },
  {
    route: '/brand',
    file: 'brand.html',
    title: `Brand · Twilight Blade | ${siteName}`,
    text: 'Twilight Blade',
  },
  {
    route: '404',
    file: '404.html',
    title: `404 Not Found | ${siteName}`,
    text: 'お探しのページは見つかりませんでした',
  },
];

// Produced by tailwind.config.ts, globals.css and brand/tokens.css.
const cssMarkers = [
  '--color-brand-bg',
  '.bg-brand-bg',
  '.font-brand-mono',
  '@keyframes orb-float',
  '.tb-eyebrow-pulse',
];

const decode = (s) =>
  s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const errors = [];
const stylesheets = new Set();

for (const page of pages) {
  const file = path.join(nextDir, 'server', 'pages', page.file);
  if (!existsSync(file)) {
    errors.push(`${page.route}: ${page.file} was not generated`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const fail = (msg) => errors.push(`${page.route}: ${msg}`);

  if (!/<html[^>]*\slang="ja"/.test(html)) fail('<html lang="ja"> missing');

  const titles = [...html.matchAll(/<title[^>]*>([^<]*)<\/title>/g)];
  if (titles.length !== 1) {
    fail(`expected 1 <title>, found ${titles.length}`);
  } else if (decode(titles[0][1]) !== page.title) {
    fail(`title is "${decode(titles[0][1])}", expected "${page.title}"`);
  }
  const ogTitle = html.match(
    /<meta[^>]*property="og:title"[^>]*content="([^"]*)"/
  );
  if (decode(ogTitle?.[1] ?? '') !== page.title)
    fail('og:title missing or wrong');

  if (!html.includes('id="main-content"')) fail('BaseLayout <main> missing');
  if (!/<header[\s>]/.test(html) || !/<footer[\s>]/.test(html)) {
    fail('Header / Footer missing');
  }
  const text = decode(html.replace(/<[^>]*>/g, ''));
  if (!text.includes(page.text)) fail(`body text "${page.text}" missing`);

  const links = [
    ...html.matchAll(
      /<link[^>]*rel="stylesheet"[^>]*href="\/_next\/([^"]+\.css)"/g
    ),
  ];
  if (links.length === 0) fail('no stylesheet linked');
  for (const [, href] of links) stylesheets.add(href);
}

const css = [...stylesheets]
  .map((href) => {
    const file = path.join(nextDir, href);
    if (!existsSync(file)) {
      errors.push(`linked stylesheet ${href} does not exist`);
      return '';
    }
    return readFileSync(file, 'utf8');
  })
  .join('\n');
for (const marker of cssMarkers) {
  if (!css.includes(marker)) errors.push(`CSS is missing "${marker}"`);
}

if (errors.length > 0) {
  console.error('Build output check failed:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `Build output OK: ${pages.length} pages, ${stylesheets.size} stylesheet(s).`
);
