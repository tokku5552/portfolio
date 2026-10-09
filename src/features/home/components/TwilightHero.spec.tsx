import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import TwilightHero from './TwilightHero';

describe('TwilightHero', () => {
  it('includes the CSS Orb in server-rendered HTML for first paint', () => {
    expect(renderToString(<TwilightHero />)).toMatch(/tb-orb-wrap/);
  });

  it('hides the Orb once the particle field takes over', () => {
    const { container } = render(<TwilightHero hideOrb />);
    const layer = container.querySelector('.tb-orb-wrap')?.parentElement;
    expect(layer?.className).toMatch(/invisible/);
    expect(layer?.className).toMatch(/opacity-0/);
  });
});
