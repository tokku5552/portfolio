import { GetStaticProps } from 'next';
import { ArticleList } from '../../features/article/ArticleList.page';
import { fetchArticles } from '../../features/article/apis/article';
import { Article } from '../../features/article/types/article';

interface ArticlePageProps {
  articles: Article[];
}

export default function ArticlesPage({ articles }: ArticlePageProps) {
  return (
    <>
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
