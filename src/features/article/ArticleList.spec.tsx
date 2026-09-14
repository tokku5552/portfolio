import { fireEvent, render, screen } from '@testing-library/react';
import { ArticleList } from './ArticleList.page';
import { Article } from './types/article';

const makeArticles = (count: number): Article[] =>
  Array.from({ length: count }, (_, i) => ({
    title: `Article ${i + 1}`,
    bodySummary: `Summary ${i + 1}`,
    source: 'blog',
    url: `https://example.com/articles/${i + 1}`,
    publishedAt: '2024-01-01T00:00:00.000Z',
    imageUrl: '',
  }));

const countItems = (container: HTMLElement) =>
  container.querySelectorAll('ul > li').length;

describe('ArticleList', () => {
  it('shows 10 articles at first and loads 10 more per click', () => {
    const { container } = render(<ArticleList articles={makeArticles(25)} />);
    expect(countItems(container)).toBe(10);

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(countItems(container)).toBe(20);

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(countItems(container)).toBe(25);
    expect(screen.queryByRole('button', { name: 'Load more' })).toBeNull();
  });

  it('hides the Load more button when all articles fit in one page', () => {
    const { container } = render(<ArticleList articles={makeArticles(10)} />);
    expect(countItems(container)).toBe(10);
    expect(screen.queryByRole('button', { name: 'Load more' })).toBeNull();
  });
});
