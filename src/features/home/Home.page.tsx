import { useState } from 'react';
import ParticleField, {
  ParticleStage,
} from '../../components/parts/ParticleField';
import { Article } from '../article/types/article';
import ArticlesSection from './components/ArticlesSection';
import ContactSection from './components/ContactSection';
import HeroStrip from './components/HeroStrip';
import PodcastSection from './components/PodcastSection';
import ServicesSection from './components/ServicesSection';
import TwilightHero from './components/TwilightHero';
import WorksSection from './components/WorksSection';
import YouTubeSection from './components/YouTubeSection';

// Which particle formation each section brings in (see ParticleField shaders).
const particleStages: ParticleStage[] = [
  { id: 'hero', stage: 0 },
  { id: 'podcast', stage: 1 },
  { id: 'youtube', stage: 1 },
  { id: 'services', stage: 2 },
  { id: 'works', stage: 2 },
  { id: 'articles', stage: 3 },
  { id: 'contact', stage: 4 },
];

interface HomeProps {
  articles: Article[];
  worksOgpImages: Record<string, string>;
}

export default function Home({ articles, worksOgpImages }: HomeProps) {
  const [particlesActive, setParticlesActive] = useState(false);

  return (
    <div className="relative">
      <ParticleField
        stages={particleStages}
        onActiveChange={setParticlesActive}
      />
      <div className="relative z-[1]">
        <TwilightHero hideOrb={particlesActive} />
        <HeroStrip />
        <PodcastSection />
        <YouTubeSection />
        <ServicesSection />
        <WorksSection ogImages={worksOgpImages} />
        <ArticlesSection articles={articles} />
        <ContactSection />
      </div>
    </div>
  );
}
