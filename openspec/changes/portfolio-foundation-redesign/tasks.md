## 1. 下地作業と事前確認

- [ ] 1.1 `package.json` の `next` メジャーバージョンを確認し、`Link` primitive の `next/link` ラップ方式（内側 `<a>` を置くか否か）を決定する。判断結果を `src/components/parts/Link/Link.tsx` の先頭にコメントで明記する。
- [ ] 1.2 `tailwind.config.ts` の `theme.extend` に、新しい primitive / layouts が必要とする brand token utility（例: `colors.brand.*` / `fontFamily.brand.*` / タイポグラフィサイズ）を、コンポーネントに触れる前に追加する。各 utility が `brand/tokens.css` の `var(--color-brand-*)` / `var(--font-brand-*)` に解決されることを確認する。
- [ ] 1.3 Chakra reset と Tailwind `corePlugins.preflight` の境界でリグレッションが出ないよう、preflight の有効 / 無効 / スコープを判断する。結果（そのまま有効のまま / 理由付きで無効化）を `tailwind.config.ts` のコメントとして残す。

## 2. UI primitives — `src/components/parts/`

- [ ] 2.1 `src/components/parts/Button/` を `Button.tsx` + `index.ts` で scaffold する。`variant`（`primary | ghost | outline`）と `size`（`sm | md`）を `cn()` 経由のインラインマップで実装する。デフォルトは `variant='primary'` / `size='md'` / `type='button'`。`class-variance-authority` は使わない。
- [ ] 2.2 `src/components/parts/Link/` を `Link.tsx` + `index.ts` で scaffold する。`external?: boolean` による分岐（内部は `next/link` をラップ、外部は `<a target="_blank" rel="noopener noreferrer">`）を実装する。スタイリングは両分岐で `cn()` + brand token utility を共有する。
- [ ] 2.3 `src/components/parts/Container/` を、中央寄せ + ガター付きのラッパー（`<div class="mx-auto w-full max-w-... px-...">`）として scaffold する。`className` を `cn()` 経由で forward する。
- [ ] 2.4 `src/components/parts/Section/` を scaffold する。`<section>` をレンダリングし、brand token 駆動の縦方向リズムを適用し、`className` を `cn()` 経由で forward する。
- [ ] 2.5 `src/components/parts/Stack/` を scaffold する。`gap` prop が Tailwind の `gap-*` utility にマップされる。layouts が必要とするなら `direction`（row / col）もサポートする。
- [ ] 2.6 `src/components/parts/index.ts` のバレル export を、既存の `Card` / `DisclosableCard` / `Title` に加えて `Button` / `Link` / `Container` / `Section` / `Stack` も re-export するよう更新する。
- [ ] 2.7 各 primitive に jest + `@testing-library/react` の spec を併置する。対象は以下：デフォルト描画、variant / size のクラス解決（Button）、内部 / 外部の描画分岐（Link）、`tailwind-merge` 経由の `className` マージ（全 primitive）。
- [ ] 2.8 `grep -R "@chakra-ui\|@emotion\|framer-motion\|class-variance-authority\|shadcn" src/components/parts/{Button,Link,Container,Section,Stack}/` を実行し、マッチが 0 件であることを確認する。

## 3. 共通 layouts の書き換え — `src/components/layouts/`

- [ ] 3.1 `src/components/layouts/Seo/Seo.tsx` を書き換え、`next/head` の中にメタデータ専用 JSX をレンダリングする形にする。公開 prop API は現行 `src/pages/` 呼び出し側と後方互換に保つ。Chakra / Emotion の import を落とす。
- [ ] 3.2 `src/components/layouts/BaseLayout/BaseLayout.tsx` を書き換え、新しい `Header` / `Footer` と `Container` primitive を合成する。Chakra の `Box` / `Flex` ラッパーを落とし、`{children}` を新しい chrome の内側で描画する。
- [ ] 3.3 `src/components/layouts/Header/Header.tsx` を brand token に沿って書き換える。ナビ項目は `Link` primitive 経由で描画し、すべてのインタラクティブ要素に `focus-visible:` フォーカスリングを追加する。
- [ ] 3.4 `src/components/layouts/Footer/Footer.tsx` を brand token に沿って書き換える。外部 / SNS リンクには `Link` primitive の `external` フラグを適切に利用し、`focus-visible:` フォーカスリングを適用する。
- [ ] 3.5 `src/components/layouts/Hero/Hero.tsx` を Tailwind のモーション utility で書き換える。keyframe アニメーションが必要な場合は、スコープの分かるクラス名（例: `.animate-hero-orb`）で `src/styles/globals.css` に宣言し、コンポーネント側から参照する。`framer-motion` の import をすべて削除する。
- [ ] 3.6 `grep -R "@chakra-ui\|@emotion\|framer-motion" src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}/` を実行し、マッチが 0 件であることを確認する。
- [ ] 3.7 `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}/` を実行し、ハードコード hex 色が残っていないことを確認する。

## 4. 統合確認

- [ ] 4.1 `src/pages/_app.tsx` が `ChakraProvider` を `src/theme/theme.ts` のテーマで配線し続けていることを確認する（変更は想定していないが、誤って削除していないか確認する）。
- [ ] 4.2 `pnpm dev` を起動し、すべてのルート（`/` / `/news` / `/news/[id]` / `/articles` / `/works` / `/service`）を手動で巡回する。確認項目：再設計された chrome が全ルートで描画されること、Chakra ベースのページ本体がコンソールエラー・ハイドレーション警告なく描画されること。
- [ ] 4.3 各ルートをキーボードでタブ移動し、Header / Footer のインタラクティブ要素で可視フォーカスリングが出ることを確認する。
- [ ] 4.4 `pnpm lint` / `pnpm test` / `pnpm build` を実行し、いずれもクリーンに終了することを確認する。
- [ ] 4.5 `/` を狭幅（モバイル）と広幅（デスクトップ）でスモークチェックし、再設計された chrome が原因のレイアウト崩れがないことを確認する。

## 5. 締め

- [ ] 5.1 `@chakra-ui/*` / `@emotion/*` / `framer-motion` / `class-variance-authority` が `package.json` に **追加も削除もされていない** ことを確認する（削除は change 3 の担当）。
- [ ] 5.2 TOK-83 に進捗コメントを投稿する。内容：foundation が投入済みであること、次の change は `portfolio-core-pages-redesign`（home + news）であること。
- [ ] 5.3 PR を開く前に `openspec validate portfolio-foundation-redesign --strict` がパスすることを確認する。
