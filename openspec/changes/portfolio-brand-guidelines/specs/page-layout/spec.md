## ADDED Requirements

### Requirement: Footer に `/brand` への導線が存在する

Footer は `/brand` ルートへ遷移するリンクを少なくとも 1 件含まなければならない（MUST）。リンクは `src/components/parts/Link/` の `Link` primitive 経由で描画されなければならず（MUST）、`href` は `/brand` でなければならない（MUST）。リンクラベルは `Brand` または `Brand Guidelines` 相当の表記でなければならない（MUST）。配置場所は Footer の情報列内、ソーシャル列、または著作権の周辺のいずれでもよく、Header の nav menu に追加してはならない（MUST NOT）。

#### Scenario: Footer から /brand に遷移できる

- **WHEN** ユーザーが Footer 内の Brand リンクをクリックしたとき
- **THEN** `/brand` ルートに遷移する

#### Scenario: Header の nav menu に Brand 項目が追加されない

- **WHEN** レビュアーが Header の nav menu を確認したとき
- **THEN** menu 項目は Twilight Blade 既定の 4 項目（Work / Music / Podcast / Writing）のままで、`Brand` 項目は含まれない

### Requirement: `/brand` ルートでも他ルートと同一の共通 chrome がレンダリングされる

`/brand` ルートでも `BaseLayout` 経由で同一の Header / Footer が描画されなければならない（MUST）。`/brand` 専用の独自 Header / Footer / chrome を導入してはならない（MUST NOT）。

#### Scenario: /brand に共通 Header / Footer が存在する

- **WHEN** ユーザーが `/brand` にアクセスし HTML を確認したとき
- **THEN** `/` や `/articles` と同一の Header（4 項目 nav + Get in touch CTA）と Footer（情報列 + ソーシャル + 著作権 + Brand リンク）が描画されている
