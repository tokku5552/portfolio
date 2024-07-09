import { GetStaticProps } from 'next';
import { client } from '../clients/microcms';
import { fetchArticles } from '../features/article/apis/article';
import { Article } from '../features/article/types/article';
import Home from '../features/home/Home.page';
import { News } from '../features/news/types/news';
import { ListProps } from '../types/ListCMS';

interface HomePageProps {
  news: News[];
  articles: Article[];
}
export default function HomePage({ news, articles }: HomePageProps) {
  return (
    <>
      <Home news={news} articles={articles} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await client.get<ListProps<News>>({ endpoint: 'news' });
  const articles = await fetchArticles(3);
  return {
    props: {
      news: data.contents,
      articles: articles,
    },
  };
};
