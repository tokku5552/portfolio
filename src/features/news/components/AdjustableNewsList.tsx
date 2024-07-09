'use client'

import { VStack, useBreakpointValue } from '@chakra-ui/react';
import { formatDate } from '../../../libs/date';
import { News } from '../types/news';
import { AdjustableNewsItem } from './AdjustableNewsItem';

interface AdjustableNewsListProps {
  news: News[];
  displayNumber?: number;
}

export function AdjustableNewsList({
  news,
  displayNumber,
}: AdjustableNewsListProps) {
  // 表示個数が指定されている場合は、その個数分のみ表示する
  const displayNews = displayNumber ? news.slice(0, displayNumber) : news;
  const boxWidth = useBreakpointValue({ base: '95%', md: '80%' });

  return (
    <>
      <VStack spacing={4} align="start" width={boxWidth} margin="auto" pt={10}>
        {displayNews.map((news) => (
          <AdjustableNewsItem
            key={news.id}
            title={news.title}
            url={`/news/${news.id}`}
            formatedDate={formatDate(news.openAt)}
            contents={news.body}
            imageUrl={news.image.url}
          />
        ))}
      </VStack>
    </>
  );
}
