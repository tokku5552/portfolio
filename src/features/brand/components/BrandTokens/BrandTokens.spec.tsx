import { render } from '@testing-library/react';
import { brandTokens } from '../../../../../brand/tokens';
import BrandTokens from './index';

describe('BrandTokens', () => {
  it('renders one swatch label per color token from brandTokens.color', () => {
    const { container } = render(<BrandTokens />);
    const codes = Array.from(container.querySelectorAll('code')).map(
      (el) => el.textContent ?? ''
    );
    const colorKeys = Object.keys(brandTokens.color);
    for (const key of colorKeys) {
      expect(codes.some((text) => text === key)).toBe(true);
    }
    for (const value of Object.values(brandTokens.color)) {
      expect(codes.some((text) => text.includes(value))).toBe(true);
    }
  });

  it('renders one entry per font token', () => {
    const { container } = render(<BrandTokens />);
    const codes = Array.from(container.querySelectorAll('code')).map(
      (el) => el.textContent ?? ''
    );
    for (const value of Object.values(brandTokens.font)) {
      expect(codes.some((text) => text.includes(value))).toBe(true);
    }
  });
});
