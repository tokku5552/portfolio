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

interface ArticleItemProps {
  title: string;
  url: string;
  formatedDate: string;
  contents: string;
  imageUrl: string;
}

export function ArticleItem({
  title,
  url,
  formatedDate,
  contents,
  imageUrl,
}: ArticleItemProps) {
  const textBoxWidth = useBreakpointValue({ base: '100%', md: '800px' });
  // メディアクエリを使用して、横幅が770px以下かどうかを判定
  const [isBelow1315] = useMediaQuery('(max-width: 1315px)');
  const imageBaseSize = 160;
  return (
    <>
      <Box w="100%">
        <HStack spacing={4} align="start">
          <VStack spacing={1} align={'left'}>
            <Link href={url} textDecoration="underline">
              <Heading size="md">{title}</Heading>
            </Link>
            <Box>
              <Text>{`${formatedDate}`}</Text>
            </Box>
            <Box width={textBoxWidth}>
              <Text>{contents}</Text>
            </Box>
          </VStack>
          <Spacer />
          {!isBelow1315 && (
            <Box width={1.7 * imageBaseSize} height={0.9 * imageBaseSize}>
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
