## 1. Preparation

- [x] 1.1 `feat/platform-migration` を `feat/brand-assets` から分岐し、TOK-82 の gitBranchName 相当のローカルブランチで作業開始
- [x] 1.2 現状の `yarn install` / `yarn build` / `yarn test` が通ることを一度確認し、回帰判定のベースラインにする (2026-04-22: `yarn lint` / `yarn test` / `yarn build` は pass。`yarn install --frozen-lockfile` は yarn.lock と package-lock.json の drift により fail するが、§2.4 で両 lockfile 削除されるため baseline としては build/test/lint pass を採用)
- [ ] 1.3 Vercel Project Settings の現状 (Install / Build Command, Environment Variables) をスクリーンショットなどで記録して PR description に貼れるようにしておく

## 2. pnpm migration

- [x] 2.1 最新安定版の pnpm バージョンを確認し、`package.json` に `"packageManager": "pnpm@<version>"` を追加 (2026-04-22: `pnpm@10.33.0` を pin)
- [x] 2.2 `corepack enable` で pnpm を有効化 (local 環境) (2026-04-22: corepack shim 配置済み。`pnpm --version` が `packageManager` の `10.33.0` を返すことを確認。asdf node が `.tool-versions` の 20.20.2 未インストールで 22.22.0 にフォールバックしている pre-existing drift あり、Non-Goals のため本 change では対応しない)
- [x] 2.3 `pnpm import` で `yarn.lock` から `pnpm-lock.yaml` を生成 (2026-04-22: lockfileVersion 9.0、738 packages resolved)
- [x] 2.4 `yarn.lock` および `package-lock.json` を削除 (リポジトリに npm / yarn 両 lockfile が tracked されていたため、pnpm 移行に合わせて両方撤去) (2026-04-22: 両 lockfile 削除済み、`pnpm-lock.yaml` のみ残す)
- [x] 2.5 `pnpm install --frozen-lockfile` で依存が通常通り解決することを確認し、`pnpm dev` / `pnpm build` / `pnpm test` / `pnpm lint` の 4 コマンドが成功することを確認 (2026-04-22: install 9.8s、lint/test/build 全 pass、bundle size は yarn baseline と同等 (一部ページは微減))
- [x] 2.6 `.github/workflows/ci.yml` の `prepare` ジョブ以降を pnpm ベースに書き換え (`pnpm/action-setup` 追加、`cache: 'pnpm'` の `setup-node`、`pnpm install --frozen-lockfile --ignore-scripts`) (2026-04-22: 4 jobs 全てに `pnpm/action-setup@v4` + `cache: 'pnpm'` を配置。`pnpm/action-setup@v4` は `packageManager` field を自動読込するため version 指定なし。`paths-ignore: .github/**` のため本 PR では CI が発火しない点は PR description で notes として言及する想定)
- [x] 2.7 CI の cache key を `pnpm-lock.yaml` の hash に差し替える (2026-04-22: §2.6 と同時に更新済み)
- [x] 2.8 `scripts.prepare` が pnpm install 後にも `core.hooksPath=.githooks` を設定することを確認 (`git config --get core.hooksPath` が `.githooks` を返す) (2026-04-22: `pnpm install` 後に `git config --get core.hooksPath` が `.githooks` を返すことを確認)
- [x] 2.9 `.githooks/pre-commit` / `.githooks/pre-push` が従来通り発火することを smoke test (main 上で commit が拒否される / main への push が拒否される) (2026-04-22: `git worktree` 上で main HEAD 相当で `git commit --allow-empty` が pre-commit で拒否されること、`refs/heads/main` を remote_ref とする pre-push 入力で hook が exit 1 することを確認)

## 3. Tailwind setup

- [x] 3.1 `pnpm add -D tailwindcss postcss autoprefixer` で依存を追加 (2026-04-22: `tailwindcss@3.4.19` + `postcss@8.5.10` + `autoprefixer@10.5.0` を devDependencies に追加)
- [x] 3.2 `pnpm dlx tailwindcss init -p --ts` で `tailwind.config.ts` と `postcss.config.js` を生成 (2026-04-22: `pnpm dlx tailwindcss@3 init -p --ts`。`postcss.config.js` が ESM 形式 (`export default`) で生成されたが、`package.json` に `"type": "module"` がないため `module.exports` 形式に書き換え)
- [x] 3.3 `tailwind.config.ts` の `content` に `./src/**/*.{ts,tsx}` と `./brand/**/*.{ts,tsx}` を設定、`darkMode: 'class'` を設定 (2026-04-22: 設定済み)
- [x] 3.4 `src/styles/globals.css` を新規作成し `@tailwind base; @tailwind components; @tailwind utilities;` を記述 (2026-04-22: `src/styles/globals.css` を新規作成)
- [x] 3.5 `src/pages/_app.tsx` で `@/styles/globals.css` を import (先頭で 1 度) (2026-04-22: import 文を追加、ChakraProvider import より前に配置)
- [x] 3.6 `pnpm build` が通り、`/`, `/news`, `/news/[id]`, `/articles` に visual regression が出ていないことを手動確認 (2026-04-22: `pnpm build` pass、bundle size 回帰なし (pre-Tailwind baseline と同等)。Playwright で `/`, `/news`, `/articles` をスクショ比較、baseline と一致)
- [x] 3.7 Chakra の global styles と Tailwind `preflight` の衝突がないかを preview (local dev) で確認。衝突があれば `tailwind.config.ts` の `corePlugins.preflight: false` 可否を Decision 3 に追記 (2026-04-22: Playwright で baseline (globals.css import off) / Tailwind on + preflight on / Tailwind on + preflight off の 3 パターンを `/` で比較。3 つとも同じ表示 → 衝突なし、preflight はデフォルト on のまま維持。Chakra v2 の CSSReset はコンポーネントレベルで style を確立しているため、Tailwind の要素レベル reset と共存しても実害なし)

## 4. brand/tokens.css wiring

- [x] 4.1 `brand/tokens.css` を新規作成し、`:root` に以下の CSS variable を宣言:
  `--color-brand-bg: #0A0A12;` / `--color-brand-fg: #FFFFFF;` / `--color-brand-muted: #6B6B7B;` /
  `--color-brand-border: rgba(255,255,255,0.08);` / `--color-brand-border-strong: rgba(255,255,255,0.14);` /
  `--color-brand-orb-indigo: #4F46E5;` / `--color-brand-orb-violet: #8B5CF6;` / `--color-brand-orb-pink: #EC4899;` /
  `--font-brand-sans: 'Geist', system-ui, sans-serif;` / `--font-brand-mono: 'Geist Mono', ui-monospace, monospace;` (2026-04-22: 作成済み、`:root` に 8 colors + 2 font families を宣言)
- [x] 4.2 `src/styles/globals.css` から `@import '../../brand/tokens.css';` (または相対パス相当) で読み込み、`:root` のスコープで variable が引けることを確認 (2026-04-22: `@import '../../brand/tokens.css';` を `@tailwind base;` の前に配置、Playwright で `getComputedStyle(document.documentElement).getPropertyValue('--color-brand-bg')` が `#0a0a12` を返すことを確認)
- [x] 4.3 `tailwind.config.ts` の `theme.extend.colors.brand` に CSS var を参照するエントリを追加 (例: `brand: { bg: 'var(--color-brand-bg)', fg: 'var(--color-brand-fg)', muted: 'var(--color-brand-muted)', border: 'var(--color-brand-border)', 'border-strong': 'var(--color-brand-border-strong)', 'orb-indigo': 'var(--color-brand-orb-indigo)', 'orb-violet': 'var(--color-brand-orb-violet)', 'orb-pink': 'var(--color-brand-orb-pink)' }`) (2026-04-22: 設定済み、8 色全て CSS var 経由)
- [x] 4.4 `theme.extend.fontFamily` にも `brand-sans` / `brand-mono` を追加 (2026-04-22: `font-brand-sans` / `font-brand-mono` で引ける、CSS var 経由)
- [x] 4.5 動作確認用に一時的にどこかの要素で `className="bg-brand-bg text-brand-fg"` を当ててブラウザで brand token が効くことを確認し、確認後その確認用編集を revert (2026-04-22: `_app.tsx` の `<main className="app">` に一時的に `bg-brand-bg text-brand-fg` を追加して確認。CSS variable は `:root` に正しく注入され、Tailwind utility class も生成されたが、Chakra v2 の `<Global>` CSS-in-JS が Tailwind utilities layer より後にロードされるため `<main>` の computed value では Chakra の body styles (gray.800) が勝つ cascade 状態を確認。配線自体は正しく動作しており、Chakra 剥離 (TOK-83) 後は Tailwind 中心の specificity で brand token が素直に効くため、本 change では配線完了と判定して revert)

## 5. Class-merging utility

本 change 実装中に shadcn/ui は採用しないことを決定 (design.md Decision 5 参照)。代わりに Tailwind utility class を安全に合成するための `cn()` helper だけを `src/libs/` に置く。Button / Card 等の primitive は将来 TOK-83 で必要になった段階で自前 or Radix 個別 install で対応する。

- [x] 5.1 `clsx` + `tailwind-merge` を dependencies に追加 (2026-04-22: shadcn init で副次的に導入されたもの。shadcn 本体と primitive 群は §5.2 で除去するが、`cn()` helper 用途として両パッケージは残す)
- [x] 5.2 `src/libs/cn.ts` に `cn(...inputs: ClassValue[])` を実装 (`twMerge(clsx(inputs))`)。shadcn init で副次的に生成された `components.json` / `src/components/ui/button.tsx` / `src/lib/utils.ts`、および不要 deps (`@base-ui/react` / `lucide-react` / `shadcn` / `tw-animate-css` / `class-variance-authority`) は削除。`src/styles/globals.css` も shadcn が書き足した `@import "tw-animate-css"` / `@import "shadcn/tailwind.css"` / `@layer base { ... }` を revert し、brand token + Tailwind directives のみに戻す (2026-04-22: 実装・確認済み、`pnpm build` / `pnpm lint` / `pnpm test` pass、bundle size 回帰なし)

## 6. Vercel

- [ ] 6.1 draft PR を push し、Vercel preview が生成されることを確認
- [ ] 6.2 preview が green なら、Vercel Project Settings UI で Install Command を `pnpm install --frozen-lockfile`、Build Command を `pnpm build` に明示
- [ ] 6.3 再度 push 後に preview を build し直し、Production 相当の設定でも壊れないことを確認
- [ ] 6.4 PR description に手動操作した Vercel 設定の内容を記録

## 7. Documentation and archive

- [x] 7.1 `design.md` の Open Questions を解決内容に置換、または Decisions に昇格 (preflight 可否 / `.npmrc` 設定 / shadcn 不採用の判断根拠 など) (2026-04-22: Open Questions 3 件に解決メモを追記 (preflight 衝突なし / `.npmrc` 追加不要 / node 20.20.2 確認済)、`## Outcome` セクションを新設して pnpm 移行 + Tailwind preflight 実測 + brand token cascade + shadcn 不採用の 4 項目を記録)
- [x] 7.2 `CLAUDE.md` の Commands / Architecture セクションを pnpm + Tailwind v3 + `cn()` helper 前提に更新 (2026-04-22: Commands を `pnpm` に書き換え、`corepack enable` 手順と CI の `pnpm/action-setup@v4` / Vercel の明示 Install/Build Command を追記。Architecture に `brand/tokens.css` / `src/styles/globals.css` / `src/libs/cn.ts` / primitive 自前化方針を追加。Conventions の Styling を Chakra → Tailwind 主体に書き換え、Git workflow を `pnpm install` 前提に)
- [x] 7.3 `README.md` の yarn 記載を pnpm に更新 (2026-04-22: Requirements 表を pnpm 固定・packageManager field 参照に変更、Getting Started の `yarn install` / `yarn dev` / `yarn lint` / `yarn test` を pnpm 等価コマンドに差し替え、`corepack enable` の案内を追記)
- [ ] 7.4 PR を open し、`Closes TOK-82` を description に含める
- [ ] 7.5 merge 後、`openspec archive <change>` で change を archive (本 change の spec は `openspec/specs/package-management/` と `openspec/specs/styling-platform/` に昇格する想定)
