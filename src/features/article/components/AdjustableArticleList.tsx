import { formatDate } from '../../../libs/date';
import { Article } from '../types/article';
import { ArticleItem } from './ArticleItem';

interface AdjustableArticleListProps {
  articles: Article[];
  displayNumber?: number;
}

export function AdjustableArticleList({
  articles,
  displayNumber,
}: AdjustableArticleListProps) {
  const displayArticles = displayNumber
    ? articles.slice(0, displayNumber)
    : articles;

  return (
    <ul className="flex flex-col gap-4">
      {displayArticles.map((article) => (
        <li key={article.url}>
          <ArticleItem
            title={article.title}
            url={article.url}
            formatedDate={formatDate(`${article.publishedAt}`)}
            contents={article.bodySummary}
            imageUrl={article.imageUrl}
            source={article.source}
          />
        </li>
      ))}
    </ul>
  );
}
