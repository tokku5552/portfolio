# page-layout Specification

## Purpose

Twilight Blade の共通 chrome（グローバル Header / Footer / `BaseLayout` / `Seo`）を Hero.html 語彙で提供し、すべてのルートに同一の枠組みを供給する。Header の nav menu はサイト全体のナビゲーション SSoT として `src/features/home/menus.ts` に集約され、`<Header />` を pages / features 側から直接 render させない契約を担保する。

## Requirements

### Requirement: 共通 chrome（Header / Footer / `BaseLayout`）は Twilight Blade 語彙でレンダリングする

`src/components/layouts/{BaseLayout,Header,Footer,Seo}/` を Tailwind + brand token で再構築しなければならない（MUST）。Header は Hero.html の `nav.top` 語彙（`Container` 内に logo mark + nav menu + ghost CTA を 28px 上下 padding で配置）を採用しなければならない（MUST）。Footer は Hero.html の `.strip` と `nav.top` の語彙を延長し、情報列 + mark（dot + tok）+ ソーシャルアイコン + 著作権を薄い `border-t var(--color-brand-border)` で区切って描画しなければならない（MUST）。`BaseLayout` は Header + `<main>{children}</main>` + Footer の単純構成でなければならない（MUST）。共通 chrome から `@chakra-ui/*` / `@emotion/*` / `framer-motion` への import を行ってはならない（MUST NOT）。

#### Scenario: 共通 chrome にレガシー import が存在しない

- **WHEN** レビュアーが `grep -R "@chakra-ui\|@emotion\|framer-motion" src/components/layouts/{BaseLayout,Header,Footer,Seo}/` を実行したとき
- **THEN** 検索結果はゼロ件である

#### Scenario: Header が Hero.html nav.top 準拠である

- **WHEN** レビュアーが Header の JSX を確認したとき
- **THEN** ロゴ mark（ドット + "tok" + "/ shinnosuke tokuda"）、mono font の nav menu、`ghost` variant の `Get in touch ↗` CTA を `Container` 内に含む

### Requirement: Header の nav menu はグローバルページ遷移を提供する

Header の nav menu 項目は、Hero.html の `Work` / `Music` / `Podcast` / `Writing` の 4 項目に加えて、`/brand` を指す `Brand` 項目を含む 5 項目で構成されなければならない（MUST）。各項目は `src/components/parts/Link/` の `Link` primitive 経由で描画されなければならない（MUST）。`href` はサイト内アンカー（例: `/#services` / `/#podcast` / `/#articles`）、内部ページパス（例: `/articles` / `/brand`）、または外部 URL のいずれかに解決されなければならない（MUST）。内部アンカーを使う場合、リンク先の DOM 要素は対応する `id` を持たなければならない（MUST）。menu 項目のラベルとターゲットの具体対応は `src/features/home/menus.ts` を介して決定されなければならない（MUST）。`<Header />` を pages / features 側から直接 render してはならない（MUST NOT）。Header は `BaseLayout` 経由のみで全ルートに供給されなければならない（MUST）。

#### Scenario: Header の menu 項目が 5 件である

- **WHEN** `/` にアクセスし Header を確認したとき
- **THEN** 5 つの nav 項目（`Work` / `Music` / `Podcast` / `Writing` / `Brand`）が描画される

#### Scenario: Header の Brand 項目が /brand に遷移する

- **WHEN** ユーザーが Header nav の `Brand` 項目をクリックしたとき
- **THEN** `/brand` ルートに遷移する

#### Scenario: home 以外のルートでも Header が描画される

- **WHEN** `/articles` または `/brand` にアクセスしたとき
- **THEN** 同一の Header が描画されている

#### Scenario: pages / features が Header を直接 import しない

- **WHEN** レビュアーが `grep -R "from.*layouts/Header\|from.*layouts['\"]" src/pages/ src/features/` を実行したとき
- **THEN** `Header` を import している pages / features は `src/components/layouts/BaseLayout/` 以外には存在しない

### Requirement: Footer は Hero.html 語彙を延長したデザインで描画する

Footer は以下を含まなければならない（MUST）：（1）Hero.html の `.strip` 語彙に準拠した情報 4 列（ラベル mono + 値 sans）、（2）Hero.html の `nav.top` の mark 語彙に準拠した logo（dot + "tok / shinnosuke tokuda"）、（3）既存のソーシャルアイコン群（GitHub / X / Facebook / Instagram / LinkedIn）を Hero.html の `.btn-ghost` 風の枠線ボタンで、（4）著作権テキスト。色は brand token のみを使用しなければならない（MUST）。Chakra の `useColorModeValue` や Emotion の `css` prop を使用してはならない（MUST NOT）。

#### Scenario: Footer にハードコード hex がない

- **WHEN** レビュアーが `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/components/layouts/Footer/` を実行したとき
- **THEN** 検索結果はゼロ件である

### Requirement: `BaseLayout` は Hero の条件分岐を廃止し Header + main + Footer のみで構成する

`BaseLayout` は現行の「`/` のときだけ Hero を描画しない」分岐ロジックを廃止しなければならない（MUST）。Hero は `/` ランディング内部のコンテンツの一部として描画される責務になり、`BaseLayout` が直接 Hero を render してはならない（MUST NOT）。`BaseLayout` は Header + `<main>{children}</main>` + Footer の単純構造でなければならない（MUST）。

#### Scenario: BaseLayout が Hero を import しない

- **WHEN** レビュアーが `src/components/layouts/BaseLayout/` のファイルを確認したとき
- **THEN** `from '../Hero'` などの Hero import が存在しない

### Requirement: `Seo` の公開 API は後方互換を維持する

`Seo` の現行公開 prop（`pageTitle` / `pageDescription` / `pagePath` / `pageImg` / `pageImgWidth` / `pageImgHeight`）は本 change 後も同じ名前と意味で呼び出せなければならない（MUST）。`Seo` 内の Google Fonts の `<link>` は現行の Roboto から `Geist` + `Geist Mono` に差し替えなければならない（MUST）。`next/head` 以外の UI ライブラリを import してはならない（MUST NOT）。

#### Scenario: Seo の prop API 互換

- **WHEN** `src/pages/` 内の既存呼び出し側（`<Seo />` / `<Seo {...metaData} />`）が変更なしで動作したとき
- **THEN** 型エラーなくビルドが通る

#### Scenario: Seo が Geist フォントを読み込む

- **WHEN** ページソースを確認したとき
- **THEN** `fonts.googleapis.com/css2?family=Geist` を参照する `<link>` が存在する

### Requirement: 共通 chrome のインタラクティブ要素には focus-visible フォーカスリングがある

Header の nav リンク・CTA、Footer のソーシャルアイコン、その他クリック可能要素は、キーボードフォーカス時に Tailwind の `focus-visible:` utility による可視フォーカスリング（brand token 由来の色）を表示しなければならない（MUST）。

#### Scenario: Header のリンクがキーボードで可視フォーカスを得る

- **WHEN** ユーザーが Header の nav リンクに Tab で到達したとき
- **THEN** 可視フォーカスリングが描画される（`focus-visible:` utility 由来）

### Requirement: 共通 chrome にハードコード hex 色や Chakra 由来のスタイルが残らない

`src/components/layouts/{BaseLayout,Header,Footer,Seo}/` のファイル群にハードコード hex 色（`#` で始まる 3〜8 文字の 16 進リテラル）、Chakra の `Box` / `Flex` / `VStack` / `HStack` / `useColorModeValue` / `chakra.*`、Emotion の `css` prop / `styled.*` が残ってはならない（MUST NOT）。

#### Scenario: chrome にハードコード hex がない

- **WHEN** レビュアーが `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/components/layouts/{BaseLayout,Header,Footer,Seo}/` を実行したとき
- **THEN** 検索結果はゼロ件である

#### Scenario: chrome に Chakra / Emotion 由来の記号が残らない

- **WHEN** レビュアーが `grep -R "useColorModeValue\|chakra\.\|from '@emotion" src/components/layouts/{BaseLayout,Header,Footer,Seo}/` を実行したとき
- **THEN** 検索結果はゼロ件である

### Requirement: Footer に `/brand` への導線が存在する

Footer は `/brand` ルートへ遷移するリンクを少なくとも 1 件含まなければならない（MUST）。リンクは `src/components/parts/Link/` の `Link` primitive 経由で描画されなければならず（MUST）、`href` は `/brand` でなければならない（MUST）。リンクラベルは `Brand` または `Brand Guidelines` 相当の表記でなければならない（MUST）。配置場所は Footer の情報列内、ソーシャル列、または著作権の周辺のいずれでもよい（MUST）。

#### Scenario: Footer から /brand に遷移できる

- **WHEN** ユーザーが Footer 内の Brand リンクをクリックしたとき
- **THEN** `/brand` ルートに遷移する

### Requirement: `/brand` ルートでも他ルートと同一の共通 chrome がレンダリングされる

`/brand` ルートでも `BaseLayout` 経由で同一の Header / Footer が描画されなければならない（MUST）。`/brand` 専用の独自 Header / Footer / chrome を導入してはならない（MUST NOT）。

#### Scenario: /brand に共通 Header / Footer が存在する

- **WHEN** ユーザーが `/brand` にアクセスし HTML を確認したとき
- **THEN** `/` や `/articles` と同一の Header（5 項目 nav + Get in touch CTA）と Footer（情報列 + ソーシャル + 著作権 + Brand リンク）が描画されている
