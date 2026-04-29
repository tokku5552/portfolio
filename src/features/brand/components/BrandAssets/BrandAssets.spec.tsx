import { render } from '@testing-library/react';
import BrandAssets from './index';

describe('BrandAssets', () => {
  it('renders external links to GitHub or jsdelivr URLs only', () => {
    const { container } = render(<BrandAssets />);
    const anchors = Array.from(container.querySelectorAll('a'));
    expect(anchors.length).toBeGreaterThan(0);

    const externalAnchors = anchors.filter((a) =>
      a.getAttribute('href')?.startsWith('http')
    );
    expect(externalAnchors.length).toBeGreaterThan(0);

    for (const a of externalAnchors) {
      const href = a.getAttribute('href') ?? '';
      const isCanonical =
        href.startsWith('https://cdn.jsdelivr.net/gh/') ||
        href.startsWith('https://raw.githubusercontent.com/') ||
        href.startsWith('https://github.com/');
      expect(isCanonical).toBe(true);
    }
  });

  it('does not render any link to a local /brand-assets/ path', () => {
    const { container } = render(<BrandAssets />);
    const localBrandAssetLinks = Array.from(
      container.querySelectorAll('a')
    ).filter((a) => a.getAttribute('href')?.includes('/brand-assets/'));
    expect(localBrandAssetLinks.length).toBe(0);
  });

  it('marks external links with target="_blank" + rel="noopener noreferrer"', () => {
    const { container } = render(<BrandAssets />);
    const externalAnchors = Array.from(container.querySelectorAll('a')).filter(
      (a) => a.getAttribute('href')?.startsWith('http')
    );
    for (const a of externalAnchors) {
      expect(a.getAttribute('target')).toBe('_blank');
      const rel = a.getAttribute('rel') ?? '';
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });
});
