## Context

TOK-83 で Twilight Blade デザイン語彙が `/`、`/articles`、共通 chrome に全面適用済み。本 change は「実運用済みの設計言語を AI が従える形で公開する」最小実装で、Stripe / Linear 級のブランドシステム公開（npm package、semver、Style Dictionary、Figma Library、独立ドメイン docs サイト等）は **採用しない**。

ユースケース棚卸しの結果、本 change の主な消費者は：

- **採用担当 / クライアント**: Footer リンクから `/brand` を訪問して signaling を得る（HTML 描画のみ）
- **ユーザー本人**: `/brand` で hex を確認 / 他の AI ツール（スライド / 画像生成）に portfolio スタイルを伝える
- **Claude Code / Cursor / Codex 等の IDE AI**: repo root の `CLAUDE.md` から自動的に Twilight Blade ルールを読む
- **第三者開発者**: `https://<portfolio>/brand-assets/tokens.css` を `@import` して自分のプロジェクトで使う

`brand.md` / `brand/CLAUDE.md` / `brand/README.md` / `tokens.json` の必要性をユースケース別に検討した結果、**root `CLAUDE.md` に Visual Conventions 節を追記すれば AI 用途は十分にカバーされる** と結論。重複ファイルを作らない。

`brand/source/twilight-blade-v1/Hero.html` も再評価の結果、TOK-83 以前の歴史的ハンドオフ資産であり、Claude Design への再投入用途も `/` URL や live site のスクショで代替可能。本 change の deliverable から外す（既存ファイルは `brand/source/` 配下にそのまま残置）。

## Goals / Non-Goals

**Goals:**

- `brand/tokens.ts` が `brand/tokens.css` と同期した typed mirror として存在する
- `/brand` ルートが 6 セクション（HERO / CONCEPT / TOKENS / IN USE / ASSETS / COLOPHON）で公開される
- `public/brand-assets/{tokens.css, brand-og.png}` が配置され、`tokens.css` は `brand/tokens.css` とバイト一致する
- root `CLAUDE.md` に "Visual Conventions" 節があり、Twilight Blade DO/DON'T と token 参照が記述されている
- Footer に `/brand` リンクが 1 件存在する
- `/brand` が WCAG AA を満たすコントラスト比でレンダリングされ、768px 以下で 1 カラムにフォールバックする
- `pnpm lint` / `pnpm test` / `pnpm build` が通る

**Non-Goals:**

- `brand/brand.md` / `brand/CLAUDE.md` / `brand/README.md` の作成（root `CLAUDE.md` に統合）
- `tokens.json` の配布（実用ユースケースが薄い）
- npm package 公開、semver、CHANGELOG、LICENSE ファイル
- Style Dictionary 等のトークン変換ツール導入
- Figma Library 化、独立ドキュメントサイト
- `brand/source/twilight-blade-v1/Hero.html` を deliverable に含めること（既存ファイルは放置）
- 新ロゴ / フォント変更 / ブランド token 値の変更
- `/brand` 動的レンダリング（MDX / runtime fetch などは導入しない、各セクションは React component で hand-craft）

## Decisions

### Decision 1 — `brand/` 配下は `tokens.css` + `tokens.ts` + 既存 `source/` のみ

`brand.md` / `CLAUDE.md` / `README.md` を `brand/` 配下に置かない。理由：

- `brand.md` の中身（思想 / DO/DON'T / voice & tone）は `/brand` ページの CONCEPT / IN USE セクションと **同じ内容** になる。両方持つと drift する
- `brand/CLAUDE.md` は repo root の `CLAUDE.md`（Claude Code が自動読み込み）と用途が被る。AI rule file は **1 個に集約** が業界慣行（`.cursorrules` / 単独 `CLAUDE.md` パターン）
- `brand/README.md` はファイル数が少ない（2 個）フォルダに README を置く一般慣行に合わない

最終構造：

```
brand/
  tokens.css   # SSoT（既存・TOK-82）
  tokens.ts    # 型付き mirror（新規）
  source/      # Claude Design ハンドオフ（既存・触らない）
```

**代替案:**

- `brand/brand.md` を残す — 却下。root `CLAUDE.md` で同じ役割を果たせる
- `brand/CLAUDE.md` を残す — 却下。同上
- `brand/README.md` を残す — 却下。SSoT 原則は root `CLAUDE.md` の Visual Conventions 節で説明できる

**根拠:** 「AI が従える」ためには **rule の所在が一意であること** が重要。同じ内容が複数ファイルにあると AI が混乱・drift する。

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

### Decision 3 — `public/brand-assets/` は `tokens.css` + `brand-og.png` のみ

配布物は最小限：

- `public/brand-assets/tokens.css`: `brand/tokens.css` のバイト一致コピー。第三者が `@import` で使う / AI が fetch で値を引く
- `public/brand-assets/brand-og.png`: `/brand` 用 OGP 画像（1200×630 PNG）

`tokens.json` / `brand.md` は **配布しない**：

- `tokens.json`: AI が `tokens.css` を直接パースできるので冗長。スライド AI（Gamma 等）も hex 直入力が現実
- `brand.md`: root `CLAUDE.md` で代替

同期手段は `scripts/sync-brand-assets.mjs` で `brand/tokens.css` を `public/brand-assets/tokens.css` にコピーするだけ。`prebuild` および `prepare` で自動実行し、`pnpm test` でバイト一致を検証する。

**代替案:**

- symlink で同期 — 却下。Vercel build で挙動が予測しづらい
- `tokens.json` も配布 — 却下。実利用シーンが薄い
- `brand.md` も配布 — 却下。root CLAUDE.md と重複

**根拠:** AI / 第三者の実消費パターン（CSS `@import` か AI fetch）を満たす最小セット。

### Decision 4 — `/brand` ページは 6 セクション縦積みで構成する

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
| CONCEPT | 思想（実運用の事後言語化、1〜2 段落のプローズ）+ DO / DON'T リスト |
| TOKENS | `brand/tokens.ts` の `brandTokens` から色 swatch + 値（hex / rgba）+ font スタックを表示 |
| IN USE | gradient period / Orb / eyebrow-pulse / 12-col grid / two-tier CTA の小規模ライブデモ |
| ASSETS | `tokens.css` への DL リンク（`<a href="/brand-assets/tokens.css" download>`）+ 1 行説明 |
| COLOPHON | 使用フォント（Geist / Geist Mono）クレジット、最終更新日、Linear issue ID（TOK-84）|

DOWNLOADS は ASSETS にリネーム（`tokens.css` のみ配布なので「ダウンロード一覧」より「資産参照」の方が実態に近い）。

**代替案:**

- セクション数を減らして 4 つに（HERO + TOKENS + IN USE + COLOPHON）— 却下。CONCEPT が無いと「何のブランドか」が伝わらず signaling 価値が下がる
- ASSETS を独立させずに COLOPHON に統合 — 却下。DL リンクは目立たせたい

**根拠:** issue Done 定義の 6 セクションを踏襲しつつ、配布物の実態（`tokens.css` のみ）に合わせて命名を整える。

### Decision 5 — `tokens.css` ↔ `tokens.ts` の drift 検出は jest で文字列比較

`brand/tokens.spec.ts`（または `spec/brand/tokensSync.spec.ts`）で：

1. `brand/tokens.css` を fs で読み込み、`--color-brand-*` と `--font-brand-*` の `<name>: <value>` ペアを正規表現で抽出
2. `brand/tokens.ts` の `brandTokens` から同等のフラットなペアを生成
3. key 集合 + value（trim 済み文字列）の完全一致を assert

`public/brand-assets/tokens.css` についても `brand/tokens.css` とのバイト一致を別 spec で検証。

**代替案:**

- ESLint custom rule — 却下。jest の方が低コスト
- ランタイム比較 — 却下（テストでカバーするのが自然）

**根拠:** SSoT の整合契約を実行可能な test として残す。

### Decision 6 — root `CLAUDE.md` に "Visual Conventions" 節を追記する

`/brand` ページとは別に、AI rule file としての役割を repo root の既存 `CLAUDE.md` で果たす。追記する節の最低構成：

```markdown
## Visual Conventions (Twilight Blade)

This project uses the Twilight Blade design system. Visit `/brand` for the full reference.

### Tokens (use only these)
- Colors: `var(--color-brand-bg)`, `var(--color-brand-fg)`, `var(--color-brand-muted)`,
  `var(--color-brand-border)`, `var(--color-brand-border-strong)`,
  `var(--color-brand-orb-{indigo,violet,pink})`
- Fonts: `var(--font-brand-sans)`, `var(--font-brand-mono)`

### DO
- Use `var(--color-brand-*)` for all colors.
- Reserve the indigo→violet→pink gradient for the single accent moment (e.g., name period, Orb).
- Compose Tailwind classes with `cn()` from `src/libs/cn.ts`.

### DO NOT
- Introduce new hex / rgb / rgba color literals in `src/`.
- Apply `box-shadow` for depth; use border tokens instead.
- Introduce gradients other than the indigo→violet→pink trio.
- Use Chakra UI / Emotion / Framer Motion (removed in TOK-83).

See `brand/tokens.css` for the canonical token values, or fetch
`https://<portfolio>/brand-assets/tokens.css`.
```

**代替案:**

- 別ファイル `brand/CLAUDE.md` に書く — 却下。Decision 1 の通り
- `.cursorrules` を別途作る — 却下。Claude Code は `CLAUDE.md` を読むので統一
- `/brand` ページのみで AI に伝える — 却下。Claude Code は repo を開いた瞬間に root `CLAUDE.md` を読むので、ローカル作業中の AI に伝えるには root が必須

**根拠:** AI rule の所在を 1 箇所に集約し、Claude Code / Cursor / Codex 等が repo を開いた瞬間に自動的に従える状態を作る。

### Decision 7 — OGP 画像は静的 PNG を hand-craft し `public/brand-assets/brand-og.png` に置く

`/brand` 用 OGP は 1200×630 の静的 PNG。Hero.html / `/` の Hero スクリーンショットを基に hand-craft する（@vercel/og 等の動的生成は導入しない）。`/brand.tsx` から既存 `Seo` component に `ogImage="/brand-assets/brand-og.png"` を渡す。

**根拠:** 1 枚作って終わる作業に build pipeline は不要。

### Decision 8 — WCAG AA は brand token の組み合わせで満たす設計とし、利用パターンを規約化する

`/brand` 内の色組み合わせは `--color-brand-fg` (#ffffff) / `--color-brand-muted` (#6b6b7b) を `--color-brand-bg` (#0a0a12) に乗せる 2 系統に絞る。コントラスト比：

- `#ffffff` on `#0a0a12`: 約 19.8:1（AA / AAA を超過）
- `#6b6b7b` on `#0a0a12`: 約 4.7:1（AA 通常テキスト 4.5:1 をクリア）

本文サイズは `fg`、補助情報のみ `muted` という運用を spec で要件化する。

**根拠:** brand token 自体が AA を満たす値で構成済み。新たな計算は不要で、利用パターンを規約化することで a11y を担保。

### Decision 9 — 768px 以下は Tailwind の `md:` ブレイクポイントで 1 カラムにフォールバック

各セクションは `grid grid-cols-1 md:grid-cols-2`（または `md:grid-cols-3`）の方式で実装し、`md:` 未満（< 768px）では 1 カラムに自動的に折り畳まれる。Hero.html の Side-meta 列のような左右分割は `/brand` HERO では持たず、最初から縦積み構成。

**根拠:** Tailwind デフォルト `md:`（768px）が要件と一致。

## Risks / Trade-offs

- **`brand/` ↔ `public/brand-assets/` の drift** → prebuild + jest spec の二重防御で検出。CI が `pnpm test` を実行するので merge 前に弾ける
- **`tokens.css` ↔ `tokens.ts` の drift** → jest spec で完全一致検証
- **CONCEPT 本文の陳腐化** → 「実運用の事後言語化」として書くため、本質的に長期的に陳腐化しにくい。token 値の追加・変更時には CONCEPT も同 PR で見直す習慣を Visual Conventions 節で要請
- **root `CLAUDE.md` の肥大化** → 現状 architecture / commands 等で既に長め。Visual Conventions 節は 1 セクション分（< 50 行）に抑える
- **OGP 画像が古くなる** → `/` Hero デザイン変更時に手動更新。本 change のスコープは初期版のみ
- **`/brand` がアクセスされない** → Footer 導線のみ。signaling 価値があれば訪問数は問題ではない
- **第三者が `tokens.css` を self-host する** → そもそも MIT ライセンスの portfolio repo なので歓迎。ライセンス明記は本 change のスコープ外（必要なら別 PR で `LICENSE` ファイルを追加）
- **`brand/source/` を放置することによる混乱** → README 的説明は無いが、`brand/source/twilight-blade-v1/README.md`（既存）が役割を説明しているので新規ドキュメントは不要
