export interface ZennArticleResponse {
  articles: {
    id: number;
    post_type: 'Article';
    title: string;
    slug: string;
    comments_count: number;
    liked_count: number;
    body_letters_count: number;
    article_type: 'tech';
    emoji: string;
    is_suspending_private: boolean;
    published_at: string;
    body_updated_at: string;
    source_repo_updated_at: null;
    pinned: boolean;
    path: string;
    user: {
      id: number;
      username: string;
      name: string;
      avatar_small_url: string;
    };
    publication: null;
  }[];
  total_count: number;
  next_page: number;
  prev_page: number;
}

export interface ZennArticle {
  id: number;
  postType: 'Article';
  title: string;
  slug: string;
  commentsCount: number;
  likedCount: number;
  bodyLettersCount: number;
  articleType: 'tech';
  emoji: string;
  isSuspendingPrivate: boolean;
  publishedAt: string;
  bodyUpdatedAt: string;
  sourceRepoUpdatedAt: null;
  pinned: boolean;
  path: string;
  user: {
    id: number;
    username: string;
    name: string;
    avatarSmallUrl: string;
  };
  publication: null;
}
