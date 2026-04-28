## Why

TOK-82（プラットフォーム移行）で pnpm + Tailwind + brand tokens の基盤は整い、Chakra と共存した状態で既存サイトは動いている。次の段階（TOK-83）の本質は単なる「Chakra → Tailwind 書き換え」ではなく、**Twilight Blade デザインシステムを実サイトに全面適用する**こと。Claude Design からハンドオフされた `brand/source/twilight-blade-v1/project/Hero.html` が唯一のビジュアルソースオブトゥルースであり、ここで示された語彙（Geist 2 種 + Orb + 12-col グリッド + 薄い border + eyebrow-pulse + primary/ghost CTA + side-meta + bottom-strip）を、現行サイトのコンテンツ（プロフィール / Podcast / YouTube / Services / Articles / Contact）に適用して組み直す。同時にそのプロセスで Chakra / Emotion / Framer Motion を完全撤去し、後続の TOK-84（`/brand` 公開）を解放する。

加えて、現行 `/news`（microCMS 連携）はメンテナンスが滞っており継続価値が薄いため、本 change で**`/news` 関連を全面削除**する（ユーザー判断、関連 Linear コメント参照）。これに伴い microCMS 連携と `react-share` 依存も併せて撤去する。

## What Changes

- **BREAKING（視覚的）**: 残るすべてのルート（`/`、`/articles`）を Twilight Blade デザインで再実装する。既存の Chakra 由来の見た目は一切残らない。
- **BREAKING（ルート）**: `/news` と `/news/[id]` ルートを削除する。`src/pages/news/` ディレクトリを丸ごと削除する。
- **BREAKING（feature）**: `src/features/news/` ディレクトリを丸ごと削除する。home の News セクションも撤去する。
- **BREAKING（依存）**: `@chakra-ui/react`、`@chakra-ui/icons`、`@emotion/react`、`@emotion/styled`、`framer-motion`、`microcms-js-sdk`、`react-share` を `package.json` から撤去する。
- **BREAKING（コード）**: `src/theme/theme.ts` を削除し、`src/pages/_app.tsx` から `ChakraProvider` ラッパーを剥がす。`src/clients/microcms.ts` も削除する。
- **BREAKING（環境変数）**: `NEXT_PUBLIC_SERVICE_DOMAIN` / `NEXT_PUBLIC_API_KEY` を `src/config/environment.ts` から削除する。`.env.sample` も対応して更新する。
- **BREAKING（モーション）**: `framer-motion` を撤去する。モーションは Hero.html に現れる CSS keyframes / Tailwind `transition-*` / `animate-*` に置換する。
- 共通 chrome（グローバル Header / Footer / `BaseLayout` / `Seo`）を Hero.html 語彙で再構築する。
- `/` ランディングページを Hero.html の `section.hero` + `.strip` 相当 + 既存 home セクション群（Podcast / YouTube / Services / Articles / Contact、ただし News は撤去）を Twilight Blade 語彙に置き直した構成に刷新する。Hero セクションの文言は **Hero.html のビジュアル構造を採用しつつ、コンテンツは現行プロフィール（`src/config/constants.ts` の `globalDescription` 由来）に置き直す** ハイブリッド方針。
- `/articles` を Twilight Blade 語彙で再実装する（デザイン原本未収録のため、Hero.html の語彙を拡張して実装側でデザインする）。"more..." 追加読み込み UX は維持し、見た目を `ghost` Button に統一する。
- Hero.html 読解から必要な Tailwind primitive（Button primary/ghost、Link、Container、Eyebrow、Orb、GridOverlay）を手書きで追加する。`class-variance-authority` と shadcn/ui は不採用（TOK-82 の ADR に準拠）。
- Hero.html の装飾要素（Orb gradient + blur + float keyframes、12-col grid overlay、subtle grain）を再利用可能なコンポーネント／CSS として実装する。
- `src/features/home/menus.ts` を Header の新メニュー（`Work` / `Music` / `Podcast` / `Writing`）に書き換える。`Music` は外部リンク（INKDOSE / Spotify Artist / SUNO 等のいずれか）に飛ばす。`Writing` は `/articles` を指す。

## Capabilities

### New Capabilities

- `ui-primitives`: 手書き Tailwind primitive（Button primary/ghost、Link、Container、Eyebrow（pulse 付き）、Orb、GridOverlay）。Hero.html の装飾語彙を合成するためのビルディングブロック。
- `page-layout`: Twilight Blade の共通 chrome（グローバル Header / Footer / `BaseLayout` / `Seo`）。Hero.html の `nav.top` を global header として採用。Footer は Hero.html 語彙を拡張し、上段は Header と同じ 4 メニュー（About / Music / Podcast / Writing）のナビ並びとする。
- `landing-page`: `/` ランディングページ本体。Hero セクション（Hero.html ビジュアル言語 + 現行プロフィール由来コンテンツ）+ bottom-strip + 既存 home セクション群（Podcast / YouTube / Services / Articles / Contact）の縦積み構成。
- `content-pages`: `/articles`。Hero.html 語彙の延長で実装者デザイン。Seo の公開 API は既存と互換。

### Modified Capabilities

- `styling-platform`: 「Chakra UI coexists with Tailwind during the migration window」要件を削除する。本 change の完了後、Chakra UI と Emotion は install されず、`ChakraProvider` も wire されない。`src/theme/theme.ts` も存在しない。`framer-motion` / `microcms-js-sdk` / `react-share` も install されない。brand tokens と Tailwind のみでレンダリングされる。

## Impact

- **コード**: `src/components/layouts/*`、`src/components/parts/*`、`src/features/home/*`、`src/features/article/*`、`src/features/service/*`、`src/pages/index.tsx`、`src/pages/articles/index.tsx` のほぼ全てに手が入る。`src/pages/news/`、`src/features/news/`、`src/clients/microcms.ts` は削除。
- **依存**: `@chakra-ui/react`、`@chakra-ui/icons`、`@emotion/react`、`@emotion/styled`、`framer-motion`、`microcms-js-sdk`、`react-share` を `package.json` から削除。それ以外の追加はなし。
- **テーマ**: `src/theme/theme.ts` 削除。`src/pages/_app.tsx` から `ChakraProvider` と theme import を剥がす。
- **環境変数**: `NEXT_PUBLIC_SERVICE_DOMAIN` / `NEXT_PUBLIC_API_KEY` を `src/config/environment.ts` から削除。`.env.sample` も更新。
- **視覚**: 全ページが Twilight Blade（濃紺 + Geist + Orb + 12-col grid + pink/violet/indigo グラデーション）の見た目になる。
- **コンテンツ**: Qiita/Zenn 由来の articles、Service/Podcast/YouTube セクションの情報、プロフィール情報は保持される。**microCMS 由来の news コンテンツは削除される**。
- **情報アーキテクチャ**: Hero.html の nav menu（Work / Music / Podcast / Writing）に揃える。`Music` は外部リンク。`Writing` は `/articles` のみを指す（news を撤去するため）。原則、新ルートは追加しない。
- **テスト**: 既存の jest spec は Chakra / news 削除に合わせて調整する。`src/features/news/` 配下の test も削除。
- **後続**: 本 change の完了で TOK-83 が Done になり、TOK-84（`/brand` 公開）の着手が可能になる。
