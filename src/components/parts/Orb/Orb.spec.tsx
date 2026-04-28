import { render, screen } from '@testing-library/react';
import Orb from './Orb';

describe('Orb', () => {
  it('renders with data-pos="tr" by default', () => {
    render(<Orb data-testid="orb" />);
    const el = screen.getByTestId('orb');
    expect(el.getAttribute('data-pos')).toBe('tr');
    expect(el.className).toMatch(/tb-orb-wrap/);
    expect(el.querySelector('.tb-orb')).not.toBeNull();
  });

  it('honours the position prop', () => {
    render(<Orb position="center" data-testid="orb" />);
    expect(screen.getByTestId('orb').getAttribute('data-pos')).toBe('center');
  });

  it('is aria-hidden so screen readers ignore the decorative orb', () => {
    render(<Orb data-testid="orb" />);
    expect(screen.getByTestId('orb').getAttribute('aria-hidden')).toBe('true');
  });
});
