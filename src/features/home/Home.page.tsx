import { Center, Link, Spacer, Text } from '@chakra-ui/react';
import { Features, Header, Hero, YouTube } from '../../components/layouts';
import { Podcast } from '../../components/layouts/Podcast';
import { Title } from '../../components/parts';
import { contactGoogleFormUrl } from '../../config/constants';
import { AdjustableArticleList } from '../article/components/AdjustableArticleList';
import { Article } from '../article/types/article';
import { AdjustableNewsList } from '../news/components/AdjustableNewsList';
import { News } from '../news/types/news';
import ServiceGrid from '../service/Service';

interface HomeProps {
  news: News[];
  articles: Article[];
}

export default function Home({ news, articles }: HomeProps) {
  return (
    <>
      <Header />
      {/* Profile */}
      <Hero />
      <Spacer height={8} />
      <Center>
        <Title as="h1">Shinnosuke Tokuda</Title>
      </Center>
      <Features />

      {/* News */}
      <div id="news" />
      <Spacer height={24} />

      <Center>
        <Title as="h2">News</Title>
      </Center>
      <Center>
        <AdjustableNewsList news={news} displayNumber={3} />
      </Center>
      <Spacer height={4} />
      <Center>
        <Link href="/news" textDecoration="underline">
          <Text>もっと見る</Text>
        </Link>
      </Center>
      <Spacer height={12} />

      {/* Podcast */}
      <div id="podcast" />
      <Spacer height={24} />
      <Center>
        <Title as="h2">Podcast</Title>
      </Center>
      <Spacer height={8} />
      <Center>
        <Podcast />
      </Center>
      <Spacer height={16} />

      {/* YouTube */}
      <div id="youtube" />
      <Spacer height={24} />
      <Center>
        <Title as="h2">YouTube</Title>
      </Center>
      <Spacer height={8} />
      <Center>
        <YouTube />
      </Center>
      <Spacer height={16} />

      {/* Services */}
      <div id="services" />
      <Spacer height={24} />
      <Center>
        <Title as="h2">Services</Title>
      </Center>
      <Spacer height={8} />
      <Center>
        <ServiceGrid />
      </Center>

      {/* Articles */}
      <div id="articles" />
      <Spacer height={24} />
      <Center>
        <Title as="h2">Articles</Title>
      </Center>
      <Center>
        <AdjustableArticleList articles={articles} displayNumber={3} />
      </Center>
      <Spacer height={4} />
      <Center>
        <Link href="/articles" textDecoration="underline">
          <Text>もっと見る</Text>
        </Link>
      </Center>
      <Spacer height={16} />

      {/* Contact */}
      <div id="contact" />
      <Spacer height={24} />
      <Center>
        <Title as="h2">Contact</Title>
      </Center>
      <Spacer height={16} />
      <Center>
        <Link href={contactGoogleFormUrl} textDecoration="underline" isExternal>
          <Text>こちらのGoogle Formへお寄せください。</Text>
        </Link>
      </Center>
      <Spacer height={16} />
    </>
  );
}
