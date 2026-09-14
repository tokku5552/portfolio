import { fetchArticlesFromZenn } from './zenn';

const ZENN_API_URL =
  'https://zenn.dev/api/articles?username=tokku5552&order=latest';

const buildZennApiArticle = (slug: string) => ({
  id: 1,
  post_type: 'Article',
  title: `title-${slug}`,
  slug,
  comments_count: 0,
  liked_count: 0,
  body_letters_count: 0,
  article_type: 'tech',
  emoji: '',
  is_suspending_private: false,
  published_at: '2025-01-01T00:00:00.000Z',
  body_updated_at: '2025-01-01T00:00:00.000Z',
  source_repo_updated_at: null,
  pinned: false,
  path: `/tokku5552/articles/${slug}`,
  user: {
    id: 1,
    username: 'tokku5552',
    name: 'tokku5552',
    avatar_small_url: '',
  },
  publication: null,
});

const articleHtml = (slug: string) => `<!doctype html>
<html>
  <head><meta property="og:image" content="https://example.com/${slug}.png" /></head>
  <body><p>first paragraph</p><p>second paragraph</p></body>
</html>`;

describe('fetchArticlesFromZenn', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    delete (globalThis as { fetch?: typeof fetch }).fetch;
    jest.restoreAllMocks();
  });

  test('1 件の OGP 取得が失敗しても他の記事は残り、失敗した記事は OGP なしで返る', async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url === ZENN_API_URL) {
        return {
          ok: true,
          json: async () => ({
            articles: ['ok-1', 'broken', 'ok-2'].map(buildZennApiArticle),
          }),
        };
      }
      if (url.endsWith('/broken')) {
        throw new Error('network error');
      }
      const slug = url.split('/').pop() as string;
      return { ok: true, text: async () => articleHtml(slug) };
    });

    const articles = await fetchArticlesFromZenn();

    expect(articles.map((a) => a.title)).toEqual([
      'title-ok-1',
      'title-broken',
      'title-ok-2',
    ]);
    expect(articles[0].imageUrl).toBe('https://example.com/ok-1.png');
    expect(articles[1].imageUrl).toBe('');
    expect(articles[1].bodySummary).toBe('');
    expect(articles[2].imageUrl).toBe('https://example.com/ok-2.png');
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('broken'),
      'network error'
    );
  });

  test('本文の段落を空白区切りで要約にする', async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url === ZENN_API_URL) {
        return {
          ok: true,
          json: async () => ({ articles: [buildZennApiArticle('a')] }),
        };
      }
      return { ok: true, text: async () => articleHtml('a') };
    });

    const [article] = await fetchArticlesFromZenn();

    expect(article.bodySummary).toBe('first paragraph second paragraph');
  });

  test('すべての fetch に timeout 用の signal を渡す', async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url === ZENN_API_URL) {
        return {
          ok: true,
          json: async () => ({ articles: [buildZennApiArticle('a')] }),
        };
      }
      return { ok: true, text: async () => articleHtml('a') };
    });

    await fetchArticlesFromZenn();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [, init] of fetchMock.mock.calls) {
      expect(init?.signal).toBeInstanceOf(AbortSignal);
    }
  });
});
