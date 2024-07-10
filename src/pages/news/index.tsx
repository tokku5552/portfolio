import Seo, { MetaData } from '@/components/layouts/Seo';
import { baseURL } from '@/config/constants';
import { GetStaticProps } from 'next';
import { NewsList } from '../../features/news/NewsList.page';
import { fetchNewsList } from '../../features/news/apis/news';
import { News } from '../../features/news/types/news';

export default function NewsListPage({ news }: { news: News[] }) {
  const metaData: MetaData = {
    pageTitle: 'News一覧',
    pagePath: `${baseURL}/news`,
  };

  return (
    <>
      <Seo {...metaData} />
      <NewsList news={news} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetchNewsList();
  return {
    props: {
      news: data.contents,
    },
  };
};
