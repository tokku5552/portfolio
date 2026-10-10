# ui-primitives Specification

## Purpose

Twilight Blade デザインシステムの Tailwind primitive コンポーネント群（Button / Link / Container / Eyebrow / Orb / GridOverlay）と、素の WebGL で描くパーティクル背景（ParticleField）を `src/components/parts/<Name>/` 配下に手書きで提供し、`/` landing と `/articles` などすべてのページから合成可能にする。`class-variance-authority` や `shadcn/ui` を採用せず、`cn()` + brand tokens のみで実装する単一の SSoT。

## Requirements

### Requirement: primitive は `src/components/parts/<Name>/` 配下に手書きで配置する

Twilight Blade primitive コンポーネント（Button / Link / Container / Eyebrow / Orb / GridOverlay / ParticleField）は `src/components/parts/<Name>/` 配下にそれぞれ配置しなければならない（MUST）。各フォルダには実装ファイルと、default export と公開型を re-export する `index.ts` を含まなければならない（MUST）。`class-variance-authority`、`shadcn-ui`、`@chakra-ui/*`、`@emotion/*`、`framer-motion` を import してはならない（MUST NOT）。

#### Scenario: primitive フォルダの構成

- **WHEN** レビュアーが `src/components/parts/` を確認したとき
- **THEN** Button / Link / Container / Eyebrow / Orb / GridOverlay / ParticleField それぞれが独立したフォルダとして存在し、実装ファイルと `index.ts` を含む

#### Scenario: primitive にレガシー import が存在しない

- **WHEN** レビュアーが `grep -R "@chakra-ui\|@emotion\|framer-motion\|class-variance-authority\|shadcn" src/components/parts/{Button,Link,Container,Eyebrow,Orb,GridOverlay,ParticleField}/` を実行したとき
- **THEN** 検索結果はゼロ件である

### Requirement: primitive はすべて `cn()` + brand token utility でスタイリングする

Button / Link / Container / Eyebrow / Orb / GridOverlay / ParticleField は、すべてのスタイリングを `src/libs/cn.ts` の `cn(...)` で合成された Tailwind utility クラス、もしくは `src/styles/globals.css` に宣言された brand 用クラス（Orb / GridOverlay の keyframes 参照など）で表現しなければならない（MUST）。色・タイポグラフィは brand token（`var(--color-brand-*)` / `var(--font-brand-*)` に解決される Tailwind utility）を参照しなければならない（MUST）。ハードコード hex リテラルや生の `style={{}}` を使用してはならない（MUST NOT）。ただし Orb の radial gradient のように複数 token を複合する必要がある場合に限り、`src/styles/globals.css` 内のクラスでまとめて宣言することは許容される。ParticleField のように WebGL のシェーダで色を使う場合は、`brand/tokens.ts` の `brandTokens.color` から変換した値を uniform として渡さなければならない（MUST）。

#### Scenario: primitive がブランドトークン utility を使う

- **WHEN** レビュアーが primitive 内のスタイリング箇所を `#[0-9a-fA-F]{3,8}\b` でハードコード hex 検索したとき
- **THEN** 検索結果はゼロ件である（Orb 等の複合グラデーションを `globals.css` に集約する場合もハードコードを許容しない。brand token を参照する。ParticleField のシェーダに渡す色も `brandTokens.color` から変換する）

### Requirement: Button primitive は primary / ghost の 2 variant を提供する

`Button` は `src/components/parts/Button/` に存在し、`variant: 'primary' | 'ghost'` と `size: 'md'`、および標準 `<button>` prop を受け取らなければならない（MUST）。`primary` は白背景 + 黒文字 + hover 時に indigo→violet→pink グラデーションが ::before で浮上する Hero.html 準拠の挙動を持たなければならない（MUST）。`ghost` は transparent 背景 + `var(--color-brand-border-strong)` の 1px 枠 + mono font + hover 時 `rgba(255,255,255,0.04)` 背景でなければならない（MUST）。デフォルトは `variant='primary'` / `size='md'` / `type='button'` でなければならない（MUST）。

#### Scenario: デフォルト Button が primary で描画される

- **WHEN** 呼び出し側が `<Button>View my work</Button>` をレンダリングしたとき
- **THEN** 描画された DOM は `<button type="button">` で、primary variant に対応するクラスセットを持つ

#### Scenario: ghost Button が枠付きで描画される

- **WHEN** 呼び出し側が `<Button variant="ghost">Listen to the podcast</Button>` をレンダリングしたとき
- **THEN** 描画されたクラスは transparent + 枠線 + mono font を持ち、primary variant 特有のクラス（白背景等）を含まない

### Requirement: Link primitive は `next/link` と外部リンクを切り替える

`Link` は `src/components/parts/Link/` に存在し、`href: string` と optional な `external?: boolean` を受け取らなければならない（MUST）。`external` が falsy のときは `next/link` の `Link` コンポーネント経由で描画しなければならない（MUST）。`external` が truthy のときは `<a href target="_blank" rel="noopener noreferrer">` を描画しなければならない（MUST）。スタイリングは両分岐で共通の `cn()` 合成を通さなければならない（MUST）。

#### Scenario: 内部リンクが next/link 経由で描画される

- **WHEN** 呼び出し側が `<Link href="/news">News</Link>` をレンダリングしたとき
- **THEN** 描画ツリーは `next/link` を使用し、`target="_blank"` 属性を含まない

#### Scenario: 外部リンクがセキュリティ rel 付きで描画される

- **WHEN** 呼び出し側が `<Link href="https://example.com" external>Example</Link>` をレンダリングしたとき
- **THEN** 描画 DOM は `<a href="https://example.com" target="_blank" rel="noopener noreferrer">` である

### Requirement: Container primitive は中央寄せと水平ガターを提供する

`Container` は `src/components/parts/Container/` に存在し、単一の `<div>`（または呼び出し側の指定要素）に `mx-auto` + max-width 制約 + 水平 padding を適用しなければならない（MUST）。Hero.html の `max-width: 1440px; margin: 0 auto` と `.nav.top { padding: 28px 48px }` / `.hero { padding: 120px 48px 96px }` の語彙に準拠した Tailwind utility（例: `max-w-[1440px]` + `px-6 md:px-12`）で実現しなければならない（MUST）。`className` prop を `cn()` 経由で forward しなければならない（MUST）。

#### Scenario: Container が中央寄せされる

- **WHEN** 呼び出し側が `<Container>content</Container>` をレンダリングしたとき
- **THEN** 描画 DOM は `mx-auto` と max-width 制約を Tailwind utility で持つ

### Requirement: Eyebrow primitive は mono font + uppercase + muted のラベルを提供する

`Eyebrow` は `src/components/parts/Eyebrow/` に存在し、小文字 12px 相当の mono font + uppercase + `tracking-widest` + `var(--color-brand-muted)` で描画しなければならない（MUST）。`withPulse?: boolean` prop を受け取り、truthy のときは Hero.html の `.pulse` ドット（violet 6px 円 + box-shadow ring アニメーション）を `children` の左に描画しなければならない（MUST）。アニメーションは `src/styles/globals.css` に `@keyframes eyebrow-pulse` として宣言し、primitive 側はそれを参照するクラス名を使用しなければならない（MUST）。

#### Scenario: pulse なしの Eyebrow

- **WHEN** 呼び出し側が `<Eyebrow>Latest news</Eyebrow>` をレンダリングしたとき
- **THEN** 描画結果は mono font + uppercase + muted 色のテキストを含み、pulse ドット要素を含まない

#### Scenario: pulse 付きの Eyebrow

- **WHEN** 呼び出し側が `<Eyebrow withPulse>Portfolio · 2026</Eyebrow>` をレンダリングしたとき
- **THEN** 描画結果は pulse 用クラスを持つドット要素を children の左に含む

### Requirement: Orb primitive は Hero.html 準拠の光源をレンダリングする

`Orb` は `src/components/parts/Orb/` に存在し、Hero.html の `.orb`（`--color-brand-orb-indigo/violet/pink` を用いた複合 radial gradient + blur + float アニメーション）を 1 つの要素として描画しなければならない（MUST）。`position: 'tr' | 'bl' | 'center'` prop を受け取り、Hero.html の `.orb-wrap[data-pos]` に準拠した位置に配置しなければならない（MUST）。`pointer-events: none` で子要素のクリックを妨げてはならない（MUST NOT）。アニメーション keyframe は `src/styles/globals.css` に `@keyframes orb-float` として宣言しなければならない（MUST）。

#### Scenario: Orb のポジション指定

- **WHEN** 呼び出し側が `<Orb position="tr" />` をレンダリングしたとき
- **THEN** 描画要素は top right 寄りに配置される Tailwind utility か brand スコープクラスを持つ

### Requirement: GridOverlay primitive は 12 列グリッド overlay を提供する

`GridOverlay` は `src/components/parts/GridOverlay/` に存在し、Hero.html の `.grid-overlay`（`var(--color-brand-border)` で 12 列 + 水平線のパターン）を描画しなければならない（MUST）。`visible?: boolean` prop を受け取り、falsy のときは不可視でなければならない（MUST）。デフォルトは `visible=false` でなければならない（MUST）。`pointer-events: none` でクリックを妨げてはならない（MUST NOT）。

#### Scenario: デフォルトは不可視

- **WHEN** 呼び出し側が `<GridOverlay />` をレンダリングしたとき
- **THEN** 描画要素は opacity 0 または display none で、ユーザーに見えない

#### Scenario: visible 指定で表示される

- **WHEN** 呼び出し側が `<GridOverlay visible />` をレンダリングしたとき
- **THEN** 描画要素は 12 列 + 水平線のパターンが `var(--color-brand-border)` 色で見える

### Requirement: ParticleField primitive は素の WebGL でパーティクル背景を描画する

`ParticleField` は `src/components/parts/ParticleField/` に存在し、素の WebGL（WebGL1 / GLSL ES 1.00）と自作シェーダでパーティクルを描画しなければならない（MUST）。three.js などの 3D ライブラリや JS アニメーションライブラリを import してはならない（MUST NOT）。

色は `brand/tokens.ts` の `brandTokens.color`（`bg` / `orbIndigo` / `orbViolet` / `orbPink`）から変換してシェーダの uniform に渡さなければならず、新しい色リテラルを持ち込んではならない（MUST NOT）。グラデーションは indigo → violet → pink の順だけを使わなければならない（MUST）。

`ParticleField` は `stages`（セクション `id` と形の番号の配列）と、WebGL の描画状態を通知する `onActiveChange` を受け取らなければならない（MUST）。描画領域は親要素と同じ大きさの `absolute` な層で、その中に画面の高さの `sticky` な canvas を置かなければならない（MUST）。高さは `lvh` を使い、未対応のブラウザでは `100vh` で代用しなければならない（MUST）。層は `aria-hidden="true"` かつ `pointer-events: none` でなければならない（MUST）。

次の場合、`ParticleField` は canvas を描画せず、`onActiveChange(true)` を呼んではならない（MUST NOT）。

- WebGL コンテキストを取得できない
- ソフトウェア描画など、性能上の大きな制約がある（`failIfMajorPerformanceCaveat`）
- シェーダのコンパイルまたはリンクに失敗した

描画中に WebGL コンテキストを失った場合は、描画ループを止め、canvas を外し、`onActiveChange(false)` を呼ばなければならない（MUST）。コンテキストの復帰は行わない。

スクロール位置から形の番号を決める計算は、副作用のない関数（`stage.ts` の `computeStage`）として実装し、単体テストを持たなければならない（MUST）。

#### Scenario: WebGL が使えないときは何も描画しない

- **WHEN** `HTMLCanvasElement.getContext` が null を返す環境で `ParticleField` を描画したとき
- **THEN** canvas は描画されず、`onActiveChange` は呼ばれない

#### Scenario: 装飾の層として扱われる

- **WHEN** `ParticleField` の外側の要素を確認したとき
- **THEN** `aria-hidden="true"` と `pointer-events-none` と `absolute` を持ち、その最初の子が `sticky` である

#### Scenario: 形の番号の計算

- **WHEN** `computeStage` に、上端の位置と形の番号を持つアンカーの配列、スクロール位置、ビューポートの高さを渡したとき
- **THEN** 次のセクションの上端がビューポートの 0.55 の位置に達するまでは直前の形の番号を返し、そこから 0.3 ビューポート分スクロールする間に次の形の番号へ連続的に移り、アンカーの並び順には依存しない

#### Scenario: ブランドトークンだけを使う

- **WHEN** レビュアーが `src/components/parts/ParticleField/` を `#[0-9a-fA-F]{3,8}\b` でハードコード hex 検索したとき
- **THEN** 検索結果はゼロ件である
