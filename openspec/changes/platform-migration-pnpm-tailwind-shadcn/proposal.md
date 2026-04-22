## Why

現在のスタック (yarn 1.22 + Chakra UI v2 + Emotion) は、今後 portfolio に適用していく Twilight Blade デザインシステムの配線、および shadcn/ui 相当の primitive 基盤を前提にした実装を阻害している。また yarn 1 は実質メンテナンスモードで、pnpm 方が install 速度 / node_modules の軽量さ / workspaces 対応で優位。このタイミングで基盤を刷新し、以降の刷新フェーズ (TOK-83) と /brand 公開 (TOK-84) が新スタック上で走れる状態にする。本 change では **portfolio のビジュアルは一切変更せず**、基盤入れ替えの整合性のみを対象とする。

## What Changes

- yarn 1.22 → **pnpm** に移行 (`pnpm-lock.yaml`、`packageManager` field、`.github/workflows/ci.yml`、Vercel ビルド設定、`.githooks/` 経由の prepare script)
- **Tailwind CSS** を導入 (`tailwind.config.ts`、PostCSS、`src/styles/globals.css`、dark mode 設定)
- **shadcn/ui** を初期化 (`components.json`、primitive を 1 個 (Button) generate して型含めてビルド通過を確認)
- `brand/tokens.css` を `:root` に配線し、Tailwind theme から CSS variable として参照可能にする
- **Chakra UI v2 / Emotion は残置** する。既存ページは旧スタックのままビルド通過することを保証する (本 change 単体では **ユーザー回遊に対して BREAKING ではない**)
- ADR を 1 枚残し、Tailwind vs styled / shadcn vs Radix 直接 / pnpm 採用理由 / Chakra との共存方針 の判断根拠を記録

## Capabilities

### New Capabilities

- `package-management`: portfolio の依存管理を pnpm で行う capability。`packageManager` field 固定、lockfile commit、CI / Vercel / git hooks の整合を含む。
- `styling-platform`: Tailwind CSS + shadcn/ui + `brand/tokens.css` を組み合わせた UI 実装基盤。既存の Chakra UI v2 / Emotion と**共存**する期間を前提に、token の single source は `brand/tokens.css` であることを規約化する。

### Modified Capabilities

(なし — portfolio には既存の openspec spec がまだ存在しない)

## Impact

- **lockfile / package.json**: `yarn.lock` 削除、`pnpm-lock.yaml` を追加。`packageManager: "pnpm@<version>"` を追記。`scripts.prepare` は `.githooks/` 経由の hooksPath 設定を維持。
- **CI**: `.github/workflows/ci.yml` の `yarn install --ignore-scripts` と cache キーを pnpm 相当に置換。
- **Vercel**: Install Command / Build Command を pnpm 前提に。Vercel は `packageManager` 自動認識するが念のため設定を明示する方針。
- **git hooks**: `.githooks/pre-commit` `.githooks/pre-push` は変更なし。`prepare` script が pnpm install 後でも発火することを確認。
- **新規設定ファイル**: `tailwind.config.ts`, `postcss.config.js`, `components.json`, `src/styles/globals.css`
- **`brand/`**: `brand/tokens.css` を新規追加 (本 change ではプラットフォーム配線レベルまで。完成版 SSoT は TOK-84 / 後続 change で完成させる)
- **既存コード**: `src/pages/_app.tsx` に `globals.css` の import を追加する程度。Chakra UI / Emotion は触らない。
- **docs**: ADR ノートを 1 枚追加 (配置先は `design.md` で確定)。`README.md` / `CLAUDE.md` の yarn 前提記述 (Commands, Git workflow の `yarn install` 経由 prepare 等) を pnpm ベースに更新する。
- **ダウンストリーム change**: TOK-83 (ポートフォリオ刷新) と TOK-84 (/brand 公開) が本 change の完了を前提に進む
