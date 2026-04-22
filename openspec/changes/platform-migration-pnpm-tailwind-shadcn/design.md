## Context

Portfolio は Next.js 15 (Pages Router) + TypeScript の SPA で、現状は以下のスタックで稼働中:

- Package manager: **yarn 1.22.22** (`.tool-versions`, `.node-version` で node 20.20.2 固定)
- UI: **Chakra UI v2 + Emotion** (`src/theme/theme.ts` は ほぼデフォルト、`src/components/layouts/Footer/index.tsx` 等でヘビーユース)
- CI: `.github/workflows/ci.yml` が `yarn install --ignore-scripts` → lint / test / build を並列
- Vercel: `vercel.json` で preview / production デプロイ
- git hooks: `.githooks/pre-commit` `.githooks/pre-push` が `scripts.prepare` 経由で `core.hooksPath=.githooks` を設定

`brand/` は現状 Claude Design の export (Hero.html) のみ。Twilight Blade トークン (`#0A0A12`, Geist, indigo/violet/pink orb 等) は proposal の What Changes にまとめた通りで、この change で `brand/tokens.css` として CSS variable 化する。

ステークホルダは自分のみ (個人 portfolio)。ダウンストリームで TOK-83 (portfolio 全ページ刷新) と TOK-84 (/brand 公開) がこの change の完了を前提に走る。

## Goals / Non-Goals

**Goals:**

- portfolio が pnpm + Tailwind + shadcn/ui + `brand/tokens.css` を土台にして動くようにする (configuration-only)
- 既存の Chakra UI / Emotion 依存ページは**全て壊れず**にビルド・デプロイできる
- ADR 1 枚で Tailwind / shadcn / pnpm / Chakra 共存方針の判断根拠を文書化する
- CI / Vercel / git hooks が pnpm ベースでも従来と同じ挙動をする

**Non-Goals:**

- 既存ページの見た目を変える (TOK-83 の仕事)
- `brand/` 配下の完成版 SSoT (tokens.ts / brand.md / CLAUDE.md / README.md) を揃える (TOK-84 の仕事)
- `/brand` ページを作る (TOK-84 の仕事)
- Chakra UI を撤去する (TOK-83 の最終 Done 条件)
- App Router への移行 (別 change で検討)
- Node バージョン変更

## Decisions

### 1. Package manager: **pnpm** を採用

- **Why**: yarn 1 はメンテナンスモードで、yarn 2+ (Berry) は PnP や zero-install で学習コストが高い。pnpm は hardlink ベースで disk 軽量・install 高速・Next.js / Vercel でも公式サポート済。`packageManager` field で version pinning も出来る。
- **Alternatives considered**:
  - yarn 4 (Berry) — PnP の副作用と移行コストを考えると恩恵が薄い
  - npm — シンプルだが install 速度で pnpm に劣り、node_modules サイズも重い
  - bun — install 速いが Next.js 側のサポートが Vercel 本体で段階導入中、本番採用は時期尚早
- **Trade-off**: CI キャッシュキーと Vercel の Install Command を置換するだけで済むが、local で初回 `pnpm install` 時に `core.hooksPath` 再設定が走るかどうかを検証する必要あり。

### 2. Styling: **Tailwind CSS (v3 系)** + shadcn/ui

- **Why**: shadcn/ui はコピー配布モデルで primitive の所有権が自リポに残り、Radix UI ベースでアクセシビリティも担保されている。Tailwind v3 は `@apply` や CSS variables との相性が良く、`brand/tokens.css` を `:root` に置けば `theme.extend.colors` で CSS var 参照できる。
- **Alternatives considered**:
  - styled-components / Emotion 継続 — brand token の一元管理が TS ファイルに閉じてしまい、`/brand` 公開時に別配布する二重管理になる
  - vanilla-extract — ゼロランタイム CSS で型安全だが、shadcn/ui の Tailwind 前提と噛み合わない
  - Radix UI 直接 + 自前 CSS — 自前で styling を書く工数が大きく、shadcn/ui の恩恵を受けられない
- **Trade-off**: Tailwind のクラス羅列で JSX が読みづらくなる点は、shadcn/ui primitive と `cn()` utility (`clsx` + `tailwind-merge`) で緩和する。

### 3. Chakra UI / Emotion は**残置**して共存させる

- **Why**: 既存ページ全てを本 change で書き直すと scope が膨張して Done 判定が曖昧になる。TOK-83 でページ単位に剥がすのが spec 分割上も健全。
- **実装**: `_app.tsx` で `ChakraProvider` と Tailwind の `globals.css` を両方 import する。新規ページ (将来の `/brand` 等) は Tailwind 系のみ使う。
- **Alternatives considered**:
  - 本 change で Chakra を一気に剥がす — scope 越境、TOK-83 の仕事を奪う
  - Chakra を使ったまま Tailwind のみ追加して共存しない — 意味不明
- **Trade-off**: bundle size が一時的に膨らむが、TOK-83 で Chakra 撤去時に解消する。本 change 期間は許容する。

### 4. `brand/tokens.css` を **`:root` で CSS variable** として配置

- **Why**: CSS variable は Tailwind / shadcn / 生 CSS 全てから参照でき、ランタイム dark mode 切替にも相性が良い。`brand/tokens.ts` (型付きトークン) は TOK-84 で生成するが、source of truth は CSS variable 側に揃える。
- **Tailwind 連携**: `tailwind.config.ts` の `theme.extend.colors` で CSS var 参照 (例: `bg: "var(--color-bg)"`)。shadcn/ui の `tokens.css` が作る CSS var 群と衝突しないよう namespace 設計する (例: `--color-brand-bg`, `--color-brand-orb-indigo`)。
- **Alternatives considered**:
  - TS の token object を Tailwind `theme` に注入 — `/brand` で配布するときに JS が必要になり、素の HTML/CSS コピペで使えなくなる
- **Trade-off**: CSS variable は build 時型チェックが効かない。TS 側の `brand/tokens.ts` を TOK-84 で生やした段階で型レベルの verification を足す。

### 5. shadcn/ui の CLI と components の置き場

- **Why**: shadcn/ui の `init` で `components.json` を生成し、primitive は `src/components/ui/` に置く (shadcn デフォルト)。既存の `src/components/layouts/` `src/components/parts/` と namespace が分かれるので衝突しない。
- **どの primitive を初期に入れるか**: `Button` の 1 個のみ。本 change の目的は「shadcn CLI が動き、生成された primitive が型含めてビルド通過する」ことの疎通確認に留める。追加の primitive (Card, Dialog 等) は TOK-83 で必要になったタイミングで generate する。

### 6. ADR の置き場: **`openspec/changes/.../design.md` に集約**

- **Why**: ADR を別フォルダ `docs/adr/` に切るか悩んだが、本 change の design.md がまさに ADR 相当。別ファイルに切ると openspec archive 後に参照が切れる。Archive 時に `openspec/specs/` へ capability spec が移り、design.md は change 配下に残るので、後世の参照もこの path で済む。
- **将来**: portfolio 全体で ADR が増えた段階で `docs/adr/` を作る判断。今は不要。

## Risks / Trade-offs

- **[Risk] `yarn install --ignore-scripts` → `pnpm install --ignore-scripts` でキャッシュが効かない** → Mitigation: `actions/cache` の key を `pnpm-lock.yaml` の hash に差し替え、`setup-node` の `cache: 'pnpm'` を使う。
- **[Risk] Vercel が `packageManager` を誤認識する** → Mitigation: Vercel Project Settings で Install Command / Build Command を明示 (`pnpm install --frozen-lockfile`, `pnpm build`)。
- **[Risk] `core.hooksPath` の prepare script が pnpm で発火しない** → Mitigation: pnpm も `prepare` lifecycle を実行するので原則動くが、lockfile 差し替え後の初回 install で明示的に確認する。
- **[Risk] Chakra UI v2 と Tailwind の CSS reset が衝突する** → Mitigation: Tailwind の `preflight` (CSS reset) は残したまま、Chakra の global styles (`CSSReset` 相当) と同時に読む。具体的な衝突箇所 (margin / line-height 等) が出たら `tailwind.config` で `corePlugins.preflight: false` を検討する選択肢を残す。
- **[Risk] `brand/tokens.css` の変数名と shadcn/ui が生成する変数名が衝突** → Mitigation: brand 側は `--color-brand-*`, `--font-brand-*` の prefix で namespace を分ける。shadcn デフォルトの `--background`, `--foreground` 等とは棲み分ける。
- **[Risk] pnpm 特有の strict node_modules 解決で、Chakra の依存が壊れる** → Mitigation: 万一 peer dep 不整合が出たら `.npmrc` に `public-hoist-pattern[]=*emotion*` などを設定。Chakra UI v2 は pnpm の strict 解決で問題が出にくいことを既知の事例で確認済み。

## Migration Plan

1. feature branch を TOK-82 で切る (例: `feat/platform-migration` を `feat/brand-assets` から分岐)
2. **Step 1: pnpm 化**
   - `packageManager: "pnpm@<latest-stable>"` を `package.json` に追加
   - `yarn.lock` 削除 → `pnpm import` で lockfile 変換 → `pnpm-lock.yaml` commit
   - `.github/workflows/ci.yml` の `yarn install --ignore-scripts` を `pnpm install --ignore-scripts --frozen-lockfile` に、cache ブロックを `pnpm/action-setup` + `actions/setup-node` の `cache: 'pnpm'` に置換
   - Vercel Project Settings (UI) を更新 (この change で触れないので、PR description に手順を書く)
   - local で `pnpm install` → `pnpm dev` / `pnpm build` が通ることを確認
   - `core.hooksPath` が `.githooks` になっていることを確認 (prepare script が発火したか)
3. **Step 2: Tailwind 導入**
   - `pnpm add -D tailwindcss postcss autoprefixer`
   - `npx tailwindcss init -p --ts` で `tailwind.config.ts` と `postcss.config.js` を生成
   - `content: ['./src/**/*.{ts,tsx}']`, `darkMode: 'class'` 設定
   - `src/styles/globals.css` に `@tailwind base; @tailwind components; @tailwind utilities;`
   - `_app.tsx` で `globals.css` import
   - `pnpm build` と `pnpm dev` で既存ページに CSS 回帰が出ないことを確認 (Chakra の global styles と併存)
4. **Step 3: `brand/tokens.css` 整備**
   - `brand/tokens.css` を作成 (bg / fg / muted / line / orb 3 色 / font family の CSS variable)
   - `globals.css` の `@layer base` で `:root` に import
   - `tailwind.config.ts` の `theme.extend.colors` / `fontFamily` で CSS var 参照エントリを追加
   - 動作確認用に `_app.tsx` や任意のページで背景色を CSS var 経由で一時確認 (確認後 revert)
5. **Step 4: shadcn/ui 初期化**
   - `pnpm dlx shadcn@latest init` で `components.json` と tailwind 側の config 拡張を反映
   - `pnpm dlx shadcn@latest add button` で primitive を 1 個入れて型含めてビルド通過を確認
   - namespace 衝突 (`--background` 等) が出た場合は `components.json` の `cssVariables` と tokens.css の prefix を調整
6. **Step 5: ADR 補足と PR 作成**
   - `design.md` (本ファイル) の Decisions を確定版に整え、必要なら `## Outcome` メモを追記
   - PR は TOK-82 を close するように `Closes TOK-82` を description に (もしくは Linear が `gitBranchName` と自動紐付け)
   - PR description に Vercel 側の手動手順 (Install/Build Command) を明記
7. **Rollback**
   - lockfile 変更は commit 単位で revert 可能。万一 pnpm / Tailwind / shadcn のどれかが CI を破壊したら、各 Step の commit を revert して yarn 構成に戻す。

## Open Questions

- Vercel Project Settings の書き換えは手動 UI 作業になる。Preview デプロイで事故らないよう、**先に draft PR を出して preview を確認してから Vercel 側を変更**する順序でよいか?
- shadcn/ui の `cssVariables: true` (デフォルト) と `brand/tokens.css` の変数名 prefix が最終的に綺麗に棲み分けできるか。実装中に衝突が出たら本ファイルに Decision 7 として追記する。
- `.npmrc` に `node-linker=hoisted` を入れるか、デフォルトの isolated で走るか。Chakra UI v2 のために明示的 hoist が要るかを実 install で検証する。
- Node version は `.node-version` / `.tool-versions` で 20.20.2 に pinned だが、pnpm が要求する node version に合うか (pnpm 9 系は node 18+ で OK、問題なし)。
