## 1. 方向性の決定

- [x] 1.1 A〜D（液体状の Orb / オーロラ / パーティクル / ブレード）のプロトタイプを作り、見比べて C（パーティクル）に決める
- [x] 1.2 スクロール時の動き（ほどけて散る）、明るさ、モバイルでの配置を決める
- [x] 1.3 ページ全体に広げ、セクションごとに形を変える方針と、Hero 以外を控えめにする強さを決める

## 2. ParticleField primitive

- [x] 2.1 `src/components/parts/ParticleField/shaders.ts` に、5 つの形（球・波形・格子・雨・リング）とブレンド・散り方・強さ・端のフェードを持つ頂点シェーダと、varying だけを受け取るフラグメントシェーダを書く
- [x] 2.2 `renderer.ts` で WebGL コンテキストの取得（`failIfMajorPerformanceCaveat`）、プログラムの構築、`brandTokens` から uniform への色の受け渡し、resize / draw / dispose を実装する
- [x] 2.3 `stage.ts` に、スクロール位置から形の番号を出す `computeStage` を純関数として実装する
- [x] 2.4 `ParticleField.tsx` で、absolute の層と sticky の canvas（`h-screen h-lvh`）、アンカーの測り直し（canvas の層・コンテンツ・body の ResizeObserver）、開いた直後のスナップ、reduced-motion、コンテキスト喪失時の停止、`onActiveChange` を実装する
- [x] 2.5 `index.ts` と `src/components/parts/index.ts` から export する

## 3. トップページへの組み込み

- [x] 3.1 `Home.page.tsx` で、コンテンツを `div.relative` で包み、`ParticleField` と `relative z-[1]` のコンテンツを並べる
- [x] 3.2 `Home.page.tsx` に `particleStages`（セクション id と形の番号の対応表）を定義する
- [x] 3.3 `TwilightHero.tsx` に `id="hero"` を付け、SSR に `Orb` を含めたうえで `hideOrb` で `invisible opacity-0` にする

## 4. ブランドとドキュメント

- [x] 4.1 `brand/brand.md` を改訂し、`ParticleField` を「アクセントは 1 画面に 1 つ」の唯一の例外として明記する。ドット模様の背景のルールで許可し、部品一覧に加える
- [x] 4.2 `src/features/brand/data/rules.ts` を brand.md に合わせる
- [x] 4.3 `CLAUDE.md` の部品一覧とアニメーションの記述を更新する

## 5. テスト

- [x] 5.1 `stage.spec.ts`: 形を保つ区間、切り替え範囲の端、同じ形が続く区間、アンカーのない区間、並び順に依存しないことを検証する
- [x] 5.2 `ParticleField.spec.tsx`: WebGL がないときに canvas を出さず `onActiveChange` を呼ばないこと、層の属性（aria-hidden / pointer-events-none / absolute / sticky）を検証する
- [x] 5.3 `TwilightHero.spec.tsx`: SSR の HTML に Orb が含まれること、`hideOrb` で Orb が隠れることを検証する
- [x] 5.4 `Home.page.spec.tsx`: `particleStages` の id がすべてトップページに存在することを検証する

## 6. 仕上げ・検証

- [x] 6.1 `pnpm lint` / `pnpm test` / `pnpm build` が通ることを確認する
- [x] 6.2 1440px 幅で全セクションとページ最下部（フッターに重ならないこと）、375px 幅で Hero・Podcast・Services・Contact を目視確認する
- [x] 6.3 `/#works` を直接開いたとき、最初から格子が出ることを確認する
- [x] 6.4 reduced-motion を Playwright で有効にして、形が補間なしで切り替わることを確認する
- [x] 6.5 Fable のレビューで挙がった指摘（GLSL の未定義動作、狭い画面の判定の単位、測り直しの漏れ、動いていなかった IntersectionObserver、復帰処理のない preventDefault）を直す
- [x] 6.6 `openspec validate home-particle-field` が通ることを確認する

## 7. archive 時の手作業

`openspec archive` は Requirements だけを本体 spec に反映し、`## Purpose` は更新しない。archive のときに次を手で直す。

- [x] 7.1 `openspec/specs/landing-page/spec.md` の Purpose にある「Hero セクションのコンテンツは現行プロフィール（`globalDescription`）由来とし」を、「サイト所有者の現在の活動に基づくものとし」に直す（Hero の肩書きの要件の書き直しに合わせる）。あわせて、トップページ背面のパーティクル背景に触れる
- [x] 7.2 `openspec/specs/ui-primitives/spec.md` の Purpose にある primitive の一覧（Button / Link / Container / Eyebrow / Orb / GridOverlay）に `ParticleField` を加える
