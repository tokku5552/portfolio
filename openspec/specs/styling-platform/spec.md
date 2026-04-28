# styling-platform Specification

## Purpose
TBD - created by archiving change platform-migration-pnpm-tailwind-shadcn. Update Purpose after archive.
## Requirements
### Requirement: Tailwind CSS is the primary utility styling layer

The repository SHALL include a working Tailwind CSS v3 setup. A `tailwind.config.ts` and a `postcss.config.js` (or `.cjs`) SHALL exist at the repository root. The content globs SHALL cover all JSX/TSX source files under `src/**`. Dark mode SHALL be configured as `class`-based so that `/brand` (a dark-only page) and any future light-mode pages can both be served from the same build.

#### Scenario: A Tailwind utility class styles a DOM node

- **WHEN** a component in `src/` uses a Tailwind utility class (for example `bg-[var(--color-brand-bg)]`)
- **THEN** the production build emits CSS that applies the expected styles to that node in the browser

#### Scenario: Dark mode is class-driven

- **WHEN** the `dark` class is applied to an ancestor element
- **THEN** Tailwind's `dark:` variant utilities apply their dark-mode values

### Requirement: Global stylesheet imports Tailwind and brand tokens

A `src/styles/globals.css` SHALL exist, SHALL declare the `@tailwind base; @tailwind components; @tailwind utilities;` directives, and SHALL import `brand/tokens.css` so that CSS variables are attached to `:root`. `src/pages/_app.tsx` SHALL import `src/styles/globals.css` exactly once at the top level so that every route receives the stylesheet.

#### Scenario: Every page receives the global stylesheet

- **WHEN** the app renders any route
- **THEN** the rendered HTML includes the Tailwind-generated stylesheet and the `:root` variables defined by `brand/tokens.css`

### Requirement: `brand/tokens.css` is the single source of brand CSS variables

`brand/tokens.css` SHALL declare the Twilight Blade tokens (background, foreground, muted text, subtle border, orb indigo/violet/pink, font families) as CSS Custom Properties on `:root`. Variable names SHALL use the `--color-brand-*` / `--font-brand-*` prefix so the namespace is explicit and future additions do not collide with unprefixed variables introduced by any third-party library. Other layers (Tailwind `theme.extend`, component styles, downloadable copies under `public/brand-assets/`) MUST consume these variables; they MUST NOT redefine token values independently.

#### Scenario: Tailwind theme references brand variables

- **WHEN** a Tailwind utility references a brand token (for example `bg-brand-bg` or `text-brand-muted`)
- **THEN** the resolved CSS value comes from the CSS Custom Properties declared in `brand/tokens.css` at runtime

#### Scenario: No duplicate token definitions

- **WHEN** a reviewer searches the repository for hard-coded Twilight Blade color literals outside of `brand/tokens.css`
- **THEN** the search returns no matches in source code that ships to the browser (comments, proposal/design docs, and the Claude Design handoff under `brand/source/` are exempt)

### Requirement: Class-merging helper is available for Tailwind-based components

The repository SHALL expose a `cn(...inputs: ClassValue[]) => string` helper backed by `clsx` and `tailwind-merge`. It SHALL live under `src/libs/cn.ts` (matching the existing `src/libs/` convention) so that any component written in Tailwind can compose variant classes and resolve conflicts (e.g. `bg-brand-bg` overridden by `bg-transparent`) consistently. The project SHALL NOT install shadcn/ui or its CLI in this change; primitive components are owned by the repository and built by hand as needed in downstream changes.

#### Scenario: cn() merges conflicting Tailwind classes

- **WHEN** a component calls `cn('px-2 py-1', condition && 'px-4')` with `condition === true`
- **THEN** the returned class string contains `px-4 py-1` (the conflicting `px-2` is discarded by `tailwind-merge`)

#### Scenario: No shadcn artifacts exist

- **WHEN** a reviewer inspects the repository root
- **THEN** there is no `components.json`, no `src/components/ui/` directory, and the `dependencies` do not list `shadcn`, `@base-ui/react`, `lucide-react`, `tw-animate-css`, or `class-variance-authority`

### Requirement: ランタイムに Chakra UI / Emotion / Framer Motion / microCMS / react-share が存在しない

`portfolio-twilight-blade-redesign` change の完了後、`package.json` の `dependencies` および `devDependencies` に `@chakra-ui/react`、`@chakra-ui/icons`、`@emotion/react`、`@emotion/styled`、`framer-motion`、`microcms-js-sdk`、`react-share` が存在してはならない（MUST NOT）。`src/**/*.{ts,tsx}` 配下のいかなるファイルも、これらのパッケージからシンボルを import してはならない（MUST NOT）。`src/theme/theme.ts` および `src/clients/microcms.ts` は存在してはならない（MUST NOT）。`src/pages/_app.tsx` は `ChakraProvider` ラッパーを含んではならない（MUST NOT）。

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

### Requirement: ADR captures platform decisions

The change SHALL include an ADR-equivalent record of the following decisions and their rationale: (a) selection of pnpm over yarn / npm / bun, (b) selection of Tailwind CSS v3 over styled-components / vanilla-extract / Tailwind v4, (c) decision to keep Chakra UI coexisting instead of removing it in this change, (d) naming convention for brand CSS variables, (e) decision **not** to adopt shadcn/ui in this change and to defer primitive construction to downstream changes. The record SHALL live inside the change itself so it is archived alongside the capability specs.

#### Scenario: Decisions are documented

- **WHEN** a reader opens the change directory under `openspec/changes/platform-migration-pnpm-tailwind-shadcn/`
- **THEN** the `design.md` Decisions section answers each of (a)-(e) with the chosen option, at least one rejected alternative, and the rationale

