import { createDom } from './createDom';

describe('createDom', () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  test('parses head meta tags from an HTML page', () => {
    const dom = createDom(
      '<html><head><meta property="og:image" content="https://example.com/a.png" /></head><body></body></html>'
    );
    const meta = dom.window.document.head.querySelector(
      'meta[property="og:image"]'
    );
    expect(meta?.getAttribute('content')).toBe('https://example.com/a.png');
  });

  test('does not report stylesheets jsdom cannot parse', () => {
    const dom = createDom(
      '<html><head><style>@layer base { a { color: color-mix(in srgb, red 50%, blue); } } a {</style><meta property="og:title" content="t" /></head></html>'
    );
    expect(
      dom.window.document.head
        .querySelector('meta[property="og:title"]')
        ?.getAttribute('content')
    ).toBe('t');
    expect(consoleError).not.toHaveBeenCalled();
  });

  test('parses XML when given an XML content type', () => {
    const dom = createDom(
      '<rss><channel><item><title>x</title></item></channel></rss>',
      {
        contentType: 'text/xml',
      }
    );
    expect(dom.window.document.getElementsByTagName('item')).toHaveLength(1);
  });
});
