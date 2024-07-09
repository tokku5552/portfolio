import {
  Box,
  Divider,
  HStack,
  Heading,
  Image,
  Link,
  Spacer,
  Text,
  VStack,
  useBreakpointValue,
  useMediaQuery,
} from '@chakra-ui/react';
import { stripHtmlTags, truncateText } from '../../../libs/text';

interface AdjustableNewsItemProps {
  title: string;
  url: string;
  formatedDate: string;
  contents: string;
  imageUrl: string;
}

export function AdjustableNewsItem({
  title,
  url,
  formatedDate,
  contents,
  imageUrl,
}: AdjustableNewsItemProps) {
  const textBoxWidth = useBreakpointValue({ base: '100%', md: '800px' });
  // メディアクエリを使用して、横幅が770px以下かどうかを判定
  const [isBelow1315] = useMediaQuery('(max-width: 1315px)');
  return (
    <>
      <Box w="100%">
        <HStack spacing={4} align="center">
          <VStack spacing={1} align={'left'}>
            <Link href={url} textDecoration="underline">
              <Heading size="md">{title}</Heading>
            </Link>
            <Box>
              <Text>{`公開日: ${formatedDate}`}</Text>
            </Box>
            <Box width={textBoxWidth}>
              {/* news.bodyからHTMLタグを取り除き、100文字で切り取る */}
              <Text>{truncateText(stripHtmlTags(contents), 100)}</Text>
            </Box>
          </VStack>
          <Spacer />
          {!isBelow1315 && (
            <Box width={160} height={90}>
              <Link
                href={url}
                textDecoration="underline"
                _hover={{
                  color: 'blue.500',
                  textDecoration: 'underline',
                }}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </Link>
            </Box>
          )}
        </HStack>
        <Divider mt={4} />
      </Box>
    </>
  );
}
