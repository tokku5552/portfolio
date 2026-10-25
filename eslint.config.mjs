import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

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
  ...nextCoreWebVitals,
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // Added by eslint-config-next 16 (react-hooks v7). It flags the
      // latest-value ref pattern (`ref.current = prop` during render) that
      // ParticleField relies on.
      'react-hooks/refs': 'off',
    },
  },
];

export default eslintConfig;
