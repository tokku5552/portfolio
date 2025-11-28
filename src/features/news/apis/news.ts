import { client, isMicrocmsConfigured } from '../../../clients/microcms';
import { ListProps } from '../../../types/ListCMS';
import { News } from '../types/news';

const createEmptyNewsList = (): ListProps<News> => ({
  contents: [],
  totalCount: 0,
  offset: 0,
  limit: 0,
});

export const fetchNewsList = async (): Promise<ListProps<News>> => {
  if (!isMicrocmsConfigured) {
    console.warn('MicroCMS is not configured; returning empty news list.');
    return createEmptyNewsList();
  }

  try {
    return await client.get<ListProps<News>>({
      endpoint: 'news?limit=100&orders=-openAt',
    });
  } catch (error) {
    console.warn(
      'Failed to fetch news list:',
      error instanceof Error ? error.message : error
    );
    return createEmptyNewsList();
  }
};

export const fetchNews = async (id: string): Promise<News | null> => {
  if (!isMicrocmsConfigured) {
    console.warn(
      'MicroCMS is not configured; cannot fetch news content for id:',
      id
    );
    return null;
  }

  try {
    return await client.get<News>({
      endpoint: 'news',
      contentId: id,
    });
  } catch (error) {
    console.warn(
      `Failed to fetch news content (id: ${id}):`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
};
