import { config } from '../../../config/environment';
import { mapWithConcurrency } from '../../../libs/mapWithConcurrency';
import { stripHtmlTags, truncateText } from '../../../libs/text';
import { extractOgp, OgpData } from '../functions/extractOgp';
import { Article } from '../types/article';
import { QiitaArticle, QiitaArticleResponse } from '../types/qiita';
import { createDom } from './createDom';
import { FETCH_TIMEOUT_MS, OGP_FETCH_CONCURRENCY } from './fetchConfig';

/**
 * Qiitaの記事を取得する
 * ref: https://qiita.com/api/v2/docs
 * @returns
 */
export const fetchArticlesFromQiita = async (): Promise<Article[]> => {
  if (!config.qiitaToken) {
    console.warn('NEXT_PUBLIC_QIITA_TOKEN is not set; skipping Qiita fetch.');
    return [];
  }

  try {
    const res = await fetch(
      'https://qiita.com/api/v2/authenticated_user/items?per_page=100&page=1',
      {
        headers: {
          Authorization: `Bearer ${config.qiitaToken}`,
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      }
    ).then((response) => response.json());

    if (!res || !Array.isArray(res)) {
      console.warn('Invalid response from Qiita API');
      return [];
    }

    const qiitaArticles = toQiitaArticles(res);
    const result = await mapWithConcurrency(
      qiitaArticles,
      OGP_FETCH_CONCURRENCY,
      async (qiitaArticle) => {
        const ogp = await fetchOgpDataFromQiita(qiitaArticle.url);
        return {
          qiitaArticle,
          ogp,
        };
      }
    );
    return result.map((item) =>
      toArticleFromQiita(item.qiitaArticle, item.ogp['og:image'] ?? '')
    );
  } catch (error) {
    console.warn(
      'Failed to fetch Qiita articles:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
};

const fetchOgpDataFromQiita = async (url: string): Promise<OgpData> => {
  try {
    const encodedUri = encodeURI(url);
    const res = await fetch(encodedUri, {
      headers: {
        'User-Agent': 'bot',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const html = await res.text();
    const dom = createDom(html);

    // metaデータを取得し、ogpの各データを抽出
    const meta = dom.window.document.head.querySelectorAll('meta');
    const metaElements = Array.from(meta);
    return extractOgp([...metaElements]);
  } catch (error) {
    console.warn(
      `Failed to fetch OGP from Qiita article ${url}:`,
      error instanceof Error ? error.message : error
    );
    return {};
  }
};

const toQiitaArticles = (response: QiitaArticleResponse[]): QiitaArticle[] => {
  return response.map((article) => ({
    title: article.title,
    renderedBody: article.rendered_body,
    url: article.url,
    createdAt: article.created_at,
  }));
};

const toArticleFromQiita = (
  qiitaArticle: QiitaArticle,
  imageUrl: string
): Article => {
  return {
    title: qiitaArticle.title,
    bodySummary: truncateText(stripHtmlTags(qiitaArticle.renderedBody), 100),
    source: 'qiita',
    url: qiitaArticle.url,
    publishedAt: new Date(qiitaArticle.createdAt).toISOString(),
    imageUrl: imageUrl,
  };
};
