import { buttonClasses } from '../../../../components/parts/Button';
import Container from '../../../../components/parts/Container';
import Eyebrow from '../../../../components/parts/Eyebrow';
import GridOverlay from '../../../../components/parts/GridOverlay';
import Link from '../../../../components/parts/Link';
import Orb from '../../../../components/parts/Orb';

interface DemoTile {
  label: string;
  description: string;
  body: React.ReactNode;
}

const tiles: DemoTile[] = [
  {
    label: 'Gradient period',
    description:
      'The single identity accent — applied to the trailing period of the wordmark.',
    body: (
      <span className="font-brand-sans text-[clamp(36px,4vw,56px)] font-black leading-[0.95] tracking-[-0.035em] text-brand-fg">
        tokku<span className="tb-period-gradient">.</span>
      </span>
    ),
  },
  {
    label: 'Eyebrow with pulse',
    description:
      'Mono uppercase label paired with a violet pulse dot for "live" sections.',
    body: <Eyebrow withPulse>Currently shipping</Eyebrow>,
  },
  {
    label: 'Two-tier CTA',
    description:
      'Primary action is filled (`fg` on `bg` with hover gradient). Secondary is ghost — bordered, mono.',
    body: (
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="#tokens"
          className={buttonClasses('primary', 'md', 'pointer-events-none')}
        >
          <span>Primary action</span>
          <span aria-hidden="true" className="font-brand-mono">
            ↗
          </span>
        </Link>
        <Link
          href="#tokens"
          className={buttonClasses('ghost', 'md', 'pointer-events-none')}
        >
          <span>Ghost</span>
        </Link>
      </div>
    ),
  },
  {
    label: 'Diamond separator',
    description:
      'Rotated 45° violet square — separates titles or list items in mono runs.',
    body: (
      <div className="flex items-center gap-4 font-brand-sans text-[16px] font-bold tracking-[-0.01em] text-brand-fg">
        <span>Engineering Manager</span>
        <span aria-hidden="true" className="tb-diamond-sep" />
        <span>Music Producer</span>
      </div>
    ),
  },
];

export default function BrandInUse() {
  return (
    <section
      id="in-use"
      className="relative isolate overflow-hidden border-b border-brand-border"
    >
      <Container className="relative z-[2] py-20 md:py-28">
        <Eyebrow className="mb-6">{'// In use'}</Eyebrow>
        <h2 className="mb-10 font-brand-sans text-[clamp(28px,4vw,48px)] font-black leading-[1.05] tracking-[-0.025em] text-brand-fg">
          Live signature elements.
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="flex flex-col gap-5 border border-brand-border p-6"
            >
              <Eyebrow>{tile.label}</Eyebrow>
              <div className="flex min-h-[120px] items-center">{tile.body}</div>
              <p className="font-brand-sans text-[14px] leading-[1.55] text-brand-muted">
                {tile.description}
              </p>
            </div>
          ))}

          <div className="relative col-span-1 flex min-h-[200px] flex-col gap-5 overflow-hidden border border-brand-border p-6 md:col-span-2">
            <Eyebrow>12-col grid + Orb</Eyebrow>
            <GridOverlay visible className="opacity-100" />
            <Orb position="center" />
            <p className="relative z-[2] mt-auto font-brand-sans text-[14px] leading-[1.55] text-brand-muted">
              The 12-column grid overlay (toggled on for this demo) and the
              radial Orb backdrop establish the underlying structure used by
              hero sections.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
