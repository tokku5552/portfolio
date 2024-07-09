import { Article } from '../types/article';

export const staticArticlesData: Article[] = [
  {
    title:
      'AWS cafeteria #1 〜サイバーエージェント×ゆめみ×クラスメソッド 3社共催LT会〜 開催レポート | CyberAgent Developers Blog',
    bodySummary:
      'こんにちは。サイバーエージェント AI事業本部の徳田です。 先日2024年1月25日に開催されたAWS cafeteria #1の様子についてご紹介いたします。',
    source: 'blog',
    url: 'https://developers.cyberagent.co.jp/blog/archives/46221/',
    publishedAt: `${new Date('2024-02-04')}` as any,
    imageUrl:
      'https://developers.cyberagent.co.jp/blog/wp-content/uploads/2024/02/e2857132c0a68ad6f87379f38230e2f6.jpg',
  },
  {
    title:
      'Azure OpenAI ServiceをOpenAI APIとして使う技術 | CyberAgent Developers Blog',
    bodySummary:
      'この記事はCyberAgent Developers Advent Calendar 2023 7日目の記事です。こんにちは、AI事業本部の徳田(@tokkuu)です。OpenAIのC',
    source: 'blog',
    url: 'https://developers.cyberagent.co.jp/blog/archives/44386/',
    publishedAt: `${new Date('2023-12-7')}` as any,
    imageUrl:
      'https://developers.cyberagent.co.jp/blog/wp-content/uploads/2023/12/Twitter-OGP-1.jpg',
  },
];
