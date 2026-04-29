import { staticArticlesData } from '../data/static-data';
import { fetchArticlesFromQiita } from './qiita';
import { fetchArticlesFromZenn } from './zenn';

export const fetchArticles = async (num?: number) => {
  const zennArticles = await fetchArticlesFromZenn();
  const qiitaArticles = await fetchArticlesFromQiita();
  const staticArticles = staticArticlesData;

  const articles = [...zennArticles, ...qiitaArticles, ...staticArticles];
  const sortedArticles = articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return num ? sortedArticles.slice(0, num) : sortedArticles;
};
