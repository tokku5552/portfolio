"use server";

import { client } from "../clients/microcms";
import { fetchArticles } from "../features/article/apis/article";
import Home from "../features/home/Home.page";
import { News } from "../features/news/types/news";
import { ListProps } from "../types/ListCMS";

export default async function HomePage() {
  const data = await client.get<ListProps<News>>({ endpoint: "news" });
  const articles = await fetchArticles(3);
  return (
    <>
      <Home news={data.contents} articles={articles} />
    </>
  );
}
