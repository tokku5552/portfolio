import Link from '../../../components/parts/Link';
import { AdjustableArticleList } from '../../article/components/AdjustableArticleList';
import { Article } from '../../article/types/article';
import HomeSection from './HomeSection';

interface ArticlesSectionProps {
  articles: Article[];
}

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  return (
    <HomeSection
      id="articles"
      eyebrow="// Writing"
      heading="Articles"
      description="Zenn / Qiita / 自前ブログから集約した最近の記事。"
    >
      <AdjustableArticleList articles={articles} displayNumber={3} />
      <div className="mt-8">
        <Link
          href="/articles"
          className="font-brand-mono text-[12px] uppercase tracking-[0.08em] text-brand-fg transition-colors hover:text-brand-muted"
        >
          See all articles →
        </Link>
      </div>
    </HomeSection>
  );
}
