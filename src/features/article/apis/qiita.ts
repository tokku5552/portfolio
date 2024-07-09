import { JSDOM } from "jsdom";
import { config } from "../../../config/environment";
import { stripHtmlTags, truncateText } from "../../../libs/text";
import { extractOgp, OgpData } from "../functions/extractOgp";
import { Article } from "../types/article";
import { QiitaArticle, QiitaArticleResponse } from "../types/qiita";

/**
 * Qiitaの記事を取得する
 * ref: https://qiita.com/api/v2/docs
 * @returns
 */
export const fetchArticlesFromQiita = async (): Promise<Article[]> => {
  const res = await fetch(
    "https://qiita.com/api/v2/authenticated_user/items?per_page=100&page=1",
    {
      headers: {
        Authorization: `Bearer ${config.qiitaToken}`,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  const qiitaArticles = toQiitaArticles(res);
  const result = await Promise.all(
    qiitaArticles.map(async (qiitaArticle) => {
      const ogp = await fetchOgpDataFromQiita(qiitaArticle.url);
      return {
        qiitaArticle,
        ogp,
      };
    })
  );
  return result.map((item) =>
    toArticleFromQiita(item.qiitaArticle, item.ogp["og:image"])
  );
};

const fetchOgpDataFromQiita = async (url: string): Promise<OgpData> => {
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

  return ogp;
};

const toQiitaArticles = (response: QiitaArticleResponse[]): QiitaArticle[] => {
  return response.map((article) => ({
    renderedBody: article.rendered_body,
    body: article.body,
    coediting: article.coediting,
    commentsCount: article.comments_count,
    createdAt: article.created_at,
    group: article.group,
    id: article.id,
    likesCount: article.likes_count,
    private: article.private,
    reactionsCount: article.reactions_count,
    stocksCount: article.stocks_count,
    tags: article.tags,
    title: article.title,
    updatedAt: article.updated_at,
    url: article.url,
    user: {
      description: article.user.description,
      facebookId: article.user.facebook_id,
      followeesCount: article.user.followees_count,
      followersCount: article.user.followers_count,
      githubLoginName: article.user.github_login_name,
      id: article.user.id,
      itemsCount: article.user.items_count,
      linkedinId: article.user.linkedin_id,
      location: article.user.location,
      name: article.user.name,
      organization: article.user.organization,
      permanentId: article.user.permanent_id,
      profileImageUrl: article.user.profile_image_url,
      teamOnly: article.user.team_only,
      twitterScreenName: article.user.twitter_screen_name,
      websiteUrl: article.user.website_url,
    },

    pageViewsCount: article.page_views_count,
    teamMembership: article.team_membership,
    organizationUrlName: article.organization_url_name,
    slide: article.slide,
  }));
};

const toArticleFromQiita = (
  qiitaArticle: QiitaArticle,
  imageUrl: string
): Article => {
  return {
    title: qiitaArticle.title,
    bodySummary: truncateText(stripHtmlTags(qiitaArticle.renderedBody), 100),
    source: "qiita",
    url: qiitaArticle.url,
    publishedAt: qiitaArticle.createdAt,
    imageUrl: imageUrl,
  };
};
