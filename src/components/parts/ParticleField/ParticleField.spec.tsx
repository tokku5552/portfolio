import { render, screen } from '@testing-library/react';
import ParticleField from './ParticleField';

describe('ParticleField', () => {
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

  it('renders no canvas and never reports active when WebGL is unavailable', () => {
    const onActiveChange = jest.fn();
    render(
      <ParticleField
        data-testid="field"
        stages={[{ id: 'hero', stage: 0 }]}
        onActiveChange={onActiveChange}
      />
    );
    expect(screen.getByTestId('field').querySelector('canvas')).toBeNull();
    expect(onActiveChange).not.toHaveBeenCalled();
  });

  it('is an aria-hidden, non-interactive layer with a sticky viewport', () => {
    render(<ParticleField data-testid="field" stages={[]} />);
    const el = screen.getByTestId('field');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.className).toMatch(/pointer-events-none/);
    expect(el.className).toMatch(/absolute/);
    expect(el.firstElementChild?.className).toMatch(/sticky/);
  });

  it('falls back to 100vh where lvh is unsupported', () => {
    render(<ParticleField data-testid="field" stages={[]} />);
    const sticky = screen.getByTestId('field').firstElementChild;
    expect(sticky?.className).toMatch(/\bh-screen\b/);
    expect(sticky?.className).toMatch(/\bh-lvh\b/);
  });

  it('declines software-rendered WebGL', () => {
    render(<ParticleField stages={[]} />);
    expect(getContext).toHaveBeenCalledWith(
      'webgl',
      expect.objectContaining({ failIfMajorPerformanceCaveat: true })
    );
  });
});
