export interface NoteArticle {
  title: string;
  url: string;
  date: string;
  description: string;
  imageUrl: string;
  paid?: boolean;
}

export const noteArticles: NoteArticle[] = [
  {
    title:
      'AIを入れても仕事が楽にならないのはなぜか。手作業フローを先に分解したほうがいい理由',
    url: 'https://note.com/tokku5552/n/n514aef406ec2',
    date: '2026-03-10',
    description:
      'AIで仕事が楽にならない原因は性能ではなく、手作業フローの分解不足にあるという、この相談の土台になる考え方。',
    imageUrl:
      'https://assets.st-note.com/production/uploads/images/257891485/rectangle_large_type_2_b9dc2485f35ceb66617cbacf4717f892.png?fit=bounds&quality=85&width=1280',
  },
  {
    title: '個人開発の自動化パイプラインをClaude Codeで構築した話',
    url: 'https://note.com/tokku5552/n/n30a549151a57',
    date: '2026-03-19',
    description:
      'Podcast制作の自動化を、対話的な実行からパイプライン運用へ育てていった記録。',
    imageUrl:
      'https://assets.st-note.com/production/uploads/images/260285123/rectangle_large_type_2_26f70cb638a11e6a0563f2f158ce8e68.png?fit=bounds&quality=85&width=1280',
  },
  {
    title: 'Podcast編集が辛くなって、全部自動化した話',
    url: 'https://note.com/tokku5552/n/n7ec8d019cc92',
    date: '2026-03-02',
    description:
      '1エピソード3〜4時間の編集作業を、どこから自動化したかの実録。',
    imageUrl:
      'https://assets.st-note.com/production/uploads/images/255760765/rectangle_large_type_2_4f0bf570b4e68b1b720259d4b9fd34f7.png?fit=bounds&quality=85&width=1280',
    paid: true,
  },
  {
    title: 'Fitbit APIとn8nで自動ジャーナリングシステム',
    url: 'https://note.com/tokku5552/n/n91095150637e',
    date: '2025-10-07',
    description: 'n8nとAPI連携で、日々の記録を自動で残す仕組みを作った話。',
    imageUrl:
      'https://assets.st-note.com/production/uploads/images/220494643/rectangle_large_type_2_43937e0750bf6e26d07d16e949d6157e.jpeg?fit=bounds&quality=85&width=1280',
  },
  {
    title:
      'AIにコードを書かせる前に知っておきたい、Claude Codeのセキュリティの勘所',
    url: 'https://note.com/tokku5552/n/n7bdf533485ff',
    date: '2026-06-05',
    description:
      'エージェントに権限を渡すときに、最低限押さえたい安全側の考え方。',
    imageUrl:
      'https://assets.st-note.com/production/uploads/images/282610120/rectangle_large_type_2_c6d49f3e3807812c0f2faac10dc1997e.png?fit=bounds&quality=85&width=1280',
  },
  {
    title:
      'Cloudflare のセキュリティ監査スキルを、自分のリポジトリで回してみた',
    url: 'https://note.com/tokku5552/n/nd1cdc344acce',
    date: '2026-11-05',
    description:
      'AIの指摘を別のAIに検証させる監査スキルを、自分のリポジトリで実際に回した記録。',
    imageUrl:
      'https://assets.st-note.com/production/uploads/images/332642784/rectangle_large_type_2_1a555ac1351484be5c90529f1ed29d66.png?fit=bounds&quality=85&width=1280',
  },
];

export const problems: string[] = [
  '経営として「AI活用を進めろ」と号令はかけたが、現場のどこから始めるべきか定まっていない',
  '部署ごとにAIツールを試してはいるが、単発利用で終わって業務に定着していない',
  'AIとスクリプト、SaaS、手作業の役割分担が曖昧なまま、導入の議論だけが進んでいる',
  'ベンダーやツールの提案は集まるが、自社の業務に合うかの判断材料が足りない',
  'PoCは作れたが、権限・セキュリティ・運用体制の壁で実運用に乗らず止まっている',
  '投資対効果を問われる立場として、「速くなったはずなのに仕事全体は楽になっていない」状態を説明できない',
];

export interface Promise {
  title: string;
  body: string;
}

export const promises: Promise[] = [
  {
    title: 'テンプレが苦手です',
    body: '型にはまった提案はしません。その代わり、御社の業務を先に分解して、どこに効くかを見てから組み立てます。',
  },
  {
    title: 'ツール先行ができません',
    body: '道具ありきで話を進めるのが苦手です。業務の切り分けが済んでから、最後に道具を選びます。',
  },
  {
    title: '作って終わりにできません',
    body: '作ること自体より、現場で回り続けることのほうが難しい。だから設計の段階から、運用まで見て考えます。',
  },
  {
    title: '何でもAI化はできません',
    body: 'AI化しないほうがいい業務も正直にお伝えします。やらないことを先に決めるのが、結局いちばんの近道です。',
  },
];

export interface Deliverable {
  title: string;
  body: string;
}

export const deliverables: Deliverable[] = [
  {
    title: '業務の切り分け表',
    body: '対象部門の業務・手作業を棚卸しし、「AIに任せる」「スクリプトやワークフローで自動化する」「人が判断する」の3つに切り分けた一覧。投資対効果の見立てと、どこから手を付けるかの優先順位付き。',
  },
  {
    title: '最初の一台の設計メモ',
    body: '最初に作るエージェント／自動化について、何を入力にして、何を出力し、どこで人が承認するかを決めた設計メモ。大きく作らず、現場で回る最小の形に絞るので、そのまま開発チームや委託先への指示に使えます。',
  },
  {
    title: 'やらないことリスト',
    body: 'AI化しないほうがいい業務と、その理由。コストやリスクに見合わない自動化を先に捨てることで、効くところに集中できます。',
  },
  {
    title: '運用の勘所メモ',
    body: '権限の渡し方、承認フローの置き場所、ログと機密情報の扱いなど、エージェントを実務で回し続けるときに踏みやすい落とし穴のメモ。情シスやセキュリティ部門との調整で詰まりやすい点も先回りして整理します。',
  },
];

export interface Practice {
  title: string;
  body: string;
}

export const practices: Practice[] = [
  {
    title: '毎朝のAIニュース自動収集（n8n）',
    body: '生成AI／AIエージェントのニュースを毎朝自動で収集・選定・要約し、Slackに届けるワークフローを構築し、運用を続けています。',
  },
  {
    title: 'X投稿エージェント',
    body: '自分の口調コーパスをもとに投稿候補を組み立てるエージェントを構築。ネタ集めから候補生成までを自動化し、最後の判断は人が行う形で運用しています。',
  },
  {
    title: 'Claude Codeプラグインの開発と運用',
    body: '自分の開発支援プラグイン群を公開リポジトリで開発し、エージェント自身に診断・改修させる運用まで回しています。',
  },
  {
    title: 'Podcastの制作自動化',
    body: '編集に1エピソード3〜4時間かかっていた作業を、文字起こし・編集・投稿まで含めてパイプライン化しました。',
  },
];

export interface FlowStep {
  title: string;
  body: string;
}

export const flowSteps: FlowStep[] = [
  {
    title: '申込',
    body: 'Google Formから相談内容を送ってください。内容を確認のうえ、日程調整のご連絡をします。（TimeTicket経由の申込も可能です）',
  },
  {
    title: '事前共有',
    body: '対象部門の業務の流れと困りごとを、事前にフォームまたはメッセージで共有いただきます（機密情報は伏せた形で大丈夫です）。',
  },
  {
    title: '当日',
    body: 'オンラインで、業務の切り分けを一緒に進めます。必要に応じて、実際に運用しているエージェントの画面や構成もお見せします。',
  },
  {
    title: '持ち帰り',
    body: '切り分け表と、最初に作るエージェントの設計メモを、社内で共有・稟議に使える形でお渡しします。',
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: 'どんな人が対象ですか？',
    answer:
      '経営者・事業責任者の方、部門の予算を持ちAI活用の投資判断をするマネージャーの方、社内のAI推進を任された責任者の方を対象としています。会社の予算で、現場への導入を前に進めたい方の相談です。',
  },
  {
    question: '対象にならない相談はありますか？',
    answer:
      '「全部作ってほしい」という受託開発のご相談は対象外です。作るのは貴社のチーム（または委託先）で、私は切り分けと設計の伴走をします。また、個人の学習・転職目的の技術相談も、この相談の対象外です。',
  },
  {
    question: '相談内容の秘密は守られますか？',
    answer:
      'はい。相談で伺った内容を外部に公開することはありません。逆に、所属組織の機密情報そのものは持ち込まず、業務の構造が分かる範囲で伏せて共有いただく形をお願いしています。',
  },
  {
    question: '支払いや契約の形はどうなりますか？',
    answer:
      '個人の副業としてお受けしています。請求書払いや法人契約の可否を含め、申込時に個別にご案内します。所属企業の業務としての相談・契約はお受けできません。',
  },
  {
    question: '料金はいくらですか？',
    answer: '申込時にご案内します。',
  },
  {
    question: '相談の前に準備しておくことはありますか？',
    answer:
      '対象にしたい部門の「困っている業務」を1〜2個、具体的な流れが分かる形で思い浮かべておいてください。資料の用意は不要です。',
  },
];
