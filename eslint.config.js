// @ts-check
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/.expo/',
    '**/dist/',
    '**/coverage/',
    'apps/mobile/ios/',
    'apps/mobile/android/',
  ]),
  expoConfig,
  prettierConfig,
  {
    settings: {
      'import/resolver': {
        typescript: { project: ['apps/*/tsconfig.json', 'packages/*/tsconfig.json'] },
      },
    },
  },
  {
    // The engine must stay framework-independent (docs/ENGINE.md).
    files: ['packages/engine/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-*',
                'react-native',
                'react-native-*',
                'expo',
                'expo-*',
                '@expo/*',
              ],
              message: 'The engine must not depend on React, React Native or Expo.',
            },
          ],
        },
      ],
    },
  },
]);
