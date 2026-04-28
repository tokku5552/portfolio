## REMOVED Requirements

### Requirement: Chakra UI coexists with Tailwind during the migration window

**Reason**: 本 change で Chakra UI と Emotion を完全撤去するため、共存要件そのものが不要になる。

**Migration**:
- `@chakra-ui/react`、`@chakra-ui/icons`、`@emotion/react`、`@emotion/styled` を `package.json` から削除する
- `src/theme/theme.ts` を削除する
- `src/pages/_app.tsx` の `ChakraProvider` ラッパーと `theme` import を削除する
- `src/**/*.{ts,tsx}` から `@chakra-ui/*` および `@emotion/*` への import をゼロにする（grep で確認）
- 既存の Chakra ベースの JSX はすべて Tailwind + brand token 実装で書き直す（本 change の新 capability: `ui-primitives` / `page-layout` / `landing-page` / `content-pages` 参照）

## ADDED Requirements

### Requirement: ランタイムに Chakra UI / Emotion / Framer Motion / microCMS / react-share が存在しない

本 change の完了後、`package.json` の `dependencies` および `devDependencies` に `@chakra-ui/react`、`@chakra-ui/icons`、`@emotion/react`、`@emotion/styled`、`framer-motion`、`microcms-js-sdk`、`react-share` が存在してはならない（MUST NOT）。`src/**/*.{ts,tsx}` 配下のいかなるファイルも、これらのパッケージからシンボルを import してはならない（MUST NOT）。`src/theme/theme.ts` および `src/clients/microcms.ts` は存在してはならない（MUST NOT）。`src/pages/_app.tsx` は `ChakraProvider` ラッパーを含んではならない（MUST NOT）。

#### Scenario: package.json から不要パッケージが消えている

- **WHEN** レビュアーが `grep -E "@chakra-ui|@emotion|framer-motion|microcms-js-sdk|react-share" package.json` を実行したとき
- **THEN** 検索結果はゼロ件である

#### Scenario: src 配下にレガシー import が存在しない

- **WHEN** レビュアーが `grep -R "@chakra-ui\|@emotion\|framer-motion\|microcms-js-sdk\|react-share" src/` を実行したとき
- **THEN** 検索結果はゼロ件である

#### Scenario: 削除対象ファイルが存在しない

- **WHEN** レビュアーが `ls src/theme/theme.ts src/clients/microcms.ts` を実行したとき
- **THEN** いずれも存在しない（exit code 非ゼロ）

#### Scenario: _app.tsx に ChakraProvider が存在しない

- **WHEN** レビュアーが `grep "ChakraProvider" src/pages/_app.tsx` を実行したとき
- **THEN** 検索結果はゼロ件である

### Requirement: microCMS 関連の環境変数が `environment.ts` から削除される

`src/config/environment.ts` から `NEXT_PUBLIC_SERVICE_DOMAIN` と `NEXT_PUBLIC_API_KEY` の読み込みおよび warn 出力を削除しなければならない（MUST）。`.env.sample` も対応して更新し、これら 2 変数のサンプル行を削除しなければならない（MUST）。

#### Scenario: environment.ts に microCMS 関連の参照が残らない

- **WHEN** レビュアーが `grep "SERVICE_DOMAIN\|API_KEY" src/config/environment.ts` を実行したとき
- **THEN** 検索結果はゼロ件である
