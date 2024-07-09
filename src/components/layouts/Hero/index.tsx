import { Box, Image } from '@chakra-ui/react';

export default function Hero() {
  return (
    <Box
      w="100%"
      h={['25vh', '35vh', '280px']}
      position="relative"
      overflow="hidden"
    >
      <Image
        objectFit="cover"
        src="/assets/hero_skills_2023.png"
        alt="hero"
        width="auto"
        minW="100%"
        height="100%"
        position="absolute"
        top="0"
        left="50%"
        transform="translateX(-50%)"
      />
    </Box>
  );
}
