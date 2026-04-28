import { Article } from '../article/types/article';
import ArticlesSection from './components/ArticlesSection';
import ContactSection from './components/ContactSection';
import HeroStrip from './components/HeroStrip';
import PodcastSection from './components/PodcastSection';
import ServicesSection from './components/ServicesSection';
import TwilightHero from './components/TwilightHero';
import YouTubeSection from './components/YouTubeSection';

interface HomeProps {
  articles: Article[];
}

export default function Home({ articles }: HomeProps) {
  return (
    <>
      <TwilightHero />
      <HeroStrip />
      <PodcastSection />
      <YouTubeSection />
      <ServicesSection />
      <ArticlesSection articles={articles} />
      <ContactSection />
    </>
  );
}
