import useSWR from 'swr';
import { ZennArticle } from '../types/zenn';

// unused
export const useZennArticles = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR<ZennArticle[]>(
    'https://zenn.dev/api/articles?username=tokku5552&order=latest',
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
