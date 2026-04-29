## ADDED Requirements

### Requirement: `brand/` 配下に最小 SSoT が存在する

リポジトリ root の `brand/` 配下には以下のファイルが存在しなければならない（MUST）：

- `brand/tokens.css`: ブランド CSS 変数の真本（TOK-82 で配線済み）
- `brand/tokens.ts`: `tokens.css` と同期した TypeScript 型付きトークン

これらのファイル以外に CSS 変数 `--color-brand-*` および `--font-brand-*` の値を再定義してはならない（MUST NOT）。`brand/brand.md` / `brand/CLAUDE.md` / `brand/README.md` は本 change では作成してはならない（MUST NOT）。

#### Scenario: SSoT ファイルが存在する

- **WHEN** レビュアーが `ls brand/{tokens.css,tokens.ts}` を実行したとき
- **THEN** 両ファイルが存在し、エラーを返さない

#### Scenario: 余分な markdown ファイルが存在しない

- **WHEN** レビュアーが `ls brand/*.md` を実行したとき
- **THEN** マッチは 0 件である（`brand/source/` 配下の README は対象外）

#### Scenario: token 値が `brand/` 外で再定義されていない

- **WHEN** レビュアーが `grep -R "\\-\\-color-brand-\\|\\-\\-font-brand-" src/` を実行したとき
- **THEN** マッチは値の参照（`var(--color-brand-*)`）のみで、`--color-brand-*: <value>;` のような定義行は含まれない

### Requirement: `brand/tokens.css` と `brand/tokens.ts` が同期している

`brand/tokens.ts` から export される `brandTokens` の値は、`brand/tokens.css` に定義された CSS 変数の値と完全一致しなければならない（MUST）。両者の整合は jest spec によって自動検証されなければならない（MUST）。drift が発生した場合は test がエラーで落ちなければならない（MUST）。

#### Scenario: tokens.ts と tokens.css の値が一致する

- **WHEN** `pnpm test` が実行されたとき
- **THEN** `brand/tokens.css` の各 `--color-brand-*` / `--font-brand-*` の値と `brandTokens` の対応する値の文字列一致を spec が assert し、すべて通過する

#### Scenario: drift が発生すると test が落ちる

- **WHEN** `brand/tokens.css` のいずれかの値を変更したまま `brand/tokens.ts` を更新せずに `pnpm test` を実行したとき
- **THEN** 該当する key の不一致を示すエラーで test が失敗する

### Requirement: `public/brand-assets/` から `tokens.css` と OGP が配布されている

`public/brand-assets/` 配下には以下のファイルが存在しなければならない（MUST）：

- `public/brand-assets/tokens.css`
- `public/brand-assets/brand-og.png`（1200×630 PNG）

`tokens.css` は `brand/tokens.css` とバイト単位で完全一致しなければならない（MUST）。同期手段は `scripts/sync-brand-assets.mjs` を経由しなければならず（MUST）、`package.json` の `prebuild` および `prepare` script から呼び出されなければならない（MUST）。jest spec によってバイト一致が自動検証されなければならない（MUST）。

`public/brand-assets/` 配下に `brand.md` / `CLAUDE.md` / `tokens.json` を配置してはならない（MUST NOT）。

#### Scenario: 配布 tokens.css がソースと一致する

- **WHEN** `pnpm test` が実行されたとき
- **THEN** `brand/tokens.css` と `public/brand-assets/tokens.css` のバイト列が一致することを spec が assert し、通過する

#### Scenario: prebuild が同期スクリプトを呼ぶ

- **WHEN** レビュアーが `package.json` を確認したとき
- **THEN** `scripts.prebuild` および `scripts.prepare` のいずれにも `node scripts/sync-brand-assets.mjs` または `pnpm sync:brand` 相当の呼び出しが含まれる

#### Scenario: 配布ファイルから DL できる

- **WHEN** ユーザーが `https://<host>/brand-assets/tokens.css` にアクセスしたとき
- **THEN** レスポンスが 200 で返り、内容は `brand/tokens.css` と一致する

#### Scenario: 余分な配布物が存在しない

- **WHEN** レビュアーが `ls public/brand-assets/` を実行したとき
- **THEN** `tokens.css` と `brand-og.png` の 2 ファイル以外は含まれない

### Requirement: `/brand` ルートが 6 セクション構成で公開される

`/brand` ルートは `src/pages/brand.tsx` から `src/features/brand/Brand.page.tsx` を呼び出して描画されなければならない（MUST）。本ルートは以下 6 セクションを上から順に描画しなければならない（MUST）：

1. HERO: `Eyebrow`（"Brand · Twilight Blade" 等）+ 大型タイポ "Twilight Blade." + 1 行コンセプト + Orb 背景
2. CONCEPT: 思想を 1〜2 段落のプローズ + DO / DON'T リスト
3. TOKENS: `brand/tokens.ts` の `brandTokens` から色 swatch + 値（hex / rgba）+ font スタックを表示
4. IN USE: gradient period / Orb / eyebrow-pulse / 12-col grid / two-tier CTA の小規模なライブデモ
5. ASSETS: `tokens.css` への DL リンク（`<a href="/brand-assets/tokens.css" download>`）+ 1 行説明
6. COLOPHON: 使用フォント（Geist / Geist Mono）クレジット、最終更新日、Linear issue ID（TOK-84）

各セクションは `src/features/brand/components/Brand{Hero,Concept,Tokens,InUse,Assets,Colophon}/` 配下の独立 component として実装されなければならない（MUST）。

#### Scenario: /brand に 6 セクションが存在する

- **WHEN** ユーザーが `/brand` にアクセスしたとき
- **THEN** HERO / CONCEPT / TOKENS / IN USE / ASSETS / COLOPHON の 6 セクションがこの順で描画される

#### Scenario: /brand 配下が feature folder にある

- **WHEN** レビュアーが `src/features/brand/` を確認したとき
- **THEN** `Brand.page.tsx` と `components/Brand{Hero,Concept,Tokens,InUse,Assets,Colophon}/` が存在する

#### Scenario: TOKENS セクションが SSoT を参照する

- **WHEN** レビュアーが `BrandTokens` の実装を確認したとき
- **THEN** `brand/tokens.ts` から `brandTokens` を import し、その値を表示する。ファイル内に `--color-brand-*` の値を文字列リテラルでハードコードしていない

### Requirement: `/brand` の ASSETS セクションは `tokens.css` への DL リンクを提供する

ASSETS セクションは `tokens.css` への DL リンクを描画しなければならない（MUST）。リンクは `<a href="/brand-assets/tokens.css" download>` 形式または同等のセマンティクスを持たなければならない（MUST）。1 行説明（用途・利用対象）を併記しなければならない（MUST）。

ASSETS セクションには `tokens.css` 以外のファイルへの DL リンク（`brand.md` / `CLAUDE.md` / `tokens.json` 等）を含めてはならない（MUST NOT）。

#### Scenario: ASSETS リンクが正しい href を持つ

- **WHEN** ユーザーが ASSETS セクションのリンクを確認したとき
- **THEN** `/brand-assets/tokens.css` を指す `<a>` 要素が存在し、`download` 属性または同等のセマンティクスが付与されている

#### Scenario: 余分な DL リンクが存在しない

- **WHEN** レビュアーが ASSETS セクションの DOM を検査したとき
- **THEN** `/brand-assets/` 配下のリンクは `tokens.css` へのリンクのみで、他のファイルへの DL リンクは存在しない

### Requirement: `/brand` は OGP 画像を持つ

`/brand` ルートは Twitter Card / Open Graph 用の画像として `public/brand-assets/brand-og.png` を `Seo` component 経由で公開しなければならない（MUST）。画像は 1200×630 px の PNG でなければならない（MUST）。

#### Scenario: /brand に OGP メタタグがある

- **WHEN** ユーザーが `/brand` の HTML を取得し `<head>` を検査したとき
- **THEN** `og:image` および `twitter:image` 相当のメタタグが `/brand-assets/brand-og.png` を指す URL で出力されている

### Requirement: `/brand` の全テキストは WCAG AA を満たすコントラスト比でレンダリングされる

`/brand` のテキストは `--color-brand-fg` または `--color-brand-muted` のいずれかと `--color-brand-bg` の組み合わせのみで描画されなければならない（MUST）。本文サイズのテキストには `--color-brand-fg`（コントラスト比 ≈ 19.8:1）を使用しなければならない（MUST）。`--color-brand-muted`（≈ 4.7:1）は補助情報・eyebrow・mono ラベルにのみ使用してよい（MUST）。`/brand` 内で brand token 以外の hex 色を使用してはならない（MUST NOT）。

#### Scenario: /brand にハードコード hex がない

- **WHEN** レビュアーが `grep -RE "#[0-9a-fA-F]{3,8}\\b" src/features/brand/` を実行したとき
- **THEN** 検索結果はゼロ件である

#### Scenario: /brand 内のテキスト色が brand token のみで構成される

- **WHEN** レビュアーが `src/features/brand/` 配下の text 系 className を確認したとき
- **THEN** 色指定は `text-brand-fg` / `text-brand-muted` のみで、他の Tailwind 色 utility（`text-white` / `text-gray-*` 等）は含まれない

### Requirement: `/brand` は 768px 以下で 1 カラムにフォールバックする

`/brand` の各セクションのレイアウトは Tailwind の `md:` ブレイクポイント（768px）以上でのみ複数カラムを使用しなければならない（MUST）。768px 未満では各セクション内のすべての要素が縦 1 カラムに積まれなければならない（MUST）。IN USE セクションのライブデモ（Orb / grid overlay 等）も 768px 未満では幅 100% に収まり、横スクロールを発生させてはならない（MUST NOT）。

#### Scenario: 375px 幅で 1 カラム描画

- **WHEN** ユーザーが viewport 幅 375px で `/brand` を開いたとき
- **THEN** 各セクション内のすべてのコンテンツが縦 1 カラムに積まれ、横スクロールバーが表示されない

#### Scenario: 1280px 幅で複数カラム描画

- **WHEN** ユーザーが viewport 幅 1280px で `/brand` を開いたとき
- **THEN** TOKENS や CONCEPT 等のグリッド構造が 2 列以上で描画される（実装側の決定で 2 列または 3 列）

### Requirement: `/brand` は既存 primitive と Tailwind + brand token のみで構成する

`/brand` ページとそのセクション component は `src/components/parts/{Button,Container,Eyebrow,Orb,GridOverlay,Link}/` 等の既存 primitive と Tailwind + brand token のみで構成されなければならない（MUST）。`@chakra-ui/*` / `@emotion/*` / `framer-motion` / `microcms-js-sdk` を import してはならない（MUST NOT）。

#### Scenario: brand feature にレガシー import が存在しない

- **WHEN** レビュアーが `grep -R "@chakra-ui\\|@emotion\\|framer-motion\\|microcms-js-sdk" src/features/brand/ src/pages/brand.tsx` を実行したとき
- **THEN** 検索結果はゼロ件である

### Requirement: repo root の `CLAUDE.md` に "Visual Conventions" 節が存在する

repo root の `CLAUDE.md` には Twilight Blade に関する AI 向けルールを記述した節が存在しなければならない（MUST）。本節には以下の内容を含まなければならない（MUST）：

- 利用可能な color token と font token の列挙（`var(--color-brand-*)` / `var(--font-brand-*)` 形式）
- DO リスト（最低限: brand token のみ使用、indigo→violet→pink のグラデーションは唯一のアクセントとして使う、`cn()` で class 合成）
- DO NOT リスト（最低限: 新規 hex / rgb / rgba の導入禁止、Chakra / Emotion / Framer Motion 禁止、brand token 以外のグラデーション禁止）
- `/brand` ページおよび `brand/tokens.css` への参照リンク

`brand/CLAUDE.md` を別途作成してはならない（MUST NOT）。AI rule は repo root の単一 `CLAUDE.md` に集約されていなければならない（MUST）。

#### Scenario: CLAUDE.md に Visual Conventions 節がある

- **WHEN** レビュアーが repo root の `CLAUDE.md` を確認したとき
- **THEN** "Visual Conventions" または同等の見出しが存在し、color/font token の列挙、DO / DO NOT リスト、`/brand` への参照が含まれている

#### Scenario: brand 配下に CLAUDE.md が存在しない

- **WHEN** レビュアーが `ls brand/CLAUDE.md` を実行したとき
- **THEN** ファイルは存在しない（エラーで返る）
