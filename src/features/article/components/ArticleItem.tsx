import Link from '../../../components/parts/Link';
import { Article } from '../types/article';

interface ArticleItemProps {
  title: string;
  url: string;
  formatedDate: string;
  contents: string;
  imageUrl: string;
  source?: Article['source'];
}

const sourceLabel: Record<NonNullable<Article['source']>, string> = {
  zenn: 'Zenn',
  qiita: 'Qiita',
  note: 'note',
  blog: 'Blog',
};

export function ArticleItem({
  title,
  url,
  formatedDate,
  contents,
  imageUrl,
  source,
}: ArticleItemProps) {
  return (
    <Link
      href={url}
      external
      className="group flex w-full flex-col gap-4 border border-brand-border p-6 transition-colors hover:border-brand-border-strong md:flex-row md:gap-6 md:p-7"
    >
      {imageUrl ? (
        <div className="relative aspect-video w-full shrink-0 overflow-hidden border border-brand-border md:h-28 md:w-44 md:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-brand-mono text-[11px] uppercase tracking-[0.08em] text-brand-muted">
          {source ? <span>{sourceLabel[source]}</span> : null}
          <span aria-hidden="true">·</span>
          <span>{formatedDate}</span>
        </div>
        <h3 className="font-brand-sans text-[clamp(18px,1.5vw,22px)] font-bold tracking-[-0.01em] text-brand-fg transition-colors group-hover:text-brand-fg">
          {title}
        </h3>
        {contents ? (
          <p className="line-clamp-3 font-brand-sans text-[14px] leading-[1.6] text-brand-muted">
            {contents}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export default ArticleItem;
