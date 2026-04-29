## ADDED Requirements

### Requirement: Footer に `/brand` への導線が存在する

Footer は `/brand` ルートへ遷移するリンクを少なくとも 1 件含まなければならない（MUST）。リンクは `src/components/parts/Link/` の `Link` primitive 経由で描画されなければならず（MUST）、`href` は `/brand` でなければならない（MUST）。リンクラベルは `Brand` または `Brand Guidelines` 相当の表記でなければならない（MUST）。配置場所は Footer の情報列内、ソーシャル列、または著作権の周辺のいずれでもよい（MUST）。

#### Scenario: Footer から /brand に遷移できる

- **WHEN** ユーザーが Footer 内の Brand リンクをクリックしたとき
- **THEN** `/brand` ルートに遷移する

### Requirement: `/brand` ルートでも他ルートと同一の共通 chrome がレンダリングされる

`/brand` ルートでも `BaseLayout` 経由で同一の Header / Footer が描画されなければならない（MUST）。`/brand` 専用の独自 Header / Footer / chrome を導入してはならない（MUST NOT）。

#### Scenario: /brand に共通 Header / Footer が存在する

- **WHEN** ユーザーが `/brand` にアクセスし HTML を確認したとき
- **THEN** `/` や `/articles` と同一の Header（5 項目 nav + Get in touch CTA）と Footer（情報列 + ソーシャル + 著作権 + Brand リンク）が描画されている

## MODIFIED Requirements

### Requirement: Header の nav menu はグローバルページ遷移を提供する

Header の nav menu 項目は、Hero.html の `Work` / `Music` / `Podcast` / `Writing` の 4 項目に加えて、`/brand` を指す `Brand` 項目を含む 5 項目で構成されなければならない（MUST）。各項目は `src/components/parts/Link/` の `Link` primitive 経由で描画されなければならない（MUST）。`href` はサイト内アンカー（例: `/#services` / `/#podcast` / `/#articles`）、内部ページパス（例: `/articles` / `/brand`）、または外部 URL のいずれかに解決されなければならない（MUST）。内部アンカーを使う場合、リンク先の DOM 要素は対応する `id` を持たなければならない（MUST）。menu 項目のラベルとターゲットの具体対応は `src/features/home/menus.ts` を介して決定されなければならない（MUST）。`<Header />` を pages / features 側から直接 render してはならない（MUST NOT）。Header は `BaseLayout` 経由のみで全ルートに供給されなければならない（MUST）。

#### Scenario: Header の menu 項目が 5 件である

- **WHEN** `/` にアクセスし Header を確認したとき
- **THEN** 5 つの nav 項目（`Work` / `Music` / `Podcast` / `Writing` / `Brand`）が描画される

#### Scenario: Header の Brand 項目が /brand に遷移する

- **WHEN** ユーザーが Header nav の `Brand` 項目をクリックしたとき
- **THEN** `/brand` ルートに遷移する

#### Scenario: home 以外のルートでも Header が描画される

- **WHEN** `/articles` または `/brand` にアクセスしたとき
- **THEN** 同一の Header が描画されている

#### Scenario: pages / features が Header を直接 import しない

- **WHEN** レビュアーが `grep -R "from.*layouts/Header\|from.*layouts['\"]" src/pages/ src/features/` を実行したとき
- **THEN** `Header` を import している pages / features は `src/components/layouts/BaseLayout/` 以外には存在しない
