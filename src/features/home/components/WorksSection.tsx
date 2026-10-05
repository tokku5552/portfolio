import Link from '../../../components/parts/Link';
import { lineSummaryLpUrl } from '../../../config/constants';
import HomeSection from './HomeSection';

interface WorksProduct {
  key: string;
  /** Product name shown as the card title. */
  name: string;
  /** Small mono meta label (product category). */
  meta: string;
  description: string;
  href: string;
}

const PRODUCTS: WorksProduct[] = [
  {
    key: 'summary',
    name: 'サマリ',
    meta: 'Web App',
    description:
      'サマリは、LINE グループの会話から、決まったこと・まだ決まっていないこと・やることと担当を議事録にして、あなたとのトークに届けます。前に頼んだことが片づいたかどうかも、次の議事録で分かります。',
    href: lineSummaryLpUrl,
  },
];

interface WorksSectionProps {
  /** Map of product href → og:image URL hydrated at build time. */
  ogImages?: Record<string, string>;
}

export default function WorksSection({ ogImages = {} }: WorksSectionProps) {
  return (
    <HomeSection
      id="works"
      eyebrow="// Works"
      heading="Works"
      description="個人で開発・運用しているプロダクト。"
    >
      <div className="grid gap-6">
        {PRODUCTS.map((product) => {
          const imageUrl = ogImages[product.href];
          return (
            <Link
              key={product.key}
              href={product.href}
              external
              className="group flex w-full flex-col gap-4 border border-brand-border p-6 transition-colors hover:border-brand-border-strong md:flex-row md:gap-6 md:p-7"
            >
              {imageUrl ? (
                <div className="relative aspect-video w-full shrink-0 overflow-hidden border border-brand-border md:h-28 md:aspect-auto md:w-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={product.name}
                    width={320}
                    height={180}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-2.5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-brand-mono text-[11px] uppercase tracking-[0.08em] text-brand-muted">
                  <span>{product.meta}</span>
                </div>
                <h3 className="font-brand-sans text-[clamp(18px,1.5vw,22px)] font-bold tracking-[-0.01em] text-brand-fg transition-colors group-hover:text-brand-fg">
                  {product.name}
                </h3>
                <p className="font-brand-sans text-[14px] leading-[1.6] text-brand-muted">
                  {product.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </HomeSection>
  );
}
