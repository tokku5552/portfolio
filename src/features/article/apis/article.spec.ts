import { Article } from '../types/article';

jest.mock('./zenn', () => ({
  fetchArticlesFromZenn: jest.fn(),
}));
jest.mock('./qiita', () => ({
  fetchArticlesFromQiita: jest.fn(),
}));
jest.mock('./note', () => ({
  fetchArticlesFromNote: jest.fn(),
}));
jest.mock('../data/static-data', () => ({
  staticArticlesData: [] as Article[],
}));

import { fetchArticles } from './article';
import { fetchArticlesFromNote } from './note';
import { fetchArticlesFromQiita } from './qiita';
import { fetchArticlesFromZenn } from './zenn';
import { staticArticlesData } from '../data/static-data';

const mockedZenn = fetchArticlesFromZenn as jest.MockedFunction<
  typeof fetchArticlesFromZenn
>;
const mockedQiita = fetchArticlesFromQiita as jest.MockedFunction<
  typeof fetchArticlesFromQiita
>;
const mockedNote = fetchArticlesFromNote as jest.MockedFunction<
  typeof fetchArticlesFromNote
>;

const buildArticle = (
  overrides: Partial<Article> & Pick<Article, 'title' | 'publishedAt'>
): Article => ({
  bodySummary: '',
  source: 'zenn',
  url: `https://example.com/${overrides.title}`,
  imageUrl: '',
  ...overrides,
});

describe('fetchArticles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (staticArticlesData as Article[]).length = 0;
  });

  test('publishedAt の降順で記事をソートする（複数ソース統合）', async () => {
    mockedZenn.mockResolvedValue([
      buildArticle({
        title: 'zenn-old',
        source: 'zenn',
        publishedAt: '2024-01-10T00:00:00.000Z',
      }),
      buildArticle({
        title: 'zenn-new',
        source: 'zenn',
        publishedAt: '2025-03-01T00:00:00.000Z',
      }),
    ]);
    mockedQiita.mockResolvedValue([
      buildArticle({
        title: 'qiita-mid',
        source: 'qiita',
        publishedAt: '2024-08-15T00:00:00.000Z',
      }),
    ]);
    mockedNote.mockResolvedValue([
      buildArticle({
        title: 'note-mid',
        source: 'note',
        publishedAt: '2025-01-15T00:00:00.000Z',
      }),
    ]);
    (staticArticlesData as Article[]).push(
      buildArticle({
        title: 'blog-newest',
        source: 'blog',
        publishedAt: '2026-04-01T00:00:00.000Z',
      }),
      buildArticle({
        title: 'blog-oldest',
        source: 'blog',
        publishedAt: '2023-05-20T00:00:00.000Z',
      })
    );

    const result = await fetchArticles();

    expect(result.map((a) => a.title)).toEqual([
      'blog-newest',
      'zenn-new',
      'note-mid',
      'qiita-mid',
      'zenn-old',
      'blog-oldest',
    ]);
  });

  test('num 引数で先頭 N 件のみを返す', async () => {
    mockedZenn.mockResolvedValue([
      buildArticle({
        title: 'a',
        publishedAt: '2025-01-01T00:00:00.000Z',
      }),
      buildArticle({
        title: 'b',
        publishedAt: '2024-01-01T00:00:00.000Z',
      }),
      buildArticle({
        title: 'c',
        publishedAt: '2023-01-01T00:00:00.000Z',
      }),
    ]);
    mockedQiita.mockResolvedValue([]);
    mockedNote.mockResolvedValue([]);

    const result = await fetchArticles(2);

    expect(result.map((a) => a.title)).toEqual(['a', 'b']);
  });
});
