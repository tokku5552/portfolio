import { Article } from '../article/types/article';
import ArticlesSection from './components/ArticlesSection';
import ContactSection from './components/ContactSection';
import HeroStrip from './components/HeroStrip';
import PodcastSection from './components/PodcastSection';
import ServicesSection from './components/ServicesSection';
import TwilightHero from './components/TwilightHero';
import WorksSection from './components/WorksSection';
import YouTubeSection from './components/YouTubeSection';

interface HomeProps {
  articles: Article[];
  worksOgpImages: Record<string, string>;
}

export default function Home({ articles, worksOgpImages }: HomeProps) {
  return (
    <>
      <TwilightHero />
      <HeroStrip />
      <PodcastSection />
      <YouTubeSection />
      <ServicesSection />
      <WorksSection ogImages={worksOgpImages} />
      <ArticlesSection articles={articles} />
      <ContactSection />
    </>
  );
}
