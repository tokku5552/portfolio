## 1. 下地作業

- [x] 1.1 `src/styles/globals.css` に Twilight Blade 用 keyframes（`@keyframes orb-float` / `@keyframes eyebrow-pulse` / `@keyframes btn-arrow-hover`）と、primitive が参照する共通 class（`.tb-orb` / `.tb-grid-overlay` / `.tb-btn-primary-hover` など）を宣言する。Hero.html の `@keyframes float` / `@keyframes pulse` を Twilight Blade 規約に寄せた命名で移植する。
- [x] 1.2 `src/components/layouts/Seo/index.tsx` の Google Fonts link を Roboto から `Geist` + `Geist Mono` に差し替える。公開 prop API は据え置き。
- [x] 1.3 `tailwind.config.ts` の `theme.extend` に必要な追加があれば加える（例: `maxWidth.shell: '1440px'` / Hero タイポ用 fontSize scale）。brand token 自体の追加はしない。
- [x] 1.4 `src/config/constants.ts` に `inkdoseUrl = 'https://inkdoses.com/'` を追加する（Header / Footer の Music リンク先）。

## 2. UI primitive の追加

- [x] 2.1 `src/components/parts/Button/` を追加。`variant: 'primary' | 'ghost'`、`size: 'md'`、default `type='button'`。primary は Hero.html の `.btn-primary`（白背景 + hover 時 gradient ::before）、ghost は `.btn-ghost`（border-strong + hover で透過白）。`cn()` + インライン variant マップ。
- [x] 2.2 `src/components/parts/Link/` を追加。`external?: boolean` 分岐。Next 15.5 のため内部は `<NextLink href>{children}</NextLink>`、外部は `<a target="_blank" rel="noopener noreferrer">`。
- [x] 2.3 `src/components/parts/Container/` を追加。`mx-auto max-w-[1440px] px-6 md:px-12`。`className` を `cn()` で forward。
- [x] 2.4 `src/components/parts/Eyebrow/` を追加。mono font + uppercase + muted + tracking。`withPulse?: boolean` で pulse ドット。
- [x] 2.5 `src/components/parts/Orb/` を追加。`position: 'tr' | 'bl' | 'center'`。`.tb-orb` class 経由で gradient + blur + `orb-float`。`pointer-events: none`。
- [x] 2.6 `src/components/parts/GridOverlay/` を追加。`visible?: boolean`（デフォルト false）。`.tb-grid-overlay` class で 12 列パターン。`pointer-events: none`。
- [x] 2.7 `src/components/parts/index.ts` の barrel export を更新（既存 + Button / Link / Container / Eyebrow / Orb / GridOverlay）。
- [x] 2.8 各 primitive に jest + `@testing-library/react` の spec を最小で併置。
- [x] 2.9 `grep -R "@chakra-ui\|@emotion\|framer-motion\|class-variance-authority\|shadcn" src/components/parts/{Button,Link,Container,Eyebrow,Orb,GridOverlay}/` を実行、0 件を確認。

## 3. 共通 chrome の再構築

- [x] 3.1 `src/features/home/menus.ts` を Header 用に書き換える。Work / Music / Podcast / Writing の 4 項目 + 各 href（Music は外部、Writing は `/articles`）。
- [x] 3.2 `src/components/layouts/Header/index.tsx` を書き換える。`Container` 内で logo mark（dot + "tok / shinnosuke tokuda"）+ nav menu（`Link` primitive、4 項目）+ `Button` ghost `Get in touch ↗`。`border-b var(--color-brand-border)`。`useColorModeValue` / Chakra import を撤去。
- [x] 3.3 `src/components/layouts/Footer/index.tsx` を書き換える。上段：Header と同じ 4 メニュー（About / Music / Podcast / Writing）の縦リンク列を 4 列で並べる。下段：mark + 著作権 + ソーシャルアイコン群（react-icons 継続）。Chakra `Box` / `useColorModeValue` 撤去。
- [x] 3.4 `src/components/layouts/BaseLayout/index.tsx` を書き換える。`usePathname` 分岐と Hero import を廃止。`<Header />` + `<main>{children}</main>` + `<Footer />` の単純構成。
- [x] 3.5 `src/components/layouts/Hero/` ディレクトリは削除する（landing 専用 Hero は `src/features/home/` 内で再実装するため）。
- [x] 3.6 `src/components/layouts/index.ts` を更新（`Header` / `Footer` / `Seo` / `BaseLayout` のみ公開、不要 export を削除）。
- [x] 3.7 `grep -R "@chakra-ui\|@emotion\|framer-motion" src/components/layouts/{BaseLayout,Header,Footer,Seo}/` 0 件を確認。
- [x] 3.8 `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/components/layouts/{BaseLayout,Header,Footer,Seo}/` 0 件を確認。

## 4. `/` landing の再構成

- [x] 4.1 `src/features/home/components/TwilightHero.tsx` を新設。Hero.html の `section.hero` 構造を React で再現（`Eyebrow withPulse` + 巨大 name + titles + tagline + CTA + side-meta + Orb 背景）。
- [x] 4.2 Hero セクションのコンテンツを現行プロフィール由来で埋める（jp="とっく" / titles=Engineering Manager + Music Producer / tagline=現職主軸 / CTA=View my work + Listen to the podcast / side-meta=Tokyo / Open to collabs / AI implementation）。
- [x] 4.3 `src/features/home/components/HeroStrip.tsx` を新設し Hero 直下に配置（Currently / Discography / Podcast / Stack の 4 列）。
- [x] 4.4 `Home.page.tsx` を再構築。`<Header />` 呼び出しは削除済（BaseLayout が担う）。TwilightHero → HeroStrip → Podcast → YouTube → Services → Articles → Contact の順に並べ、News は撤去。各セクションは `id` を保持（`podcast` / `youtube` / `services` / `articles` / `contact`）。
- [x] 4.5 旧 `src/components/layouts/{Features, Works, YouTube, OwnSNS, Podcast, Hero}` を削除。`src/features/home/components/` に `HomeSection` / `PodcastSection` / `YouTubeSection` / `ServicesSection` / `ArticlesSection` / `ContactSection` を新設して同等以上の機能を Twilight Blade 語彙で再構築。
- [x] 4.6 `src/features/service/Service.tsx`（`TimeTicketConsultation`）を Twilight Blade 語彙で書き直し、Chakra 依存を撤去。
- [x] 4.7 `src/features/article/components/AdjustableArticleList.tsx` と `ArticleItem.tsx` を Twilight Blade カードに書き直し（Articles セクションでも同じコンポーネントを再利用）。
- [x] 4.8 `src/components/parts/{Card, DisclosableCard, Title}` は §5 完了後に削除（残呼び出しは ArticleList の Title のみで、§5 で書き換える際に外す）。
- [x] 4.9 `src/pages/index.tsx` の `getStaticProps` から news fetch と `isMicrocmsConfigured` 参照を削除。`HomePageProps` から `news` を除き `articles` のみ。
- [x] 4.10 `/` をブラウザで開き、上から下までスクロールして全セクションが Twilight Blade 語彙で描画されていること、`#podcast` 等のアンカーが動作すること、News セクションが存在しないことを確認（ユーザー確認済 2026-04-29、Vercel preview）。

## 5. `/articles` の再実装

- [x] 5.1 `src/features/article/ArticleList.page.tsx` を Twilight Blade カード一覧で書き直す。`Container` + `Eyebrow` + H1 "Articles" + カード羅列 + ghost Button の "Load more" + "← Home"。`useBreakpointValue` を Tailwind の `md:` に置換。Chakra import を撤去。
- [x] 5.2 `src/features/article/components/{ArticleItem, AdjustableArticleList}.tsx` を Twilight Blade 化（§4.7 で完了済み）。orphan なし。
- [x] 5.3 `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/features/article/` 0 件を確認。
- [x] 5.4 `grep -R "@chakra-ui\|@emotion" src/features/article/` 0 件を確認。

## 6. /news 関連の削除

- [x] 6.1 `src/pages/news/` ディレクトリ全体を削除（`index.tsx` と `[news_id]/index.tsx`）。
- [x] 6.2 `src/features/news/` ディレクトリ全体を削除（`apis/` / `components/` / `types/` / `NewsList.page.tsx` / `NewsDetail.page.tsx`）。
- [x] 6.3 `src/clients/microcms.ts` を削除。
- [x] 6.4 `src/features/home/Home.page.tsx` を新構成に書き換えた際に News セクションは描画していない（§4.4）。
- [x] 6.5 `src/pages/index.tsx` の `getStaticProps` から news fetch / `isMicrocmsConfigured` 参照を削除（§4.9）。
- [x] 6.6 副次的に発生した orphan（`src/apis/featureFlags.ts` / `src/types/featureFlags.ts` / `src/types/ListCMS.ts` / `src/types/Skill.ts`）も併せて削除。`grep -R "microcms\|features/news\|NewsList\|NewsDetail" src/` 0 件を確認。

## 7. 依存・テーマ・環境変数の撤去

- [x] 7.1 `src/pages/_app.tsx` から `ChakraProvider` / `theme` import を削除。`<main className="app">` ラッパーも撤去（BaseLayout 内の `<main>` で代替）。
- [x] 7.2 `src/theme/` ディレクトリを削除（`theme.ts` 含む）。
- [x] 7.3 `package.json` から `@chakra-ui/react` / `@chakra-ui/icons` / `@emotion/react` / `@emotion/styled` / `framer-motion` / `microcms-js-sdk` / `react-share` / `html-react-parser` を削除（html-react-parser は news/[id] でのみ利用していたため不要）。
- [x] 7.4 `pnpm install --lockfile-only` を実行し `pnpm-lock.yaml` を更新済（依存撤去を反映）。
- [x] 7.5 `src/config/environment.ts` から `NEXT_PUBLIC_SERVICE_DOMAIN` / `NEXT_PUBLIC_API_KEY` の読み込みと warn を削除。
- [x] 7.6 `.env.sample` から `NEXT_PUBLIC_SERVICE_DOMAIN` / `NEXT_PUBLIC_API_KEY` の行を削除（sed -i 経由で編集）。
- [x] 7.7 `spec/setupTest.ts` の orphan dummy（`NEXT_PUBLIC_APP_ENV` / `API_BASE_URL` / `BUILD_VERSION`）を整理し、現行 `environment.ts` に合わせた `NEXT_PUBLIC_ENVIRONMENT` / `GA_ID` / `QIITA_TOKEN` の dummy に差し替え。
- [x] 7.8 `grep -R "@chakra-ui\|@emotion\|framer-motion\|microcms-js-sdk\|react-share" src/` 0 件を確認。
- [x] 7.9 `grep -E "@chakra-ui|@emotion|framer-motion|microcms-js-sdk|react-share" package.json` 0 件を確認。
- [x] 7.10 `src/theme/theme.ts` および `src/clients/microcms.ts` が不在であることを確認。
- [x] 7.11 `grep "ChakraProvider" src/pages/_app.tsx` 0 件を確認。
- [x] 7.12 副次撤去: 既存 Chakra 依存だった `src/components/parts/{Card,DisclosableCard,Title}` を削除（呼び出し元なし、§5 の書き換えで Title 利用も解消済）。

## 8. 統合検証

- [x] 8.1 `pnpm lint` がクリーンに通ることを確認（prettier 自動整形 + Eyebrow 子の `// Writing` を `{'// Writing'}` でエスケープ後 0 errors）。
- [x] 8.2 `pnpm test` がクリーンに通ることを確認（16/16 pass、既存 date.spec + 新規 primitive 6 spec）。
- [x] 8.3 `pnpm build` がクリーンに通ることを確認（`/` `/articles` `/404` `/_app` のみ。/news 系ルートが build から消滅）。
- [x] 8.4 `/` / `/articles` の手動巡回を確認（Twilight Blade 描画 / コンソールエラーなし / ハイドレーション警告なし / `/news` `/news/[id]` 404）。ユーザー確認済 2026-04-29。
- [x] 8.5 Tab キー巡回で Header / Footer / CTA / カードリンクに focus-visible リングが出ることを確認。ユーザー確認済 2026-04-29。
- [x] 8.6 狭幅（375px）と広幅（1440px）のレスポンシブ確認（Hero タイポ / strip / nav の折り返し許容範囲）。ユーザー確認済 2026-04-29。
- [x] 8.7 Orb / Grid Overlay / eyebrow pulse モーション動作確認。ユーザー確認済 2026-04-29。

## 9. 締め

- [x] 9.1 TOK-83 に進捗コメントを投稿（comment id `ff779f01`）。実装範囲・検証結果（lint / test / build pass）・残タスク（.env.sample 編集 / dev 巡回 / commit）を記載。
- [x] 9.2 `openspec validate portfolio-twilight-blade-redesign --strict` パス確認済（`Change 'portfolio-twilight-blade-redesign' is valid`）。
