## Why

TOK-83 の完了で Twilight Blade デザイン語彙は実サイトに全面適用された。次の段階は、AI（Claude Code / Cursor / Codex 等の IDE AI、Claude.ai / ChatGPT 等の chat AI、Gamma 等のスライド AI）に Twilight Blade を **コピペ可能 / fetch 可能 / IDE 自動読み込み可能** な形で渡せるようにし、人間に対しては「ブランドが整っている」signal を与える `/brand` ページを公開すること。

ただし「ブランドガイド = manifesto + AI 命令ファイル + README + 配布物」のような Stripe / Linear 規模の体裁は不要。ユースケース棚卸しの結果：

- AI 用の clean な spec として **`brand/brand.md` を 1 ファイル用意する**（chat AI への paste / URL fetch で活きる）
- IDE AI（Claude Code 等）には repo root の既存 `CLAUDE.md` から `brand/brand.md` を参照させる
- `brand/CLAUDE.md` / `brand/README.md` は **作らない**（root CLAUDE.md と用途完全重複）
- **`public/brand-assets/` ディレクトリは作らない** — `brand/` 配下のファイルは GitHub raw URL や jsdelivr CDN 経由で十分配信できる。同期スクリプトやバイト一致テスト等の運用コストを払う価値が無い
- OGP 画像のみ Next.js の static 配信制約から `public/brand-og.png`（トップレベル）に置く
- npm publish / semver / Style Dictionary は対象外
- `brand/source/twilight-blade-v1/Hero.html` は TOK-83 以前の歴史的ハンドオフ資産として放置（deliverable 対象外）

## What Changes

- **新規（SSoT）**:
  - `brand/tokens.ts`: `brand/tokens.css` と同期した TypeScript 型付きトークン。`/brand` の TOKENS セクションが SSoT 駆動で swatch を描画するための typed mirror
  - `brand/brand.md`: AI（chat AI / 画像 AI / スライド AI 等）に paste / URL fetch で渡すための clean spec。トークン値、思想、DO / DON'T、`/brand` への参照リンクを単一ファイルにまとめる
- **新規（公開ページ）**: `/brand` を 6 セクション（HERO / CONCEPT / TOKENS / IN USE / ASSETS / COLOPHON）で公開。ASSETS セクションは `brand/tokens.css` / `brand/brand.md` への外部リンク（GitHub raw URL または jsdelivr CDN URL）を提供
- **新規（OGP）**: `/brand` 用 OGP 画像を `public/brand-og.png` に配置し、`Seo` 経由で配信
- **変更（`page-layout`）**: Footer に `/brand` への導線を 1 件追加。`/brand` でも他ルートと同一の共通 chrome がレンダリングされる
- **変更（root `CLAUDE.md`）**: "Visual Conventions" 節を 1 段落で追記し、`brand/brand.md` を AI rule の単一 SoT として参照する
- **品質要件**: WCAG AA（コントラスト比 4.5:1 以上）と 768px 以下 1 カラム対応

## Capabilities

### New Capabilities

- `brand-guidelines`: `brand/` SSoT（`tokens.css` 既存 + `tokens.ts` 新規 + `brand.md` 新規）+ `/brand` ルート + OGP 画像 + root `CLAUDE.md` の AI ルール拡張を一体として規定するブランド公開ガイド capability。`tokens.css` ↔ `tokens.ts` 同期、6 セクション構成、ASSETS セクションの外部リンク、WCAG AA / 768px 1 カラム要件、AI 向けルール統合をここで担保する

### Modified Capabilities

- `page-layout`: Footer に `/brand` 導線を追加し、`/brand` ルートでも共通 chrome がレンダリングされる要件を加える

## Impact

- **新規ディレクトリ / ファイル**:
  - `brand/tokens.ts`
  - `brand/brand.md`
  - `src/features/brand/`（`Brand.page.tsx` + 6 section component + `data/` 任意）
  - `src/pages/brand.tsx`
  - `public/brand-og.png`
- **変更ファイル**: `src/components/layouts/Footer/`（リンク追加）、`CLAUDE.md`（"Visual Conventions" 節追記）
- **依存**: 追加なし。既存 Tailwind + brand token + 既存 primitive のみ
- **配布**: `brand/` 配下の SSoT は **公開 GitHub repo の raw URL / jsdelivr CDN を介して配信**。`public/brand-assets/` 配下のミラーは **作らない**（同期スクリプト / バイト一致テスト不要）
- **テスト**: `tokens.css` ↔ `tokens.ts` 同期 spec、`/brand` レンダリング spec、Footer に `/brand` リンクが含まれる spec、`brand/brand.md` に必須セクションが揃っているかの構造 spec を追加
- **`brand/source/`**: TOK-84 では touch しない（既存のまま放置、deliverable 対象外）
- **コンテンツ**: `brand/brand.md` および `/brand` の CONCEPT セクション本文は実装時に書く（運用実績の事後言語化）。両者は同じ思想を別フォーマットで表現するが、自動同期は要件としない（drift は手動メンテで許容）
- **後続**: TOK-84 完了で TOK-81（親）の Done 条件に近づく
