## ADDED Requirements

### Requirement: Package manager is pnpm with pinned version

The repository SHALL use pnpm as its sole package manager. The specific pnpm version SHALL be pinned via the `packageManager` field in `package.json` so that every install (local / CI / Vercel) uses the same tool and version. The legacy `yarn.lock` file SHALL be removed.

#### Scenario: Fresh clone installs via pnpm

- **WHEN** a contributor clones the repository and runs `pnpm install`
- **THEN** dependencies are installed successfully using the pnpm version declared in `packageManager`, and `pnpm-lock.yaml` at HEAD is treated as the authoritative lockfile

#### Scenario: yarn is not used

- **WHEN** any contributor, CI job, or Vercel build executes
- **THEN** the install step MUST NOT reference `yarn` or `yarn.lock`; `yarn.lock` MUST NOT exist at the repository root

### Requirement: pnpm lockfile is committed and enforced

The file `pnpm-lock.yaml` SHALL be committed to the repository. Installs that are not interactive (CI, Vercel) SHALL use `--frozen-lockfile` so that drift between `package.json` and the lockfile fails the build.

#### Scenario: CI install without lockfile drift

- **WHEN** CI runs the install step
- **THEN** it executes `pnpm install --frozen-lockfile --ignore-scripts` (or equivalent) and the job succeeds when the lockfile matches `package.json`

#### Scenario: Lockfile drift fails the build

- **WHEN** `package.json` declares a dependency version that `pnpm-lock.yaml` does not satisfy
- **THEN** the CI install step exits with a non-zero status and the pipeline fails

### Requirement: CI pipeline is migrated to pnpm with proper caching

`.github/workflows/ci.yml` SHALL use pnpm for install, lint, test, and build steps. The workflow SHALL cache the pnpm store keyed by `pnpm-lock.yaml`'s content hash. Install SHALL run with `--ignore-scripts` (preserving current CI behaviour) so that lifecycle scripts such as `prepare` do not execute on CI where they are not needed.

#### Scenario: Successive CI runs hit the pnpm cache

- **WHEN** a CI run follows a previous run on the same lockfile
- **THEN** the pnpm store cache is restored and the install step is measurably faster than a cold install

#### Scenario: CI runs do not mutate the local git hooks path

- **WHEN** CI executes `pnpm install --ignore-scripts`
- **THEN** the `prepare` script does NOT run, and `core.hooksPath` is NOT modified in the CI workspace

### Requirement: Vercel deploys via pnpm

Vercel Preview and Production deployments SHALL use pnpm. Install Command and Build Command in Vercel Project Settings SHALL be set explicitly (`pnpm install --frozen-lockfile` and `pnpm build`) rather than relying on auto-detection alone.

#### Scenario: Vercel preview succeeds after migration

- **WHEN** a pull request branch is pushed after the migration
- **THEN** Vercel builds the preview using pnpm and produces a successful deployment URL

### Requirement: `prepare` script continues to activate the local git hooks path

After migration to pnpm, the `scripts.prepare` entry in `package.json` SHALL continue to set `core.hooksPath` to `.githooks` on any local install that does not pass `--ignore-scripts`. Behaviour and effect MUST be indistinguishable from the previous yarn-based setup.

#### Scenario: Local install wires up git hooks

- **WHEN** a contributor runs `pnpm install` locally (without `--ignore-scripts`)
- **THEN** `git config --get core.hooksPath` returns `.githooks`

#### Scenario: CI install does not wire up git hooks

- **WHEN** CI runs `pnpm install --ignore-scripts`
- **THEN** no git configuration is written in the CI workspace
