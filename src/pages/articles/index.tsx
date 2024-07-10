import Seo, { MetaData } from '@/components/layouts/Seo';
import { baseURL } from '@/config/constants';
import { GetStaticProps } from 'next';
import { ArticleList } from '../../features/article/ArticleList.page';
import { fetchArticles } from '../../features/article/apis/article';
import { Article } from '../../features/article/types/article';

interface ArticlePageProps {
  articles: Article[];
}

export default function ArticlesPage({ articles }: ArticlePageProps) {
  const metaData: MetaData = {
    pageTitle: '記事一覧',
    pagePath: `${baseURL}/news`,
  };

  return (
    <>
      <Seo {...metaData} />
      <ArticleList articles={articles} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const articles = await fetchArticles();

  return {
    props: {
      articles: articles,
    },
  };
};
