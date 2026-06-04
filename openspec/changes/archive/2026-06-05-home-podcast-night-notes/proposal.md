## Why

ランディングページの Podcast セクションは現在 1 番組（「エンジニアがもがくラジオ」）専用で、カバー画像＋リンクのみの表現になっている。新たに始めた stand.fm の短尺音声番組「とっくの夜ノート」を発信導線として可視化したいが、別番組を載せる枠が無い（TOK-157）。あわせて、番組を聴ける状態をその場で示すため、両番組を埋め込みプレイヤー中心の統一表現に揃える。

## What Changes

- Podcast セクション（`PodcastSection`）を **単一番組 → 複数番組対応** に拡張し、「エンジニアがもがくラジオ」と「とっくの夜ノート」を並列表示する。
- 「とっくの夜ノート」ブロックを追加する: Spotify show 埋め込みプレイヤー＋ stand.fm / Spotify / Apple Podcast へのリンクボタン。
- 既存「エンジニアがもがくラジオ」ブロックを **カバー画像主体 → 埋め込みプレイヤー主体** に置き換える（`podcastSpotifyEmbedUrl` = open.spotify.com の show 埋め込みを使用）。両番組を同一の Spotify show 埋め込み表現に統一する。
- 「とっくの夜ノート」の各種 URL（Spotify show / Spotify 埋め込み / Apple Podcast / stand.fm）、およびもがくラジオの Spotify 埋め込み URL を `src/config/constants.ts` に追加する。
- ナビゲーションは現状の `Podcast → /#podcast` を維持（アンカー `id="podcast"` は不変）。

## Capabilities

### New Capabilities
<!-- なし。既存ランディングページの Podcast セクション要件の変更のみ。 -->

### Modified Capabilities
- `landing-page`: Podcast セクションの要件を「単一番組の埋め込み／リンク」から「**複数番組**を埋め込みプレイヤー中心で並列掲載する」要件へ更新する。掲載すべき番組（エンジニアがもがくラジオ／とっくの夜ノート）と、各番組が保持すべき導線（埋め込み＋プラットフォームリンク）を規定する。

## Impact

- **コード**:
  - `src/features/home/components/PodcastSection.tsx` — 複数番組対応へリファクタ（データ駆動の番組リスト＋ブロック描画）。
  - `src/config/constants.ts` — とっくの夜ノートの URL 定数＋もがくラジオの Spotify 埋め込み定数（`podcastSpotifyEmbedUrl`）を追加。
- **アセット**: 既存の `/assets/podcast_cover.png` はカバー画像置き換えに伴い参照が外れる（ファイル自体は残置）。
- **デザイン**: Twilight Blade 準拠（`HomeSection` / `Eyebrow` / `brand-border` 罫線、iframe は `rounded-[4px] border border-brand-border-strong` で囲う既存 YouTube パターンを踏襲）。
- **テスト**: `PodcastSection` に spec が無い場合、両番組の埋め込み iframe とリンクの存在を確認するテストを追加。
- **外部入力（未確定）**: stand.fm 番組ページの URL が Issue 未提供。stand.fm リンクボタンの実装に必要なため、実装時に確定が必要（Spotify 埋め込み自体は提供済み URL から生成可能でブロックされない）。
