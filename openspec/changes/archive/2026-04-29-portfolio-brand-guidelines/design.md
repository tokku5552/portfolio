## Context

TOK-83 で Twilight Blade デザイン語彙が `/`、`/articles`、共通 chrome に全面適用済み。本 change は「実運用済みの設計言語を AI が従える形で公開する」最小実装。Stripe / Linear 級のブランドシステム公開（npm package、semver、Style Dictionary、Figma Library、独立ドメイン docs サイト等）は **採用しない**。

ユースケース棚卸しの結果、本 change の主な消費者は：

- **採用担当 / クライアント**: Footer リンクから `/brand` を訪問して signaling を得る（HTML 描画のみ）
- **ユーザー本人**: `/brand` で hex を確認 / 他の AI ツール（スライド / 画像生成）に portfolio スタイルを伝える
- **Claude Code / Cursor / Codex 等の IDE AI**: repo root の `CLAUDE.md` から `brand/brand.md` を参照して読む
- **Claude.ai / ChatGPT 等の chat AI**: `brand/brand.md` をペーストする、または GitHub raw / jsdelivr CDN URL で fetch する
- **第三者開発者 / スライド AI / 画像 AI**: `brand/tokens.css` を GitHub raw / jsdelivr URL で取得、または `@import` で利用

`brand.md` の役割は **「AI に渡すための clean な single-file spec」**。root `CLAUDE.md` には「`brand/brand.md` に従え」と書くだけで内容を二重化しない。`brand/CLAUDE.md` / `brand/README.md` は作らない。

`public/brand-assets/` の配布ミラーも作らない。GitHub raw URL（例: `https://raw.githubusercontent.com/<user>/portfolio/main/brand/tokens.css`）と jsdelivr CDN URL（例: `https://cdn.jsdelivr.net/gh/<user>/portfolio/brand/tokens.css`）で配信ニーズは満たせる。同期スクリプト / バイト一致 jest spec / `prebuild` 配線等の運用コストを避ける。

`brand/source/twilight-blade-v1/Hero.html` も再評価の結果、TOK-83 以前の歴史的ハンドオフ資産であり、Claude Design への再投入用途は `/` URL や live site のスクショで代替可能。本 change の deliverable から外す（既存ファイルは `brand/source/` 配下にそのまま残置）。

## Goals / Non-Goals

**Goals:**

- `brand/tokens.ts` が `brand/tokens.css` と同期した typed mirror として存在する
- `brand/brand.md` が AI に paste / URL fetch される単一ファイル spec として存在する
- `/brand` ルートが 6 セクション（HERO / CONCEPT / TOKENS / IN USE / ASSETS / COLOPHON）で公開される
- `public/brand-og.png` が配置され、`/brand` ルートが OGP 経由で配信する
- root `CLAUDE.md` に "Visual Conventions" 節があり、`brand/brand.md` を AI rule SoT として参照する
- Footer に `/brand` リンクが 1 件存在する
- `/brand` が WCAG AA を満たすコントラスト比でレンダリングされ、768px 以下で 1 カラムにフォールバックする
- `pnpm lint` / `pnpm test` / `pnpm build` が通る

**Non-Goals:**

- `brand/CLAUDE.md` / `brand/README.md` の作成（root `CLAUDE.md` に統合）
- `public/brand-assets/` ディレクトリ作成 + 同期スクリプト + jest sync spec（GitHub raw / jsdelivr で代替）
- `tokens.json` の配布（実用ユースケースが薄い）
- npm package 公開、semver、CHANGELOG、LICENSE ファイル
- Style Dictionary 等のトークン変換ツール導入
- Figma Library 化、独立ドキュメントサイト
- `brand/source/twilight-blade-v1/Hero.html` を deliverable に含めること（既存ファイルは放置）
- 新ロゴ / フォント変更 / ブランド token 値の変更
- `/brand` 動的レンダリング（MDX / runtime fetch などは導入しない、各セクションは React component で hand-craft）
- `/brand` ページの CONCEPT 本文と `brand/brand.md` の自動同期（手動メンテで許容）

## Decisions

### Decision 1 — `brand/` 配下は `tokens.css` + `tokens.ts` + `brand.md` + 既存 `source/` のみ

`brand/CLAUDE.md` / `brand/README.md` を `brand/` 配下に置かない。理由：

- `brand/CLAUDE.md` は repo root の `CLAUDE.md`（Claude Code が自動読み込み）と用途が被る。AI rule file は **1 個に集約** が業界慣行（`.cursorrules` / 単独 `CLAUDE.md` パターン）
- `brand/README.md` はファイル数が少ない（4 個）フォルダに README を置く一般慣行に合わない

最終構造：

```
brand/
  tokens.css   # SSoT（既存・TOK-82）
  tokens.ts    # 型付き mirror（新規）
  brand.md     # AI 用 single-file spec（新規）
  source/      # Claude Design ハンドオフ（既存・触らない）
```

**根拠:** AI rule の所在が一意（`brand/brand.md`）であることが「AI に従わせる」の前提。同じ内容が複数ファイルにあると AI / 人間が混乱・drift する。

### Decision 2 — `tokens.css` を SSoT 真本にし、`tokens.ts` を typed mirror にする

`brand/tokens.css` が真本。TOK-82 で確定済みで Tailwind が `var(--color-brand-*)` 経由で参照する配線は変更しない。`brand/tokens.ts` は同じ値を `as const` で再宣言した typed mirror で、`/brand` の TOKENS セクションが import して swatch を描画するために使う。

`tokens.ts` の構造：

```ts
export const brandTokens = {
  color: {
    bg: '#0a0a12',
    fg: '#ffffff',
    muted: '#6b6b7b',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.14)',
    orbIndigo: '#4f46e5',
    orbViolet: '#8b5cf6',
    orbPink: '#ec4899',
  },
  font: {
    sans: "'Geist', system-ui, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace",
  },
} as const;
```

両者の整合は jest spec で文字列比較する（Decision 5）。

**代替案:**

- `tokens.ts` を SSoT にして `tokens.css` を build-time 生成 — 却下。TOK-82 確定の Tailwind 配線を壊す
- Style Dictionary を導入 — 却下。Non-Goal 通り

**根拠:** Tailwind 配線を変えず、build pipeline を増やさず、drift は jest で検出可能。

### Decision 3 — 配布は GitHub raw / jsdelivr CDN で行い、`public/brand-assets/` ミラーを作らない

`brand/` 配下のファイルは public な GitHub repo にあるので、以下の URL でそのまま配信できる：

- GitHub raw: `https://raw.githubusercontent.com/<user>/portfolio/main/brand/tokens.css`
- jsdelivr CDN（無料・キャッシュあり）: `https://cdn.jsdelivr.net/gh/<user>/portfolio/brand/tokens.css`
- GitHub blob view（人間向けレンダリング）: `https://github.com/<user>/portfolio/blob/main/brand/tokens.css`

これにより：

- 第三者の `@import` / AI fetch 用途は GitHub raw / jsdelivr で満たせる
- `/brand` ASSETS セクションのリンクも上記 URL を指す
- `public/brand-assets/` ディレクトリ、`scripts/sync-brand-assets.mjs`、`prebuild` 配線、jest のバイト一致 spec は **すべて不要**

トレードオフ：

- 配信が `<portfolio>` ドメインではなく GitHub / jsdelivr ドメインになる（ブランド URL の美観のみ低下）
- repo を private にすると配信が止まる（個人 portfolio で発生確率低、許容）

**代替案:**

- `public/brand-assets/` にミラーを作って同期 — 却下。同期コスト > ブランド URL の美観
- `next/og` を入れて build-time 生成 — 却下。tokens.css のような静的ファイルに動的生成は不要

**根拠:** 既に public な repo に置いた SSoT を再配信する技術的必要性は低い。GitHub / jsdelivr で 99% のシーンを満たせる。

### Decision 4 — OGP 画像は `public/brand-og.png`（top-level）に置く

OGP 画像のみは Next.js の static 配信制約から `public/` 配下に置く必要がある。`public/brand-assets/` サブディレクトリを作らないので、`public/brand-og.png` の top-level 配置とする。`/brand.tsx` から既存 `Seo` component に `ogImage="/brand-og.png"` を渡す。

推奨は 1200×630 / < 500 KB の静的 PNG だが、OGP のアスペクト比（≈ 1.91:1）を満たす同等寸法・2 MB 以下であれば許容する。各 SNS が描画時にスケーリングするため、ピクセル厳守の必要性は低い。@vercel/og 等の動的生成は導入しない。

**根拠:** `public/brand-assets/` を不採用（Decision 3）にしたので OGP も自然と top-level。

### Decision 5 — `tokens.css` ↔ `tokens.ts` の drift 検出は jest で文字列比較

`brand/tokens.spec.ts`（または `spec/brand/tokensSync.spec.ts`）で：

1. `brand/tokens.css` を fs で読み込み、`--color-brand-*` と `--font-brand-*` の `<name>: <value>` ペアを正規表現で抽出
2. `brand/tokens.ts` の `brandTokens` から同等のフラットなペアを生成
3. key 集合 + value（trim 済み文字列）の完全一致を assert

`brand/brand.md` と `brand/tokens.css` の token 値整合性も spec 化する：`brand.md` 内に列挙される hex 値が `tokens.css` の値と一致するかを正規表現で検証する。

**代替案:**

- ESLint custom rule — 却下。jest の方が低コスト
- ランタイム比較 — 却下（テストでカバーするのが自然）

**根拠:** SSoT の整合契約を実行可能な test として残す。

### Decision 6 — `/brand` ページは 6 セクション縦積みで構成する

ファイル配置：

```
src/pages/brand.tsx                          # thin wrapper
src/features/brand/
  Brand.page.tsx                             # 6 セクションを縦に配置
  components/
    BrandHero/index.tsx
    BrandConcept/index.tsx
    BrandTokens/index.tsx
    BrandInUse/index.tsx
    BrandAssets/index.tsx
    BrandColophon/index.tsx
  data/
    rules.ts                                 # CONCEPT / IN USE 等で使う構造化データ（任意）
```

各セクションの内容：

| セクション | 内容 |
|---|---|
| HERO | `Eyebrow` "Brand · Twilight Blade" + 大型タイポ "Twilight Blade." + 1 行コンセプト + Orb 背景 |
| CONCEPT | 思想（実運用の事後言語化、1〜2 段落のプローズ）+ DO / DON'T リスト。`brand/brand.md` と同じ思想を React 描画用にフォーマット |
| TOKENS | `brand/tokens.ts` の `brandTokens` から色 swatch + 値（hex / rgba）+ font スタックを表示 |
| IN USE | gradient period / Orb / eyebrow-pulse / 12-col grid / two-tier CTA の小規模ライブデモ |
| ASSETS | `brand/tokens.css` および `brand/brand.md` への外部リンク（GitHub raw / jsdelivr CDN URL）+ 各 1 行説明 + コピペ用 URL の表示 |
| COLOPHON | 使用フォント（Geist / Geist Mono）クレジット、最終更新日、ライセンス（MIT）|

ASSETS セクションは「ダウンロード」ではなく「外部リンクと URL 表示」の形を取る（公式に DL 機能を提供しない）。

**根拠:** issue Done 定義の 6 セクションを踏襲しつつ、配布 mirror を持たない構成に合わせて命名・内容を整える。

### Decision 7 — root `CLAUDE.md` は "Visual Conventions" 節で `brand/brand.md` を参照するだけ

root `CLAUDE.md` には Twilight Blade ルールを inline で書かず、**`brand/brand.md` を AI rule の SoT として参照する 1 段落** だけを置く。例：

```markdown
## Visual Conventions

This project uses the Twilight Blade design system.
AI agents working in this repo MUST follow `brand/brand.md` for all visual
decisions: colors, typography, gradients, and DO / DO NOT rules.
Do not introduce new color hex literals or styling primitives outside
what is described there. See `/brand` for the rendered reference page.
```

これにより：

- AI rule の SoT が 1 個（`brand/brand.md`）に集約される
- root `CLAUDE.md` は coding workflow 中心の役割を保ち、肥大化しない
- chat AI へ paste / URL fetch するときは `brand/brand.md` 単体で完結する

**代替案:**

- inline で root `CLAUDE.md` にルールを書く — 却下。chat AI への paste で root CLAUDE.md 全体（commands / env vars / architecture）が混じってノイズになる
- 別ファイル `brand/CLAUDE.md` に書く — 却下。Decision 1 の通り
- `.cursorrules` を別途作る — 却下。Claude Code は `CLAUDE.md` を読むので統一

**根拠:** AI rule の所在を `brand/brand.md` 一箇所に集約し、IDE AI / chat AI 双方が同じ SoT を参照する状態を作る。

### Decision 8 — `brand/brand.md` は AI 用 single-file spec として最小構造で書く

`brand/brand.md` は **「AI に paste / fetch して従わせるための clean spec」** に役割を限定。次の構造で書く：

```markdown
# Twilight Blade

[1〜2 段落で思想 / 設計意図を運用実績の事後言語化として記述]

## Tokens

### Colors (use only these)
- bg: #0a0a12
- fg: #ffffff
- muted: #6b6b7b
- border: rgba(255,255,255,0.08)
- border-strong: rgba(255,255,255,0.14)
- orb-indigo: #4f46e5
- orb-violet: #8b5cf6
- orb-pink: #ec4899

### Fonts
- Sans: 'Geist', system-ui, sans-serif
- Mono: 'Geist Mono', ui-monospace, monospace

## DO
- [箇条書きで実運用準拠の DO リスト]

## DO NOT
- [箇条書きで実運用準拠の DO NOT リスト]

## Reference

- Live page: https://<portfolio>/brand
- Tokens (CSS): https://cdn.jsdelivr.net/gh/<user>/portfolio/brand/tokens.css
- Source: https://github.com/<user>/portfolio
```

`tokens.css` と値が一致することを Decision 5 で spec 化。

**根拠:** AI が paste / fetch するときに余計な情報を取らせない。コードベースの構造説明、command の説明、git workflow 等は brand とは無関係なので含めない。

### Decision 9 — WCAG AA は brand token の組み合わせで満たす設計とし、利用パターンを規約化する

`/brand` 内の色組み合わせは `--color-brand-fg` (#ffffff) / `--color-brand-muted` (#6b6b7b) を `--color-brand-bg` (#0a0a12) に乗せる 2 系統に絞る。コントラスト比：

- `#ffffff` on `#0a0a12`: 約 19.8:1（AA / AAA を超過）
- `#6b6b7b` on `#0a0a12`: 約 4.7:1（AA 通常テキスト 4.5:1 をクリア）

本文サイズは `fg`、補助情報のみ `muted` という運用を spec で要件化する。

**根拠:** brand token 自体が AA を満たす値で構成済み。新たな計算は不要で、利用パターンを規約化することで a11y を担保。

### Decision 10 — 768px 以下は Tailwind の `md:` ブレイクポイントで 1 カラムにフォールバック

各セクションは `grid grid-cols-1 md:grid-cols-2`（または `md:grid-cols-3`）の方式で実装し、`md:` 未満（< 768px）では 1 カラムに自動的に折り畳まれる。Hero.html の Side-meta 列のような左右分割は `/brand` HERO では持たず、最初から縦積み構成。

**根拠:** Tailwind デフォルト `md:`（768px）が要件と一致。

## Risks / Trade-offs

- **`brand/brand.md` ↔ `brand/tokens.css` の値 drift** → jest spec で hex 値の整合を検証（Decision 5）
- **`brand/brand.md` ↔ `/brand` CONCEPT セクションのプローズ drift** → 自動検出はしない（手動メンテ）。両者は同じ思想を別フォーマットで表現する関係なので、語彙が一致しない程度の drift は許容
- **`tokens.css` ↔ `tokens.ts` の drift** → jest spec で完全一致検証
- **GitHub raw / jsdelivr URL の脆弱性**: repo を private にしたり branch 名を変えると URL が切れる。発生確率は個人 portfolio では低いが、起きたときは `brand/brand.md` および `/brand` ASSETS セクションのリンクを更新する必要あり
- **OGP 画像が古くなる** → `/` Hero デザイン変更時に手動更新。本 change のスコープは初期版のみ
- **`/brand` がアクセスされない** → Footer 導線のみ。signaling 価値があれば訪問数は問題ではない
- **`brand/brand.md` の文面が陳腐化** → 「実運用の事後言語化」として書くため、本質的に長期的に陳腐化しにくい。token 値の追加・変更時には `brand/brand.md` も同 PR で見直す（Decision 5 の test がそれを強制する）
- **root `CLAUDE.md` の Visual Conventions 節が長くなる懸念** → Decision 7 通り 1 段落で抑える
- **`brand/source/` を放置することによる混乱** → README 的説明は無いが、`brand/source/twilight-blade-v1/README.md`（既存）が役割を説明しているので新規ドキュメントは不要
