import { GetStaticProps } from 'next';
import { NewsList } from '../../features/news/NewsList.page';
import { fetchNewsList } from '../../features/news/apis/news';
import { News } from '../../features/news/types/news';

export default function NewsListPage({ news }: { news: News[] }) {
  return (
    <>
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
