import { buttonClasses } from '../../../components/parts/Button';
import Container from '../../../components/parts/Container';
import Eyebrow from '../../../components/parts/Eyebrow';
import Link from '../../../components/parts/Link';
import Orb from '../../../components/parts/Orb';
import { inkdoseUrl, podcastUrl } from '../../../config/constants';

const titles = ['Engineering Manager', 'Music Producer'];

const sideMeta: { label: string; value: string }[] = [
  { label: '// Based in', value: 'Tokyo, JP' },
  { label: '// Status', value: 'Open to collabs' },
  { label: '// Now working', value: 'AI implementation' },
];

export default function TwilightHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Orb position="tr" />
      <span aria-hidden="true" className="tb-grain" />

      <Container className="relative z-[2] py-24 md:py-32">
        <Eyebrow withPulse className="mb-10">
          Portfolio · 2026 — Currently shipping
        </Eyebrow>

        <h1 className="mb-7 font-brand-sans text-[clamp(48px,13.5vw,72px)] sm:text-[clamp(72px,11vw,180px)] font-black leading-[0.88] tracking-[-0.045em] text-brand-fg break-words [overflow-wrap:anywhere] [hyphens:none]">
          Shinnosuke
          <br />
          Tokuda
          <span className="tb-period-gradient">.</span>
        </h1>

        <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2 font-brand-sans text-[clamp(16px,1.35vw,20px)] font-bold tracking-[-0.01em] text-brand-fg">
          {titles.map((title, index) => (
            <span key={title} className="inline-flex items-center gap-4">
              <span>{title}</span>
              {index < titles.length - 1 ? (
                <span className="tb-diamond-sep" aria-hidden="true" />
              ) : null}
            </span>
          ))}
        </div>

        <p className="mb-14 max-w-[640px] font-brand-sans text-[clamp(16px,1.25vw,18px)] font-normal leading-[1.55] text-brand-muted">
          <strong className="font-medium text-brand-fg">
            Engineering Manager at Mercari.
          </strong>{' '}
          Building teams and shipping product across TypeScript / Go / Flutter /
          AWS / GCP.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href={inkdoseUrl} external className={buttonClasses('primary')}>
            <span>Listen to my music</span>
            <span aria-hidden="true" className="font-brand-mono">
              ↗
            </span>
          </Link>
          <Link href={podcastUrl} external className={buttonClasses('ghost')}>
            <span aria-hidden="true">▶</span>
            <span>Listen to the podcast</span>
          </Link>
        </div>

        <ul className="absolute right-12 top-1/2 hidden -translate-y-1/2 flex-col gap-5 text-right font-brand-mono text-[11px] uppercase tracking-[0.08em] text-brand-muted lg:flex">
          {sideMeta.map((item) => (
            <li key={item.label}>
              <div>{item.label}</div>
              <div className="mt-1 font-medium tracking-[0.04em] text-brand-fg">
                {item.value}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
