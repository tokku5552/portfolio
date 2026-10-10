## Why

トップページの Hero は CSS の `Orb`（ぼかした radial-gradient）だけで構成されていて、第一印象が弱い（TOK-416）。WebGL のパーティクルで Hero に動きを持たせ、さらに同じ粒がスクロールに合わせてセクションごとに形を変えることで、ページ全体を通した一貫した体験にしたい。

なお、この change は PR #341 で実装を先に進めたあと、仕様を後から記録するために作成した。

## What Changes

- トップページ全体の背面に、WebGL のパーティクル背景 `ParticleField` を 1 枚だけ描画する。素の WebGL と自作シェーダで実装し、依存パッケージは追加しない。
- 同じ粒が、スクロール位置に応じてセクションごとの形に組み替わる（Hero: 球 / Podcast・YouTube: 波形 / Services・Works: 格子 / Articles: 縦に流れる雨 / Contact: リング）。切り替えの途中では一度ほどけて散る。
- アクセントは Hero の形だけとし、他のセクションの形は暗く抑えて、カードや本文と競わせない。
- Hero の CSS `Orb` は、最初の HTML（SSR）に含めたまま残す。WebGL の描画が始まったら隠し、WebGL が使えないときの代替表示として使う。
- 縮退: WebGL が使えない・ソフトウェア描画・コンテキスト喪失のときは描画しない（Orb が残る）。`prefers-reduced-motion` では時間を止め、形は補間せずに切り替える。
- `brand/brand.md` と /brand ページのルール表示を改訂し、`ParticleField` を「アクセントは 1 画面に 1 つ」の唯一の例外として明記する。

## Capabilities

### New Capabilities

<!-- なし。既存 capability の要件変更として扱う。 -->

### Modified Capabilities

- `landing-page`: Hero の「`Orb` を背景レイヤーとして描画しなければならない」を、「最初の HTML に `Orb` を含め、WebGL のパーティクル背景が動いている間は隠す」へ変更する。あわせて、トップページ背面のパーティクル背景とセクションごとの形の要件を追加する。同じ要件にある肩書きの文面は、実装（"Engineering Manager" と "Music Producer"）と矛盾していたので、「所有者の現在の活動に対応する肩書き」へ書き直す。
- `ui-primitives`: primitive の一覧に `ParticleField` を加え、その振る舞い（縮退・reduced-motion・ブランドトークンの使い方・コンテンツとの重なり）を要件として追加する。

## Impact

- **コード**:
  - `src/components/parts/ParticleField/`（新規）— `ParticleField.tsx` / `renderer.ts` / `shaders.ts` / `stage.ts` と spec
  - `src/features/home/Home.page.tsx` — `ParticleField` の配置と、セクション id と形の対応表（`particleStages`）
  - `src/features/home/components/TwilightHero.tsx` — `id="hero"` の付与、`hideOrb` で Orb を隠す
  - `src/components/parts/index.ts` — export の追加
- **ブランド**: `brand/brand.md`（jsDelivr 経由で外部配布される）、`src/features/brand/data/rules.ts`
- **ドキュメント**: `CLAUDE.md` の部品一覧とアニメーションの記述
- **依存**: 追加なし
- **パフォーマンス**: トップページ表示中は描画ループが回り続ける（バックグラウンドタブではブラウザが止める）。デスクトップ 14,000 粒・モバイル 6,000 粒。
