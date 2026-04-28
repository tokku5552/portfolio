## Context

TOK-81（Portfolio リニューアル親）の直列 3 段階の中段である TOK-83 の実装設計。TOK-82 でプラットフォーム（pnpm / Tailwind / `brand/tokens.css` / `cn()`）が揃い、Chakra と共存した状態で既存サイトは動いている。本 change は「Hero.html デザイン言語でサイト全体を組み直す」ことと「Chakra / Emotion / Framer Motion / microCMS / react-share を完全撤去する」ことを同時に行う。後続の TOK-84（`/brand` 公開）を解放するのが最終目的。

加えて、ユーザー判断により `/news` 関連（microCMS ベースのお知らせ機能）を本 change で撤去する（メンテナンス停滞のため）。これによりコンテンツ周りはプロフィール / Podcast / YouTube / Services / Articles / Contact + 外部 Music リンクに簡素化される。

デザイン原本は `brand/source/twilight-blade-v1/project/Hero.html` 1 ファイルのみ。Hero セクションと global nav のみカバーされている。Footer、`/articles` 一覧のデザインは原本に存在しないので、Hero.html から抽出した語彙を延長して実装側で組む（= Decision 2）。

現行の情報構造（本 change 後）：

- `/` ランディング（`Home.page.tsx` が Twilight Blade Hero + strip + Podcast / YouTube / Services / Articles / Contact を縦積み）
- `/articles` 一覧（Qiita / Zenn / static-data の集約）
- `/works` `/service` `/news` `/news/[id]` などのルートは存在しない

Hero.html が提示する UI 語彙：`Geist` + `Geist Mono` の二刀流、`--color-brand-{bg,fg,muted,border,border-strong,orb-indigo,orb-violet,orb-pink}`、`.orb` 複合 radial gradient + blur + `float` keyframes、`.grid-overlay` 12 列、`section.hero` の巨大タイポ + eyebrow with pulse + titles with sep + tagline + CTA row (primary-white + ghost-bordered)、`.side-meta` 右カラム、`.strip` 4 カラム bottom、`nav.top` logo + 4 項目 menu + CTA `Get in touch ↗`。

## Goals / Non-Goals

**Goals:**

- 全ルート（`/`、`/articles`）が Twilight Blade の見た目で描画される
- `@chakra-ui/*`、`@emotion/*`、`framer-motion`、`microcms-js-sdk`、`react-share` が `package.json` から消える
- `src/theme/theme.ts` / `src/clients/microcms.ts` / `src/pages/news/` / `src/features/news/` が削除される
- `_app.tsx` から `ChakraProvider` が剥がれる
- 残るコンテンツ（プロフィール / articles / podcast / youtube / service / contact）は情報として保持される
- Hero.html の装飾語彙（Orb / Grid / eyebrow-pulse など）が再利用可能な形で実装される
- `pnpm lint` / `pnpm test` / `pnpm build` が通る

**Non-Goals:**

- `/brand` ページの実装（TOK-84）
- `brand/tokens.css` の token 追加・変更（TOK-82 で完成済）
- 新規ルート追加（`/podcast` `/music` `/writing` などは Out。`Music` は外部リンクで処理する）
- 新規 microCMS 連携（撤去のみ）
- ブログ機能の代替実装（news 機能を別形態で再生する作業は Out）
- Storybook 等のコンポーネントカタログ整備
- テスト拡充（既存 spec の調整までがスコープ）
- ダークモード切替 UI（サイトは常時ダーク）
- a11y 監査のフル実施（focus-visible と alt 属性程度の基本対応はするが、WCAG 準拠監査はスコープ外）

## Decisions

### Decision 1 — Hero.html を唯一のデザイン原本とする

Hero.html に記述された色・タイポ・装飾・レイアウトが全ページのビジュアル規範。矛盾するものは Hero.html を正とする。Hero.html に未定義の領域は Decision 2 で実装者拡張。

**代替案:**

- 既存 Chakra デザインの踏襲 — 却下。TOK-83 の本質は「刷新」。
- 外部の UI キット（shadcn/ui 等）の採用 — 却下。TOK-82 ADR で不採用が確定済み。

**根拠:** ユーザー明示指示「Hero.html を参考に今の情報を置き直す」に直結する唯一解。

### Decision 2 — Hero.html 未収録領域は「語彙の延長」で実装者デザインする

Footer、`/articles` 一覧は Hero.html に原本がない。これらは Hero.html から抽出した語彙（border / mono font / eyebrow / strip / ghost button / hover underline / muted / primary ↔ ghost の二階層 CTA など）を組み合わせて実装者がデザインする。デザイナー（Claude Design）への追加発注は行わない。

**代替案:**

- Claude Design に追加発注して待つ — 却下。直列スケジュールが延びる。
- Chakra デザインを Tailwind で忠実移植 — 却下。見た目の刷新というスコープ定義に反する。

**根拠:** デザインシステムの真価は「原本にない場面でも語彙が引き継げる」ところにあり、それを示す機会として扱う。デザイナーが後で見てずれがあれば TOK-84 前後で微調整する。

### Decision 3 — グローバル Header は Hero.html の `nav.top` を採用、現行 home の `<Header />`（anchor nav）は廃止

Hero.html の `nav.top`（ロゴ + 4 項目 menu + `Get in touch ↗` CTA）を全ページに敷く `BaseLayout` 直下の共通 Header にする。現在 `src/features/home/Home.page.tsx` が直接 render している `<Header />`（`features/home/menus.ts` のアンカー menu）は廃止し、Home 内のセクション間移動用には別途スクロール順で表現する（アンカー ID は残すので URL `#podcast` 等は機能する）。

menu 項目のマッピング（実装時に微調整可、ただし下記が初期解）:

| Hero.html nav 項目 | リンク先 |
|---|---|
| Work | `/#services`（Services セクション。EM 業務 / FDE / 副業の窓口） |
| Music | **外部リンク** `https://inkdoses.com/`（`src/config/constants.ts` に `inkdoseUrl` として追加。`Link external` で描画） |
| Podcast | `/#podcast` |
| Writing | `/#articles`（`/articles` 一覧へのスクロール後、リンクで `/articles` に飛ぶ）。news は撤去のため対象外。 |

CTA `Get in touch ↗`: 現行 `contactGoogleFormUrl` に外部リンクで接続。

**代替案:**

- anchor nav（現行 home の Header）の踏襲 — 却下。Hero.html に存在しない UI。
- 個別ルート `/work` `/music` `/writing` の新設 — 却下。スコープ外。

**根拠:** Hero.html が nav の正解を提示しているので、それに寄せるのが最短。既存アンカーリンクは ID で担保。`Music` は実コンテンツが現サイトにないので外部に逃がす（ユーザー指示）。

### Decision 4 — `/` landing 再構成: Hero + Strip + 既存セクション群（News 撤去）

`/` のページ構成を以下の縦積みにする。上から順：

1. Hero セクション（Hero.html ビジュアル準拠：eyebrow-pulse + 巨大 name タイポ + titles + tagline + CTA row + side-meta）。**コンテンツは現行プロフィール由来**（Decision 4-1）
2. Bottom strip（Hero.html 準拠：4 列）。**ラベル/値は現行プロフィール由来**（Decision 4-1）
3. Podcast セクション（既存の Spotify/Apple/Amazon 埋め込み）
4. YouTube セクション（既存のチャンネル埋め込み）
5. Services セクション（既存の TimeTicket 導線）
6. Articles セクション（既存の Qiita/Zenn/static 集約 3 件）
7. Contact セクション（Google Form リンク）

アンカー ID（`#podcast` `#youtube` `#services` `#articles` `#contact`）は保持。News セクションとアンカー `#news` は撤去する。セクション見出しは Hero.html の `eyebrow` 語彙を流用（mono font + muted + uppercase letter-spacing）。

**代替案:**

- News セクションを残す — 却下。ユーザー判断で撤去確定。
- ページを複数ルートに分割 — 却下。スコープ外。

**根拠:** ユーザー判断（/news 全面削除）と Hero.html ビジュアルへの寄せの整合。

#### Decision 4-1 — Hero セクションの**ビジュアル**は Hero.html、**コンテンツ**は現行プロフィール由来

Hero.html はデザイン提案として Music Producer / Podcast Host のような肩書きを盛り込んでいるが、現行プロフィール（`src/config/constants.ts` の `globalDescription`）は Engineering Manager 中心の自己紹介である。ユーザー指示「Hero のデザインをベースに現在のトップページの要素を並べていく感じで」に従い、Hero セクションの文字情報は現行プロフィール由来に置き直す。

具体的な対応の初期解（実装中に微調整可）:

| Hero.html 要素 | コンテンツ |
|---|---|
| eyebrow | "Portfolio · 2026" + 軽いタグ（"Currently shipping" 相当）。Hero.html 語彙を流用 |
| 巨大タイポ jp | **なし**（実装中にユーザー確認の結果、サイズが小さく主張が弱いため省略を確定 2026-04-28） |
| 巨大タイポ en | "Shinnosuke<br>Tokuda<span class='period'>.</span>"（Hero.html と同一） |
| titles | "Engineering Manager" を中心に、現行に照らして妥当な肩書き 1〜2 個（例: "Engineering Manager / Music Producer"）。**3 つに膨らませない**。 |
| tagline | **現職主軸の英文 1 行（ユーザー確定 2026-04-28）。例: "Engineering Manager at Mercari. Building teams and shipping product across TypeScript / Go / Flutter / AWS / GCP."** Hero.html の "Currently shipping" eyebrow と調和。最終文言は実装時に微調整。 |
| CTA primary | **"Listen to my music ↗" → `inkdoseUrl`（外部）。ユーザー確定 2026-04-28**。当初は "View my work" → `/#services` だったが、ラベルと遷移先が乖離していた（"View my work" はアーティスト portfolio 文脈で、サイト実態は EM + 副線。導線も TimeTicket 相談だった）ため、音楽軸に揃えて INKDOSE 外部リンクへ |
| CTA ghost | "▶ Listen to the podcast" → `podcastUrl`（外部）。Music + Podcast の二本柱で並ぶ構成 |
| side-meta | Based in（Tokyo or 福岡。現行明記なし） / Status（"Open to collabs" 等） / Now working（適当な現状ラベル） |

これらは実装時に `src/features/home/Home.page.tsx` 近辺の固定文字列として配置し、必要なら `src/config/constants.ts` に新規定数を追加する。**ユーザーレビュー時に文言フィードバックを受けて微調整する前提**。

**代替案:**

- Hero.html の文言をそのまま採用 — 却下（ユーザー指示で現行プロフィール優先）。
- 現行 `globalDescription` を Hero に長文ベタ貼り — 却下（タイポグラフィの語彙が崩れる）。

**根拠:** ユーザー指示への忠実な従属 + Hero.html のビジュアル規律維持。

### Decision 5 — Footer デザイン: Header と同じ 4 メニュー語彙 + mark + ソーシャル + 著作権

Footer の上段は Hero.html の `.strip` 語彙（4 列 + 薄い border 区切り + label mono + value）に従い、Header の nav menu と同じ 4 項目（**About** / **Music** / **Podcast** / **Writing**）でナビ並びを敷く。各列内には 2〜3 本の関連リンクを mono サイズで列挙。

下段は `nav.top` の mark（dot + "tok / shinnosuke tokuda"）+ 著作権 + 既存のソーシャルアイコン群（GitHub / X / Facebook / Instagram / LinkedIn）。ソーシャルアイコンは `react-icons` から継続利用。ボタン枠は Hero.html の `.btn-ghost`（`border: 1px solid var(--color-brand-border-strong)` + hover 時 `rgba(255,255,255,0.04)`）スタイルに統一。

「About」列の確定リンク（ユーザー確定 2026-04-28）: **GitHub / LinkedIn / Wantedly**（それぞれ `githubUrl` / `linkdinUrl` / `wantedlyUrl` を `Link external` で）。
「Writing」列: `/articles`。

**代替案:**

- bottom strip を Hero.html のまま流用（Currently / Discography / Podcast / Latest） — 却下（ユーザー判断で「Header と同じ 4 メニュー並び」を選択）。
- Footer を超軽量（mark + copyright のみ）にする — 却下（同じく）。

**根拠:** Header と Footer の語彙統一でナビゲーション体験が一貫する。

### Decision 6 — `/articles` のレイアウト

共通：上部に eyebrow + H1（mono の Eyebrow + sans 700 の見出し）、本文エリアは `Container` primitive で中央寄せ、`border: 1px solid var(--color-brand-border)` の薄い区切り罫。

カード羅列。各カードは `border: 1px solid var(--color-brand-border)` の矩形 + hover で `border-strong`。サムネイル + タイトル + 公開日（mono font）+ 抜粋 + ソースラベル（Qiita / Zenn / Static の `Eyebrow` mono）。"more..." 追加読み込みは ghost Button で「Load more」表記に置換。一覧下部に「← Home」リンク。

**代替案:**

- 既存レイアウト（Chakra の Container + VStack）を Tailwind で忠実移植 — 却下（Chakra テイストが残る）。
- ページネーション化 — 却下。現行 "more..." UX の維持はユーザー判断。

**根拠:** Hero.html 語彙で統一するのが最短でブレない。現行 UX を踏襲しつつ見た目だけ刷新。

### Decision 7 — `Seo` の公開 API は維持、内部は Google Fonts 差し替えのみ

`src/components/layouts/Seo/index.tsx` はすでに `next/head` のみで Chakra / Emotion を import していない。公開 prop（`pageTitle` / `pageDescription` / `pagePath` / `pageImg` / `pageImgWidth` / `pageImgHeight`）を維持し、内部を大きく変更しない。Google Fonts の `<link>` 読み込みは Roboto から Geist 2 種に差し替える。

**代替案:**

- `Seo` を丸ごと書き直す — 却下。中身が既に要件を満たしており、変更すると呼び出し側 `src/pages/*` を全部触ることになる。

**根拠:** 変更の最小化。

### Decision 8 — primitive は `src/components/parts/<Name>/` に手書きで追加、cva 不使用

TOK-82 ADR に準拠。Button / Link / Container / Eyebrow / Orb / GridOverlay を最小で追加。`class-variance-authority` は導入しない。variant 解決は `cn()` + インラインマップで実装。

primitive 範囲：

- `Button`: `variant='primary' | 'ghost'`、`size='md'`。`primary` は白背景 + hover 時 gradient ::before（Hero.html 準拠）。`ghost` は `border: 1px solid var(--color-brand-border-strong)` + hover で `rgba(255,255,255,0.04)`。`asChild` / `as` prop 不実装（必要なら後で追加）。
- `Link`: `href` + `external?: boolean`。Next 15.5 なので内部は `<NextLink href>{children}</NextLink>` で子 `<a>` 不要、外部は `<a target="_blank" rel="noopener noreferrer">`。
- `Container`: `mx-auto max-w-[1440px] px-6 md:px-12` 程度の中央寄せラッパー。
- `Eyebrow`: mono font + muted + uppercase letter-spacing のラベル。`withPulse?: boolean` で Hero.html の pulse ドットを左に付けられる。
- `Orb`: Hero.html の `.orb` と `.orb::after` を React で再現。`position='tr' | 'bl' | 'center'` prop。
- `GridOverlay`: Hero.html の 12 列グリッド overlay。`visible?: boolean` prop（デフォルトは非表示）。

既存の `src/components/parts/{Card, DisclosableCard, Title}` は呼び出し側書き換え時に判断（流用できれば残し、そうでなければ Tailwind 版に差し替え）。

**代替案:**

- cva / shadcn を使う — 却下。TOK-82 ADR 準拠。
- primitive を丸ごと省略 — 却下（再利用度が高い）。

**根拠:** Hero.html の語彙を再利用可能な形で凝固させる最小セット。

### Decision 9 — Framer Motion / microCMS / react-share は撤去

- **Framer Motion**: Hero.html のモーション（Orb の `float`、eyebrow pulse、button hover gradient、arrow translate）はすべて CSS + Tailwind で再現できる。新規依存ゼロで実現する。
- **microCMS**: news 撤去に伴い不要。`src/clients/microcms.ts` 削除、`microcms-js-sdk` を package.json から外す。`isMicrocmsConfigured` を参照する箇所は news 削除と同時に消える。
- **react-share**: news 詳細の SNS シェアボタン群が消えるので不要。

keyframes は `src/styles/globals.css` にスコープ付きで宣言：`@keyframes orb-float`、`@keyframes eyebrow-pulse`、`@keyframes btn-arrow-hover`。

**代替案:**

- `framer-motion` を残す — 却下（ユーザー方針）。
- microCMS を残しつつ news ページだけ削除 — 却下（クライアントが死蔵する）。

**根拠:** 撤去対象の依存はサイトから完全に消すのが正攻法。中途半端に残すと TOK-84 で再度判断が必要になる。

### Decision 10 — 実装順: 撤去対象の特定 → primitive → chrome → `/` → `/articles` → 依存撤去 → 検証

依存関係を踏まえた順序：

1. **primitive 層**: Button / Link / Container / Eyebrow / Orb / GridOverlay を先に揃える（下流すべてが依存）
2. **共通 chrome**: `Seo`（Font 差し替え）/ `Header`（Hero.html nav.top 準拠の新規）/ `Footer`（Decision 5 準拠）/ `BaseLayout`（Header + main + Footer の単純構成）
3. **`/` landing**: `src/features/home/Home.page.tsx` を再構築（Hero セクション + strip + Podcast / YouTube / Services / Articles / Contact の縦積み、News なし）。`src/features/home/menus.ts` を Header 用に書き換え。`<Header />` 呼び出しは削除（BaseLayout が担う）
4. **`/articles`**: `src/features/article/ArticleList.page.tsx` / `src/features/article/components/*` を Twilight Blade 化。"more..." を ghost Button 化
5. **home サブコンポーネント**: `Features`、`YouTube`、`Podcast`、`Works`、`OwnSNS`、`src/features/service/Service.tsx`、`Card`、`DisclosableCard`、`Title` の中から実際に呼ばれるものだけ Twilight Blade 化。呼ばれない orphan は削除
6. **撤去対象の削除**: `src/pages/news/` ディレクトリ、`src/features/news/` ディレクトリ、`src/clients/microcms.ts`、`src/theme/theme.ts` を削除。`src/pages/index.tsx` の `getStaticProps` から news fetch を削除。`src/pages/articles/index.tsx` 等で `Seo` 使用は維持
7. **依存撤去**: `_app.tsx` から `ChakraProvider` を剥がす、`package.json` から `@chakra-ui/*` / `@emotion/*` / `framer-motion` / `microcms-js-sdk` / `react-share` を削除、`pnpm install --lockfile-only` で lockfile 更新
8. **環境変数**: `src/config/environment.ts` から `NEXT_PUBLIC_SERVICE_DOMAIN` / `NEXT_PUBLIC_API_KEY` を削除。`.env.sample` 対応更新
9. **最終検証**: `grep -R "@chakra-ui\|@emotion\|framer-motion\|microcms-js-sdk\|react-share" src/` がマッチゼロ、`pnpm lint`、`pnpm test`、`pnpm build` がクリーン

**代替案:**

- ページを先に書き換えてから chrome を整える — 却下（chrome / primitive が未整備のままページを書くと無駄な中間状態が出る）。
- 依存撤去を最初にする — 却下（撤去したとたん全ページが壊れるので順序逆）。

**根拠:** 「下流ほど後」「壊れる操作はまとめて最後」の基本原則。

## Risks / Trade-offs

- **Hero.html 未収録デザインの解釈ブレ** → Claude Design のトーンと実装者のトーンが合わず、TOK-84 時点で違和感が出る可能性。**Mitigation**: 語彙抽出を Decision 5/6 に明記しておき、後で差分レビューしやすくする。Tailwind なので差し替えコストは低い。
- **Hero セクションの文言確定が実装中まで残る** → `Decision 4-1` で初期解は提示したが、ユーザーの感覚と合うかは実装後レビュー次第。**Mitigation**: 文言を `Home.page.tsx` 近辺の固定文字列に集約し、変更しやすい構造にしておく。
- **大規模書き換えによる回帰** → 全ページ・全コンポーネントが変わるため、目視のリグレッションチェックが必須。**Mitigation**: 実装順序（Decision 10）を守り、各段階で `pnpm dev` + 全ルート手動巡回。
- **/news 削除後の SEO 影響** → 既に検索流入されている news 記事 URL がすべて 404 になる。**Mitigation**: Vercel 上で 410 / 301 を設定するかは TOK-83 のスコープ外。必要ならユーザー判断で別 issue を立てる。
- **Hero タイポの超特大サイズによるモバイル崩れ** → `clamp(72px, 11vw, 180px)` は狭幅で 72px まで縮むが、日本語 jp 部分は重なる可能性あり。**Mitigation**: Hero.html の `@media (max-width: 900px)` 指定に準拠し、実装時に実機確認。
- **Music リンク先未確定** → `Decision 3` で外部リンクと決まったが具体 URL が未定。**Mitigation**: 実装時にユーザーに 1 度確認。

## Migration Plan

1. primitive → chrome → `/` → `/articles` → 撤去 の順で段階的に landing する（Decision 10）。
2. 各段階で `pnpm lint && pnpm test && pnpm build` が通ることを確認してから次へ。
3. 最終段階で `grep` による Chakra / Emotion / Framer Motion / microcms / react-share ゼロ化を確認。
4. ロールバック戦略: 段階ごとに commit を分けておき、問題があれば最終マージ前に戻す。本番は Vercel の即時 rollback が使える。

## Open Questions

- なし（実装着手前に必要な判断はすべて確定済み）。

## Resolved Questions

- `Music` の外部リンク URL → `https://inkdoses.com/`（ユーザー確定 2026-04-28）
- Hero 巨大タイポ jp 部分 → 当初 "とっく" で landing したが、実装プレビューでサイズが小さく主張が弱いため**省略**に変更（ユーザー確定 2026-04-28）
- Hero tagline 方針 → 現職主軸の英文 1 行（ユーザー確定 2026-04-28、最終文言は実装時に微調整）
- Footer "About" 列の中身 → GitHub / LinkedIn / Wantedly（ユーザー確定 2026-04-28）
- /news 旧 URL の SEO 処理 → 何もしない、デフォルトの 404 に任せる（ユーザー確定 2026-04-28、本 change スコープ内で対応不要）
