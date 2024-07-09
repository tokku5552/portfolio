'use client'

import { VStack, useBreakpointValue } from '@chakra-ui/react';
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
  // 表示個数が指定されている場合は、その個数分のみ表示する
  const displayArticles = displayNumber
    ? articles.slice(0, displayNumber)
    : articles;
  const boxWidth = useBreakpointValue({ base: '95%', md: '80%' });

  return (
    <>
      <VStack spacing={4} align="start" width={boxWidth} margin="auto" pt={10}>
        {displayArticles.map((article, index) => (
          <ArticleItem
            key={index}
            title={article.title}
            url={article.url}
            formatedDate={formatDate(`${article.publishedAt}`)}
            contents={article.bodySummary}
            imageUrl={article.imageUrl}
          />
        ))}
      </VStack>
    </>
  );
}
