import { render } from '@testing-library/react';
import { lineSummaryLpUrl } from '../../../config/constants';
import WorksSection from './WorksSection';

describe('WorksSection', () => {
  it('renders the Works heading and the サマリ product card', () => {
    const { container } = render(<WorksSection />);

    const heading = container.querySelector('h2');
    expect(heading?.textContent).toBe('Works');

    const title = Array.from(container.querySelectorAll('h3')).map(
      (h) => h.textContent
    );
    expect(title).toContain('サマリ');
  });

  it('shows the product meta, description and external LP link', () => {
    const { container } = render(<WorksSection />);

    const link = container.querySelector(`a[href="${lineSummaryLpUrl}"]`);
    expect(link).not.toBeNull();
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');

    expect(container.textContent).toContain('Web App');
    expect(container.textContent).toContain(
      'サマリは、LINE グループの会話から'
    );
  });

  it('renders the og:image when one is provided for the product', () => {
    const imageUrl = 'https://cdn.example.com/line-summary-og.png';
    const { container } = render(
      <WorksSection ogImages={{ [lineSummaryLpUrl]: imageUrl }} />
    );

    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe(imageUrl);
  });

  it('stays a text-only card when no og:image is available', () => {
    const { container } = render(<WorksSection />);
    expect(container.querySelector('img')).toBeNull();
  });
});
