## ADDED Requirements

### Requirement: `/articles` 一覧は Twilight Blade 語彙のカードリストで描画する

`/articles` ルートは Hero.html から抽出した語彙（`var(--color-brand-border)` の 1px 枠、mono font の公開日、eyebrow 的ラベル、hover で `var(--color-brand-border-strong)` への遷移）を用いたカード羅列で描画しなければならない（MUST）。各カードは記事のタイトル + 公開日 + 本文サマリ + サムネイル画像を含まなければならない（MUST）。ソース（Qiita / Zenn / static）を `Eyebrow` の mono ラベルで各カードに表示しなければならない（MUST）。ページ上部には `Eyebrow` + H1 "Articles"、ページ下部には "more..." 相当の追加読み込み UI を `ghost` variant の Button で実装しなければならない（MUST）。"ホームへ戻る" 表記は "← Home" に統一しなければならない（MUST）。Chakra の `VStack` / `Center` / `Text` / `useBreakpointValue` に依存してはならない（MUST NOT）。

#### Scenario: /articles の more ボタンが ghost Button

- **WHEN** ユーザーが `/articles` の下部にスクロールしたとき
- **THEN** 追加読み込みボタンが `ghost` variant の `Button` primitive として描画される

#### Scenario: /articles カードがソースラベルを持つ

- **WHEN** ユーザーが `/articles` を開いたとき
- **THEN** 各記事カード内に Qiita / Zenn / Static のいずれかを示す mono Eyebrow 風ラベルが表示される

#### Scenario: /articles にハードコード hex がない

- **WHEN** レビュアーが `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/features/article/` を実行したとき
- **THEN** 検索結果はゼロ件である

### Requirement: `/news` および `/news/[id]` ルートは存在しない

本 change の完了後、`src/pages/news/` ディレクトリは存在してはならない（MUST NOT）。`src/features/news/` ディレクトリも存在してはならない（MUST NOT）。`src/clients/microcms.ts` も存在してはならない（MUST NOT）。

#### Scenario: news 関連のディレクトリが削除されている

- **WHEN** レビュアーが `ls src/pages/news/ src/features/news/ src/clients/microcms.ts` を実行したとき
- **THEN** いずれも存在しない（exit code 非ゼロ）

#### Scenario: src 配下に news / microcms 由来の import が残らない

- **WHEN** レビュアーが `grep -R "microcms-js-sdk\|@/clients/microcms\|features/news" src/` を実行したとき
- **THEN** 検索結果はゼロ件である
