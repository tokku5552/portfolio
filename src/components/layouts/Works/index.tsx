import { Box, Container } from '@chakra-ui/react';
import { DisclosableCard } from '../../parts';
import { DisclosableCardProps } from '../../parts/DisclosableCard';

const contents: DisclosableCardProps[] = [
  {
    title: 'COUPLE TODO - Flutter製の夫婦で使うTODOアプリ',
    children: 'https://couple-todo-product.web.app/',
  },
  {
    title: '鬼ロク - Flutter製のアンガーマネジメントアプリ',
    children: 'https://angless-production.web.app/',
  },
];

export default function Works() {
  return (
    <>
      <Container maxW={'5xl'} py={12}>
        <Box w="100%">
          {contents.map((content, index) => (
            <DisclosableCard key={index} title={content.title}>
              {content.children}
            </DisclosableCard>
          ))}
        </Box>
      </Container>
    </>
  );
}
