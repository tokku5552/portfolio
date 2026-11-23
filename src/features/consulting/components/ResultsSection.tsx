import { noteArticles, practices } from '../data/content';
import Section from './Section';

export function ResultsSection() {
  return (
    <Section id="results" title="実績・運用実例" wide>
      <p className="max-w-3xl text-base leading-[1.9] text-neutral-700">
        机上の提案ではなく、実際に作って回し続けているものだけを挙げます。いずれも「小さく作って、本番の実務で回す」という、貴社の導入でもそのまま使える型です。
      </p>

      <div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
        {practices.map((practice) => (
          <div key={practice.title} className="py-6">
            <h3 className="text-lg font-bold text-neutral-900">
              {practice.title}
            </h3>
            <p className="mt-2 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">
              {practice.body}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mt-14 text-xl font-bold text-neutral-900">
        考え方と実践を書いた記事（note）
      </h3>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {noteArticles.map((article) => (
          <a
            key={article.url}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col border border-neutral-200 bg-white transition-colors hover:border-neutral-400"
          >
            <div className="aspect-video w-full overflow-hidden bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                width={640}
                height={360}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <p className="text-xs text-neutral-500">
                {article.date}
                {article.paid ? '（有料記事）' : ''}
              </p>
              <h4 className="text-[15px] font-bold leading-relaxed text-neutral-900 group-hover:underline group-hover:underline-offset-4">
                {article.title}
              </h4>
              <p className="text-sm leading-[1.7] text-neutral-600">
                {article.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

export default ResultsSection;
