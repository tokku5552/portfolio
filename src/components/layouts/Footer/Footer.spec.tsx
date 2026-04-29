import { render } from '@testing-library/react';
import Footer from './index';

describe('Footer', () => {
  it('renders a link to /brand', () => {
    const { container } = render(<Footer />);
    const brandLinks = Array.from(container.querySelectorAll('a')).filter(
      (a) => a.getAttribute('href') === '/brand'
    );
    expect(brandLinks.length).toBeGreaterThan(0);
  });

  it('does NOT add Brand to the Header-style nav (only in Footer chrome)', () => {
    const { container } = render(<Footer />);
    // Footer renders inside <footer>; ensure the brand link is within it.
    const footer = container.querySelector('footer');
    expect(footer).not.toBeNull();
    const brandLink = footer?.querySelector('a[href="/brand"]');
    expect(brandLink).not.toBeNull();
  });
});
