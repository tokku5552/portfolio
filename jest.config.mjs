import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  globalSetup: './spec/setupTest.ts',
  setupFiles: ['<rootDir>/spec/jestPolyfills.ts'],
};

// jsdom's dependency tree ships some ESM-only packages that Jest's CommonJS
// runtime cannot load untransformed. next/jest only lets custom config append
// to transformIgnorePatterns, so its node_modules pattern is replaced here.
// The lookahead is matched at every `/node_modules/` segment, so a package
// inside pnpm's `.pnpm/<name>@<version>/node_modules/<name>/` is transformed
// only when it is listed below.
const esmPackages = [
  '@asamuzakjp/css-color',
  '@asamuzakjp/dom-selector',
  '@bramus/specificity',
  '@csstools/color-helpers',
  '@csstools/css-calc',
  '@csstools/css-color-parser',
  '@csstools/css-parser-algorithms',
  '@csstools/css-tokenizer',
  '@exodus/bytes',
  'css-tree',
  'entities',
  'lru-cache',
  'parse5',
  'tough-cookie',
];

// createJestConfig is wrapped this way to ensure that next/jest can load the Next.js config which is async
const jestConfig = async () => {
  const resolved = await createJestConfig(config)();
  return {
    ...resolved,
    transformIgnorePatterns: [
      `/node_modules/(?!(\\.pnpm|${esmPackages.join('|')})/)`,
      ...resolved.transformIgnorePatterns.filter(
        (pattern) => !pattern.includes('node_modules')
      ),
    ],
  };
};

export default jestConfig;
