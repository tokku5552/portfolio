import ConsultingHero from './components/ConsultingHero';
import DeliverablesSection from './components/DeliverablesSection';
import FaqSection from './components/FaqSection';
import FinalCtaSection from './components/FinalCtaSection';
import FlowSection from './components/FlowSection';
import ProblemsSection from './components/ProblemsSection';
import ProfileSection from './components/ProfileSection';
import PromisesSection from './components/PromisesSection';
import ResultsSection from './components/ResultsSection';
import StickyCtaBar from './components/StickyCtaBar';

export default function Consulting() {
  return (
    <div
      className="bg-white pb-[76px] text-neutral-800 antialiased md:pb-0"
      style={{
        fontFamily:
          "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif",
      }}
    >
      <ConsultingHero />
      <ProblemsSection />
      <PromisesSection />
      <DeliverablesSection />
      <ResultsSection />
      <ProfileSection />
      <FlowSection />
      <FaqSection />
      <FinalCtaSection />
      <StickyCtaBar />
    </div>
  );
}
