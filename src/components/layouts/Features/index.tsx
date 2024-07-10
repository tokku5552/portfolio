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
import { globalDescription, linedcUrl } from '../../../config/constants';
import { OwnSNS } from '../OwnSNS';

const description = globalDescription;

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
