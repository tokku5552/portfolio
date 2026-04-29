import { staticArticlesData } from '../data/static-data';
import { fetchArticlesFromNote } from './note';
import { fetchArticlesFromQiita } from './qiita';
import { fetchArticlesFromZenn } from './zenn';

export const fetchArticles = async (num?: number) => {
  const [zennArticles, qiitaArticles, noteArticles] = await Promise.all([
    fetchArticlesFromZenn(),
    fetchArticlesFromQiita(),
    fetchArticlesFromNote(),
  ]);
  const staticArticles = staticArticlesData;

  const articles = [
    ...zennArticles,
    ...qiitaArticles,
    ...noteArticles,
    ...staticArticles,
  ];
  const sortedArticles = articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return num ? sortedArticles.slice(0, num) : sortedArticles;
};
