import { JSDOM } from "jsdom";
import { stripHtmlTags, truncateText } from "../../../libs/text";
import { extractOgp, OgpData } from "../functions/extractOgp";
import { Article } from "../types/article";
import { ZennArticle, ZennArticleResponse } from "../types/zenn";

export const fetchArticlesFromZenn = async (): Promise<Article[]> => {
  const res = await fetch(
    "https://zenn.dev/api/articles?username=tokku5552&order=latest"
  );
  const response: ZennArticleResponse = await res.json();

  const zennArticles = toZennArticles(response);
  const result = await Promise.all(
    zennArticles.map(async (zennArticle) => {
      const [ogp, description] = await fetchOgpDataFromZenn(
        `https://zenn.dev/${zennArticle.user.username}/articles/${zennArticle.slug}`
      );
      return {
        zennArticle,
        ogp,
        description,
      };
    })
  );

  return result.map((item) =>
    toArticleFromZenn(item.zennArticle, item.description, item.ogp["og:image"])
  );
};

const fetchOgpDataFromZenn = async (
  url: string
): Promise<[OgpData, string]> => {
  const encodedUri = encodeURI(url);
  const res = await fetch(encodedUri, {
    headers: {
      "User-Agent": "bot",
    },
  });
  const html = await res.text();
  const dom = new JSDOM(html);

  // metaデータを取得し、ogpの各データを抽出
  const meta = dom.window.document.head.querySelectorAll("meta");
  const metaElements = Array.from(meta);
  const ogp = extractOgp([...metaElements]);

  // bodyからdescriptionを生成
  const body = dom.window.document.body.querySelectorAll("p");
  const bodyElements = Array.from(body);
  const textContents = bodyElements.map((element) => element.textContent);
  const description = truncateText(stripHtmlTags(textContents.join()), 100);

  return [ogp, description];
};

const toZennArticles = (response: ZennArticleResponse): ZennArticle[] => {
  return response.articles.map((article) => ({
    id: article.id,
    postType: article.post_type,
    title: article.title,
    slug: article.slug,
    commentsCount: article.comments_count,
    likedCount: article.liked_count,
    bodyLettersCount: article.body_letters_count,
    articleType: article.article_type,
    emoji: article.emoji,
    isSuspendingPrivate: article.is_suspending_private,
    publishedAt: article.published_at,
    bodyUpdatedAt: article.body_updated_at,
    sourceRepoUpdatedAt: article.source_repo_updated_at,
    pinned: article.pinned,
    path: article.path,
    user: {
      id: article.user.id,
      username: article.user.username,
      name: article.user.name,
      avatarSmallUrl: article.user.avatar_small_url,
    },
    publication: article.publication,
  }));
};

const toArticleFromZenn = (
  zennArticle: ZennArticle,
  bodySummary: string,
  imageUrl: string
): Article => {
  return {
    title: zennArticle.title,
    bodySummary: bodySummary,
    source: "zenn",
    url: `https://zenn.dev/${zennArticle.user.username}/articles/${zennArticle.slug}`,
    publishedAt: zennArticle.publishedAt,
    imageUrl: imageUrl,
  };
};
