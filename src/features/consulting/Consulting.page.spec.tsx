import { render, screen } from '@testing-library/react';
import Consulting from './Consulting.page';

describe('Consulting.page', () => {
  it('renders all sections in order: hero / problems / promises / deliverables / results / profile / flow / faq / cta', () => {
    const { container } = render(<Consulting />);
    const sections = Array.from(container.querySelectorAll('section[id]')).map(
      (s) => s.getAttribute('id')
    );
    expect(sections).toEqual([
      'hero',
      'problems',
      'promises',
      'deliverables',
      'results',
      'profile',
      'flow',
      'faq',
      'cta',
    ]);
  });

  it('renders the headline in the HERO section', () => {
    render(<Consulting />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('名前のついた面倒は');
  });

  it('links the primary CTA to the contact Google Form', () => {
    render(<Consulting />);
    const ctas = screen.getAllByRole('link', { name: '相談を申し込む' });
    expect(ctas.length).toBeGreaterThanOrEqual(2);
    ctas.forEach((cta) => {
      expect(cta.getAttribute('href')).toBe(
        'https://forms.gle/fvHkjYuSExq6EvUr9'
      );
    });
  });

  it('does not mention Mercari anywhere on the page', () => {
    const { container } = render(<Consulting />);
    expect(container.textContent).not.toContain('メルカリ');
    expect(container.textContent).not.toContain('Mercari');
  });
});
