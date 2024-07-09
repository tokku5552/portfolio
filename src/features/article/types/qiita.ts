export interface QiitaArticleResponse {
  rendered_body: string;
  body: string;
  coediting: boolean;
  comments_count: number;
  created_at: Date;
  group: null;
  id: string;
  likes_count: number;
  private: boolean;
  reactions_count: number;
  stocks_count: number;
  tags: {
    name: string;
    versions: string[];
  }[];
  title: string;
  updated_at: Date;
  url: string;
  user: {
    description: string;
    facebook_id: string;
    followees_count: number;
    followers_count: number;
    github_login_name: string;
    id: string;
    items_count: number;
    linkedin_id: string;
    location: string;
    name: string;
    organization: string;
    permanent_id: number;
    profile_image_url: string;
    team_only: boolean;
    twitter_screen_name: string;
    website_url: string;
  };
  page_views_count: number;
  team_membership: null;
  organization_url_name: string;
  slide: boolean;
}

export interface QiitaArticle {
  renderedBody: string;
  body: string;
  coediting: boolean;
  commentsCount: number;
  createdAt: Date;
  group: null;
  id: string;
  likesCount: number;
  private: boolean;
  reactionsCount: number;
  stocksCount: number;
  tags: {
    name: string;
    versions: string[];
  }[];
  title: string;
  updatedAt: Date;
  url: string;
  user: {
    description: string;
    facebookId: string;
    followeesCount: number;
    followersCount: number;
    githubLoginName: string;
    id: string;
    itemsCount: number;
    linkedinId: string;
    location: string;
    name: string;
    organization: string;
    permanentId: number;
    profileImageUrl: string;
    teamOnly: boolean;
    twitterScreenName: string;
    websiteUrl: string;
  };
  pageViewsCount: number;
  teamMembership: null;
  organizationUrlName: string;
  slide: boolean;
}
