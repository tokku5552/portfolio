import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';

const data: ServiceCardProps[] = [
  {
    title: 'IT Consulting',
    description: `
    お客様のビジネスを一歩先へ導くために、提案段階からシステム開発、デジタル変革までサポートします。
    LTVの向上、効果的なマーケティング戦略の構築、DXを通じて、お客様の事業成長と市場での競争力を強化します。
    スタートアップや小規模企業の変革を技術面から全面的にバックアップします。
    `,
  },
  {
    title: 'Education',
    description: `
    エンジニアとしてスキルアップを目指すあなたを全力でサポートします。
    React、Next.js、Go、Node.js、Flutterといったフロントエンド・バックエンドの技術から、AWS、Google Cloud、Firebaseのクラウドサービス、
    さらにはLINE APIの活用まで、幅広い技術に対応しています。
    MENTAでの実績は75件、平均評価4.7と、多くの受講者に評価されています。
    `,
  },
  {
    title: 'Event Planning',
    description: `
    エンジニア向けのイベントの企画と運営をサポートしています。
    さまざまな規模のイベントに対応し、一貫したサポートを提供することで、参加者が新しいつながりを築き、有意義な時間を過ごせるよう努めています。
    独自のアプローチで集客を図り、イベントの成功を手助けします。
    `,
  },
];

interface ServiceCardProps {
  title: string;
  description: string;
}

const ServiceCard = ({ title, description }: ServiceCardProps) => {
  return (
    <>
      <Box>
        <Heading as="h3" size="lg" textAlign="center">
          {title}
        </Heading>

        <Box m={8}>
          <Text>{description}</Text>
        </Box>
      </Box>
    </>
  );
};

export default function ServiceGrid() {
  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {data.map((d, i) => (
          <ServiceCard key={i} title={d.title} description={d.description} />
        ))}
      </SimpleGrid>
    </>
  );
}
