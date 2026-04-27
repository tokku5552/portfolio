## 1. 下地作業

- [ ] 1.1 `src/styles/globals.css` に Twilight Blade 用 keyframes（`@keyframes orb-float` / `@keyframes eyebrow-pulse` / `@keyframes btn-arrow-hover`）と、primitive が参照する共通 class（`.tb-orb` / `.tb-grid-overlay` / `.tb-btn-primary-hover` など）を宣言する。Hero.html の `@keyframes float` / `@keyframes pulse` を Twilight Blade 規約に寄せた命名で移植する。
- [ ] 1.2 `src/components/layouts/Seo/index.tsx` の Google Fonts link を Roboto から `Geist` + `Geist Mono` に差し替える。公開 prop API は据え置き。
- [ ] 1.3 `tailwind.config.ts` の `theme.extend` に必要な追加があれば加える（例: `maxWidth.shell: '1440px'` / Hero タイポ用 fontSize scale）。brand token 自体の追加はしない。
- [ ] 1.4 `src/config/constants.ts` に `inkdoseUrl = 'https://inkdoses.com/'` を追加する（Header / Footer の Music リンク先）。

## 2. UI primitive の追加

- [ ] 2.1 `src/components/parts/Button/` を追加。`variant: 'primary' | 'ghost'`、`size: 'md'`、default `type='button'`。primary は Hero.html の `.btn-primary`（白背景 + hover 時 gradient ::before）、ghost は `.btn-ghost`（border-strong + hover で透過白）。`cn()` + インライン variant マップ。
- [ ] 2.2 `src/components/parts/Link/` を追加。`external?: boolean` 分岐。Next 15.5 のため内部は `<NextLink href>{children}</NextLink>`、外部は `<a target="_blank" rel="noopener noreferrer">`。
- [ ] 2.3 `src/components/parts/Container/` を追加。`mx-auto max-w-[1440px] px-6 md:px-12`。`className` を `cn()` で forward。
- [ ] 2.4 `src/components/parts/Eyebrow/` を追加。mono font + uppercase + muted + tracking。`withPulse?: boolean` で pulse ドット。
- [ ] 2.5 `src/components/parts/Orb/` を追加。`position: 'tr' | 'bl' | 'center'`。`.tb-orb` class 経由で gradient + blur + `orb-float`。`pointer-events: none`。
- [ ] 2.6 `src/components/parts/GridOverlay/` を追加。`visible?: boolean`（デフォルト false）。`.tb-grid-overlay` class で 12 列パターン。`pointer-events: none`。
- [ ] 2.7 `src/components/parts/index.ts` の barrel export を更新（既存 + Button / Link / Container / Eyebrow / Orb / GridOverlay）。
- [ ] 2.8 各 primitive に jest + `@testing-library/react` の spec を最小で併置。
- [ ] 2.9 `grep -R "@chakra-ui\|@emotion\|framer-motion\|class-variance-authority\|shadcn" src/components/parts/{Button,Link,Container,Eyebrow,Orb,GridOverlay}/` を実行、0 件を確認。

## 3. 共通 chrome の再構築

- [ ] 3.1 `src/features/home/menus.ts` を Header 用に書き換える。Work / Music / Podcast / Writing の 4 項目 + 各 href（Music は外部、Writing は `/articles`）。
- [ ] 3.2 `src/components/layouts/Header/index.tsx` を書き換える。`Container` 内で logo mark（dot + "tok / shinnosuke tokuda"）+ nav menu（`Link` primitive、4 項目）+ `Button` ghost `Get in touch ↗`。`border-b var(--color-brand-border)`。`useColorModeValue` / Chakra import を撤去。
- [ ] 3.3 `src/components/layouts/Footer/index.tsx` を書き換える。上段：Header と同じ 4 メニュー（About / Music / Podcast / Writing）の縦リンク列を 4 列で並べる。下段：mark + 著作権 + ソーシャルアイコン群（react-icons 継続）。Chakra `Box` / `useColorModeValue` 撤去。
- [ ] 3.4 `src/components/layouts/BaseLayout/index.tsx` を書き換える。`usePathname` 分岐と Hero import を廃止。`<Header />` + `<main>{children}</main>` + `<Footer />` の単純構成。
- [ ] 3.5 `src/components/layouts/Hero/` ディレクトリは削除する（landing 専用 Hero は `src/features/home/` 内で再実装するため）。
- [ ] 3.6 `src/components/layouts/index.ts` を更新（`Header` / `Footer` / `Seo` / `BaseLayout` のみ公開、不要 export を削除）。
- [ ] 3.7 `grep -R "@chakra-ui\|@emotion\|framer-motion" src/components/layouts/{BaseLayout,Header,Footer,Seo}/` 0 件を確認。
- [ ] 3.8 `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/components/layouts/{BaseLayout,Header,Footer,Seo}/` 0 件を確認。

## 4. `/` landing の再構成

- [ ] 4.1 `src/features/home/` 配下に新 Hero セクションコンポーネント（例: `TwilightHero.tsx`）を作成。Hero.html の `section.hero` を React 化：`Eyebrow withPulse` + 巨大 name（日本語 + 英語 + gradient period）+ titles + tagline + CTA row（primary "View my work" + ghost `Listen to the podcast`）+ side-meta。`Orb position="tr"` を背景レイヤー。
- [ ] 4.2 Hero セクションのコンテンツ（巨大タイポ jp / titles / tagline / side-meta / CTA 文言）を現行プロフィール（`globalDescription`）由来で埋める。実装着手時にユーザーへ初期解（Decision 4-1 の表）を提示してフィードバックを受け、確定したら定数として `Home.page.tsx` 近辺に置く。
- [ ] 4.3 Hero.html の `.strip` 4 列（Currently / Discography / Podcast / Latest 相当）を `HeroStrip.tsx` として実装し Hero 直下に配置。各列のラベル/値も現行プロフィール由来（実装時にユーザー確認）。
- [ ] 4.4 `src/features/home/Home.page.tsx` を再構築。`<Header />` 呼び出しを削除（BaseLayout が担う）。上から TwilightHero → HeroStrip → **Podcast → YouTube → Services → Articles → Contact** の順に並べる（News は除外）。各セクションに対応アンカー id（`podcast` / `youtube` / `services` / `articles` / `contact`）を保持。セクション見出しは `Eyebrow` primitive で統一。
- [ ] 4.5 `src/features/home/` 配下の既存サブコンポーネント（`Features` / `Works` / `YouTube` / `Podcast` / `OwnSNS`）のうち、`Home.page.tsx` が呼ぶものを Twilight Blade 語彙に書き換える。呼ばれない orphan は削除。
- [ ] 4.6 `src/features/service/Service.tsx`（`TimeTicketConsultation`）を Twilight Blade 語彙で書き直す。Chakra 依存を撤去。
- [ ] 4.7 `src/features/article/components/AdjustableArticleList.tsx` と `ArticleItem` を Twilight Blade カードで書き直す（Articles セクションも同コンポーネントを再利用）。
- [ ] 4.8 `src/components/parts/{Card, DisclosableCard, Title}` の扱いを決定：Twilight Blade 語彙と整合するなら書き換えて継続、整合しなければ削除し primitive で置換。
- [ ] 4.9 `src/pages/index.tsx` の `getStaticProps` から news fetch を削除し、props も `articles` のみに整理。`isMicrocmsConfigured` 参照を削除。
- [ ] 4.10 `/` をブラウザで開き、上から下までスクロールして全セクションが Twilight Blade 語彙で描画されていること、`#podcast` 等の外部アンカーリンクが動作すること、News セクションが存在しないことを確認。

## 5. `/articles` の再実装

- [ ] 5.1 `src/features/article/ArticleList.page.tsx` を Twilight Blade カード一覧で書き直す。`Container` + `Eyebrow` + H1 "Articles" + カード羅列 + ソースラベル（mono）+ ghost Button の "Load more" + "← Home"。`useBreakpointValue` を Tailwind の `md:` に置換。Chakra import を撤去。
- [ ] 5.2 `src/features/article/components/*` のうち `ArticleList.page.tsx` から呼ばれるものを Twilight Blade 化。orphan は削除。
- [ ] 5.3 `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/features/article/` 0 件を確認。
- [ ] 5.4 `grep -R "@chakra-ui\|@emotion" src/features/article/` 0 件を確認。

## 6. /news 関連の削除

- [ ] 6.1 `src/pages/news/` ディレクトリ全体を削除する（`index.tsx` と `[news_id]/index.tsx` を含む）。
- [ ] 6.2 `src/features/news/` ディレクトリ全体を削除する（`apis/` / `components/` / `types/` / `NewsList.page.tsx` / `NewsDetail.page.tsx`）。
- [ ] 6.3 `src/clients/microcms.ts` を削除する。
- [ ] 6.4 `src/features/home/Home.page.tsx` から News セクション関連コード（`<Title as="h2">News</Title>` / `<AdjustableNewsList />` / `<div id="news" />` / "もっと見る" の `/news` リンク）を削除する。
- [ ] 6.5 `src/pages/index.tsx` の `getStaticProps` から `client.get<ListProps<News>>` 部分を削除し、`isMicrocmsConfigured` 参照を消す。`HomePageProps` から `news` プロパティを削除。
- [ ] 6.6 `grep -R "microcms\|news/\|features/news\|NewsList\|NewsDetail" src/` を実行し、削除漏れがゼロ件であることを確認。

## 7. 依存・テーマ・環境変数の撤去

- [ ] 7.1 `src/pages/_app.tsx` から `ChakraProvider` と `theme` import を削除。`<main className="app">` ラッパーは維持、`ChakraProvider` のみ剥がす。
- [ ] 7.2 `src/theme/theme.ts` を削除。
- [ ] 7.3 `package.json` から `@chakra-ui/react`、`@chakra-ui/icons`、`@emotion/react`、`@emotion/styled`、`framer-motion`、`microcms-js-sdk`、`react-share` を削除する。
- [ ] 7.4 `pnpm install --lockfile-only` で `pnpm-lock.yaml` を更新する。
- [ ] 7.5 `src/config/environment.ts` から `NEXT_PUBLIC_SERVICE_DOMAIN` と `NEXT_PUBLIC_API_KEY` の読み込み + warn を削除。
- [ ] 7.6 `.env.sample` から `NEXT_PUBLIC_SERVICE_DOMAIN` / `NEXT_PUBLIC_API_KEY` の行を削除。
- [ ] 7.7 `spec/setupTest.ts`（globalSetup）に dummy 注入があれば削除する（`SERVICE_DOMAIN` / `API_KEY` 関連）。
- [ ] 7.8 `grep -R "@chakra-ui\|@emotion\|framer-motion\|microcms-js-sdk\|react-share" src/` 0 件を確認。
- [ ] 7.9 `grep -E "@chakra-ui|@emotion|framer-motion|microcms-js-sdk|react-share" package.json` 0 件を確認。
- [ ] 7.10 `ls src/theme/theme.ts src/clients/microcms.ts` がいずれも非ゼロ exit（不在）であることを確認。
- [ ] 7.11 `grep "ChakraProvider" src/pages/_app.tsx` 0 件を確認。

## 8. 統合検証

- [ ] 8.1 `pnpm lint` がクリーンに通ることを確認。
- [ ] 8.2 `pnpm test` がクリーンに通ることを確認。news 削除に伴う orphan test は同時に削除済みであること。
- [ ] 8.3 `pnpm build` がクリーンに通ることを確認。
- [ ] 8.4 `pnpm dev` を起動し、`/` / `/articles` を手動で巡回。Twilight Blade 語彙で描画、コンソールエラーなし、ハイドレーション警告なしを確認。`/news` / `/news/[id]` が 404 になることも確認。
- [ ] 8.5 各ページで Tab キー巡回し、Header / Footer / CTA / カードリンクに可視フォーカスリングが出ることを確認。
- [ ] 8.6 `/` を狭幅（375px）と広幅（1440px）でレスポンシブ確認。Hero タイポが壊れていないこと、strip と nav の折り返しが許容範囲であること。
- [ ] 8.7 Hero.html の Orb / Grid Overlay / eyebrow pulse モーションが動作することを目視確認。

## 9. 締め

- [ ] 9.1 TOK-83 に進捗コメントを投稿する。内容：本 change で Hero.html 準拠の全面刷新と Chakra / Emotion / Framer Motion / microCMS / react-share 完全撤去 + /news 削除が landing した旨、次は TOK-84（/brand 公開）に進める状態であること。
- [ ] 9.2 PR を開く前に `openspec validate portfolio-twilight-blade-redesign --strict` がパスすることを確認する。
