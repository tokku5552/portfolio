## MODIFIED Requirements

### Requirement: Chakra UI coexists with Tailwind during the migration window

Chakra UI v2 と Emotion は、まだ書き換えられていない `src/features/*` 配下のすべてのページのために install されたまま機能し続けなければならない（MUST）。本移行は既存の Chakra ベースの feature JSX を変更してはならず、いまだ Chakra でレンダリングされているページ（例: `/articles` が書き換えられるまで）はランタイムエラーなく描画を継続しなければならない（MUST）。`src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}/` 配下の共通 layouts は `@chakra-ui/*` / `@emotion/*` からいかなるシンボルも import してはならない（MUST NOT）。すなわち Chakra 共存のスコープは feature 単位のページ本体に限定される。`ChakraProvider` は `src/pages/_app.tsx` に配線されたまま、`src/theme/theme.ts` のテーマを供給し続けなければならない（MUST）。これにより Chakra ベースの feature JSX がテーマコンテキストを維持する。Tailwind の `preflight` / reset が Chakra 独自のグローバルスタイルと衝突する場合は、既存の feature ページを編集するのではなく、設定（必要であれば `corePlugins.preflight` の無効化など）で解決しなければならない（MUST）。

#### Scenario: Chakra 上の feature ページが変更なく描画される

- **WHEN** 本 change 後にアプリがビルド・デプロイされたとき
- **THEN** 本 change 前に Chakra で描画されていた `src/features/*` 配下のあらゆるページは、ランタイムエラーなく、それ以前の視覚的振る舞いを保ったまま（再設計された共通 chrome の内部で）描画され続ける

#### Scenario: `ChakraProvider` が配線されたままである

- **WHEN** レビュアーが `src/pages/_app.tsx` を確認したとき
- **THEN** `ChakraProvider` がアプリをラップし、`src/theme/theme.ts` からの `theme` がこれまで通り供給されている

#### Scenario: 共通 layouts に Chakra の痕跡がない

- **WHEN** レビュアーが `grep -R "@chakra-ui\|@emotion" src/components/layouts/{BaseLayout,Header,Footer,Hero,Seo}/` を実行したとき
- **THEN** grep はマッチなしで終了する
