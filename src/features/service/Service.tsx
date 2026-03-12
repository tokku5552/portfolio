import {
  Box,
  Button,
  Container,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
} from '@chakra-ui/react';
import { timeTicketUrl } from '../../config/constants';

export default function TimeTicketConsultation() {
  return (
    <Container maxW="3xl">
      <VStack spacing={8} align="stretch">
        <Heading as="h3" size="lg" textAlign="center">
          AIを試したけど業務に落とし込めない方へ
        </Heading>

        <Text color={'gray.500'} fontSize={'lg'} whiteSpace={'pre-line'}>
          {`ChatGPTやAIツールを試してみたものの、単発利用で終わっていたり、現場の業務フローにうまく組み込めていない方向けの相談です。

現状の業務や手作業を整理しながら、
・どこをAIで補助するか
・どこをスクリプトやワークフローに落とすか
・どこを人が判断するか
を切り分け、無理なく進めるための現実的な一歩を明確にします。`}
        </Text>

        <Box>
          <Text fontWeight="bold" mb={4}>
            こんな悩みがある方向け
          </Text>
          <List spacing={2} color={'gray.500'} styleType="disc" pl={4}>
            <ListItem>
              AIを使って改善しろと言われたが、何から始めるべきか分からない
            </ListItem>
            <ListItem>ChatGPTを試しているが、業務に定着していない</ListItem>
            <ListItem>AIとスクリプト、SaaS、手作業の役割分担が曖昧</ListItem>
            <ListItem>PoCっぽいものはあるが、実運用に乗らない</ListItem>
          </List>
        </Box>

        <Box textAlign="center" pt={4}>
          <Button
            as="a"
            href={timeTicketUrl}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="blue"
            size="lg"
          >
            TimeTicketで相談する
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}
