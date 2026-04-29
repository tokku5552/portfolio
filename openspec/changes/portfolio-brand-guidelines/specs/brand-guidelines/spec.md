## ADDED Requirements

### Requirement: `brand/` 配下に最小 SSoT が存在する

リポジトリ root の `brand/` 配下には以下のファイルが存在しなければならない（MUST）：

- `brand/tokens.css`: ブランド CSS 変数の真本（TOK-82 で配線済み）
- `brand/tokens.ts`: `tokens.css` と同期した TypeScript 型付きトークン
- `brand/brand.md`: AI に paste / URL fetch される single-file spec

これらのファイル以外に CSS 変数 `--color-brand-*` および `--font-brand-*` の値を再定義してはならない（MUST NOT）。`brand/CLAUDE.md` / `brand/README.md` は本 change では作成してはならない（MUST NOT）。`public/brand-assets/` ディレクトリも作成してはならない（MUST NOT）。

#### Scenario: SSoT ファイルが存在する

- **WHEN** レビュアーが `ls brand/{tokens.css,tokens.ts,brand.md}` を実行したとき
- **THEN** 3 ファイルすべてが存在し、エラーを返さない

#### Scenario: 余分な markdown / 設定ファイルが存在しない

- **WHEN** レビュアーが `ls brand/CLAUDE.md brand/README.md` を実行したとき
- **THEN** どちらも存在しない（コマンドはエラーを返す）

#### Scenario: `public/brand-assets/` ディレクトリが存在しない

- **WHEN** レビュアーが `ls public/brand-assets` を実行したとき
- **THEN** ディレクトリが存在しない（コマンドはエラーを返す）

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

### Requirement: `brand/brand.md` に必須セクションが揃っている

`brand/brand.md` は以下のセクションを含まなければならない（MUST）：

- 思想を 1〜2 段落で記述したプローズ
- "Tokens" セクション（Colors と Fonts のサブセクションで token 値を列挙）
- "DO" セクション（採用ルールを箇条書き）
- "DO NOT" セクション（禁止ルールを箇条書き）
- "Reference" セクション（live `/brand` ページ URL、`brand/tokens.css` への外部リンク URL を含む）

`brand/brand.md` 内の color hex 値は `brand/tokens.css` の値と一致しなければならず（MUST）、jest spec によって自動検証されなければならない（MUST）。

#### Scenario: brand.md に必須セクションが揃う

- **WHEN** レビュアーが `brand/brand.md` を読んだとき
- **THEN** 1〜2 段落の思想プローズ、Tokens（Colors / Fonts）、DO、DO NOT、Reference の各見出しが存在する

#### Scenario: brand.md の hex 値が tokens.css と一致する

- **WHEN** `pnpm test` が実行されたとき
- **THEN** `brand/brand.md` 内に列挙される各 color hex / rgba 値が `brand/tokens.css` の対応する値と一致することを spec が assert し、通過する

### Requirement: `/brand` ルートが 6 セクション構成で公開される

`/brand` ルートは `src/pages/brand.tsx` から `src/features/brand/Brand.page.tsx` を呼び出して描画されなければならない（MUST）。本ルートは以下 6 セクションを上から順に描画しなければならない（MUST）：

1. HERO: `Eyebrow`（"Brand · Twilight Blade" 等）+ 大型タイポ "Twilight Blade." + 1 行コンセプト + Orb 背景
2. CONCEPT: 思想を 1〜2 段落のプローズ + DO / DON'T リスト
3. TOKENS: `brand/tokens.ts` の `brandTokens` から色 swatch + 値（hex / rgba）+ font スタックを表示
4. IN USE: gradient period / Orb / eyebrow-pulse / 12-col grid / two-tier CTA の小規模なライブデモ
5. ASSETS: `brand/tokens.css` および `brand/brand.md` への外部リンク（GitHub raw / jsdelivr CDN URL）+ コピペ用 URL の表示
6. COLOPHON: 使用フォント（Geist / Geist Mono）クレジット、最終更新日、ライセンス（MIT）

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

### Requirement: `/brand` の ASSETS セクションは外部リンクで `brand/tokens.css` と `brand/brand.md` を参照する

ASSETS セクションは `brand/tokens.css` および `brand/brand.md` への外部リンクを描画しなければならない（MUST）。リンクの URL は GitHub raw URL / jsdelivr CDN URL / GitHub blob view URL のいずれかでなければならない（MUST）。リンクは新規タブで開かれなければならない（MUST、`target="_blank"` + `rel="noopener noreferrer"`）。各ファイルの URL を**コピペ可能な形でテキスト表示**しなければならない（MUST、`<code>` 要素等で URL 文字列を可視化する）。

ASSETS セクションは `public/brand-assets/` 等のローカル mirror への DL リンクを **持ってはならない**（MUST NOT）。

#### Scenario: ASSETS リンクが GitHub または jsdelivr の URL を指す

- **WHEN** ユーザーが ASSETS セクションのリンクを確認したとき
- **THEN** `brand/tokens.css` および `brand/brand.md` への `<a>` 要素が存在し、href が `https://raw.githubusercontent.com/.../brand/...` / `https://cdn.jsdelivr.net/gh/.../brand/...` / `https://github.com/.../blob/.../brand/...` のいずれかのパターンに合致する

#### Scenario: ASSETS にローカル mirror へのリンクが存在しない

- **WHEN** レビュアーが ASSETS セクションの DOM を検査したとき
- **THEN** `/brand-assets/` パスへの link は 1 件も存在しない

#### Scenario: URL がコピペ可能な形で表示される

- **WHEN** ユーザーが ASSETS セクションを確認したとき
- **THEN** 各ファイルの URL 文字列が `<code>` 要素または同等の monospace 表示で可視化されており、ユーザーが手動で選択コピーできる

### Requirement: `/brand` は OGP 画像を持つ

`/brand` ルートは Twitter Card / Open Graph 用の画像として `public/brand-og.png` を `Seo` component 経由で公開しなければならない（MUST）。画像は 1200×630 px の PNG でなければならない（MUST）。`public/brand-assets/` サブディレクトリ配下には配置してはならない（MUST NOT）。

#### Scenario: /brand に OGP メタタグがある

- **WHEN** ユーザーが `/brand` の HTML を取得し `<head>` を検査したとき
- **THEN** `og:image` および `twitter:image` 相当のメタタグが `/brand-og.png` を指す URL で出力されている

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

### Requirement: repo root の `CLAUDE.md` に "Visual Conventions" 節が存在し、`brand/brand.md` を SoT として参照する

repo root の `CLAUDE.md` には Twilight Blade に関する AI 向けルール参照を記述した節が存在しなければならない（MUST）。本節は以下の最低条件を満たさなければならない（MUST）：

- `brand/brand.md` が AI rule の SoT であることを明示する
- AI agents が `brand/brand.md` に従うべき旨を記述する
- live `/brand` ページへの参照リンクを含む
- token 値や DO / DON'T リストを root `CLAUDE.md` 内に **inline で書かない**（重複を避けるため、SoT は `brand/brand.md` のみ）

`brand/CLAUDE.md` を別途作成してはならない（MUST NOT）。AI rule SoT は `brand/brand.md` の単一ファイルでなければならない（MUST）。

#### Scenario: CLAUDE.md に Visual Conventions 節があり brand.md を参照する

- **WHEN** レビュアーが repo root の `CLAUDE.md` を確認したとき
- **THEN** "Visual Conventions" または同等の見出しが存在し、`brand/brand.md` への参照および `/brand` への参照が含まれている

#### Scenario: CLAUDE.md に token 値が inline で書かれていない

- **WHEN** レビュアーが repo root の `CLAUDE.md` の Visual Conventions 節を読んだとき
- **THEN** 個別の color hex / rgba 値の列挙が含まれていない（具体値は `brand/brand.md` に集約されている）

#### Scenario: brand 配下に CLAUDE.md が存在しない

- **WHEN** レビュアーが `ls brand/CLAUDE.md` を実行したとき
- **THEN** ファイルは存在しない（エラーで返る）
