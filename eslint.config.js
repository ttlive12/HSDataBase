import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'miniprogram_npm/**',
      'miniprogram/miniprogram_npm/**',
      'miniprogram/ec-canvas/**',
      'ec-canvas/**',
      'typings/**',
      '.idea/**',
      '.vscode/**',
      '*.min.js',
      '*.d.ts',
      'project.config.json',
      'project.private.config.json',
      'sitemap.json',
      '*.wxml',  // 暂时忽略 wxml 文件，直到找到正确的规则配置
      'node_modules/@vant/**',
      'miniprogram/pages/my/chart/**'
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        wx: 'readonly',
        App: 'readonly',
        Page: 'readonly',
        Component: 'readonly',
        getApp: 'readonly',
        getCurrentPages: 'readonly',
        Behavior: 'readonly',
        requirePlugin: 'readonly',
        uni: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        WechatMiniprogram: 'readonly',
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'prettier': prettier,
      'import': importPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // TypeScript 相关规则
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',

      // 放宽一些规则，使其成为警告而非错误
      'no-undef': 'warn',
      'no-redeclare': 'warn',

      // 引入相关规则
      'import/order': ['warn', {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type'
        ],
        'pathGroups': [
          {
            'pattern': '@/**',
            'group': 'internal',
            'position': 'after'
          }
        ],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }],
      'import/no-unresolved': 'off', // TypeScript 可以处理这个

      // 代码风格相关规则
      'prettier/prettier': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
      'curly': ['warn', 'all'],  // 改为警告级别
      'no-alert': 'error',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',  // 降级为警告
    },
  },
  {
    files: ['*.config.js', '*.conf.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off'
    }
  }
];
