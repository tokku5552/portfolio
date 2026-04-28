import { useState } from 'react';
import Button from '../../components/parts/Button';
import Container from '../../components/parts/Container';
import Eyebrow from '../../components/parts/Eyebrow';
import Link from '../../components/parts/Link';
import { AdjustableArticleList } from './components/AdjustableArticleList';
import { Article } from './types/article';

interface ArticleListProps {
  articles: Article[];
}

const PAGE_SIZE = 10;

export function ArticleList({ articles }: ArticleListProps) {
  const [displayNumber, setDisplayNumber] = useState(PAGE_SIZE);

  const displayArticles = articles.slice(0, displayNumber);
  const hasMore = displayNumber < articles.length;

  return (
    <Container className="py-20 md:py-28">
      <Eyebrow className="mb-6">{'// Writing'}</Eyebrow>
      <h1 className="mb-12 font-brand-sans text-[clamp(40px,6vw,72px)] font-black leading-[0.95] tracking-[-0.03em] text-brand-fg">
        Articles
      </h1>

      <AdjustableArticleList articles={displayArticles} />

      <div className="mt-10 flex flex-col items-start gap-6">
        {hasMore ? (
          <Button
            variant="ghost"
            onClick={() => setDisplayNumber((n) => n + PAGE_SIZE)}
          >
            <span>Load more</span>
            <span aria-hidden="true" className="font-brand-mono">
              ↓
            </span>
          </Button>
        ) : null}

        <Link
          href="/"
          className="font-brand-mono text-[12px] uppercase tracking-[0.08em] text-brand-muted transition-colors hover:text-brand-fg"
        >
          ← Home
        </Link>
      </div>
    </Container>
  );
}
