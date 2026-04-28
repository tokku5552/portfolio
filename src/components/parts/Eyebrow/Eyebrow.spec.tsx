import { render, screen } from '@testing-library/react';
import Eyebrow from './Eyebrow';

describe('Eyebrow', () => {
  it('renders mono uppercase muted label without pulse by default', () => {
    render(<Eyebrow data-testid="e">Latest</Eyebrow>);
    const el = screen.getByTestId('e');
    expect(el.className).toMatch(/font-brand-mono/);
    expect(el.className).toMatch(/uppercase/);
    expect(el.className).toMatch(/text-brand-muted/);
    expect(el.querySelector('.tb-eyebrow-pulse')).toBeNull();
  });

  it('renders pulse dot when withPulse is true', () => {
    render(
      <Eyebrow withPulse data-testid="e">
        Portfolio · 2026
      </Eyebrow>
    );
    const el = screen.getByTestId('e');
    expect(el.querySelector('.tb-eyebrow-pulse')).not.toBeNull();
  });
});
