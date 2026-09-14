import { extractOgp } from './extractOgp';

const metaElementsFrom = (html: string): HTMLMetaElement[] => {
  document.head.innerHTML = html;
  return Array.from(document.head.querySelectorAll('meta'));
};

describe('extractOgp', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  test('property 属性を持つ meta から OGP を抽出する', () => {
    const metas = metaElementsFrom(`
      <meta property="og:title" content="Title" />
      <meta property="og:image" content="https://example.com/image.png" />
      <meta name="description" content="ignored" />
    `);

    expect(extractOgp(metas)).toEqual({
      'og:title': 'Title',
      'og:image': 'https://example.com/image.png',
    });
  });

  test('空白だけの property があっても後続の meta を抽出し続ける', () => {
    const metas = metaElementsFrom(`
      <meta property="   " content="blank" />
      <meta property="og:image" content="https://example.com/image.png" />
    `);

    expect(extractOgp(metas)).toEqual({
      'og:image': 'https://example.com/image.png',
    });
  });

  test('property の前後の空白を除去し、content が無い meta は無視する', () => {
    const metas = metaElementsFrom(`
      <meta property=" og:title " content="Title" />
      <meta property="og:image" />
    `);

    expect(extractOgp(metas)).toEqual({
      'og:title': 'Title',
    });
  });

  test('meta が無ければ空オブジェクトを返す', () => {
    expect(extractOgp([])).toEqual({});
  });
});
