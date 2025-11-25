import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import boundaries from 'eslint-plugin-boundaries';

export default tseslint.config(
  {
    ignores: ['dist'],
  },
  // Special config for Logger utility - allow console usage here only
  {
    files: ['src/shared/utils/helpers/logger.ts'],
    rules: {
      'no-console': 'off', // Allow console in Logger utility
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        __DEV__: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
      prettier: prettier,
      react: react,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      boundaries,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'warn',
      'react/jsx-uses-react': 'off',
      // Disable formatting rules - let Prettier handle them
      'no-trailing-spaces': 'off',
      'arrow-spacing': 'off',
      'block-spacing': 'off',
      'comma-spacing': 'off',
      'eol-last': 'off',
      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/quotes': 'off', // Let Prettier handle quotes
      '@typescript-eslint/semi': 'off', // Let Prettier handle semicolons
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      // 'unused-imports/no-unused-vars': [
      //   'warn',
      //   {
      //     vars: 'all',
      //     varsIgnorePattern: '^_',
      //     args: 'after-used',
      //     argsIgnorePattern: '^_',
      //   },
      // ],
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always',
          jsxSingleQuote: true,
          trailingComma: 'all',
          tabWidth: 2,
          semi: true,
          singleQuote: true,
          useTabs: false,
          endOfLine: 'lf',
          printWidth: 130,
          bracketSameLine: true,
        },
      ],
      'boundaries/element-types': ['error'],
      
      // Security: Prevent direct console usage - use Logger utility instead
      'no-console': 'warn', // Warn on direct console usage - prefer Logger utility
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'boundaries/elements': [
        { type: 'features', pattern: 'src/features/*' },
        { type: 'shared', pattern: 'src/shared/*' },
      ],
    },
  },
);
