import { render } from '@testing-library/react';
import NotFound from './NotFound.page';

describe('NotFound', () => {
  it('renders a 404 heading', () => {
    const { container } = render(<NotFound />);
    const heading = container.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe('Lost.');
    expect(container.textContent).toMatch(/404/);
  });

  it('links back to the home page', () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector('a[href="/"]')).not.toBeNull();
  });
});
