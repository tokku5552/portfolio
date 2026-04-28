import Seo from '@/components/layouts/Seo';
import { GetStaticProps } from 'next';
import { fetchArticles } from '../features/article/apis/article';
import { Article } from '../features/article/types/article';
import Home from '../features/home/Home.page';

interface HomePageProps {
  articles: Article[];
}

export default function HomePage({ articles }: HomePageProps) {
  return (
    <>
      <Seo />
      <Home articles={articles} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const articles = await fetchArticles(3);
  return {
    props: {
      articles: articles,
    },
  };
};
