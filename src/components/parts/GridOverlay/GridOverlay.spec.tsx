import { render, screen } from '@testing-library/react';
import GridOverlay from './GridOverlay';

describe('GridOverlay', () => {
  it('is hidden by default (data-visible="false")', () => {
    render(<GridOverlay data-testid="g" />);
    const el = screen.getByTestId('g');
    expect(el.getAttribute('data-visible')).toBe('false');
    expect(el.className).toMatch(/tb-grid-overlay/);
  });

  it('exposes data-visible="true" when visible is set', () => {
    render(<GridOverlay visible data-testid="g" />);
    expect(screen.getByTestId('g').getAttribute('data-visible')).toBe('true');
  });
});
