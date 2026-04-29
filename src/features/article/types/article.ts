export interface Article {
  title: string;
  bodySummary: string;
  source: 'zenn' | 'qiita' | 'blog';
  url: string;
  publishedAt: string;
  imageUrl: string;
}
