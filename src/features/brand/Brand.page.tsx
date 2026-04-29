import BrandAssets from './components/BrandAssets';
import BrandColophon from './components/BrandColophon';
import BrandConcept from './components/BrandConcept';
import BrandHero from './components/BrandHero';
import BrandInUse from './components/BrandInUse';
import BrandTokens from './components/BrandTokens';

export default function Brand() {
  return (
    <>
      <BrandHero />
      <BrandConcept />
      <BrandTokens />
      <BrandInUse />
      <BrandAssets />
      <BrandColophon />
    </>
  );
}
