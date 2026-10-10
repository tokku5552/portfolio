## MODIFIED Requirements

### Requirement: primitive は `src/components/parts/<Name>/` 配下に手書きで配置する

Twilight Blade primitive コンポーネント（Button / Link / Container / Eyebrow / Orb / GridOverlay / ParticleField）は `src/components/parts/<Name>/` 配下にそれぞれ配置しなければならない（MUST）。各フォルダには実装ファイルと、default export と公開型を re-export する `index.ts` を含まなければならない（MUST）。`class-variance-authority`、`shadcn-ui`、`@chakra-ui/*`、`@emotion/*`、`framer-motion` を import してはならない（MUST NOT）。

#### Scenario: primitive フォルダの構成

- **WHEN** レビュアーが `src/components/parts/` を確認したとき
- **THEN** Button / Link / Container / Eyebrow / Orb / GridOverlay / ParticleField それぞれが独立したフォルダとして存在し、実装ファイルと `index.ts` を含む

#### Scenario: primitive にレガシー import が存在しない

- **WHEN** レビュアーが `grep -R "@chakra-ui\|@emotion\|framer-motion\|class-variance-authority\|shadcn" src/components/parts/{Button,Link,Container,Eyebrow,Orb,GridOverlay,ParticleField}/` を実行したとき
- **THEN** 検索結果はゼロ件である

## ADDED Requirements

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
