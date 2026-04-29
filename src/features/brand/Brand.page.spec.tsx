import { render, screen } from '@testing-library/react';
import Brand from './Brand.page';

describe('Brand.page', () => {
  it('renders all 6 sections in order: HERO / CONCEPT / TOKENS / IN USE / ASSETS / COLOPHON', () => {
    const { container } = render(<Brand />);
    const sections = Array.from(container.querySelectorAll('section[id]')).map(
      (s) => s.getAttribute('id')
    );
    expect(sections).toEqual([
      'hero',
      'concept',
      'tokens',
      'in-use',
      'assets',
      'colophon',
    ]);
  });

  it('renders the wordmark "Twilight Blade." in the HERO section', () => {
    render(<Brand />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('Twilight Blade');
  });

  it('renders DO and DO NOT lists in the CONCEPT section', () => {
    render(<Brand />);
    const eyebrows = screen.getAllByText(/^Do$|^Do not$/);
    expect(eyebrows.length).toBeGreaterThanOrEqual(2);
  });
});
