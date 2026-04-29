import Container from '../../../../components/parts/Container';
import Eyebrow from '../../../../components/parts/Eyebrow';
import { doRules, dontRules } from '../../data/rules';

export default function BrandConcept() {
  return (
    <section id="concept" className="border-b border-brand-border">
      <Container className="py-20 md:py-28">
        <Eyebrow className="mb-6">{'// Concept'}</Eyebrow>
        <h2 className="mb-8 font-brand-sans text-[clamp(28px,4vw,48px)] font-black leading-[1.05] tracking-[-0.025em] text-brand-fg">
          Quiet surface, single accent.
        </h2>

        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-2">
          <p className="font-brand-sans text-[clamp(15px,1.1vw,17px)] leading-[1.7] text-brand-muted">
            Twilight Blade earns its accent. The page is dark, structured by
            near-invisible borders and two type voices —{' '}
            <strong className="font-medium text-brand-fg">Geist</strong> for
            body and headings,{' '}
            <strong className="font-medium text-brand-fg">Geist Mono</strong>{' '}
            for labels and structural marks.
          </p>
          <p className="font-brand-sans text-[clamp(15px,1.1vw,17px)] leading-[1.7] text-brand-muted">
            The indigo→violet→pink gradient is the single accent. It marks
            identity moments — the period in the wordmark, the orb behind the
            hero, the primary button hover — and stays out of everything else.
            The rest holds back so that one accent reads as deliberate.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <Eyebrow className="mb-4">Do</Eyebrow>
            <ul className="flex flex-col gap-3">
              {doRules.map((rule) => (
                <li
                  key={rule}
                  className="flex gap-3 font-brand-sans text-[15px] leading-[1.6] text-brand-fg"
                >
                  <span
                    aria-hidden="true"
                    className="font-brand-mono text-brand-orb-violet"
                  >
                    +
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow className="mb-4">Do not</Eyebrow>
            <ul className="flex flex-col gap-3">
              {dontRules.map((rule) => (
                <li
                  key={rule}
                  className="flex gap-3 font-brand-sans text-[15px] leading-[1.6] text-brand-muted"
                >
                  <span
                    aria-hidden="true"
                    className="font-brand-mono text-brand-muted"
                  >
                    ✕
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
