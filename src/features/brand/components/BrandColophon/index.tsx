import Container from '../../../../components/parts/Container';
import Eyebrow from '../../../../components/parts/Eyebrow';
import Link from '../../../../components/parts/Link';

const lastUpdated = '2026-04-29';

export default function BrandColophon() {
  return (
    <section id="colophon">
      <Container className="py-20 md:py-28">
        <Eyebrow className="mb-6">{'// Colophon'}</Eyebrow>
        <h2 className="mb-10 font-brand-sans text-[clamp(28px,4vw,48px)] font-black leading-[1.05] tracking-[-0.025em] text-brand-fg">
          Set in Geist.
        </h2>

        <dl className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2 border-t border-brand-border pt-5">
            <dt className="font-brand-mono text-[11px] uppercase tracking-[0.12em] text-brand-muted">
              Type
            </dt>
            <dd className="font-brand-sans text-[15px] leading-[1.55] text-brand-fg">
              <Link
                href="https://vercel.com/font"
                external
                className="text-brand-fg underline-offset-2 hover:underline"
              >
                Geist
              </Link>{' '}
              and{' '}
              <Link
                href="https://vercel.com/font"
                external
                className="text-brand-fg underline-offset-2 hover:underline"
              >
                Geist Mono
              </Link>
              , by Vercel.
            </dd>
          </div>

          <div className="flex flex-col gap-2 border-t border-brand-border pt-5">
            <dt className="font-brand-mono text-[11px] uppercase tracking-[0.12em] text-brand-muted">
              Last updated
            </dt>
            <dd className="font-brand-mono text-[14px] tracking-[0.02em] text-brand-fg">
              {lastUpdated}
            </dd>
          </div>

          <div className="flex flex-col gap-2 border-t border-brand-border pt-5">
            <dt className="font-brand-mono text-[11px] uppercase tracking-[0.12em] text-brand-muted">
              License
            </dt>
            <dd className="font-brand-mono text-[14px] tracking-[0.02em] text-brand-fg">
              MIT
            </dd>
          </div>
        </dl>

        <p className="mt-12 max-w-[680px] font-brand-sans text-[14px] leading-[1.6] text-brand-muted">
          Twilight Blade is the design system of{' '}
          <Link
            href="/"
            className="text-brand-fg underline-offset-2 hover:underline"
          >
            tokku-tech.dev
          </Link>
          . It exists to keep the site coherent over time and to give AI agents
          a single reference to follow when generating new collateral. License:
          MIT.
        </p>
      </Container>
    </section>
  );
}
