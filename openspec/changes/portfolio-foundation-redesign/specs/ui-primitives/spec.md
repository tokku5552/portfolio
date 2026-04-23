## ADDED Requirements

### Requirement: primitive コンポーネントは `src/components/parts/` 配下に配置する

本リポジトリは、手書きの Tailwind primitive コンポーネント（Button / Link / Container / Section / Stack）を `src/components/parts/<Name>/` 配下に同居させなければならない（MUST）。各フォルダは `<Name>.tsx` 実装と、default export と公開型を re-export する `index.ts` を含まなければならない（MUST）。primitive を `src/components/ui/`（shadcn/ui の慣習であり本プロジェクトは明示的に採用していない）に置いてはならない（MUST NOT）。また `src/libs/`（純粋なユーティリティ専用）に置いてはならない（MUST NOT）。

#### Scenario: primitive のフォルダ構成

- **WHEN** レビュアーが `src/components/parts/` を開いたとき
- **THEN** 各新規 primitive はそれぞれ独立したフォルダ（例: `Button/` / `Link/` / `Container/` / `Section/` / `Stack/`）として現れ、`index.ts` と `<Name>.tsx` ファイルを含む

#### Scenario: primitive がフォルダ名で import できる

- **WHEN** コンポーネントが `import { Button } from '@/components/parts/Button'` と書いたとき
- **THEN** import が解決し、primitive の default export が返る

### Requirement: primitive は `cn()` + brand tokens でクラスを合成する

すべての primitive は、スタイリングを `src/libs/cn.ts` の `cn(...)` ヘルパーで合成した Tailwind utility クラスのみを用いて適用しなければならない（MUST）。色、タイポグラフィ、サーフェス色は、ハードコードされた hex 値やインラインスタイルではなく、`brand/tokens.css` で宣言された brand token（`var(--color-brand-*)` / `var(--font-brand-*)` に解決される Tailwind utility 経由）を参照しなければならない（MUST）。ただし、その token に対応する Tailwind utility が未定義の場合に限り、コンポーネント追加と同時に `tailwind.config.ts` の `theme.extend` を拡張して当該 token を utility として公開しなければならない（MUST）。

#### Scenario: primitive が brand token utility を使う

- **WHEN** レビュアーが `src/components/parts/<primitive>/<Name>.tsx` から色・タイポグラフィのスタイリングを grep したとき
- **THEN** ヒットするのは Tailwind utility（例: `bg-brand-bg` / `text-brand-fg` / `font-brand-display`）であり、ハードコードされた hex リテラルや生の `style={{ color: '#...' }}` ではない

#### Scenario: primitive が `className` を `cn()` 経由で forward する

- **WHEN** 呼び出し側が primitive 内部の utility と衝突する `className`（例: primitive が `px-2` を当てているところに `className="px-4"`）を渡したとき
- **THEN** レンダリング結果の DOM ノードは呼び出し側の utility（`cn()` 内の `tailwind-merge` による）を持ち、primitive 側の衝突する utility は破棄される

### Requirement: Button primitive は variant / size API を公開する

`Button` コンポーネントは `src/components/parts/Button/` に存在し、`variant`（`'primary' | 'ghost' | 'outline'`）と `size`（`'sm' | 'md'`）の prop を受け取らなければならない（MUST）。その他の標準 `<button>` prop をすべて forward し、`variant` のデフォルトは `'primary'`、`size` のデフォルトは `'md'`、`type` が明示的に上書きされない限り native `<button type="button">` を描画しなければならない（MUST）。コンポーネントは `class-variance-authority` などの variant ライブラリに依存してはならない（MUST NOT）。variant からクラスへの解決は `cn()` 経由でインラインに実装しなければならない（MUST）。

#### Scenario: デフォルトの Button が primary variant / md size で描画される

- **WHEN** 呼び出し側が `<Button>Save</Button>` をレンダリングしたとき
- **THEN** 出力される DOM 要素は `<button type="button">` で、primary + md のクラスセットを持つ

#### Scenario: variant prop で視覚的なクラスセットが変わる

- **WHEN** 呼び出し側が `<Button variant="ghost">Cancel</Button>` をレンダリングしたとき
- **THEN** 描画されたクラスは ghost variant に対応し、primary variant のクラスを含まない

### Requirement: Link primitive は `next/link` をラップし、外部リンクを扱う

`Link` コンポーネントは `src/components/parts/Link/` に存在し、`href: string` と optional な `external?: boolean` を受け取らなければならない（MUST）。`external` が falsy のときは `next/link` の `Link` コンポーネント経由でレンダリングしなければならない（MUST）。`external` が truthy のときは native `<a href={href} target="_blank" rel="noopener noreferrer">` をレンダリングしなければならない（MUST）。スタイリングは `cn()` + brand token utility で両分岐にまたがって共有しなければならない（MUST）。コンポーネントは、呼び出し側から渡された `className` で上書きできない独自のアンカースタイリングを導入してはならない（MUST NOT）。

#### Scenario: 内部リンクが next/link 経由で描画される

- **WHEN** 呼び出し側が `<Link href="/news">News</Link>` をレンダリングしたとき
- **THEN** レンダリングツリーは `/news` を指す `next/link` の `<Link>` ラッパーを含み、`target="_blank"` 属性を含まない

#### Scenario: 外部リンクがセキュリティ rel 付きで素のアンカーとして描画される

- **WHEN** 呼び出し側が `<Link href="https://example.com" external>External</Link>` をレンダリングしたとき
- **THEN** 出力 DOM は `<a href="https://example.com" target="_blank" rel="noopener noreferrer">` である

### Requirement: layout primitive — Container / Section / Stack

`Container` / `Section` / `Stack` コンポーネントは `src/components/parts/` 配下に存在し、それぞれ単一のラッパー要素をレンダリングしなければならない（意味的タグが適切な場合を除き `<div>`。例: `Section` は `<section>` をレンダリングしなければならない）。`Container` はコンテンツを中央寄せし、一貫した水平ガターを適用しなければならない（MUST）。`Section` は brand token のスペーシングを用いて一貫した縦方向リズムを適用しなければならない（MUST）。`Stack` は Tailwind の flex utility で子要素を並べ、Tailwind の `gap-*` スケールに対応する値（例: `gap="4"` → `gap-4`）をとる `gap` prop を受け取らなければならない（MUST）。3 つすべての primitive は `className` prop を受け取り、`cn()` 経由で forward しなければならない（MUST）。

#### Scenario: Container がコンテンツを中央寄せする

- **WHEN** 呼び出し側が `<Container>content</Container>` をレンダリングしたとき
- **THEN** レンダリングされた DOM は Tailwind utility 経由で `mx-auto` と max-width 制約を持つ

#### Scenario: Section は section タグを用いる

- **WHEN** 呼び出し側が `<Section>...</Section>` をレンダリングしたとき
- **THEN** レンダリングされた DOM ノードは `<section>` 要素である（`<div>` ではない）

#### Scenario: Stack の gap prop が Tailwind gap utility にマップされる

- **WHEN** 呼び出し側が `<Stack gap="4">...</Stack>` をレンダリングしたとき
- **THEN** レンダリングされたコンテナは Tailwind の `gap-4` utility を持つ

### Requirement: primitive は Chakra UI / Emotion / Framer Motion / cva を import しない

`src/components/parts/{Button,Link,Container,Section,Stack}/` 配下のすべてのファイルは、`@chakra-ui/*` / `@emotion/*` / `framer-motion` / `class-variance-authority` / `shadcn-ui` からいかなるシンボルも import してはならない（MUST NOT）。これにより primitive 層は、change 3 で撤去されるスタックから独立した状態となる。

#### Scenario: primitive にレガシー import が存在しない

- **WHEN** レビュアーが `src/components/parts/{Button,Link,Container,Section,Stack}/` を対象に `@chakra-ui` / `@emotion` / `framer-motion` / `class-variance-authority` / `shadcn` を grep したとき
- **THEN** 検索結果はゼロ件である
