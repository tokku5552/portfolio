import Seo from '@/components/layouts/Seo';
import { GetStaticProps } from 'next';
import { fetchArticles } from '../features/article/apis/article';
import { Article } from '../features/article/types/article';
import { fetchWorksOgpImages } from '../features/home/apis/works';
import Home from '../features/home/Home.page';

interface HomePageProps {
  articles: Article[];
  worksOgpImages: Record<string, string>;
}

export default function HomePage({ articles, worksOgpImages }: HomePageProps) {
  return (
    <>
      <Seo />
      <Home articles={articles} worksOgpImages={worksOgpImages} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [articles, worksOgpImages] = await Promise.all([
    fetchArticles(3),
    fetchWorksOgpImages(),
  ]);
  return {
    props: {
      articles: articles,
      worksOgpImages: worksOgpImages,
    },
  };
};
