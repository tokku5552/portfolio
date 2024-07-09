import { staticArticlesData } from '../data/static-data';
import { fetchArticlesFromQiita } from './qiita';
import { fetchArticlesFromZenn } from './zenn';

export const fetchArticles = async (num?: number) => {
  const zennArticles = await fetchArticlesFromZenn();
  const qiitaArticles = await fetchArticlesFromQiita();
  const staticArticles = staticArticlesData;

  const articles = [...zennArticles, ...qiitaArticles, ...staticArticles];
  // publishedAt で降順に並び替え
  const sortedArticles = articles.sort((a, b) => {
    return b.publishedAt < a.publishedAt ? -1 : 1;
  });

  return num ? sortedArticles.slice(0, num) : sortedArticles;
};
