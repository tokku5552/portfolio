"use server";

import { NewsDetail } from "../../../features/news/NewsDetail.page";
import { fetchNews, fetchNewsList } from "../../../features/news/apis/news";

interface NewsDetailPageProps {
  params: { news_id: string };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const id = params.news_id;
  const news = await fetchNews(id);
  return (
    <>
      <NewsDetail news={news} />
    </>
  );
}

export async function generateStaticParams() {
  const datas = await fetchNewsList();

  return datas.contents.map((data) => ({
    news_id: data.id,
  }));
}
