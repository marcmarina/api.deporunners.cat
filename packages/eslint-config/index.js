/* eslint-disable */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:node/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  rules: {
    'no-process-exit': 'off',

    // Node
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules'],
        version: '16.18.1',
      },
    ],
    'node/no-extraneous-import': 'error',
    'node/no-missing-import': [
      'error',
      {
        tryExtensions: ['.js', '.ts'],
      },
    ],

    // Typescript
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],

    'no-return-await': 'off',
    'no-console': 'error',
    'no-unreachable': 'error',

    // Imports
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Copied from https://github.com/lydell/eslint-plugin-simple-import-sort/#custom-grouping
          // Side effect imports.
          ['^\\u0000'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // React
          ['^react'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          // Internal packages.
          ['^@deporunners'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          ['^\\.\\.'],
          ['^\\.'],
        ],
      },
    ],
  },
};
