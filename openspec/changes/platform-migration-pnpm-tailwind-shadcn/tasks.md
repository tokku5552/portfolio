## 1. Preparation

- [ ] 1.1 `feat/platform-migration` を `feat/brand-assets` から分岐し、TOK-82 の gitBranchName 相当のローカルブランチで作業開始
- [ ] 1.2 現状の `yarn install` / `yarn build` / `yarn test` が通ることを一度確認し、回帰判定のベースラインにする
- [ ] 1.3 Vercel Project Settings の現状 (Install / Build Command, Environment Variables) をスクリーンショットなどで記録して PR description に貼れるようにしておく

## 2. pnpm migration

- [ ] 2.1 最新安定版の pnpm バージョンを確認し、`package.json` に `"packageManager": "pnpm@<version>"` を追加
- [ ] 2.2 `corepack enable` で pnpm を有効化 (local 環境)
- [ ] 2.3 `pnpm import` で `yarn.lock` から `pnpm-lock.yaml` を生成
- [ ] 2.4 `yarn.lock` を削除
- [ ] 2.5 `pnpm install --frozen-lockfile` で依存が通常通り解決することを確認し、`pnpm dev` / `pnpm build` / `pnpm test` / `pnpm lint` の 4 コマンドが成功することを確認
- [ ] 2.6 `.github/workflows/ci.yml` の `prepare` ジョブ以降を pnpm ベースに書き換え (`pnpm/action-setup` 追加、`cache: 'pnpm'` の `setup-node`、`pnpm install --frozen-lockfile --ignore-scripts`)
- [ ] 2.7 CI の cache key を `pnpm-lock.yaml` の hash に差し替える
- [ ] 2.8 `scripts.prepare` が pnpm install 後にも `core.hooksPath=.githooks` を設定することを確認 (`git config --get core.hooksPath` が `.githooks` を返す)
- [ ] 2.9 `.githooks/pre-commit` / `.githooks/pre-push` が従来通り発火することを smoke test (main 上で commit が拒否される / main への push が拒否される)

## 3. Tailwind setup

- [ ] 3.1 `pnpm add -D tailwindcss postcss autoprefixer` で依存を追加
- [ ] 3.2 `pnpm dlx tailwindcss init -p --ts` で `tailwind.config.ts` と `postcss.config.js` を生成
- [ ] 3.3 `tailwind.config.ts` の `content` に `./src/**/*.{ts,tsx}` と `./brand/**/*.{ts,tsx}` を設定、`darkMode: 'class'` を設定
- [ ] 3.4 `src/styles/globals.css` を新規作成し `@tailwind base; @tailwind components; @tailwind utilities;` を記述
- [ ] 3.5 `src/pages/_app.tsx` で `@/styles/globals.css` を import (先頭で 1 度)
- [ ] 3.6 `pnpm build` が通り、`/`, `/news`, `/news/[id]`, `/articles` に visual regression が出ていないことを手動確認
- [ ] 3.7 Chakra の global styles と Tailwind `preflight` の衝突がないかを preview (local dev) で確認。衝突があれば `tailwind.config.ts` の `corePlugins.preflight: false` 可否を Decision 3 に追記

## 4. brand/tokens.css wiring

- [ ] 4.1 `brand/tokens.css` を新規作成し、`:root` に以下の CSS variable を宣言:
  `--color-brand-bg: #0A0A12;` / `--color-brand-fg: #FFFFFF;` / `--color-brand-muted: #6B6B7B;` /
  `--color-brand-border: rgba(255,255,255,0.08);` / `--color-brand-border-strong: rgba(255,255,255,0.14);` /
  `--color-brand-orb-indigo: #4F46E5;` / `--color-brand-orb-violet: #8B5CF6;` / `--color-brand-orb-pink: #EC4899;` /
  `--font-brand-sans: 'Geist', system-ui, sans-serif;` / `--font-brand-mono: 'Geist Mono', ui-monospace, monospace;`
- [ ] 4.2 `src/styles/globals.css` から `@import '../../brand/tokens.css';` (または相対パス相当) で読み込み、`:root` のスコープで variable が引けることを確認
- [ ] 4.3 `tailwind.config.ts` の `theme.extend.colors.brand` に CSS var を参照するエントリを追加 (例: `brand: { bg: 'var(--color-brand-bg)', fg: 'var(--color-brand-fg)', muted: 'var(--color-brand-muted)', border: 'var(--color-brand-border)', 'border-strong': 'var(--color-brand-border-strong)', 'orb-indigo': 'var(--color-brand-orb-indigo)', 'orb-violet': 'var(--color-brand-orb-violet)', 'orb-pink': 'var(--color-brand-orb-pink)' }`)
- [ ] 4.4 `theme.extend.fontFamily` にも `brand-sans` / `brand-mono` を追加
- [ ] 4.5 動作確認用に一時的にどこかの要素で `className="bg-brand-bg text-brand-fg"` を当ててブラウザで brand token が効くことを確認し、確認後その確認用編集を revert

## 5. shadcn/ui initialization

- [ ] 5.1 `pnpm dlx shadcn@latest init` を実行し、質問に沿って `components.json` を生成 (Tailwind config 経路、CSS variables モード、`src/components/ui/` の alias を確認)
- [ ] 5.2 `components.json` の `cssVariables: true` 構成が `--background` / `--foreground` / `--primary` 等を `:root` に書き込むことを確認し、`brand/tokens.css` の `--color-brand-*` と namespace が分離していることを確認
- [ ] 5.3 `pnpm dlx shadcn@latest add button` で primitive を 1 個取得し、`src/components/ui/button.tsx` が生成されることを確認
- [ ] 5.4 試験用の一時ページ or storybook 相当がないので、`_app.tsx` か `index.tsx` でダミーに 1 行 import → `pnpm build` で型含めて通ることを確認 (確認後 import は revert)
- [ ] 5.5 `.npmrc` に `node-linker` / `public-hoist-pattern` 調整が必要だったかを記録 (必要なら追記)

## 6. Vercel

- [ ] 6.1 draft PR を push し、Vercel preview が生成されることを確認
- [ ] 6.2 preview が green なら、Vercel Project Settings UI で Install Command を `pnpm install --frozen-lockfile`、Build Command を `pnpm build` に明示
- [ ] 6.3 再度 push 後に preview を build し直し、Production 相当の設定でも壊れないことを確認
- [ ] 6.4 PR description に手動操作した Vercel 設定の内容を記録

## 7. Documentation and archive

- [ ] 7.1 `design.md` の Open Questions を解決内容に置換、または Decisions に昇格 (shadcn CSS var 衝突 / `.npmrc` 設定 / preflight 可否 など)
- [ ] 7.2 `CLAUDE.md` の Commands / Architecture セクションを pnpm + Tailwind + shadcn 前提に更新
- [ ] 7.3 `README.md` の yarn 記載を pnpm に更新
- [ ] 7.4 PR を open し、`Closes TOK-82` を description に含める
- [ ] 7.5 merge 後、`openspec archive <change>` で change を archive (本 change の spec は `openspec/specs/package-management/` と `openspec/specs/styling-platform/` に昇格する想定)
