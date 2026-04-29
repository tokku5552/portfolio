export interface Article {
  title: string;
  bodySummary: string;
  source: 'zenn' | 'qiita' | 'note' | 'blog';
  url: string;
  publishedAt: string;
  imageUrl: string;
}
