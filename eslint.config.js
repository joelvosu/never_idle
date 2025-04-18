const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const typescript = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-plugin-prettier');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.js',
      'coverage/**',
      '*.d.ts',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescript,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
