'use client'

import {
  AspectRatio,
  Box,
  Center,
  Container,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  podcastAmazonMusicUrl,
  podcastApplePodcastsUrl,
  podcastEmbedUrl,
  podcastGooglePodcastsUrl,
  podcastSpotifyUrl,
  podcastUrl,
} from '../../../config/constants';

export function Podcast() {
  const title = 'Podcast player';
  const [isSmallerThan600] = useMediaQuery('(min-width: 600px)');
  return (
    <>
      <VStack>
        <Container maxW={'5xl'} py={12}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Link href={podcastUrl} textDecoration={'underline'} isExternal>
              <Center>
                <Image
                  src="/assets/podcast_cover.png"
                  alt="Podcast"
                  w={'80%'}
                />
              </Center>
            </Link>
            <VStack>
              <Heading as="h3" size={'lg'}>
                エンジニアがもがくラジオ
              </Heading>
              <Spacer h={1} />
              <Text fontSize={'xl'} whiteSpace={'pre-wrap'}>
                エンジニアのキャリアなどについて雑談しているPodcastです。
              </Text>
              <Text fontSize={'xl'} whiteSpace={'pre-wrap'}>
                <Link
                  href={podcastSpotifyUrl}
                  textDecoration={'underline'}
                  isExternal
                >
                  Spotify
                </Link>
                /
                <Link
                  href={podcastApplePodcastsUrl}
                  textDecoration={'underline'}
                  isExternal
                >
                  Apple Podcast
                </Link>
                /
                <Link
                  href={podcastGooglePodcastsUrl}
                  textDecoration={'underline'}
                  isExternal
                >
                  Google Podcast
                </Link>
                /
                <Link
                  href={podcastAmazonMusicUrl}
                  textDecoration={'underline'}
                  isExternal
                >
                  Amazon Music
                </Link>
                など主要スタンドで配信中！
              </Text>
              <Spacer h={1} />
              <Image
                src="/assets/podcast_available_on.png"
                alt="Podcast Available on"
                w={'80%'}
              />
            </VStack>
          </SimpleGrid>
        </Container>
        {isSmallerThan600 && (
          <>
            <Text fontSize={'2xl'} fontWeight={'bold'}>
              最新エピソード
            </Text>
            <Spacer height={4} />
            <AspectRatio ratio={400 / 90} w="80%">
              <Box
                as="iframe"
                src={podcastEmbedUrl}
                title={title}
                scrolling="no"
              />
            </AspectRatio>
          </>
        )}
      </VStack>
    </>
  );
}
