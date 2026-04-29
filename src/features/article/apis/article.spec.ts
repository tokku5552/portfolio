import { fetchArticles } from './article';
import { fetchArticlesFromQiita } from './qiita';
import { fetchArticlesFromZenn } from './zenn';

jest.mock('./qiita', () => ({
  fetchArticlesFromQiita: jest.fn(),
}));

jest.mock('./zenn', () => ({
  fetchArticlesFromZenn: jest.fn(),
}));

describe('fetchArticles', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('公開日の降順でソートされる（複数ソース混在）', async () => {
    (fetchArticlesFromZenn as jest.Mock).mockResolvedValue([
      {
        title: 'zenn old',
        bodySummary: '',
        source: 'zenn',
        url: 'https://zenn.dev/old',
        publishedAt: new Date('2024-01-01T00:00:00.000Z'),
        imageUrl: '',
      },
      {
        title: 'zenn newest',
        bodySummary: '',
        source: 'zenn',
        url: 'https://zenn.dev/newest',
        publishedAt: new Date('2024-04-01T00:00:00.000Z'),
        imageUrl: '',
      },
    ]);

    (fetchArticlesFromQiita as jest.Mock).mockResolvedValue([
      {
        title: 'qiita middle',
        bodySummary: '',
        source: 'qiita',
        url: 'https://qiita.com/middle',
        publishedAt: new Date('2024-02-01T00:00:00.000Z'),
        imageUrl: '',
      },
    ]);

    const articles = await fetchArticles();

    const publishedTimes = articles.map((article) =>
      article.publishedAt.getTime()
    );
    const sortedTimes = [...publishedTimes].sort((a, b) => b - a);

    expect(publishedTimes).toEqual(sortedTimes);

    const targetTitles = articles
      .filter((article) =>
        ['zenn newest', 'qiita middle', 'zenn old'].includes(article.title)
      )
      .map((article) => article.title);
    expect(targetTitles).toEqual(['zenn newest', 'qiita middle', 'zenn old']);
  });
});
