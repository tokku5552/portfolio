import { fetchArticlesFromQiita } from './qiita';

const QIITA_API_URL =
  'https://qiita.com/api/v2/authenticated_user/items?per_page=100&page=1';

const buildQiitaApiArticle = (id: string) => ({
  rendered_body: `<p>body of ${id}</p>`,
  body: '',
  coediting: false,
  comments_count: 0,
  created_at: '2025-01-01T00:00:00+09:00',
  group: null,
  id,
  likes_count: 0,
  private: false,
  reactions_count: 0,
  stocks_count: 0,
  tags: [],
  title: `title-${id}`,
  updated_at: '2025-01-01T00:00:00+09:00',
  url: `https://qiita.com/tokku5552/items/${id}`,
  user: {},
  page_views_count: null,
  team_membership: null,
  organization_url_name: null,
  slide: false,
});

describe('fetchArticlesFromQiita', () => {
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
      if (url === QIITA_API_URL) {
        return {
          ok: true,
          json: async () =>
            ['ok-1', 'broken', 'ok-2'].map(buildQiitaApiArticle),
        };
      }
      const id = url.split('/').pop() as string;
      if (id === 'broken') {
        throw new Error('network error');
      }
      return {
        ok: true,
        text: async () =>
          `<html><head><meta property="og:image" content="https://example.com/${id}.png" /></head><body></body></html>`,
      };
    });

    const articles = await fetchArticlesFromQiita();

    expect(articles.map((a) => a.title)).toEqual([
      'title-ok-1',
      'title-broken',
      'title-ok-2',
    ]);
    expect(articles[0].imageUrl).toBe('https://example.com/ok-1.png');
    expect(articles[1].imageUrl).toBe('');
    expect(articles[1].bodySummary).toBe('body of broken');
    expect(articles[2].imageUrl).toBe('https://example.com/ok-2.png');
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('broken'),
      'network error'
    );
    for (const [, init] of fetchMock.mock.calls) {
      expect(init?.signal).toBeInstanceOf(AbortSignal);
    }
  });
});
