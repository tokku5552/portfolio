import {
  Center,
  Link,
  Spacer,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Title } from '../../components/parts';
import { formatDate } from '../../libs/date';
import { ArticleItem } from './components/ArticleItem';
import { Article } from './types/article';

interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  const [displayNumber, setDisplayNumber] = useState(10);
  const [isScrollable, setIsScrollable] = useState(true);
  const boxWidth = useBreakpointValue({ base: '95%', md: '80%' });
  const displayArticles = articles.slice(0, displayNumber);

  const handleClickedMore = () => {
    setDisplayNumber(displayNumber + 10);
    if (displayNumber >= articles.length) {
      setIsScrollable(false);
    }
  };

  return (
    <>
      <Spacer height={8} />
      <Center>
        <Title as="h2">Articles</Title>
      </Center>
      <Spacer height={8} />
      <VStack spacing={4} align="start" width={boxWidth} margin="auto" pt={10}>
        {displayArticles.map((article, index) => {
          return (
            <ArticleItem
              key={index}
              title={article.title}
              url={article.url}
              formatedDate={formatDate(`${article.publishedAt}`)}
              contents={article.bodySummary}
              imageUrl={article.imageUrl}
            />
          );
        })}
      </VStack>
      <Spacer height={8} />
      {isScrollable && (
        <Center>
          <Text onClick={handleClickedMore} textDecoration="underline">
            more...
          </Text>
        </Center>
      )}
      <Spacer height={8} />
      <Center>
        <Link href="/" textDecoration="underline">
          <Text>{'< '}ホームへ戻る</Text>
        </Link>
      </Center>
      <Spacer height={8} />
    </>
  );
}
