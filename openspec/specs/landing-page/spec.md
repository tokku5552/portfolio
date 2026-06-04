# landing-page Specification

## Purpose

`/` ランディングページ本体の構成と要件。Hero.html を Twilight Blade デザインの SSoT として、Hero セクション → 4 列 strip → 既存 home セクション群（Podcast / YouTube / Services / Articles / Contact）の縦積みを規定する。Hero セクションのコンテンツは現行プロフィール（`globalDescription`）由来とし、Hero.html ビジュアルに揃えつつも自分のキャリアと整合させる。

## Requirements

### Requirement: `/` ランディングは Hero セクションから始まる

`/` ルートは最上段に Hero.html 準拠の Hero セクションを描画しなければならない（MUST）。Hero セクションは（1）`withPulse` 付き `Eyebrow`、（2）日本語呼称（任意）と英語名の巨大 2 段タイポ（英語名の末尾ピリオドは indigo→violet→pink グラデーションのテキストクリップ）、（3）肩書きを `<span class="sep">` 相当の 45 度回転 violet 矩形で区切った titles 列、（4）640px 幅 max のタグライン、（5）`Button` primary（メインアクション）+ `Button` ghost（podcast 等のサブアクション）の CTA 行、（6）右端に side-meta 列を含まなければならない（MUST）。Hero セクション内では `Orb` primitive を背景レイヤーとして描画しなければならない（MUST）。

文字情報は **Hero.html のビジュアル構造を保ちつつ、コンテンツは現行プロフィール（`src/config/constants.ts` の `globalDescription` 由来）に置き直さなければならない**（MUST）。具体的には、肩書き列は現行プロフィールが示す範囲（例: "Engineering Manager"）に揃え、Hero.html の "Music Producer / Podcast Host" を機械的に流用してはならない（MUST NOT）。タグラインは `globalDescription` を 1〜2 文に圧縮した内容でなければならない（MUST）。

#### Scenario: Hero セクションが Hero.html の構造を再現する

- **WHEN** ユーザーが `/` にアクセスしたとき
- **THEN** Eyebrow + 巨大 name タイポ + titles + tagline + CTA row + side-meta が Hero.html と同じ上から下への順序で描画される

#### Scenario: Hero 末尾ピリオドがグラデーションで描画される

- **WHEN** 英語名の末尾ピリオドを DOM 検査したとき
- **THEN** `background-clip: text` と `color: transparent` を持つスパン要素としてレンダリングされ、背景は `var(--color-brand-orb-indigo/violet/pink)` のリニアグラデーションである

#### Scenario: 肩書きが現行プロフィール由来である

- **WHEN** Hero セクションの titles 列を確認したとき
- **THEN** "Engineering Manager" を中心とする現行プロフィール準拠の肩書きが表示され、Hero.html サンプルの "Music Producer" / "Podcast Host" が直訳で並ぶことはない（実装時の判断で 1〜2 個追加することは許容）

### Requirement: `/` ランディングは Hero 直下に 4 列の strip を描画する

Hero セクション直下には Hero.html の `.strip` 語彙に準拠した 4 列情報ストリップを描画しなければならない（MUST）。各列は薄い `var(--color-brand-border)` で区切られ、上部に mono font の label（uppercase + tracking）、下部に sans 700 の value を含まなければならない（MUST）。

#### Scenario: bottom strip が 4 列描画される

- **WHEN** `/` にアクセスしたとき
- **THEN** Hero 直下に 4 つの div が grid で並び、各 div は label + value を持つ

### Requirement: `/` ランディングは既存 home セクション群（News 除く）を Twilight Blade 語彙で保持する

`/` は **Podcast / YouTube / Services / Articles / Contact** の 5 セクションを Twilight Blade 語彙で再描画しなければならない（MUST）。各セクションの見出しは `Eyebrow` primitive（pulse なし）で描画し、セクション区切りは `var(--color-brand-border)` の薄い水平罫で表現しなければならない（MUST）。各セクションは対応するアンカー `id`（`podcast` / `youtube` / `services` / `articles` / `contact`）を保持しなければならない（MUST）。Qiita/Zenn 由来の articles（上位 3 件）、Podcast / YouTube 埋め込み、Service（TimeTicket 導線）、Contact（Google Form リンク）の情報を失ってはならない（MUST NOT）。

**News セクション（および対応するアンカー `#news`）は描画してはならない**（MUST NOT）。

#### Scenario: アンカー ID が保持されている

- **WHEN** ユーザーが `/#podcast` にアクセスしたとき
- **THEN** Podcast セクションまでスクロールされる（対応する `id="podcast"` の要素が存在する）

#### Scenario: Articles セクションに Qiita/Zenn 由来の記事 3 件が表示される

- **WHEN** `/` を開いたとき
- **THEN** Articles セクションに最新 3 件の記事が表示され、`/articles` 一覧へのリンクが存在する

#### Scenario: News セクションが存在しない

- **WHEN** `/` の DOM を確認したとき
- **THEN** News セクションを示す `id="news"` の要素は存在せず、News 見出しも描画されない

### Requirement: `/` ランディング内で `<Header />` を直接 render しない

`src/features/home/Home.page.tsx` およびそこから呼ばれる `src/features/home/` 配下の JSX は、`<Header />` を直接 render してはならない（MUST NOT）。Header は `BaseLayout` 経由で全ルートに供給される。

#### Scenario: Home.page.tsx が Header を import しない

- **WHEN** レビュアーが `grep "Header" src/features/home/Home.page.tsx` を実行したとき
- **THEN** `Header` の import 文は存在しない

### Requirement: `/` の `getStaticProps` から news fetch を削除する

`src/pages/index.tsx` の `getStaticProps` は news 関連のフェッチを行ってはならない（MUST NOT）。`Home` コンポーネントの props も news を受け取ってはならない（MUST NOT）。articles のフェッチは継続する。

#### Scenario: index.tsx に news 関連のシンボルが残らない

- **WHEN** レビュアーが `grep "News\|news\|microcms" src/pages/index.tsx` を実行したとき
- **THEN** マッチがゼロ件、または microCMS / news に関連しないコメント / 文字列のみである

### Requirement: Podcast セクションは複数番組を埋め込みプレイヤー中心で並列掲載する

`/` の Podcast セクション（`id="podcast"`）は 1 つ以上の番組ブロックを描画しなければならず、現状は **「エンジニアがもがくラジオ」と「とっくの夜ノート」の 2 番組** を含まなければならない（MUST）。各番組ブロックは（1）当該番組の **埋め込みプレイヤー iframe**、（2）当該番組の **プラットフォームリンク群** の両方を含まなければならない（MUST）。各埋め込み iframe は YouTube セクションと同じ Twilight Blade 語彙（`rounded-[4px] border border-brand-border-strong` 相当のボーダー／角丸でラップ）で描画しなければならない（MUST）。

両番組とも Spotify show 埋め込み（`open.spotify.com/embed/show/...`）を用い、プレイヤー表現を統一しなければならない（MUST）。「エンジニアがもがくラジオ」ブロックは `src/config/constants.ts` の `podcastSpotifyEmbedUrl` による埋め込みを用いなければならず、カバー画像（`/assets/podcast_cover.png`）を主表現とする旧構成を保持してはならない（MUST NOT）。「とっくの夜ノート」ブロックは `nightNoteSpotifyEmbedUrl` による Spotify show 埋め込みと、stand.fm / Spotify / Apple Podcast へのリンクを含まなければならない（MUST）。

セクションのアンカー `id="podcast"` は保持しなければならない（MUST）。新規ナビゲーション項目や専用ページは追加しない（MUST NOT）。

#### Scenario: Podcast セクションに 2 番組の埋め込みが存在する

- **WHEN** ユーザーが `/` を開き Podcast セクションの DOM を確認したとき
- **THEN** `id="podcast"` の要素内に「エンジニアがもがくラジオ」と「とっくの夜ノート」それぞれの埋め込みプレイヤー iframe が 2 つ存在する

#### Scenario: 各番組がプラットフォームリンクを持つ

- **WHEN** Podcast セクションの各番組ブロックを確認したとき
- **THEN** 各ブロックは当該番組を聴けるプラットフォームへの外部リンクを 1 つ以上含む

#### Scenario: とっくの夜ノートが stand.fm / Spotify / Apple Podcast リンクを持つ

- **WHEN** 「とっくの夜ノート」ブロックを確認したとき
- **THEN** stand.fm・Spotify・Apple Podcast の各プラットフォームへの外部リンクが存在する

#### Scenario: もがくラジオがカバー画像主体ではなく埋め込み表現である

- **WHEN** 「エンジニアがもがくラジオ」ブロックの DOM を確認したとき
- **THEN** `/assets/podcast_cover.png` の `<img>` を主表現として描画せず、`podcastSpotifyEmbedUrl` を用いた Spotify show 埋め込みプレイヤー iframe を描画する

#### Scenario: Podcast アンカーが保持されている

- **WHEN** ユーザーが `/#podcast` にアクセスしたとき
- **THEN** `id="podcast"` の要素が存在し、Podcast セクションまでスクロールされる
