import { buttonClasses } from '../../components/parts/Button';
import Link from '../../components/parts/Link';
import { cn } from '../../libs/cn';
import { timeTicketUrl } from '../../config/constants';

const tagline = `ChatGPTやAIツールを試してみたものの、単発利用で終わっていたり、現場の業務フローにうまく組み込めていない方向けの相談です。

現状の業務や手作業を整理しながら、
・どこをAIで補助するか
・どこをスクリプトやワークフローに落とすか
・どこを人が判断するか
を切り分け、無理なく進めるための現実的な一歩を明確にします。`;

const bullets = [
  'AIを使って改善しろと言われたが、何から始めるべきか分からない',
  'ChatGPTを試しているが、業務に定着していない',
  'AIとスクリプト、SaaS、手作業の役割分担が曖昧',
  'PoC っぽいものはあるが、実運用に乗らない',
];

export default function TimeTicketConsultation() {
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-16">
      <div>
        <h3 className="mb-6 font-brand-sans text-[clamp(20px,2vw,28px)] font-bold tracking-[-0.01em] text-brand-fg">
          AI を試したけど業務に落とし込めない方へ
        </h3>
        <p className="whitespace-pre-line font-brand-sans text-[15px] leading-[1.7] text-brand-muted">
          {tagline}
        </p>
      </div>

      <div className="rounded-[4px] border border-brand-border bg-white/[0.02] p-6">
        <div className="mb-3 font-brand-mono text-[11px] uppercase tracking-[0.12em] text-brand-muted">
          こんな悩みがある方向け
        </div>
        <ul className="mb-8 flex flex-col gap-3 font-brand-sans text-[14px] leading-[1.6] text-brand-fg">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-orb-violet"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <Link
          href={timeTicketUrl}
          external
          className={cn(buttonClasses('primary'), 'w-full justify-center')}
        >
          <span>TimeTicket で相談する</span>
          <span aria-hidden="true" className="font-brand-mono">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
