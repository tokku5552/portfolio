import { render, screen } from '@testing-library/react';
import Link from './Link';

describe('Link', () => {
  it('renders an internal link without target=_blank', () => {
    render(<Link href="/news">News</Link>);
    const a = screen.getByRole('link', { name: 'News' });
    expect(a.getAttribute('href')).toBe('/news');
    expect(a.getAttribute('target')).toBeNull();
    expect(a.getAttribute('rel')).toBeNull();
  });

  it('renders an external link with security rel attributes', () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>
    );
    const a = screen.getByRole('link', { name: 'Example' });
    expect(a.getAttribute('href')).toBe('https://example.com');
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('forwards className through cn()', () => {
    render(
      <Link href="/x" className="text-brand-muted">
        x
      </Link>
    );
    const a = screen.getByRole('link', { name: 'x' });
    expect(a.className).toMatch(/text-brand-muted/);
  });
});
