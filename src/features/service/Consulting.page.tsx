import { Noto_Sans_JP } from 'next/font/google';
import NextLink from 'next/link';
import { contactGoogleFormUrl, timeTicketUrl } from '../../config/constants';
import { cn } from '../../libs/cn';

/*
 * Standalone LP for the AI adoption / agent consulting offer.
 * It deliberately does not use Twilight Blade: the page is light-themed, renders
 * without BaseLayout (see `standalone` in src/pages/consulting.tsx), and takes
 * its colors from the `--lp-*` variables scoped to `.consulting-lp` in
 * src/styles/globals.css. Do not reuse the dark primitives (Link, Button) here.
 */

const notoSansJp = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

const btn =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-(--lp-teal) font-bold leading-[1.4] text-white no-underline transition-colors hover:bg-(--lp-teal-dark) motion-reduce:transition-none';
const btnLarge = cn(btn, 'min-h-[54px] px-7 py-[13px] text-[15.5px]');
const btnSmall = cn(btn, 'min-h-[42px] px-[18px] py-2 text-[13.5px]');
const textLink =
  'inline-flex items-center px-0.5 py-1 text-[14px] font-bold text-(--lp-teal-dark) underline underline-offset-4 hover:text-(--lp-teal)';
const wrap = 'mx-auto max-w-[880px] px-6 max-[560px]:px-5';
const block = 'scroll-mt-[76px] py-[88px] max-[560px]:py-[60px]';
const sectionHeading =
  'm-0 mb-9 text-[clamp(24px,4.4vw,32px)] font-bold leading-[1.5]';
const sectionIntro =
  'm-0 mb-10 -mt-4 max-w-[680px] text-[15.5px] leading-loose text-(--lp-ink-soft)';
const rowItem = 'border-t border-(--lp-line) last:border-b';
const profileRow = cn(
  rowItem,
  'grid grid-cols-[140px_1fr] gap-[18px] py-3.5 text-[15px] leading-[1.9] max-[640px]:grid-cols-1 max-[640px]:gap-0.5'
);

const problems = [
  '経営として「AI活用を進めろ」と号令はかけたが、現場のどこから始めるべきか定まっていない',
  '部署ごとに AI ツールを試してはいるが、単発利用で終わって業務に定着していない',
  'AI とスクリプト、SaaS、手作業の役割分担が曖昧なまま、導入の議論だけが進んでいる',
  'ベンダーやツールの提案は集まるが、自社の業務に合うかの判断材料が足りない',
  'PoC は作れたが、権限・セキュリティ・運用体制の壁で実運用に乗らず止まっている',
  '投資対効果を問われる立場として、「速くなったはずなのに仕事全体は楽になっていない」状態を説明できない',
];

const promises = [
  {
    habit: '汎用テンプレを当てはめるのが、苦手です。だから——',
    title: '業務を先に分解してから、設計します',
    desc: '他社事例や流行の型をそのまま持ち込むと、現場の手作業の癖や例外が抜け落ちます。まず今の業務の流れを棚卸しし、御社の実務に合う切り分けから始めます。',
  },
  {
    habit: 'ツールから先に提案することが、できません。だから——',
    title: '道具は、最後に選びます',
    desc: 'どのAIか、n8nか、自作エージェントかは、業務の切り分けが決まってからで十分です。先に道具を決めると、道具に合わせて業務の側を曲げることになります。',
  },
  {
    habit: '作って終わりにすることが、できません。だから——',
    title: '運用に乗るまでを見て、設計します',
    desc: 'PoCで動いても、権限・承認・ログの置き場が決まらなければ現場では止まります。自分で毎朝回し続けている運用の勘所まで含めて、最初の一台を設計します。',
  },
  {
    habit: '何でもAI化する提案が、できません。だから——',
    title: '「やらないこと」も、先に決めます',
    desc: 'コストやリスクに見合わない自動化は、やらない方が得です。やらない業務とその理由を先に言語化することで、効くところに投資を集中できます。',
  },
];

const deliverables = [
  {
    title: '業務の切り分け表',
    desc: '対象部門の業務・手作業を棚卸しし、「AIに任せる」「スクリプトやワークフローで自動化する」「人が判断する」の3つに切り分けた一覧。投資対効果の見立てと、どこから手を付けるかの優先順位付き。',
  },
  {
    title: '最初の一台の設計メモ',
    desc: '最初に作るエージェント／自動化について、何を入力にして、何を出力し、どこで人が承認するかを決めた設計メモ。大きく作らず、現場で回る最小の形に絞るので、そのまま開発チームや委託先への指示に使えます。',
  },
  {
    title: 'やらないことリスト',
    desc: 'AI化しないほうがいい業務と、その理由。コストやリスクに見合わない自動化を先に捨てることで、効くところに集中できます。',
  },
  {
    title: '運用の勘所メモ',
    desc: '権限の渡し方、承認フローの置き場所、ログと機密情報の扱いなど、エージェントを実務で回し続けるときに踏みやすい落とし穴のメモ。情シスやセキュリティ部門との調整で詰まりやすい点も先回りして整理します。',
  },
];

const productions = [
  {
    title: '毎朝の AI ニュース自動収集（n8n）',
    desc: '生成AI／AIエージェントのニュースを毎朝自動で収集・選定・要約し、Slack に届けるワークフローを構築し、運用を続けています。',
  },
  {
    title: 'X 投稿エージェント',
    desc: '自分の口調コーパスをもとに投稿候補を組み立てるエージェントを構築。ネタ集めから候補生成までを自動化し、最後の判断は人が行う形で運用しています。',
  },
  {
    title: 'Claude Code プラグインの開発と運用',
    desc: '自分の開発支援プラグイン群を公開リポジトリで開発し、エージェント自身に診断・改修させる運用まで回しています。',
  },
  {
    title: 'Podcast の制作自動化',
    desc: '編集に1エピソード3〜4時間かかっていた作業を、文字起こし・編集・投稿まで含めてパイプライン化しました。',
  },
];

const articles = [
  {
    href: 'https://note.com/tokku5552/n/n514aef406ec2',
    image: 'note-manual-flow.webp',
    date: '2026年3月10日',
    title:
      'AIを入れても仕事が楽にならないのはなぜか。手作業フローを先に分解したほうがいい理由',
    desc: 'AIで仕事が楽にならない原因は性能ではなく、手作業フローの分解不足にあるという、この相談の土台になる考え方。',
  },
  {
    href: 'https://note.com/tokku5552/n/n30a549151a57',
    image: 'note-pipeline.webp',
    date: '2026年3月19日',
    title: '個人開発の自動化パイプラインをClaude Codeで構築した話',
    desc: 'Podcast 制作の自動化を、対話的な実行からパイプライン運用へ育てていった記録。',
  },
  {
    href: 'https://note.com/tokku5552/n/n7ec8d019cc92',
    image: 'note-podcast.webp',
    date: '2026年3月2日',
    title: 'Podcast編集が辛くなって、全部自動化した話',
    desc: '1エピソード3〜4時間の編集作業を、どこから自動化したかの実録。',
  },
  {
    href: 'https://note.com/tokku5552/n/n91095150637e',
    image: 'note-fitbit.webp',
    date: '2025年10月7日',
    title: 'Fitbit APIとn8nで自動ジャーナリングシステム',
    desc: 'n8n と API 連携で、日々の記録を自動で残す仕組みを作った話。',
  },
  {
    href: 'https://note.com/tokku5552/n/n7bdf533485ff',
    image: 'note-claude-code-security.webp',
    date: '2026年6月5日',
    title:
      'AIにコードを書かせる前に知っておきたい、Claude Codeのセキュリティの勘所',
    desc: 'エージェントに権限を渡すときに、最低限押さえたい安全側の考え方。',
  },
  {
    href: 'https://note.com/tokku5552/n/nd1cdc344acce',
    image: 'note-cloudflare-audit.webp',
    date: '2026年11月5日',
    title:
      'Cloudflare のセキュリティ監査スキルを、自分のリポジトリで回してみた',
    desc: 'AI の指摘を別の AI に検証させる監査スキルを、自分のリポジトリで実際に回した記録。',
  },
];

const profileRows = [
  { label: '学歴', value: '九州大学 理学部 物理学科 卒' },
  {
    label: '経歴',
    value:
      '元インフラエンジニア。SIer → ミロゴス → サイバーエージェントと、インフラから開発組織のマネジメントまでを経験',
  },
  { label: 'Podcast', value: 'Podcast「エンジニアがもがくラジオ」ホスト' },
];

const flowSteps = [
  {
    title: '申込',
    desc: 'Google Form から相談内容を送ってください。内容を確認のうえ、日程調整のご連絡をします。（TimeTicket 経由の申込も可能です）',
  },
  {
    title: '事前共有',
    desc: '対象部門の業務の流れと困りごとを、事前にフォームまたはメッセージで共有いただきます（機密情報は伏せた形で大丈夫です）。',
  },
  {
    title: '当日',
    desc: 'オンラインで、業務の切り分けを一緒に進めます。必要に応じて、実際に運用しているエージェントの画面や構成もお見せします。',
  },
  {
    title: '持ち帰り',
    desc: '切り分け表と、最初に作るエージェントの設計メモを、社内で共有・稟議に使える形でお渡しします。',
  },
];

const faqs = [
  {
    q: 'どんな人が対象ですか？',
    a: '経営者・事業責任者の方、部門の予算を持ち AI 活用の投資判断をするマネージャーの方、社内の AI 推進を任された責任者の方を対象としています。会社の予算で、現場への導入を前に進めたい方の相談です。',
  },
  {
    q: '対象にならない相談はありますか？',
    a: '「全部作ってほしい」という受託開発のご相談は対象外です。作るのは貴社のチーム（または委託先）で、私は切り分けと設計の伴走をします。また、個人の学習・転職目的の技術相談も、この相談の対象外です。',
  },
  {
    q: '相談内容の秘密は守られますか？',
    a: 'はい。相談で伺った内容を外部に公開することはありません。逆に、所属組織の機密情報そのものは持ち込まず、業務の構造が分かる範囲で伏せて共有いただく形をお願いしています。',
  },
  {
    q: '支払いや契約の形はどうなりますか？',
    a: '個人の副業としてお受けしています。請求書払いや法人契約の可否を含め、申込時に個別にご案内します。所属企業の業務としての相談・契約はお受けできません。',
  },
  { q: '料金はいくらですか？', a: '申込時にご案内します。' },
  {
    q: '相談の前に準備しておくことはありますか？',
    a: '対象にしたい部門の「困っている業務」を1〜2個、具体的な流れが分かる形で思い浮かべておいてください。資料の用意は不要です。',
  },
];

const navLinks = [
  { href: '#production', label: '実績' },
  { href: '#profile', label: 'プロフィール' },
  { href: '#faq', label: 'よくある質問' },
];

export default function Consulting() {
  return (
    <div
      className={cn(
        notoSansJp.className,
        'consulting-lp min-h-screen bg-(--lp-bg) text-base leading-[1.9] text-(--lp-ink) antialiased max-[640px]:pb-[84px]'
      )}
    >
      <header className="sticky top-0 z-20 border-b border-(--lp-line) bg-(--lp-bg)">
        <div className="mx-auto flex min-h-[60px] max-w-[880px] items-center justify-between gap-4 px-6 max-[560px]:px-5">
          <a
            href="#top"
            className="inline-flex min-h-11 items-center text-[15px] font-bold leading-[1.4] text-(--lp-ink) no-underline"
          >
            AI導入・エージェント活用相談
          </a>
          <nav
            aria-label="ページ内ナビゲーション"
            className="flex items-center gap-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center px-2.5 text-[13.5px] font-medium text-(--lp-ink-soft) no-underline hover:text-(--lp-teal-dark) max-[560px]:hidden"
              >
                {link.label}
              </a>
            ))}
            <a
              href={contactGoogleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSmall}
            >
              相談を申し込む
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="scroll-mt-[76px]">
        <div className="border-b border-(--lp-line) pb-20 pt-[72px] max-[560px]:pb-14 max-[560px]:pt-[18px]">
          <div className={cn(wrap, 'flex flex-col')}>
            <h1 className="m-0 mb-7 max-w-[760px] text-[clamp(27px,4.8vw,40px)] font-bold leading-[1.6] max-[640px]:order-1 max-[640px]:mb-5 max-[640px]:leading-[1.5]">
              <span className="block">議事録、週報、下調べ。</span>
              <span className="block">名前のついた面倒は、</span>
              <span className="block">だいたい自動化できる。</span>
            </h1>
            <p className="m-0 mb-6 max-w-[680px] text-base leading-[2.05] text-(--lp-ink-soft) max-[640px]:order-3 max-[640px]:leading-[1.95]">
              AIエージェントを自分で作って、毎日の仕事を任せています。あなたの会社の業務でも同じことができないか、最初の相談で一緒に見ます。
            </p>
            <p className="m-0 mb-8 text-[14px] font-bold max-[640px]:order-3 max-[640px]:mb-6">
              徳田真之介｜Engineering Manager / LINE API Expert
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5 max-[640px]:order-3">
              <a
                href={contactGoogleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={btnLarge}
              >
                相談を申し込む
              </a>
              <a
                href={timeTicketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(textLink, 'min-h-11')}
              >
                TimeTicket でも受け付けています
              </a>
            </div>
            <p className="m-0 mt-4 text-[12.5px] leading-[1.7] text-(--lp-muted) max-[640px]:order-3">
              料金は申込時にご案内します
            </p>
            <figure className="relative left-1/2 m-0 mt-[52px] w-[min(1160px,calc(100vw-48px))] -translate-x-1/2 max-[640px]:order-2 max-[640px]:mb-0.5 max-[640px]:mt-2 max-[640px]:w-[calc(100vw-40px)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/consulting/hero.webp"
                alt="朝の窓際でコーヒーを飲む男性のそばで、小さなロボットたちが新聞を運び、タイピングし、書類をトレイに整理し、下書きを書いているフラットなイラスト"
                width={2736}
                height={912}
                fetchPriority="high"
                className="block h-auto w-full rounded-[10px] max-[640px]:aspect-[3/2] max-[640px]:rounded-lg max-[640px]:object-cover max-[640px]:object-[90%_50%]"
              />
            </figure>
          </div>
        </div>

        <section id="problems" className={block}>
          <div className={wrap}>
            <h2 className={sectionHeading}>こんな悩みありませんか</h2>
            <ul className="m-0 list-none p-0">
              {problems.map((problem) => (
                <li
                  key={problem}
                  className={cn(
                    rowItem,
                    'py-[18px] text-[15.5px] leading-[1.95]'
                  )}
                >
                  {problem}
                </li>
              ))}
            </ul>
            <p className="m-0 mt-10 text-[clamp(16px,2.8vw,19px)] font-bold leading-[1.9]">
              こうした状態の原因は、たいてい AI
              の性能ではなく、業務の側の分解が済んでいないことです。
            </p>
          </div>
        </section>

        <section id="promise" className={cn(block, 'bg-(--lp-band)')}>
          <div className={wrap}>
            <h2 className={sectionHeading}>
              約束 — できないことから、先に決めます
            </h2>
            <p className={sectionIntro}>
              得意なことだけを並べる提案はしません。私ができないこと、やらないと決めていることが、そのまま貴社にとっての利益になる。その形で4つ、約束します。
            </p>
            <div className="flex flex-col">
              {promises.map((promise) => (
                <div key={promise.title} className={cn(rowItem, 'py-[30px]')}>
                  <p className="m-0 mb-1.5 text-[15px] font-bold leading-[1.8] text-(--lp-ink-soft)">
                    {promise.habit}
                  </p>
                  <h3 className="m-0 mb-2.5 text-[clamp(18px,3vw,21px)] font-bold leading-[1.6]">
                    {promise.title}
                  </h3>
                  <p className="m-0 max-w-[640px] text-[14.5px] leading-loose text-(--lp-ink-soft)">
                    {promise.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="what-you-get" className={block}>
          <div className={wrap}>
            <h2 className={sectionHeading}>相談で得られるもの</h2>
            <p className={sectionIntro}>
              相談のゴールは「何でもAIでできますね」という話ではなく、稟議や現場への説明に使える形で持ち帰ることです。
            </p>
            <div className="flex flex-col">
              {deliverables.map((item) => (
                <div key={item.title} className={cn(rowItem, 'py-[30px]')}>
                  <h3 className="m-0 mb-2.5 text-[clamp(18px,3vw,21px)] font-bold leading-[1.6]">
                    {item.title}
                  </h3>
                  <p className="m-0 max-w-[640px] text-[14.5px] leading-loose text-(--lp-ink-soft)">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="production" className={cn(block, 'bg-(--lp-band)')}>
          <div className={wrap}>
            <h2 className={sectionHeading}>実績・運用実例</h2>
            <p className={sectionIntro}>
              机上の提案ではなく、実際に作って回し続けているものだけを挙げます。いずれも「小さく作って、本番の実務で回す」という、貴社の導入でもそのまま使える型です。以下は、自分自身の実務で運用しているものです。
            </p>
            <div className="mb-[72px] flex flex-col">
              {productions.map((item) => (
                <div
                  key={item.title}
                  className={cn(rowItem, 'py-[30px] max-[820px]:py-6')}
                >
                  <h3 className="m-0 mb-2.5 text-[clamp(18px,3vw,21px)] font-bold leading-[1.6]">
                    {item.title}
                  </h3>
                  <p className="m-0 max-w-[680px] text-[14.5px] leading-loose text-(--lp-ink-soft)">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="m-0 mb-1.5 text-[clamp(19px,3.2vw,23px)] font-bold">
              考え方と実践を書いた記事
            </h3>
            <p className="m-0 mb-2 text-[14px] text-(--lp-muted)">
              note で公開している、運用の記録と考察です。
            </p>
            <div className="flex flex-col">
              {articles.map((article) => (
                <a
                  key={article.href}
                  href={article.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    rowItem,
                    'group grid grid-cols-[220px_1fr] items-center gap-[26px] py-[22px] text-(--lp-ink) no-underline max-[640px]:grid-cols-1 max-[640px]:gap-3 max-[640px]:py-5'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/consulting/${article.image}`}
                    alt={`note記事「${article.title}」の見出し画像`}
                    width={640}
                    height={335}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[1280/670] h-auto w-full rounded-md border border-(--lp-line) bg-(--lp-band) object-cover"
                  />
                  <div>
                    <p className="m-0 mb-1.5 text-[12.5px] text-(--lp-muted)">
                      {article.date}
                    </p>
                    <h4 className="m-0 mb-1.5 text-base font-bold leading-[1.7] group-hover:text-(--lp-teal-dark) group-hover:underline group-hover:underline-offset-4">
                      {article.title}
                    </h4>
                    <p className="m-0 max-w-[56ch] text-[13.5px] leading-[1.9] text-(--lp-ink-soft)">
                      {article.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="profile" className={block}>
          <div className={wrap}>
            <h2 className={sectionHeading}>プロフィール</h2>
            <p className="m-0 mb-1.5 text-[clamp(28px,5.5vw,38px)] font-bold leading-[1.4]">
              徳田真之介
              <span className="ml-3.5 whitespace-nowrap text-[13px] font-normal text-(--lp-muted)">
                とくだ しんのすけ
              </span>
            </p>
            <p className="m-0 text-[14.5px] font-bold">
              Engineering Manager / LINE API Expert
            </p>
            <ul className="m-0 mt-7 list-none p-0">
              {profileRows.map((row) => (
                <li key={row.label} className={profileRow}>
                  <span className="text-[14px] font-bold text-(--lp-ink-soft)">
                    {row.label}
                  </span>
                  <span>{row.value}</span>
                </li>
              ))}
              <li className={profileRow}>
                <span className="text-[14px] font-bold text-(--lp-ink-soft)">
                  ポートフォリオ
                </span>
                <NextLink
                  href="/"
                  className="break-all font-medium text-(--lp-teal-dark) underline underline-offset-4"
                >
                  https://www.tokku-tech.dev/
                </NextLink>
              </li>
            </ul>
          </div>
        </section>

        <section id="flow" className={cn(block, 'bg-(--lp-band)')}>
          <div className={wrap}>
            <h2 className={sectionHeading}>相談の流れ</h2>
            <ol className="m-0 list-none p-0">
              {flowSteps.map((step) => (
                <li key={step.title} className={cn(rowItem, 'py-6')}>
                  <h3 className="m-0 mb-1.5 text-[17px] font-bold leading-[1.6]">
                    {step.title}
                  </h3>
                  <p className="m-0 max-w-[640px] text-[14.5px] leading-[1.95] text-(--lp-ink-soft)">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
            <p className="m-0 mt-9 rounded-lg bg-(--lp-bg) px-[26px] py-[22px] text-[clamp(15.5px,2.8vw,18px)] font-bold leading-[1.8]">
              到達点 — 最初の一台が、毎朝の実務で回り始める状態へ。
            </p>
          </div>
        </section>

        <section id="faq" className={block}>
          <div className={wrap}>
            <h2 className={sectionHeading}>よくある質問</h2>
            <div className="flex flex-col">
              {faqs.map((faq, index) => (
                <details
                  key={faq.q}
                  open={index === 0}
                  className={cn(rowItem, 'group')}
                >
                  <summary className="flex min-h-11 cursor-pointer list-none items-start gap-3.5 px-0.5 py-[22px] text-base font-bold leading-[1.7] [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="ml-auto flex-none text-[22px] font-normal leading-[1.4] text-(--lp-muted) transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                    >
                      +
                    </span>
                  </summary>
                  <div className="max-w-[680px] px-0.5 pb-6 text-[14.5px] leading-loose text-(--lp-ink-soft)">
                    <p className="m-0">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-(--lp-line) py-[88px] max-[560px]:py-[60px]">
          <div className={wrap}>
            <h2 className="m-0 mb-5 text-[clamp(24px,4.6vw,32px)] font-bold leading-[1.55]">
              まずは1回、業務の切り分けから。
            </h2>
            <p className="m-0 mb-8 max-w-[620px] text-[15.5px] leading-loose text-(--lp-ink-soft)">
              「AIを入れれば何とかなる」から始めるのではなく、今の手作業を分解するところから始めると、投資すべき範囲は意外なほど小さく、説明可能になります。その最初の一歩を一緒に決めましょう。
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
              <a
                href={contactGoogleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={btnLarge}
              >
                相談を申し込む
              </a>
              <a
                href={contactGoogleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(textLink, 'min-h-12')}
              >
                相談以外の連絡（登壇・執筆など）も Google Form から
              </a>
            </div>
            <p className="m-0 mt-5 text-[13.5px] leading-[1.7] text-(--lp-muted)">
              <a
                href={timeTicketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--lp-teal-dark)"
              >
                TimeTicket でも受け付けています
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-(--lp-line) pb-10 pt-8">
        <div
          className={cn(
            wrap,
            'flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5'
          )}
        >
          <span className="text-[14px] font-bold">徳田真之介</span>
          <span className="text-[12.5px] text-(--lp-muted)">
            © 2026 Shinnosuke Tokuda
          </span>
        </div>
      </footer>

      <div
        aria-label="相談申込"
        className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-(--lp-line) bg-(--lp-bg) px-4 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2.5 max-[640px]:block"
      >
        <div className="mx-auto flex max-w-[880px] items-center gap-3">
          <p className="m-0 min-w-0 flex-1 text-[12.5px] leading-normal text-(--lp-ink-soft)">
            <strong className="block text-[13px] font-bold leading-[1.4] text-(--lp-ink)">
              AI導入・エージェント活用相談
            </strong>
            まずは業務の切り分けから
          </p>
          <a
            href={contactGoogleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(btnSmall, 'flex-none')}
          >
            相談を申し込む
          </a>
        </div>
      </div>
    </div>
  );
}
