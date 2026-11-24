import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'vendor/**',
      'private/**',
      'test-results/**',
      'playwright-report/**',
      'src/professor/reviewer-samples.js',
      'src/catalog/ams-data.js',
      'src/catalog/department-data.js',
      'src/catalog/department-link-checks.js',
      'demo-files/**',
      'tests/unit/**',
    ],
  },
  {
    ...js.configs.recommended,
    files: ['src/**/*.js', 'scripts/**/*.mjs', 'tests/e2e/**/*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Some legacy catches and exported callback parameters are intentionally unused.
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' }],
    },
  },
];
