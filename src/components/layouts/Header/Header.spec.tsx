import { fireEvent, render, screen } from '@testing-library/react';
import Header from './index';

describe('Header', () => {
  it('is closed by default', () => {
    const { container } = render(<Header />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('#header-mobile-menu')).toBeNull();
  });

  it('opens the mobile menu inside <nav> and closes it again', () => {
    const { container } = render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    const toggle = screen.getByRole('button', { name: 'Close menu' });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const menu = container.querySelector('#header-mobile-menu');
    expect(menu).not.toBeNull();
    expect(menu?.closest('nav')).not.toBeNull();

    fireEvent.click(toggle);
    expect(container.querySelector('#header-mobile-menu')).toBeNull();
    expect(
      screen
        .getByRole('button', { name: 'Open menu' })
        .getAttribute('aria-expanded')
    ).toBe('false');
  });

  it('renders the mobile CTA as an external link and closes on click', () => {
    const { container } = render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    const menu = container.querySelector('#header-mobile-menu');
    const cta = Array.from(menu?.querySelectorAll('a') ?? []).find((a) =>
      a.textContent?.includes('Get in touch')
    );
    expect(cta).toBeDefined();
    expect(cta?.getAttribute('target')).toBe('_blank');
    expect(cta?.getAttribute('rel')).toBe('noopener noreferrer');

    fireEvent.click(cta as HTMLAnchorElement);
    expect(container.querySelector('#header-mobile-menu')).toBeNull();
  });
});
