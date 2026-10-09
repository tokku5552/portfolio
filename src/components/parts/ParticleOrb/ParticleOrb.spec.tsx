import { render, screen } from '@testing-library/react';
import ParticleOrb from './ParticleOrb';

describe('ParticleOrb', () => {
  let getContext: jest.SpyInstance;

  beforeEach(() => {
    // jsdom has no WebGL; make that explicit instead of hitting its
    // "not implemented" console error.
    getContext = jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(null);
  });

  afterEach(() => {
    getContext.mockRestore();
  });

  it('falls back to the CSS Orb when WebGL is unavailable', () => {
    render(<ParticleOrb data-testid="particle-orb" />);
    const el = screen.getByTestId('particle-orb');
    const orb = el.querySelector('.tb-orb-wrap');
    expect(orb).not.toBeNull();
    expect(orb?.getAttribute('data-pos')).toBe('tr');
    expect(el.querySelector('canvas')).toBeNull();
  });

  it('is aria-hidden so screen readers ignore the decorative layer', () => {
    render(<ParticleOrb data-testid="particle-orb" />);
    expect(screen.getByTestId('particle-orb').getAttribute('aria-hidden')).toBe(
      'true'
    );
  });
});
