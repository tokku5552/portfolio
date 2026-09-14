import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const __dirname = dirname(fileURLToPath(import.meta.url));

// eslint-config-next 15.x still ships legacy (eslintrc) configs, so bridge them
// through FlatCompat. Once eslint-config-next is on 16+, replace this with its
// native flat config exports.
//
// pnpm does not hoist eslint-config-next's plugins (@next/next, react,
// react-hooks, import, jsx-a11y) to the project root, so resolve them from the
// package itself. Without this, Node's lookup walks up into parent directories
// and can pick up an unrelated copy (e.g. from the main checkout when running
// inside a git worktree).
const require = createRequire(import.meta.url);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: dirname(
    require.resolve('eslint-config-next/package.json')
  ),
});

const eslintConfig = [
  {
    // Flat config does not skip dot-directories. `.claude/worktrees/` holds
    // other checkouts of this repo, so it must be ignored explicitly.
    ignores: [
      '.claude/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals'),
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];

export default eslintConfig;
