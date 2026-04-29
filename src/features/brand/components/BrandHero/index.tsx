import Container from '../../../../components/parts/Container';
import Eyebrow from '../../../../components/parts/Eyebrow';
import Orb from '../../../../components/parts/Orb';

export default function BrandHero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden border-b border-brand-border"
    >
      <Orb position="tr" />
      <span aria-hidden="true" className="tb-grain" />

      <Container className="relative z-[2] py-24 md:py-32">
        <Eyebrow withPulse className="mb-10">
          Brand · Twilight Blade
        </Eyebrow>

        <h1 className="mb-7 font-brand-sans text-[clamp(48px,12vw,160px)] font-black leading-[0.88] tracking-[-0.045em] text-brand-fg break-words [overflow-wrap:anywhere] [hyphens:none]">
          Twilight Blade
          <span className="tb-period-gradient">.</span>
        </h1>

        <p className="max-w-[640px] font-brand-sans text-[clamp(16px,1.25vw,18px)] font-normal leading-[1.55] text-brand-muted">
          <strong className="font-medium text-brand-fg">
            One quiet surface, one accent.
          </strong>{' '}
          A dark, mono-typed system that reserves the indigo→violet→pink
          gradient for the single moments that matter.
        </p>
      </Container>
    </section>
  );
}
