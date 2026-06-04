## Context

ランディング（`/`）の Podcast セクションは `src/features/home/components/PodcastSection.tsx` 単一コンポーネントで、1 番組「エンジニアがもがくラジオ」を **カバー画像（`/assets/podcast_cover.png`）＋プラットフォームリンク** という形で描画している。一方 `YouTubeSection.tsx` は最近 Channel / Playlist の 2 ブロック（`md:grid-cols-2` ＋ `aspect-video` の iframe を `rounded-[4px] border border-brand-border-strong` で囲う）に分割され、埋め込み中心の表現パターンが確立済み。

TOK-157 で新番組「とっくの夜ノート」（stand.fm 配信の短尺音声番組）を発信導線として追加したい。ヒアリングの結果、(1) 既存 Podcast セクションを複数番組対応へ拡張する、(2) 両番組を埋め込みプレイヤー中心の統一表現に揃える、(3) 夜ノートは Spotify show 埋め込み＋ stand.fm / Spotify / Apple Podcast リンク、という方針が確定した。

`src/config/constants.ts` には既に `podcastEmbedUrl`（もがくラジオの Spotify for Podcasters 埋め込み）が定義済みだが現状未使用。夜ノート用 URL は未定義。

## Goals / Non-Goals

**Goals:**

- Podcast セクションを 2 番組（もがくラジオ／夜ノート）並列掲載に拡張する。
- 両番組を「埋め込みプレイヤー＋プラットフォームリンク」の同一フォーマットに統一する。
- YouTube セクションと同じ Twilight Blade 埋め込み語彙（border / radius / aspect）を踏襲し、デザインの一貫性を保つ。
- 既存アンカー `id="podcast"` とナビ項目（`Podcast → /#podcast`）を不変に保つ。

**Non-Goals:**

- 新規ナビ項目や専用ページ（`/podcast` 等）の追加はしない。
- stand.fm 埋め込みプレイヤーの採用はしない（埋め込みは Spotify show に統一）。
- 記事・Services・Contact 等、他セクションの変更はしない。
- Amazon Music など Issue で言及のないプラットフォーム導線の追加はしない。

## Decisions

### Decision 1: 番組をデータ駆動で表現する

`PodcastSection` 内にローカルな番組設定配列（例 `PODCASTS: { key, label, title, description?, embedUrl, embedTitle, links: { label, href }[] }[]`）を定義し、`.map()` で番組ブロックを描画する。

- **理由**: 2 番組で重複する「Eyebrow サブラベル＋埋め込み iframe＋リンク群」の構造を 1 箇所に集約でき、将来の番組追加も配列追記で済む。`YouTubeSection` はブロックをベタ書きしているが、Podcast はブロック内部構造（リンク群）が番組ごとに異なるため、データ駆動の方が重複が減る。
- **代替案**: 番組ごとに別コンポーネント（`MogakuRadioBlock` / `NightNotesBlock`）に分割 → 構造がほぼ同一のため過剰分割と判断。却下。

### Decision 2: 埋め込みは両番組とも open.spotify.com の show 埋め込みに統一する

- もがくラジオ: `podcastSpotifyEmbedUrl`（`https://open.spotify.com/embed/show/6h7WBgX1XlTuypPKhyL3qI`、既存 `podcastSpotifyUrl` の show ID）を使用。
- 夜ノート: Issue の Spotify show URL から `nightNoteSpotifyEmbedUrl`（`https://open.spotify.com/embed/show/033nwrEqIVEbLwQ01uzRKJ`）を生成して使用。
- **理由**: ユーザー方針で夜ノート埋め込みは Spotify show に決定。もがくラジオも埋め込み化（カバー画像置き換え）が要望された。当初もがくラジオは既存 `podcastEmbedUrl`（`podcasters.spotify.com/.../embed`）を想定したが、目視確認で白基調＋下部余白の出るプレイヤーとなり open.spotify.com 版（コンパクトな色付きカード）と不揃いになったため、両番組とも `open.spotify.com/embed/show/...` に統一して見た目を一致させる。
- **代替案**: (1) stand.fm 埋め込み → 番組 URL 未提供かつ UX が不揃いになるため却下。(2) もがくラジオを `podcastEmbedUrl`（podcasters 版）のまま → 夜ノートと見た目が不揃いになるため却下。

### Decision 3: もがくラジオのカバー画像を廃し埋め込みに置き換える

`/assets/podcast_cover.png` の `<img>` と Spotify for Podcasters リンクカード表現をやめ、埋め込み iframe ＋リンクボタン群に統一する。

- **理由**: 両番組の表現を揃えるという方針。カバー画像のみ片方に残ると不揃いになる。
- **トレードオフ**: カバーアートのビジュアル訴求が失われる。ただし埋め込みプレイヤー自体がカバーアートを内包表示するため実質的な情報欠落は小さい。画像ファイルは残置（参照のみ削除）。

### Decision 4: レイアウトは `md:grid-cols-2` の 2 ブロック

`YouTubeSection` と同じく、デスクトップは 2 番組横並び、モバイルは縦積み。各ブロックは `Eyebrow`（番組名サブラベル、例 `// もがくラジオ` / `// 夜ノート`）＋埋め込み iframe（border/radius 付き）＋リンクボタン群（既存 PodcastSection のリンクスタイルを流用）で構成する。セクション見出し（`HomeSection` の `heading`）は単一番組名から汎用見出し（例 `Podcast`）へ一般化する。

- **理由**: 既存 YouTube パターンとの一貫性。Spotify 埋め込みは固定高さのため、両ブロックで `compact`（高さ 152px）を採用し高さを揃える。
- **代替案**: `aspect-video` の縦長埋め込み → 音声番組には不要に大きいため compact 高さを選択。

### Decision 5: constants の命名

夜ノート用に `nightNoteSpotifyUrl` / `nightNoteSpotifyEmbedUrl` / `nightNoteApplePodcastUrl` / `nightNoteStandFmUrl` を追加する。既存 `podcast*` プレフィックスと対比できる `nightNote*` プレフィックスで統一する。あわせてもがくラジオの Spotify show 埋め込み用に `podcastSpotifyEmbedUrl` を追加する（既存 `podcastEmbedUrl`（podcasters 版）は定義を残すが本セクションでは未使用）。

## Risks / Trade-offs

- **stand.fm 番組 URL 未提供** → 夜ノートの stand.fm リンクボタンが実装できない。Mitigation: 実装着手時にユーザーへ URL を確認する（Open Question に記載）。確定するまで stand.fm リンクは保留可能で、Spotify 埋め込み＋ Spotify/Apple リンクは先行実装できる。
- **カバー画像参照の削除で既存テスト／視覚回帰が壊れる** → Mitigation: `PodcastSection` 関連の既存 spec / `podcast_cover.png` 参照を grep で確認し、影響箇所を更新する。
- **Spotify 埋め込みの高さ・余白がデザインと不調和** → Mitigation: compact 高さで両番組を揃え、YouTube セクションと同じ border/radius でラップして視覚的に統一する。
- **外部埋め込み（Spotify iframe）への依存** → 既に YouTube / 既存 Podcast 構成と同様の外部依存であり、新規リスクは増えない。

## Migration Plan

UI のみの変更で破壊的データ移行はない。

1. `constants.ts` に夜ノート URL を追加。
2. `PodcastSection.tsx` をデータ駆動の複数番組描画へリファクタ。
3. 既存テスト／参照（`podcast_cover.png`）を確認・更新し、両番組の埋め込み・リンクを検証するテストを追加。
4. ロールバックは当該コミットの revert で完結（アセット・他セクションへ影響なし）。

## Open Questions

- stand.fm 番組ページの URL（`nightNoteStandFmUrl`）— Issue 未提供。実装着手時に確定する。確定前は stand.fm リンクを暫定非表示にするか、確定を待ってから実装するかを判断する。
- セクション汎用見出しの文言（例 `Podcast` / `音声発信` 等）と各番組サブラベルの表記は実装時にコピーを最終調整する。
