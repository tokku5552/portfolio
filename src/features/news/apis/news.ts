import { client } from '../../../clients/microcms';
import { ListProps } from '../../../types/ListCMS';
import { News } from '../types/news';

export const fetchNewsList = async () =>
  await client.get<ListProps<News>>({
    endpoint: 'news?limit=100&orders=-openAt',
  });

export const fetchNews = async (id: string) =>
  await client.get<News>({
    endpoint: 'news',
    contentId: id,
  });
