import { client, isMicrocmsConfigured } from '../../../clients/microcms';
import { ListProps } from '../../../types/ListCMS';
import { News } from '../types/news';

export const fetchNewsList = async () => {
  if (!isMicrocmsConfigured) {
    console.warn('MicroCMS is not configured; returning empty news list.');
    const emptyNews: ListProps<News> = {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    };
    return emptyNews;
  }

  return client.get<ListProps<News>>({
    endpoint: 'news?limit=100&orders=-openAt',
  });
};

export const fetchNews = async (id: string) => {
  if (!isMicrocmsConfigured) {
    throw new Error('MicroCMS is not configured; cannot fetch news content.');
  }

  return client.get<News>({
    endpoint: 'news',
    contentId: id,
  });
};
