module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/base',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vuetify/base',
    'plugin:vuetify/recommended',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'warn',
    'max-len': ['warn', { code: 120, ignoreRegExpLiterals: true }],
    'vue/attribute-hyphenation': 'off',
    'vue/no-deprecated-filter': 'warn',
    'vue/no-deprecated-slot-attribute': 'warn',
    'vue/no-deprecated-slot-scope-attribute': 'warn',
    'vue/no-deprecated-v-bind-sync': 'warn',
    'vue/no-deprecated-v-on-native-modifier': 'warn',
    'vue/no-v-for-template-key-on-child': 'warn',
    'vue/no-v-html': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vuetify/no-deprecated-colors': 'warn',
    'vuetify/no-deprecated-components': 'warn',
    'vuetify/no-deprecated-events': 'warn',
    'vuetify/no-deprecated-props': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint']
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
