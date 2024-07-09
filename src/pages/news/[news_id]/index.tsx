import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { NewsDetail } from '../../../features/news/NewsDetail.page';
import { fetchNews, fetchNewsList } from '../../../features/news/apis/news';
import { News } from '../../../features/news/types/news';

interface NewsDetailPageProps {
  news: News;
}

export default function NewsDetailPage({ news }: NewsDetailPageProps) {
  return (
    <>
      <NewsDetail news={news} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetchNewsList();
  const paths = data.contents.map((content) => `/news/${content.id}`);
  return {
    paths,
    fallback: false,
  };
};

interface Params extends ParsedUrlQuery {
  news_id: string;
}

export const getStaticProps: GetStaticProps<
  NewsDetailPageProps,
  Params
> = async (context) => {
  const { params } = context;

  if (!params) {
    return {
      notFound: true,
    };
  }

  const id = params.news_id;
  const data = await fetchNews(id);

  return {
    props: {
      news: {
        ...data,
      },
    },
  };
};
