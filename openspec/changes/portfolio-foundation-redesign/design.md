## Context

本ポートフォリオサイトは Next.js Pages Router の上で動作しており、レガシーなスタイリングスタックとして Chakra UI v2 + Emotion を採用している。アーカイブ済み change `platform-migration-pnpm-tailwind-shadcn` は、Tailwind v3 / `brand/tokens.css` / `cn()` / pnpm 基盤のツールチェーンを整備したが、UI の書き換えには踏み込まなかった。既存ページと共通 layouts はすべて Chakra のまま残し、shadcn/ui は明示的に採用しない判断を下した（primitive は必要になった時点で手書きする方針）。その「必要になった時点」が今である。

TOK-83 は「全ページを書き換え、Chakra / Emotion / Framer Motion を撤去し、`src/theme/theme.ts` を削除して `ChakraProvider` を剥がす」という包括的なタスクの親 issue である。この親タスクを 3 つの OpenSpec change に分割した：

1. **`portfolio-foundation-redesign`（本 change）** — 共通 layouts + primitive ライブラリ。
2. `portfolio-core-pages-redesign` — `home` / `news` List + Detail。
3. `portfolio-remaining-and-cleanup` — `works` / `article` / `service`、および uninstall 全般。

本 change は keystone である。後続のページ書き換え change はここで定義される primitive を消費し、ここで再設計された chrome の中でレンダリングされる。設計を規定する制約は以下：

- 再設計は **フル**（Twilight Blade tokens を前提としたビジュアルリセット）であり、既存デザインの忠実な移植ではない。ユーザーは明示的に「フル再設計」を選択している。
- Chakra レンダリングのページは、自分の番が来るまで動き続けなければならない。`ChakraProvider` と `src/theme/theme.ts` は配線したまま。
- 共通 chrome は全ページをラップするため、`Header` / `Footer` / `BaseLayout` を再設計すると、まだ Chakra で描画されている本体の外側だけ見た目が変わることになる。これは受容する（単一オーナーのポートフォリオであり、リグレッションを気にする顧客はいない）。
- Framer Motion は change 3 で撤去する。本 change では新規の Framer Motion 利用を **増やさない**。新しい chrome のモーションは Tailwind の `transition-*` / `animate-*` utility、または `src/styles/globals.css` 内のカスタム `@keyframes` で表現する。
- `class-variance-authority` も shadcn/ui CLI も、その他の新規スタイリング基盤も導入しない（archive 済み ADR の Decision 4 / 5 に従う）。

## Goals / Non-Goals

**Goals:**

- 後続のページ書き換えが再発明せずに import できる、Tailwind ネイティブな primitive 層（`Button` / `Link` / `Container` / `Section` / `Stack`）を投入する。
- `@chakra-ui/*` と `@emotion/*` からのシンボルを一切 import しない、再設計済みの共通 layouts（`BaseLayout` / `Header` / `Footer` / `Hero` / `Seo`）を投入する。
- `@chakra-ui/*` / `@emotion/*` / `framer-motion` を install したまま、`ChakraProvider` を配線したまま維持し、feature 側 Chakra ページのレンダリングを壊さない。
- brand token の利用規約（`--color-brand-bg` / `--color-brand-fg` / `--color-brand-muted` / `--font-brand-display` など）を、Tailwind テーマ拡張経由で確立・文書化し、後続 change が一貫したやり方で適用できるようにする。
- primitive の API（prop 名、variant の語彙、`asChild` を採用するか否か など）をここで確定し、マージ直後からページ書き換えに着手できる状態にする。

**Non-Goals:**

- `src/features/*` 配下のファイル書き換え（change 2 / 3 の担当）。
- `@chakra-ui/*` / `@emotion/*` / `framer-motion` の uninstall（change 3 の担当）。
- `src/theme/theme.ts` 削除、`_app.tsx` からの `ChakraProvider` 剥がし（change 3 の担当）。
- `src/components/parts/{Card,DisclosableCard,Title}` の移植（呼び出し側の書き換えと同時に自然に移行する）。
- ダークモード切替 UI。`styling-platform` 上で class ベースの `dark` variant はすでに機能しており、サイトは現状ダーク一択のため、トグル UI 化は本 change の対象外。
- 新しい chrome が必要とする範囲を超える、ブレークポイント単位の応答性再設計。Tailwind デフォルトの `sm` / `md` / `lg` / `xl` で十分。

## Decisions

### Decision 1 — primitive の配置は `src/components/parts/`（既存フォルダ、新設しない）

手書き primitive は、既存の `Card` / `DisclosableCard` / `Title` と同居で `src/components/parts/` 配下に置く。各 primitive は自分のフォルダ（`src/components/parts/Button/` など）を持ち、`index.ts` が default export と名前付き型を re-export する。

**代替案:**

- `src/components/ui/`（shadcn の慣習）— 却下。既存の `parts/` 語彙と整合しない。かつ「shadcn/ui を使っている」というミスリーディングなシグナルを発してしまう（使っていない）。
- `src/libs/ui/` — 却下。`libs/` は純粋なユーティリティ（`cn.ts` / `date.ts`）の置き場であり、コンポーネントは `components/` に置くのが規約。

**根拠:** ディレクトリ階層が 1 種類で済み、`CLAUDE.md` の `parts/` 記述（「small reusable pieces」）と合致する。後続書き換えの認知負荷が最小になる。

### Decision 2 — primitive API: プレーンな props、`class-variance-authority` を使わない

primitive は variant 用の prop（`variant`、`size` など）を公開し、値は `cn()` を通じてインラインで解決する：

```tsx
// src/components/parts/Button/Button.tsx（スケッチ）
type ButtonVariant = 'primary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md';
export default function Button({ variant = 'primary', size = 'md', className, ...rest }: Props) {
  return <button className={cn(base, variantClasses[variant], sizeClasses[size], className)} {...rest} />;
}
```

**代替案:**

- `class-variance-authority`（cva）— 却下。archive 済み ADR（Decision 5）「新しいスタイリング依存は増やさず、primitive は手書きする」に従う。
- Tailwind `@apply` を CSS ファイルで書く — 却下。variant マップをコンポーネント内に併置した方が、呼び出し側から追跡しやすい。

**根拠:** 新規依存ゼロ。variant マップは単純に grep 可能。`cn()` 内の `tailwind-merge` が、呼び出し側の `className` によるコンフリクトを解決してくれる。

### Decision 3 — 本 change で投入する primitive は Button / Link / Container / Section / Stack のみ

再設計後の layouts が実際に必要とする primitive だけを揃える。追加の primitive（Card 書き換え、Badge、Tag、Heading など）は、最初に必要とする change が追加する。

**代替案:**

- 先に primitive ライブラリを一通り完成させる — 却下。「タスクが要求しない抽象化は作らない」というプロジェクト原則に反し、本 change が肥大化する。
- Button だけを作る — 却下。Header / Footer のマークアップは Container と Stack を明らかに必要とする。省略すると layouts 内で即席の div 積層が発生する。

**根拠:** 「必要以上の機能を足さない」方針に合致し、change のレビュー性を保てる。

### Decision 4 — `Link` primitive は `next/link` をラップする（生の `<a>` ではなく）

`Link` は `href` と optional な `external` フラグを受け取る。内部リンクは `<NextLink href={...}><a className={styles}>{children}</a></NextLink>` としてレンダリングし、外部リンクは `<a href target="_blank" rel="noopener noreferrer">` としてレンダリングする。スタイリング（フォーカスリング、ホバー下線）は Tailwind クラスを `cn()` で合成する。

**代替案:**

- `next/link` の利用を呼び出し側に任せる — 却下。大半の呼び出し側で同じフォーカス / ホバースタイリングを望むため、wrapper がないと毎回再定義することになる。
- Next 13+ 的に `<Link>` の下に `<a>` を置かない書き方を使う — 却下。本リポジトリは Pages Router で、インストールされている Next のメジャー次第で挙動が異なる。実装時に `package.json` の `next` バージョンを確認し、内側の `<a>` が不要なバージョンであれば落とす。

**根拠:** すべての書き換えページ間で一貫したスタイリングとアクセシビリティ（外部リンクに `rel="noopener noreferrer"`）を担保できる。

### Decision 5 — 共通 layouts は `@chakra-ui/*` / `@emotion/*` の import を停止。それ以外のファイルは引き続き利用可

本 change が触るのは `src/components/layouts/*` のみ。契約は「本 change 後、`src/components/layouts/` 配下で `@chakra-ui` と `@emotion` を grep した結果がゼロ件」である。`src/features/*` 配下、および `_app.tsx` の `ChakraProvider` ラッパーは引き続き Chakra / Emotion を import してよい。

**代替案:**

- 本 change で Chakra を全面的に剥がす — 却下。change 3 の役割であり、ここに含めるとユーザー合意済みの 3 分割が破綻する。
- 利便性優先で layouts 側にも Chakra を残す — 却下。これから撤去するスタックに layouts を結合させ続けることになる。

**根拠:** クリーンな層の境界を引けば、change 3 の Chakra uninstall が発掘作業ではなく機械的な作業になる。

### Decision 6 — brand token の消費パターン: `theme.extend` 経由で CSS 変数を参照する Tailwind utility

コンポーネントは Tailwind utility クラス（例: `bg-brand-bg` / `text-brand-muted` / `font-brand-display`）経由で brand token を参照する。これらは `brand/tokens.css` で宣言された `var(--color-brand-*)` に解決される。`style={{ color: 'var(--color-brand-fg)' }}` のような手書きインラインスタイルは、その token に対応する Tailwind utility が未定義の場合の例外的措置のみに留める。その場合はまず `tailwind.config.ts` を拡張して utility を公開する。

**代替案:**

- 何でもインラインで `var(--color-brand-*)` を書く — 却下。`tailwind-merge` によるクラス衝突解決の恩恵が失われる。
- ハードコードされた hex 値を書く — 却下。`styling-platform` の「token の重複定義なし」要件に違反する。

**根拠:** 真実の源が 1 箇所。既存 `styling-platform` spec と整合する。`cn()` + `tailwind-merge` でクラス衝突を解決可能な状態に保てる。

### Decision 7 — 新しい chrome に Framer Motion を使わない。CSS / Tailwind アニメーションのみ

再設計後の Hero と Header は Tailwind の `transition-*` / `animate-pulse`、必要な箇所では `src/styles/globals.css` 内で宣言された名前付き `@keyframes`（例: `.animate-hero-orb` のように Hero スコープと分かる命名）でアニメーションを表現する。本 change では新しい `framer-motion` の import を一切導入しないため、change 3 は新規利用を巻き戻す必要なく `framer-motion` を uninstall できる。

**代替案:**

- 旧 Hero が Framer Motion を使っていたから新 Hero でも残す — 却下。ユーザーは明示的に「撤去して CSS/Tailwind animate のみに」を選択している。
- 判断を先送りして一時的に Framer import を許容 — 却下。change 3 の負債になる。

**根拠:** ユーザー方針に沿い、change 3 のリグレッションを防げる。

### Decision 8 — `Seo` 再設計: コンポーネント API は保ち、内部は素の JSX + `next/head` に切り替える

`Seo` の現行 API（ページタイトル、description、og 画像）はそのまま保つので、呼び出し側の変更は不要。内部からは Chakra / Emotion を除去し、`<Head>` タグのみをレンダリングする。Tailwind もここでは関与しない（メタデータ専用コンポーネントのため）。

**代替案:**

- 各ページで `next/head` を直接使うよう書き換える — 却下。無意味な churn。薄い wrapper で十分。
- `BaseLayout` に統合する — 却下。ページ毎にメタデータを上書きしたいケースがある。

**根拠:** ページ側の呼び出し変更を最小化しつつ、layouts 層から Chakra / Emotion をきれいに剥がせる。

## Risks / Trade-offs

- **移行期間中の見た目の不整合** → Chakra 製のページ本体が、再設計済みの Twilight Blade chrome の中に当面入る。Mitigation: change 2 / 3 を直後に続けて実行する。ユーザーは単一オーナーポートフォリオとしてこの過渡状態を受容済み。
- **primitive API の本 change と後続ページ間でのドリフト** → ここで API 形状を固定するが、ページ書き換え中に不足する prop が見つかる可能性がある。Mitigation: 後続 change は primitive を拡張してよい（variant / prop 追加）。ただし明示的な合意なく fork したり公開 API をリネームしてはならない。
- **Tailwind `preflight` と Chakra reset のコンフリクト拡大** → layouts から Chakra を剥がすことで、境界での Tailwind utility が Chakra reset 済みの子要素と近接する場面が増える。Mitigation: `styling-platform` がすでに対応方針を定めている。実装中に境界で新たな reset リグレッションが出ないかを確認する。
- **`Link` における `next/link` API ミスマッチ** → インストール済み Next バージョンが子 `<a>` を要求しない場合、Decision 4 のスケッチを修正する必要がある。Mitigation: 実装タスクで最初に Next メジャーを確認して調整する。
- **Hero モーションのリグレッション** → Framer Motion を外すと旧 Hero アニメの「質感」が失われるかもしれない。Mitigation: そもそも再設計は忠実移植ではなく新規デザイン。特定のモーションが重要ならば CSS keyframes で再実装する。

## Migration Plan

1. primitive（`Button` / `Link` / `Container` / `Section` / `Stack`）を先行投入する。`@chakra-ui/*` / `@emotion/*` を import しない。ユニットテストを併置する。
2. `Seo` を書き換える（最小・メタデータ専用で慣らし運転として最適）。
3. `BaseLayout` → `Header` → `Footer` → `Hero` の順に書き換える。各ステップ後に `pnpm lint && pnpm test && pnpm build` がグリーンである必要がある。
4. 5 つすべての layouts が書き終わった時点で、`grep -R '@chakra-ui\|@emotion' src/components/layouts` が空であることを最終確認する。
5. ロールバックスクリプトは不要。マージコミットの単一 revert で元の chrome に戻せる。

## Open Questions

- 再設計後の `Header` にテーマ切替 UI を入れるか？ 現状の前提: 入れない。誰かが要望するまで保留。class ベースの `dark` モードはトグル UI なしで機能しており、本サイトは現状ダーク一択のため不要。
- 新しい `Hero` は、既存のモバイル / デスクトップ分岐を越える応答性再設計を必要とするか？ Hero 実装時に判断する。必要かつ自明でない場合は、本 change を肥大化させず、フォローアップ issue にスピンアウトする。
- Storybook や primitives プレビューページ（`/dev/primitives` など）を用意して variant を視覚的に監査するか？ 現時点の前提: 不要。layouts と後続 3 change でほぼすべての variant が実戦投入されるため、専用プレビューの費用対効果が低い。
