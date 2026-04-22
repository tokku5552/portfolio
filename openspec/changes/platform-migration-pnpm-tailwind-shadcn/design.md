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

### 2. Styling: **Tailwind CSS (v3 系)** + 自前 primitive

- **Why**: Tailwind v3 は `@apply` や CSS variables との相性が良く、`brand/tokens.css` を `:root` に置けば `theme.extend.colors` で CSS var 参照できる。primitive は TOK-83 で必要になった段階で自前で書くか、Radix UI を primitive 単位で個別 install する方針とする (shadcn/ui 不採用の理由は Decision 5 を参照)。
- **Alternatives considered**:
  - styled-components / Emotion 継続 — brand token の一元管理が TS ファイルに閉じてしまい、`/brand` 公開時に別配布する二重管理になる
  - vanilla-extract — ゼロランタイム CSS で型安全だが、Tailwind 側の ecosystem と噛み合わない
  - Tailwind v4 — CSS-first config と shadcn v4 (base-nova preset) に乗れるが、`tailwind.config.ts` 廃止 / PostCSS plugin 差し替え / Chakra との preflight 共存を再検証する必要があり、本 change の scope を超過する。必要になった段階で別 change で判断する
- **Trade-off**: Tailwind のクラス羅列で JSX が読みづらくなる点は `cn()` utility (`clsx` + `tailwind-merge`) で緩和する。

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

### 5. shadcn/ui は**不採用**

- **Why**: 本 change 実装中 (2026-04-22) に `pnpm dlx shadcn@latest init` が shadcn v4 系 (`base-nova` preset, base-ui + Tailwind v4 前提) で initialization を行うことが判明し、本 change の Decision 2 (Tailwind v3 系) と衝突した。改めて portfolio で必要な primitive 数 (Button / Card / Input / Accordion / Tabs / Sheet 程度で 4〜6 個に収束) と、Twilight Blade の design (固定ダーク背景 + orb グラデ + 薄 border の構造) が shadcn の semantic theme (`--background` / `--foreground` / `--primary` / `--destructive` ... の neutral base + role ベース) と噛み合わないことを踏まえ、**shadcn/ui は導入しない** ことに決定した。
- **代替**: 
  - Tailwind utility を合成するための `cn(...)` helper (`clsx` + `tailwind-merge` ベース) のみ `src/libs/cn.ts` に置く
  - primitive (Button / Card 等) は TOK-83 で必要になったタイミングで自前で書く。`src/components/ui/` というディレクトリは shadcn 用の規約なので使わず、既存の `src/components/parts/` に揃える
  - Dialog / Dropdown / Combobox など a11y が込み入る primitive が必要になった日には、`@radix-ui/react-*` を primitive 単位で個別 install する (`Radix 直接`)
- **Alternatives considered (撤廃時点)**: 
  - Tailwind を v4 に上げて shadcn v4 を採用 — config 刷新 / preflight 再検証 / bundle 影響の scope 超過、design が brand semantic と乖離したまま
  - shadcn v2 系 (Tailwind v3 互換) にダウングレード — 旧 CLI を将来引きずることになり、shadcn 本体の維持トレンドから外れる
  - shadcn を使いつつ brand token と shadcn token を namespace 分離で共存 — `:root` に 2 系統 CSS var が並ぶ構造になり、TOK-83 以降「どちらを使うべきか」の判断コストが残る
- **将来**: portfolio が SaaS / 管理画面など primitive を 10+ 必要とする用途に膨らんだら、その時点の shadcn 最新 (v4 or 以降) + Tailwind v4 を前提に改めて導入判断する。本 change の scope 外。

### 6. ADR の置き場: **`openspec/changes/.../design.md` に集約**

- **Why**: ADR を別フォルダ `docs/adr/` に切るか悩んだが、本 change の design.md がまさに ADR 相当。別ファイルに切ると openspec archive 後に参照が切れる。Archive 時に `openspec/specs/` へ capability spec が移り、design.md は change 配下に残るので、後世の参照もこの path で済む。
- **将来**: portfolio 全体で ADR が増えた段階で `docs/adr/` を作る判断。今は不要。

## Risks / Trade-offs

- **[Risk] `yarn install --ignore-scripts` → `pnpm install --ignore-scripts` でキャッシュが効かない** → Mitigation: `actions/cache` の key を `pnpm-lock.yaml` の hash に差し替え、`setup-node` の `cache: 'pnpm'` を使う。
- **[Risk] Vercel が `packageManager` を誤認識する** → Mitigation: Vercel Project Settings で Install Command / Build Command を明示 (`pnpm install --frozen-lockfile`, `pnpm build`)。
- **[Risk] `core.hooksPath` の prepare script が pnpm で発火しない** → Mitigation: pnpm も `prepare` lifecycle を実行するので原則動くが、lockfile 差し替え後の初回 install で明示的に確認する。
- **[Risk] Chakra UI v2 と Tailwind の CSS reset が衝突する** → Mitigation: Tailwind の `preflight` (CSS reset) は残したまま、Chakra の global styles (`CSSReset` 相当) と同時に読む。具体的な衝突箇所 (margin / line-height 等) が出たら `tailwind.config` で `corePlugins.preflight: false` を検討する選択肢を残す。
- **[Risk] pnpm 特有の strict node_modules 解決で、Chakra の依存が壊れる** → Mitigation: 万一 peer dep 不整合が出たら `.npmrc` に `public-hoist-pattern[]=*emotion*` などを設定。Chakra UI v2 は pnpm の strict 解決で問題が出にくいことを既知の事例で確認済み。

## Migration Plan

1. feature branch を TOK-82 で切る (例: `feat/platform-migration` を `feat/brand-assets` から分岐)
2. **Step 1: pnpm 化**
   - `packageManager: "pnpm@<latest-stable>"` を `package.json` に追加
   - `yarn.lock` 削除 → `pnpm import` で lockfile 変換 → `pnpm-lock.yaml` commit。リポジトリに `package-lock.json` も tracked されているため (Renovate が npm/yarn 両方を更新していた経緯)、同時に `package-lock.json` も削除する
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
5. **Step 4: `cn()` helper の配置**
   - `clsx` + `tailwind-merge` を `dependencies` に追加 (shadcn 不採用に伴い primitive 自前化の基盤として残す)
   - `src/libs/cn.ts` に `cn(...inputs: ClassValue[]) => twMerge(clsx(inputs))` を実装
   - primitive (Button / Card 等) は本 change では生成しない。TOK-83 で必要になったタイミングで自前で書くか、`@radix-ui/react-*` を primitive 単位で追加する
6. **Step 5: ADR 補足と PR 作成**
   - `design.md` (本ファイル) の Decisions を確定版に整え、必要なら `## Outcome` メモを追記 (特に Decision 5 は実装中に shadcn 不採用へ転換したため経緯を記録)
   - PR は TOK-82 を close するように `Closes TOK-82` を description に (もしくは Linear が `gitBranchName` と自動紐付け)
   - PR description に Vercel 側の手動手順 (Install/Build Command) を明記
7. **Rollback**
   - lockfile 変更は commit 単位で revert 可能。万一 pnpm / Tailwind / `brand/tokens.css` のどれかが CI を破壊したら、各 Step の commit を revert して yarn 構成に戻す。

## Open Questions

- Vercel Project Settings の書き換えは手動 UI 作業になる。Preview デプロイで事故らないよう、**先に draft PR を出して preview を確認してから Vercel 側を変更**する順序でよいか? (→ §6.1 → §6.2 の順で確定済み)
- `.npmrc` に `node-linker=hoisted` を入れるか、デフォルトの isolated で走るか。Chakra UI v2 のために明示的 hoist が要るかを実 install で検証する。 (→ 2026-04-22: `pnpm install --frozen-lockfile` + Chakra UI v2 + Tailwind v3 で lint / test / build 全 pass、isolated のままで問題なし。`.npmrc` 追加は不要と判定)
- Node version は `.node-version` / `.tool-versions` で 20.20.2 に pinned だが、pnpm が要求する node version に合うか (pnpm 9 系は node 18+ で OK、問題なし)。 (→ `packageManager: pnpm@10.33.0` を pin、node 20.20.2 で動作確認済み)

## Outcome (2026-04-22)

- pnpm@10.33.0 への移行 (§2) は想定通り完了。CI / Vercel / git hooks の既存動作を保ったまま lockfile のみ差し替え
- Tailwind v3 導入 (§3) では `preflight` と Chakra の CSSReset の衝突は **実測ゼロ** (Playwright で baseline / preflight on / preflight off の 3 パターンをスクショ比較して同一表示を確認)。`corePlugins.preflight: false` は設定しないまま閉じる
- `brand/tokens.css` の CSS variable は `:root` に注入・Tailwind theme から参照できる状態を確認。ただし Chakra の `<Global>` CSS-in-JS が Tailwind utilities layer より後にロードされるため、`<main>` などで brand class が Chakra の body color に負ける cascade 状態になる。これは Chakra 剥離 (TOK-83) で自然解消する
- **shadcn/ui は不採用** (Decision 5)。当初 Decision 5 は「shadcn init + Button 1 個の疎通確認」だったが、実装中に shadcn CLI が v4 系 (base-ui + Tailwind v4) に切り替わっていたこと、portfolio で必要な primitive 数が 4〜6 個に収束する見込みであること、Twilight Blade の design が shadcn の semantic theme と噛み合わないことから撤廃。代替として `src/libs/cn.ts` に `cn()` helper を配置
