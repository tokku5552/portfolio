import Container from '../../../../components/parts/Container';
import Eyebrow from '../../../../components/parts/Eyebrow';
import Link from '../../../../components/parts/Link';
import { assetLinks, sourceRepoUrl } from '../../data/rules';

export default function BrandAssets() {
  return (
    <section id="assets" className="border-b border-brand-border">
      <Container className="py-20 md:py-28">
        <Eyebrow className="mb-6">{'// Assets'}</Eyebrow>
        <h2 className="mb-4 font-brand-sans text-[clamp(28px,4vw,48px)] font-black leading-[1.05] tracking-[-0.025em] text-brand-fg">
          Source files for AI and humans.
        </h2>
        <p className="mb-10 max-w-[680px] font-brand-sans text-[clamp(15px,1.1vw,17px)] leading-[1.6] text-brand-muted">
          Files live in the public GitHub repository. Fetch them directly from
          the URLs below — paste into chat AIs, or import via{' '}
          <code className="font-brand-mono text-[14px] text-brand-fg">
            @import url(...)
          </code>{' '}
          for CSS use.
        </p>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {assetLinks.map((asset) => (
            <li
              key={asset.label}
              className="flex flex-col gap-4 border border-brand-border p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <Eyebrow>{asset.label}</Eyebrow>
                <Link
                  href={asset.url}
                  external
                  className="font-brand-mono text-[12px] tracking-[0.04em] text-brand-fg rounded-[4px] border border-brand-border-strong px-3 py-1.5 transition-colors hover:bg-white/[0.04] hover:border-white/30"
                >
                  Open ↗
                </Link>
              </div>
              <p className="font-brand-sans text-[14px] leading-[1.55] text-brand-muted">
                {asset.description}
              </p>
              <code className="overflow-x-auto font-brand-mono text-[12px] tracking-[0.02em] text-brand-fg border border-brand-border bg-black/30 p-3">
                {asset.url}
              </code>
            </li>
          ))}
        </ul>

        <p className="mt-10 font-brand-sans text-[14px] leading-[1.6] text-brand-muted">
          Source repository:{' '}
          <Link
            href={sourceRepoUrl}
            external
            className="text-brand-fg underline-offset-2 hover:underline"
          >
            {sourceRepoUrl}
          </Link>
        </p>
      </Container>
    </section>
  );
}
