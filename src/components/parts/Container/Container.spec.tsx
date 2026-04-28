import { render, screen } from '@testing-library/react';
import Container from './Container';

describe('Container', () => {
  it('centers content with max-width and gutters by default', () => {
    render(
      <Container data-testid="c">
        <span>x</span>
      </Container>
    );
    const el = screen.getByTestId('c');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toMatch(/mx-auto/);
    expect(el.className).toMatch(/max-w-shell/);
    expect(el.className).toMatch(/px-6/);
  });

  it('renders the requested element via `as` prop', () => {
    render(
      <Container as="section" data-testid="c">
        x
      </Container>
    );
    expect(screen.getByTestId('c').tagName).toBe('SECTION');
  });
});
