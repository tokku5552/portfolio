import {
  Box,
  Center,
  HStack,
  Heading,
  Image,
  Link,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import parse from 'html-react-parser';
import {
  FacebookIcon,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  LineIcon,
  LineShareButton,
  TwitterShareButton,
  XIcon,
} from 'react-share';
import Seo, { MetaData } from '../../components/layouts/Seo';
import { formatDate } from '../../libs/date';
import { News } from './types/news';

interface NewsDetailProps {
  news: News;
}

export function NewsDetail({ news }: NewsDetailProps) {
  const metaData: MetaData = {
    pageTitle: news.title,
    pageDescription: news.body,
    pagePath: `https://portfolio-tokku5552.vercel.app/news/${news.id}`,
    pageImg: news.image.url,
  };
  const shareProps = {
    url: metaData.pagePath,
    title: metaData.pageTitle,
  };
  const shareButtonSize = 48;
  return (
    <>
      <Seo {...metaData} />
      <Spacer height={8} />
      <VStack spacing={6} align="stretch" px={[4, 4, 8, 8]}>
        <Center>
          <Heading as="h1" size="xl">
            {news.title}
          </Heading>
        </Center>

        <Box maxWidth={1000} margin="0 auto">
          {/* アイキャッチ画像の表示 */}

          <Box bg="white" p={5} borderRadius="md">
            <Center>
              <Image
                src={news.image.url}
                alt={news.title}
                w="80%"
                borderRadius="md"
              />
            </Center>
            <Spacer height={4} />
            <Box fontSize="md">
              <Text>{'公開日: ' + formatDate(news.openAt)}</Text>
            </Box>
            <Box fontSize="xl" lineHeight="1.8">
              {parse(news.body)}
            </Box>
          </Box>
          <Spacer height={8} />
          {/* SNS Share */}
          <HStack spacing={4} justify="center">
            <Spacer height={8} />
            <TwitterShareButton {...shareProps}>
              <XIcon size={shareButtonSize} round={true} />
            </TwitterShareButton>
            <FacebookShareButton {...shareProps}>
              <FacebookIcon size={shareButtonSize} round={true} />
            </FacebookShareButton>

            <LineShareButton {...shareProps}>
              <LineIcon size={shareButtonSize} round={true} />
            </LineShareButton>

            <HatenaShareButton {...shareProps}>
              <HatenaIcon size={shareButtonSize} round={true} />
            </HatenaShareButton>
          </HStack>
          <Link href="/" textDecoration="underline">
            <Text>{'< '}ホームへ戻る</Text>
          </Link>
        </Box>
      </VStack>
      <Spacer height={8} />
    </>
  );
}
