import { Center, Link, Spacer, Text } from '@chakra-ui/react';
import { Title } from '../../components/parts';
import { AdjustableNewsList } from './components/AdjustableNewsList';
import { News } from './types/news';

export function NewsList({ news }: { news: News[] }) {
  return (
    <>
      <Spacer height={8} />
      <Center>
        <Title as="h2">News</Title>
      </Center>
      <Spacer height={8} />

      <AdjustableNewsList news={news} />

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
