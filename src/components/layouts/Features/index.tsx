'use client'

import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { linedcUrl } from '../../../config/constants';
import { OwnSNS } from '../OwnSNS';

const description = `
1991年1月生まれ福岡出身。九州大学理学部物理学科卒業後、都内SIerにてインフラエンジニアとして働いた後、ミロゴス株式会社でフロント・バックエンド・インフラをフルスタックにこなすエンジニアを経験。
現在はCyberAgentのAI事業本部でバックエンドエンジニアとして従事中。
好きな技術はFlutter/Next.js/AWS。現在娘の子育てに奮闘中。
`;

export default function Features() {
  const [isLagerThan872] = useMediaQuery('(min-width: 872px)');
  return (
    <Container maxW={'5xl'} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Flex
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Stack spacing={8}>
            <Text color={'gray.500'} fontSize={'lg'} whiteSpace={'pre-wrap'}>
              {description}
            </Text>
            <OwnSNS />
            {isLagerThan872 ? (
              <Box>
                <Link href={linedcUrl} isExternal>
                  <Image
                    w={160}
                    objectFit="cover"
                    src="/assets/lae.png"
                    alt="LINE API Expert"
                  />
                </Link>
              </Box>
            ) : (
              <Center>
                <Box>
                  <Link href={linedcUrl} isExternal>
                    <Image
                      w={160}
                      objectFit="cover"
                      src="/assets/lae.png"
                      alt="LINE API Expert"
                    />
                  </Link>
                </Box>
              </Center>
            )}
          </Stack>
        </Flex>

        <Flex direction={'column'} justifyContent={'center'}>
          <HStack>
            <Spacer w={200} />
            <VStack>
              <Image
                boxSize="400px"
                objectFit="cover"
                rounded={'md'}
                alt={'cover image'}
                src={'/assets/tokuda05_400x400.png'}
              />
            </VStack>
          </HStack>
        </Flex>
      </SimpleGrid>
    </Container>
  );
}
