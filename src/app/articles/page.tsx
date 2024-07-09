"use server";

import { ArticleList } from "../../features/article/ArticleList.page";
import { fetchArticles } from "../../features/article/apis/article";

export default async function ArticlesPage() {
  const articles = await fetchArticles();
  return (
    <>
      <ArticleList articles={articles} />
    </>
  );
}
