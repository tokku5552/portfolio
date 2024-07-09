import {
  AspectRatio,
  Box,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';

export default function YouTube() {
  // const src =
  //   'https://www.youtube.com/embed/videoseries?si=Hic0KDKOtJRGyCsY&amp;list=PLnJC_bt8Ttc_cymZZGfeIlYMiNbzJPQ8Y';
  const src =
    'https://www.youtube.com/embed/videoseries?si=VxIbydvyHzjo6ijO&amp;list=PLH58nXzfT1i0ELx0qvc6W4u8ssez7LcD8';

  const title = 'YouTube video player';
  const allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

  const [isLargerThan750] = useMediaQuery('(min-width: 750px)');
  if (!isLargerThan750) {
    return (
      <>
        <VStack w={'90%'}>
          <Text fontSize={'2xl'}>
            勉強会への登壇などで、出演しているYouTube動画のプレイリストです。
          </Text>

          <AspectRatio ratio={16 / 9} w="100%">
            <Box
              as="iframe"
              src={src}
              title={title}
              allow={allow}
              allowFullScreen
            />
          </AspectRatio>
        </VStack>
      </>
    );
  }
  return (
    <>
      <VStack w={'60%'}>
        <Text fontSize={'2xl'}>
          勉強会への登壇などで、出演しているYouTube動画のプレイリストです。
        </Text>

        <AspectRatio ratio={16 / 9} w="100%">
          <Box
            as="iframe"
            src={src}
            title={title}
            allow={allow}
            allowFullScreen
          />
        </AspectRatio>
      </VStack>
    </>
  );
}
