## Why

TOK-83 の完了で Twilight Blade デザイン語彙は実サイトに全面適用された。次の段階は、AI（Claude Design / Claude Code / 汎用 LLM / スライド AI 等）に Twilight Blade を **コピペ可能 / fetch 可能 / IDE 自動読み込み可能** な形で渡せるようにし、人間に対しては「ブランドが整っている」signal を与える `/brand` ページを公開すること。

ただし「ブランドガイド = manifesto + AI 命令ファイル + README + 配布物」のような Stripe / Linear 規模の体裁を真似する必要は無い。**個人ポートフォリオで AI が従えるレベルで十分**、というユースケース棚卸しの結果、必要な成果物は最小限に絞られる：

- AI 用の規範は **repo root の既存 `CLAUDE.md` に節を追記する**（ファイルを 2 個に分けない）
- `brand.md` / `brand/CLAUDE.md` / `brand/README.md` は **作らない**（root CLAUDE.md と用途が完全に被る）
- 配布物は `tokens.css` + OGP 画像 のみ（`tokens.json` も AI 実用上は不要）
- npm publish / semver / Style Dictionary は対象外
- `brand/source/twilight-blade-v1/Hero.html` は TOK-83 以前の歴史的ハンドオフ資産として放置（deliverable 対象外）

## What Changes

- **新規（SSoT）**: `brand/tokens.ts` を追加。`brand/tokens.css` と同期した TypeScript 型付きトークンで、`/brand` の TOKENS セクションが SSoT 駆動で swatch を描画するための typed mirror。
- **新規（公開ページ）**: `/brand` を 6 セクション（HERO / CONCEPT / TOKENS / IN USE / ASSETS / COLOPHON）で公開。
- **新規（配布資産）**: `public/brand-assets/tokens.css`（`brand/tokens.css` のバイト一致コピー）と `public/brand-assets/brand-og.png`（OGP）を配置。
- **新規（OGP）**: `/brand` 用 OGP 画像を `Seo` 経由で配信。
- **変更（`page-layout`）**: Footer に `/brand` への導線を 1 件追加。`/brand` でも他ルートと同一の共通 chrome がレンダリングされる。
- **変更（root `CLAUDE.md`）**: "Visual Conventions" 節を追記。Twilight Blade の DO / DON'T、利用可能な token 一覧、`/brand` への参照を AI rule として記述する。
- **品質要件**: WCAG AA（コントラスト比 4.5:1 以上）と 768px 以下 1 カラム対応。

## Capabilities

### New Capabilities

- `brand-guidelines`: `brand/` SSoT（`tokens.css` 既存 + `tokens.ts` 新規）+ `/brand` ルート + `public/brand-assets/` 配布 + root `CLAUDE.md` の AI ルール拡張 + OGP を一体として規定するブランド公開ガイド capability。SSoT と配布の同期、6 セクション構成、配布物の drift 不在、WCAG AA / 768px 1 カラム要件、AI 向けルール統合をここで担保する。

### Modified Capabilities

- `page-layout`: Footer に `/brand` 導線を追加し、`/brand` ルートでも共通 chrome がレンダリングされる要件を加える。

## Impact

- **新規ディレクトリ / ファイル**:
  - `brand/tokens.ts`
  - `src/features/brand/`（`Brand.page.tsx` + 6 section component + `data/` 任意）
  - `src/pages/brand.tsx`
  - `public/brand-assets/{tokens.css,brand-og.png}`
  - `scripts/sync-brand-assets.mjs`
- **変更ファイル**: `src/components/layouts/Footer/`（リンク追加）、`package.json`（`sync:brand` script + `prebuild` / `prepare` 配線）、`CLAUDE.md`（"Visual Conventions" 節追記）。
- **依存**: 追加なし。既存 Tailwind + brand token + 既存 primitive のみ。
- **配布同期**: `brand/tokens.css` ↔ `public/brand-assets/tokens.css` のバイト一致を `prebuild` の copy script + jest spec で担保。
- **テスト**: `tokens.css` ↔ `tokens.ts` 同期 spec、`brand/` ↔ `public/brand-assets/` 同期 spec、`/brand` レンダリング spec、Footer に `/brand` リンクが含まれる spec を追加。
- **`brand/source/`**: TOK-84 では touch しない（既存のまま放置、deliverable 対象外）。
- **コンテンツ**: `/brand` の CONCEPT セクション本文は実装時に書く（運用実績の事後言語化）。空欄起こしは避ける。
- **後続**: TOK-84 完了で TOK-81（親）の Done 条件に近づく。
