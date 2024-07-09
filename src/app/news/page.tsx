"use server";

import { NewsList } from "../../features/news/NewsList.page";
import { fetchNewsList } from "../../features/news/apis/news";

export default async function NewsListPage() {
  const data = await fetchNewsList();
  return (
    <>
      <NewsList news={data.contents} />
    </>
  );
}
