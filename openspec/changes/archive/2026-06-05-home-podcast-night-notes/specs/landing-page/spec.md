## ADDED Requirements

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
