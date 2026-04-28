import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders a button[type=button] by default with primary variant classes', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.getAttribute('type')).toBe('button');
    expect(btn.className).toMatch(/tb-btn-primary/);
    expect(btn.className).toMatch(/bg-brand-fg/);
  });

  it('switches class set when variant=ghost', () => {
    render(<Button variant="ghost">Cancel</Button>);
    const btn = screen.getByRole('button', { name: 'Cancel' });
    expect(btn.className).toMatch(/border-brand-border-strong/);
    expect(btn.className).not.toMatch(/tb-btn-primary/);
  });

  it('forwards className through cn() so callers can override conflicts', () => {
    render(
      <Button className="px-4" data-testid="b">
        x
      </Button>
    );
    const btn = screen.getByTestId('b');
    expect(btn.className).toMatch(/\bpx-4\b/);
    // primary variant ships px-7; the override should win via tailwind-merge
    expect(btn.className).not.toMatch(/\bpx-7\b/);
  });
});
