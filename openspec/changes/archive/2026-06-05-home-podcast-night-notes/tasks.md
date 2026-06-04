## 1. 事前確認

- [x] 1.1 stand.fm 番組ページの URL をユーザーに確認する（未確定なら stand.fm リンクは保留し、Spotify 埋め込み＋ Spotify/Apple リンクを先行）
- [x] 1.2 `podcast_cover.png` / `PodcastSection` の既存参照・テストを grep で洗い出す（`grep -rn "podcast_cover\|PodcastSection" src spec`）

## 2. Constants 追加

- [x] 2.1 `src/config/constants.ts` に `nightNoteSpotifyUrl`（`https://open.spotify.com/show/033nwrEqIVEbLwQ01uzRKJ`）を追加
- [x] 2.2 `nightNoteSpotifyEmbedUrl`（`https://open.spotify.com/embed/show/033nwrEqIVEbLwQ01uzRKJ`、compact 指定を含む形）を追加
- [x] 2.3 `nightNoteApplePodcastUrl`（Issue 記載の id1896878866 URL）を追加
- [x] 2.4 `nightNoteStandFmUrl` を追加（1.1 で URL 確定後。未確定なら TODO コメント付きで保留）
- [x] 2.5 もがくラジオ統一用に `podcastSpotifyEmbedUrl`（`https://open.spotify.com/embed/show/6h7WBgX1XlTuypPKhyL3qI`）を追加

## 3. PodcastSection リファクタ（複数番組対応）

- [x] 3.1 番組設定のローカル配列（key / label / title / description? / embedUrl / embedTitle / links[]）を定義し、もがくラジオと夜ノートの 2 件を登録
- [x] 3.2 セクション見出し（`HomeSection` の heading）を単一番組名から汎用見出し（例 `Podcast`）へ一般化
- [x] 3.3 番組ブロックを `md:grid-cols-2` で並列描画（モバイル縦積み）。各ブロックは `Eyebrow` サブラベル＋埋め込み iframe＋リンク群
- [x] 3.4 埋め込み iframe を `rounded-[4px] border border-brand-border-strong` でラップ（YouTubeSection 準拠、compact 高さで両番組を統一）
- [x] 3.5 もがくラジオブロックを `podcastSpotifyEmbedUrl`（open.spotify show 埋め込み）に置き換え、カバー画像 `<img>` 主表現を廃止（既存リンクは維持・夜ノートと表現統一）
- [x] 3.6 夜ノートブロックに Spotify 埋め込み＋ stand.fm / Spotify / Apple Podcast リンクを実装（既存リンクボタンの Tailwind スタイルを流用）
- [x] 3.7 アンカー `id="podcast"` が保持されていることを確認

## 4. テスト

- [x] 4.1 `PodcastSection.spec.tsx` を追加し、2 番組分の埋め込み iframe が描画されることを検証（近傍 spec の作法に合わせ、jest-dom マッチャに依存しない）
- [x] 4.2 各番組がプラットフォームリンクを持つこと、夜ノートが stand.fm/Spotify/Apple Podcast リンクを持つことを検証
- [x] 4.3 もがくラジオブロックが `podcast_cover.png` の `<img>` を主表現として描画しないことを検証

## 5. 仕上げ・検証

- [x] 5.1 `pnpm lint`（Prettier 整形含む）が通ることを確認
- [x] 5.2 `pnpm test` が通ることを確認
- [x] 5.3 `pnpm dev` で `/#podcast` を目視確認（2 番組の埋め込み・リンク・Twilight Blade 罫線／余白）
- [x] 5.4 `pnpm build` が通ることを確認
- [x] 5.5 `openspec validate home-podcast-night-notes` が通ることを確認
