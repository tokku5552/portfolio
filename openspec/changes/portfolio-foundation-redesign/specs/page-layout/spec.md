## ADDED Requirements

### Requirement: 共通 layouts は Tailwind + brand tokens でレンダリングする

`src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}/` の共通ページ chrome コンポーネントを書き換え、すべての視覚的スタイリング（色、タイポグラフィ、スペーシング、ボーダー、フォーカス状態）を `brand/tokens.css` で定義された brand token に解決される Tailwind utility クラス経由で適用しなければならない（MUST）。ハードコードされた hex 色リテラル、Emotion の `css` prop、Chakra のスタイル prop、Chakra テーマ参照をこれらのファイルに含めてはならない（MUST NOT）。

#### Scenario: layouts が brand token で描画される

- **WHEN** レビュアーが `src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}/` を対象に `#[0-9a-fA-F]{3,8}\b` にマッチするハードコード hex 色を grep したとき
- **THEN** 検索結果はゼロ件である

### Requirement: 共通 layouts は `@chakra-ui/*` / `@emotion/*` を import しない

本 change 以降、`src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}/` 配下のすべてのファイルは `@chakra-ui/*` / `@emotion/*` からいかなるシンボルも import してはならない（MUST NOT）。これによりきれいな境界線が引かれ、change 3 は共通 layouts に再び手を入れることなく Chakra を依存ツリーから除去できる。

#### Scenario: 共通 layouts 内にレガシー UI ライブラリ import が存在しない

- **WHEN** レビュアーが `grep -R "@chakra-ui\|@emotion" src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}/` を実行したとき
- **THEN** grep はマッチなしで終了する

### Requirement: 共通 layouts は `framer-motion` を import しない

書き換え後の共通 layouts は、新規の `framer-motion` import を導入してはならない（MUST NOT）。新しい chrome 内のアニメーションは、Tailwind の `transition-*` / `animate-*` utility、または `src/styles/globals.css` で宣言された keyframes 経由で表現しなければならない（MUST）。これにより change 3 は、本 change で追加された利用を巻き戻す必要なく `framer-motion` を uninstall できる。

#### Scenario: 共通 layouts 内に Framer Motion import が存在しない

- **WHEN** レビュアーが `grep -R "framer-motion" src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}/` を実行したとき
- **THEN** grep はマッチなしで終了する

### Requirement: `BaseLayout` はページをラップし新しい chrome を描画する

`BaseLayout` は `children: React.ReactNode` を受け取り、再設計された `Header` / `Footer` フレームの内部で描画しなければならない（MUST）。水平ガターが必要な箇所では `Container` primitive を用いること。Chakra の `Box` / `Flex` / `VStack` を適用してはならず、子要素を Chakra 固有のコンテナでラップしてはならない（MUST NOT）。

#### Scenario: BaseLayout が primitive で構成される

- **WHEN** レビュアーが `src/components/layouts/BaseLayout/BaseLayout.tsx` の default export を確認したとき
- **THEN** JSX ツリーは新しい `Header` / `Footer` を含み、Chakra コンポーネントではなく `src/components/parts/` の primitive（例: `Container`）を用いている

### Requirement: `Seo` はメタデータ専用コンポーネントである

`Seo` は `next/head` 内部の JSX（title / meta description / Open Graph タグ / canonical リンクなど）のみをレンダリングしなければならない（MUST）。目に見える DOM を出力してはならず、Chakra / Emotion / Tailwind utility / Framer Motion を import してはならない（MUST NOT）。公開 prop API（`title` / `description` / `ogImage` など）は現行の呼び出し側と後方互換でなければならない（MUST）。これにより、後続のページ書き換え change で `Seo` の呼び出しを同時に変更する必要がなくなる。

#### Scenario: Seo は head メタデータのみを出力する

- **WHEN** テストが React Testing Library 経由で `<Seo title="..." description="..." />` をレンダリングしたとき
- **THEN** レンダリングコンテナに目に見える DOM は追加されない（出力は `next/head` の子要素だけで構成される）

#### Scenario: Seo の prop API が保持される

- **WHEN** ページが `<Seo title={...} description={...} ogImage={...} />`（本 change 前に `src/pages/` で使われていた prop 名の任意の部分集合）を呼び出したとき
- **THEN** 本 change 後も型チェックに通り、正しく描画される

### Requirement: 再設計後の `Hero` は CSS / Tailwind のみでモーションを表現する

`Hero` は、あらゆるアニメーション（エントランス、アクセントモーション）を Tailwind utility、または `src/styles/globals.css` で宣言された `@keyframes` 経由で表現しなければならない（MUST）。`framer-motion` に直接・推移的に依存してはならない（MUST NOT）。keyframe のクラス名は（例: `animate-hero-*` のように）プレフィックス付きにし、Hero スコープであることを明示しなければならない（MUST）。

#### Scenario: Hero モーションは CSS のみ

- **WHEN** レビュアーが `src/components/layouts/Hero/Hero.tsx` を開いたとき
- **THEN** ファイルは `framer-motion` の import を一切含まず、アニメーションは Tailwind utility またはカスタム keyframe クラス名（例: `animate-hero-orb`）を参照している

### Requirement: 再設計後の `Header` / `Footer` は primitive と brand token を用いる

新しい `Header` / `Footer` はナビゲーションリンクを `src/components/parts/Link/` の `Link` primitive 経由で構成し、色・タイポグラフィに brand token utility を適用しなければならない（MUST）。また、すべてのインタラクティブ要素（ナビリンク、存在する場合のテーマ関連コントロール、モバイルメニュートグルなど）はキーボードフォーカス時に可視フォーカスリングを提供しなければならない（MUST）。フォーカススタイリングは Tailwind の `focus-visible:` utility で表現しなければならない（MUST）。

#### Scenario: Header nav が Link primitive を使う

- **WHEN** レビュアーが `src/components/layouts/Header/Header.tsx` の JSX を確認したとき
- **THEN** 各ナビ項目は `src/components/parts/Link/` の `<Link>` 経由で描画されており、素の `<a>` や Chakra の `<Link>` ではない

#### Scenario: chrome のインタラクティブ要素でキーボードフォーカスが可視

- **WHEN** ユーザーが Header / Footer をキーボードでタブ移動したとき
- **THEN** 各フォーカス要素に Tailwind の `focus-visible:` utility が定義する可視フォーカスリングが表示される

### Requirement: layouts は Chakra ベースのページ本体を引き続き描画できる

いまだ Chakra UI を使う `src/features/*` 配下のページは、本 change 以降も再設計された layouts の中で、ランタイムエラー・ハイドレーション不整合・コンソールエラーなく描画されなければならない（MUST）。`ChakraProvider` は `_app.tsx` に配線されたままなので、feature 側の Chakra コンポーネントはテーマを維持する。再設計後の layouts は `ChakraProvider` を除去・バイパス・シャドウしてはならない（MUST NOT）。

#### Scenario: 既存 Chakra ページが新しい chrome 内で描画される

- **WHEN** 本 change 後にアプリがビルドされサーブされ、ユーザーがまだ Chakra を使う feature（例: `/articles`）のページに遷移したとき
- **THEN** そのページは再設計された Header / Footer / BaseLayout の chrome で描画され、内側の Chakra ベースのコンテンツはランタイムエラーなく描画を続ける
