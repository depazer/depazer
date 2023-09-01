/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  ignorePatterns: [
    'lib',
    'bin',
    '/**/**/node_modules',
    '/**/**/dist',
    '/**/**/public',
    'packages/web/src/worker/**/*.js',
    '*.{json,yaml,yml,md,css,scss,less,html,gitignore,editorconfig}'
  ],
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    complexity: ['error', 8],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'vue/multi-word-component-names': ['error', { ignores: ['index'] }]
  },
  overrides: [
    {
      files: ['packages/web/src/**/*.{vue,ts}'],
      rules: {
        'no-console': 'error'
      }
    }
  ]
}
