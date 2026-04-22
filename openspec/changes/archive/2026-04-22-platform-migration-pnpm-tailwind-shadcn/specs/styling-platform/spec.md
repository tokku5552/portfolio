## ADDED Requirements

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

### Requirement: Chakra UI coexists with Tailwind during the migration window

Chakra UI v2 and Emotion SHALL remain installed and functional for every page that existed before this change. The migration SHALL NOT modify any existing Chakra-based JSX; all visual behaviour on `/`, `/news`, `/news/[id]`, and `/articles` SHALL remain identical to the pre-migration baseline. Any Tailwind `preflight` / reset conflict with Chakra's own global styles SHALL be resolved by configuration (for example disabling `corePlugins.preflight` if required) rather than by editing existing pages.

#### Scenario: Existing Chakra pages render unchanged

- **WHEN** the app is built and deployed after the migration
- **THEN** `/`, `/news`, `/news/[id]`, and `/articles` render with the same visual output as before the migration (no regression in spacing, colors, typography, or layout)

#### Scenario: `ChakraProvider` remains wired

- **WHEN** inspecting `src/pages/_app.tsx`
- **THEN** `ChakraProvider` wraps the app and the `theme` from `src/theme/theme.ts` is supplied as before

### Requirement: ADR captures platform decisions

The change SHALL include an ADR-equivalent record of the following decisions and their rationale: (a) selection of pnpm over yarn / npm / bun, (b) selection of Tailwind CSS v3 over styled-components / vanilla-extract / Tailwind v4, (c) decision to keep Chakra UI coexisting instead of removing it in this change, (d) naming convention for brand CSS variables, (e) decision **not** to adopt shadcn/ui in this change and to defer primitive construction to downstream changes. The record SHALL live inside the change itself so it is archived alongside the capability specs.

#### Scenario: Decisions are documented

- **WHEN** a reader opens the change directory under `openspec/changes/platform-migration-pnpm-tailwind-shadcn/`
- **THEN** the `design.md` Decisions section answers each of (a)-(e) with the chosen option, at least one rejected alternative, and the rationale
