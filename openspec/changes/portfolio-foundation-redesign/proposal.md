## Why

アーカイブ済みの `platform-migration-pnpm-tailwind-shadcn` は pnpm + Tailwind + brand tokens への切り替えリスクを最小化するため、primitive コンポーネントの構築を意図的に見送り、既存ページはすべて Chakra UI のまま残した。続きの作業（TOK-83）でページを書き換え始める前に、共通の土台が必要になる。具体的には、共通ページ chrome（`BaseLayout` / `Header` / `Footer` / `Hero` / `Seo`）と、書き直されたすべてのページが import する一握りの手書き Tailwind primitive である。この土台がないと、ページ書き換え毎に命名やパターンを再発明することになりドリフトする。本 change はその土台を確立し、後続 change（`portfolio-core-pages-redesign` / `portfolio-remaining-and-cleanup`）はその上にページを乗せていく。

## What Changes

- `src/components/parts/` 配下に、手書きの Tailwind ベース **primitive 層**（Button / Link / Container / Section / Stack、および layouts が必要とする最小セット）を導入する。各 primitive は brand CSS 変数を Tailwind utility として参照し、`cn()` + `tailwind-merge` でクラスを合成する。`class-variance-authority` も shadcn/ui も採用しない。
- **BREAKING（視覚的）**: 共通ページ chrome（`BaseLayout` / `Header` / `Footer` / `Hero` / `Seo`）を Twilight Blade token セットに沿って全面的に再設計する。移行期間中に残る Chakra ベースの子ページは、自身が書き換えられるまで新しい chrome の中でレンダリングされることになる。
- 共通 layouts 自身から Chakra / Emotion を剥がす（`src/components/layouts/*` から `@chakra-ui/*` と `@emotion/*` の import が消える）。`src/features/*` 配下の個別ページの Chakra 利用は手をつけず、`ChakraProvider` と `src/theme/theme.ts` は `_app.tsx` に残すので、既存ページは引き続き動作する。
- ADR 相当の決定事項を記録する：primitive の命名とファイル配置、「ページ書き換えの前に layouts を再設計する」順序、brand token 利用パターン（`text-brand-fg` / `bg-brand-bg` / `font-brand-display` など）、未書き換えページのために Chakra を残し続ける明示的な判断。
- 本 change では `@chakra-ui/*` / `@emotion/*` / `framer-motion` / `src/theme/theme.ts` / `_app.tsx` の `ChakraProvider` 配線の **いずれも撤去しない**。これらは `portfolio-remaining-and-cleanup`（change 3）の担当とする。

## Capabilities

### New Capabilities

- `ui-primitives`: 手書き Tailwind primitive コンポーネント群（Button / Link / Container / Section / Stack）。`cn()` + brand tokens を合成する。書き換え後のページが共通して消費するビルディングブロックライブラリとなる。
- `page-layout`: 再設計された共通ページ chrome（`BaseLayout` / `Header` / `Footer` / `Hero` / `Seo`）。Tailwind + brand tokens でレンダリングされ、`@chakra-ui/*` と `@emotion/*` への直接依存を持たない。

### Modified Capabilities

- `styling-platform`: 「Chakra UI coexists with Tailwind during the migration window」要件を絞り込む。共存のスコープを「既存レイアウトを含む全ページ」から「`src/features/*` 配下の個別ページの Chakra JSX のみ」に縮小する。本 change 以降、共通 layouts は `@chakra-ui/*` と `@emotion/*` を import せずにレンダリングされなければならない。一方で `ChakraProvider` と `src/theme/theme.ts` は残し、未書き換えページが引き続きレンダリングできる状態を維持する。

## Impact

- **コード**: `src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}` を書き換える。`src/components/parts/` に primitive ファイル群を追加する（既存の `Card` / `DisclosableCard` / `Title` は残し、呼び出し側が書き換えられるタイミングで順次移行する）。
- **依存**: すでに存在する `tailwind-merge` + `clsx` 以外の追加はない。`@chakra-ui/*` / `@emotion/*` / `framer-motion` は `package.json` に残したまま。
- **視覚的影響**: マージ直後、すべてのルートが新しい chrome で描画される。内側のコンテンツは次の change までは Chakra 製のまま。個人ポートフォリオであり、複数テナントのプロダクトではないため、この過渡状態は受容する。
- **テスト**: 既存の jest spec は引き続き通る必要がある。新しいテストは、primitive のうち挙動が自明でないもの（variant 解決、brand token バインディング）のみに限定して追加する。
- **後続への影響**: `portfolio-core-pages-redesign`（home + news）と `portfolio-remaining-and-cleanup`（works + article + service + Chakra / Framer Motion 最終撤去）のブロックを解除する。
- **スコープ外**: `src/features/*` 配下のページ JSX、`@chakra-ui/*` / `@emotion/*` / `framer-motion` の uninstall、`src/theme/theme.ts` 削除、`ChakraProvider` 剥離。
